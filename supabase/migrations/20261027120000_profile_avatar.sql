-- Profile avatars: one of the 18 animal stamps (src/content/avatars.ts, DESIGN.md §5.8).
-- Every account gets a random animal (also the accounts that already exist); teachers can
-- change it on their profile page.

create function private.random_avatar()
returns text
language sql
volatile
set search_path = ''
as $$
  select (array[
    'bear', 'fox', 'deer', 'hare', 'heron', 'songbird', 'peacock', 'fish', 'crow',
    'jellyfish', 'turtle', 'tiger', 'whale', 'wolf', 'octopus', 'elephant', 'anteater', 'hedgehog'
  ])[1 + floor(random() * 18)::int];
$$;

-- A volatile default is evaluated per row, so existing profiles each get their own animal.
alter table public.profiles
  add column avatar text not null default private.random_avatar()
  check (avatar in (
    'bear', 'fox', 'deer', 'hare', 'heron', 'songbird', 'peacock', 'fish', 'crow',
    'jellyfish', 'turtle', 'tiger', 'whale', 'wolf', 'octopus', 'elephant', 'anteater', 'hedgehog'
  ));

-- Teachers may change their own avatar (the row rule "Edit own profile" already applies).
grant update (avatar) on public.profiles to authenticated;
