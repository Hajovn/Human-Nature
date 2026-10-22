-- Moves the SECURITY DEFINER function bodies into the `private` schema, which the Data API
-- does not expose, and puts thin SECURITY INVOKER wrappers with the same names in `public`.
-- The website calls the same RPCs as before; the Security Advisor no longer flags them.
-- Grants move along with the functions, so callers keep the same rights.

alter function public.redeem_invite_code(text) set schema private;
alter function public.cast_vote(text, uuid, public.vote) set schema private;
alter function public.feedback_totals() set schema private;
alter function public.export_my_data() set schema private;
alter function public.delete_my_account() set schema private;

create function public.redeem_invite_code(p_code text)
returns text
language sql
security invoker
set search_path = ''
as $$ select private.redeem_invite_code(p_code); $$;

create function public.cast_vote(p_resource text, p_voter uuid, p_vote public.vote)
returns void
language sql
security invoker
set search_path = ''
as $$ select private.cast_vote(p_resource, p_voter, p_vote); $$;

create function public.feedback_totals()
returns table (resource_slug text, up bigint, down bigint)
language sql
stable
security invoker
set search_path = ''
as $$ select * from private.feedback_totals(); $$;

create function public.export_my_data()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$ select private.export_my_data(); $$;

create function public.delete_my_account()
returns void
language sql
security invoker
set search_path = ''
as $$ select private.delete_my_account(); $$;

revoke execute on function
  public.redeem_invite_code(text),
  public.cast_vote(text, uuid, public.vote),
  public.feedback_totals(),
  public.export_my_data(),
  public.delete_my_account()
from public, anon, authenticated;

grant execute on function public.cast_vote(text, uuid, public.vote) to anon, authenticated;
grant execute on function
  public.redeem_invite_code(text),
  public.feedback_totals(),
  public.export_my_data(),
  public.delete_my_account()
to authenticated;
