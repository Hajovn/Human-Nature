-- Teacher accounts for Human Nature (docs/SUPABASE-PLAN.md, Stage 3).
--
--   profiles         one row per teacher, created automatically at sign-up
--   invite_codes     codes that verify teachers, one per training / school / region
--   saved_resources  starred resources (DESIGN.md §8.5 #23)
--   progress         themes visited, modules opened, tests attempted/finished (§8.5 #24)
--   feedback_votes   thumbs up/down per resource (§4.11); written only via cast_vote()
--   teacher-files    private storage bucket, readable by verified teachers only
--
-- Every table has row-level security on. Helpers that policies need live in the
-- `private` schema, which the Data API does not expose.

create schema if not exists private;
grant usage on schema private to anon, authenticated;

create type public.user_role as enum ('teacher', 'admin');
create type public.progress_kind as enum ('theme_visited', 'module_opened', 'test_attempted', 'test_finished');
create type public.vote as enum ('up', 'down');

-- Content slugs as used in content/**/*.json file names.
create domain public.slug as text check (value ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(value) <= 100);

/* ── Invite codes ───────────────────────────────────────────── */

create table public.invite_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9-]{6,32}$'), -- stored in capitals
  label text not null check (char_length(label) between 1 and 200),
  expires_at timestamptz,
  max_uses integer check (max_uses > 0),
  uses integer not null default 0,
  active boolean not null default true,
  created_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now()
);

/* ── Profiles ───────────────────────────────────────────────── */

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 120),
  school_name text not null default '' check (char_length(school_name) <= 200),
  school_npsn text check (school_npsn ~ '^[0-9]{8}$'),
  phone text check (phone ~ '^\+?[0-9][0-9 ()-]{5,19}$'),
  locale text not null default 'id' check (locale in ('id', 'en')),
  role public.user_role not null default 'teacher',
  verified_at timestamptz,
  invite_code_id uuid references public.invite_codes on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_invite_code_id_idx on public.profiles (invite_code_id);

create function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function private.touch_updated_at();

/* ── Helpers used by policies ───────────────────────────────── */

create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'
  );
$$;

create function private.is_verified()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = (select auth.uid()) and verified_at is not null
  );
$$;

grant execute on function private.is_admin(), private.is_verified() to anon, authenticated;

/* ── Applying an invite code ────────────────────────────────── */

-- Returns 'ok', 'not_found', 'expired' or 'used_up'. Switched-off codes count as not found.
create function private.apply_invite_code(p_user uuid, p_code text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  invite public.invite_codes;
begin
  select * into invite
  from public.invite_codes
  where code = upper(btrim(p_code)) and active
  for update;

  if not found then return 'not_found'; end if;
  if invite.expires_at is not null and invite.expires_at <= now() then return 'expired'; end if;
  if invite.max_uses is not null and invite.uses >= invite.max_uses then return 'used_up'; end if;

  update public.invite_codes set uses = uses + 1 where id = invite.id;
  update public.profiles
    set verified_at = now(), invite_code_id = invite.id
    where id = p_user and verified_at is null;
  return 'ok';
end;
$$;

revoke execute on function private.apply_invite_code(uuid, text) from public, anon, authenticated;

create table private.code_attempts (
  user_id uuid not null references auth.users on delete cascade,
  attempted_at timestamptz not null default now()
);

create index code_attempts_user_time_idx on private.code_attempts (user_id, attempted_at);

-- Called from the profile page. At most 5 wrong codes per hour, so codes can't be guessed.
-- Returns 'ok', 'already_verified', 'too_many_attempts', 'not_found', 'expired' or 'used_up'.
create function public.redeem_invite_code(p_code text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  result text;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '42501'; end if;

  if exists (select 1 from public.profiles where id = uid and verified_at is not null) then
    return 'already_verified';
  end if;

  if (select count(*) from private.code_attempts
      where user_id = uid and attempted_at > now() - interval '1 hour') >= 5 then
    return 'too_many_attempts';
  end if;

  result := private.apply_invite_code(uid, p_code);
  if result <> 'ok' then
    insert into private.code_attempts (user_id) values (uid);
  end if;
  return result;
end;
$$;

revoke execute on function public.redeem_invite_code(text) from public, anon;
grant execute on function public.redeem_invite_code(text) to authenticated;

/* ── New user → profile ─────────────────────────────────────── */

-- Copies the registration form (sent as user metadata by supabase.auth.signUp) into a
-- profile. Invalid optional values are dropped rather than blocking the sign-up.
create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  npsn text := btrim(meta ->> 'school_npsn');
  phone text := btrim(meta ->> 'phone');
begin
  insert into public.profiles (id, full_name, school_name, school_npsn, phone, locale)
  values (
    new.id,
    left(coalesce(btrim(meta ->> 'full_name'), ''), 120),
    left(coalesce(btrim(meta ->> 'school_name'), ''), 200),
    case when npsn ~ '^[0-9]{8}$' then npsn end,
    case when phone ~ '^\+?[0-9][0-9 ()-]{5,19}$' then phone end,
    case when meta ->> 'locale' = 'en' then 'en' else 'id' end
  );

  if nullif(btrim(meta ->> 'invite_code'), '') is not null then
    perform private.apply_invite_code(new.id, meta ->> 'invite_code');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

/* ── Saved resources and progress ───────────────────────────── */

create table public.saved_resources (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  resource_slug public.slug not null,
  created_at timestamptz not null default now(),
  primary key (user_id, resource_slug)
);

create table public.progress (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  kind public.progress_kind not null,
  item_slug public.slug not null,
  first_at timestamptz not null default now(),
  primary key (user_id, kind, item_slug)
);

/* ── Feedback votes ─────────────────────────────────────────── */

-- voter_id is the teacher's id, or a random id kept in the visitor's browser.
create table public.feedback_votes (
  resource_slug public.slug not null,
  voter_id uuid not null,
  vote public.vote not null,
  updated_at timestamptz not null default now(),
  primary key (resource_slug, voter_id)
);

-- Sets, changes or (with p_vote = null) removes one vote. Logged-in teachers always vote
-- as themselves, so they can't vote twice by clearing their browser.
create function public.cast_vote(p_resource text, p_voter uuid, p_vote public.vote)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  voter uuid := coalesce(auth.uid(), p_voter);
begin
  if voter is null then raise exception 'voter id missing' using errcode = '22004'; end if;
  if p_vote is null then
    delete from public.feedback_votes where resource_slug = p_resource and voter_id = voter;
  else
    insert into public.feedback_votes (resource_slug, voter_id, vote)
    values (p_resource::public.slug, voter, p_vote)
    on conflict (resource_slug, voter_id) do update set vote = excluded.vote, updated_at = now();
  end if;
end;
$$;

grant execute on function public.cast_vote(text, uuid, public.vote) to anon, authenticated;

-- Totals per resource, for the admin page.
create function public.feedback_totals()
returns table (resource_slug text, up bigint, down bigint)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then raise exception 'admins only' using errcode = '42501'; end if;
  return query
    select v.resource_slug::text,
           count(*) filter (where v.vote = 'up'),
           count(*) filter (where v.vote = 'down')
    from public.feedback_votes v
    group by v.resource_slug
    order by v.resource_slug;
end;
$$;

revoke execute on function public.feedback_totals() from public, anon;
grant execute on function public.feedback_totals() to authenticated;

/* ── Personal-data rights (GO-LIVE.md Phase 4) ──────────────── */

create function public.export_my_data()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'email', (select email from auth.users where id = auth.uid()),
    'profile', (select to_jsonb(p) - 'role' from public.profiles p where id = auth.uid()),
    'saved_resources', coalesce((select jsonb_agg(to_jsonb(s) - 'user_id') from public.saved_resources s where user_id = auth.uid()), '[]'),
    'progress', coalesce((select jsonb_agg(to_jsonb(g) - 'user_id') from public.progress g where user_id = auth.uid()), '[]'),
    'feedback_votes', coalesce((select jsonb_agg(to_jsonb(v) - 'voter_id') from public.feedback_votes v where voter_id = auth.uid()), '[]')
  );
$$;

-- Deletes the account; profile, saved items and progress go with it (on delete cascade).
create function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'not authenticated' using errcode = '42501'; end if;
  delete from public.feedback_votes where voter_id = auth.uid();
  delete from auth.users where id = auth.uid();
end;
$$;

revoke execute on function public.export_my_data(), public.delete_my_account() from public, anon;
grant execute on function public.export_my_data(), public.delete_my_account() to authenticated;

/* ── Keep-alive (Stage 7) ───────────────────────────────────── */

-- Called every few days by GitHub Actions so the Free-plan project doesn't pause.
create function public.ping()
returns text
language sql
stable
set search_path = ''
as $$ select 'ok'::text; $$;

grant execute on function public.ping() to anon, authenticated;

/* ── Table privileges and row-level security ────────────────── */

alter table public.invite_codes enable row level security;
alter table public.profiles enable row level security;
alter table public.saved_resources enable row level security;
alter table public.progress enable row level security;
alter table public.feedback_votes enable row level security;
alter table private.code_attempts enable row level security;

revoke all on public.invite_codes, public.profiles, public.saved_resources, public.progress,
  public.feedback_votes from anon, authenticated;
revoke all on private.code_attempts from anon, authenticated;

-- Invite codes: admins only.
grant select, insert, update, delete on public.invite_codes to authenticated;
create policy "Admins manage invite codes" on public.invite_codes
  for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- Profiles: a teacher reads and edits their own; admins read all. Role and verification
-- can only be changed by the functions above or in the dashboard.
grant select on public.profiles to authenticated;
grant update (full_name, school_name, school_npsn, phone, locale) on public.profiles to authenticated;
create policy "Read own profile, admins read all" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));
create policy "Edit own profile" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Saved resources and progress: own rows only.
grant select, insert, delete on public.saved_resources, public.progress to authenticated;
create policy "Own saved resources" on public.saved_resources
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy "Own progress" on public.progress
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Feedback votes: no direct access; cast_vote() writes and feedback_totals() reads.

/* ── Teacher-only files ─────────────────────────────────────── */

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'teacher-files', 'teacher-files', false, 52428800, -- 50 MB, the Free-plan maximum
  array[
    'application/pdf',
    'application/zip',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/png',
    'image/jpeg'
  ]
);

-- Verified teachers can read (the site asks for 60-second signed links); admins manage.
-- Uploads in the Supabase dashboard bypass these rules.
create policy "Verified teachers read teacher files" on storage.objects
  for select to authenticated
  using (bucket_id = 'teacher-files' and ((select private.is_verified()) or (select private.is_admin())));
create policy "Admins upload teacher files" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'teacher-files' and (select private.is_admin()));
create policy "Admins change teacher files" on storage.objects
  for update to authenticated
  using (bucket_id = 'teacher-files' and (select private.is_admin()));
create policy "Admins delete teacher files" on storage.objects
  for delete to authenticated
  using (bucket_id = 'teacher-files' and (select private.is_admin()));
