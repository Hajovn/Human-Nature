-- Redesign 2026-10-26: the "Comments / Questions?" box on resource and theme pages
-- (DESIGN.md §4.13). Messages go privately to the team: logged-in teachers can send,
-- nobody can read them except admins (on the admin page). Nothing is shown publicly.

create table public.comments (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  resource_slug public.slug not null,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index comments_created_at on public.comments (created_at desc);

alter table public.comments enable row level security;

-- Teachers send as themselves; they can't read comments back (not even their own).
create policy "Teachers send comments" on public.comments
  for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "Admins read comments" on public.comments
  for select to authenticated
  using ((select private.is_admin()));

create policy "Admins delete comments" on public.comments
  for delete to authenticated
  using ((select private.is_admin()));

grant insert on public.comments to authenticated;
grant select, delete on public.comments to authenticated;

-- "Download my data" also includes the teacher's own comments.
create or replace function private.export_my_data()
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
    'feedback_votes', coalesce((select jsonb_agg(to_jsonb(v) - 'voter_id') from public.feedback_votes v where voter_id = auth.uid()), '[]'),
    'comments', coalesce((select jsonb_agg(to_jsonb(c) - 'user_id') from public.comments c where user_id = auth.uid()), '[]')
  );
$$;
