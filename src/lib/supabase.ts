// Supabase client for teacher accounts (docs/SUPABASE-PLAN.md). The URL and publishable
// key come from .env.local locally and from GitHub Actions variables in production. Without
// them `supabase` is null and the site keeps working without accounts (the mock log-in).
import { createClient } from '@supabase/supabase-js';
import { localizePath, type Locale } from '../i18n/locale';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/**
 * An error Supabase put in an e-mail link's redirect (e.g. an expired confirmation link).
 * Read before the client starts, because the client removes it from the address bar.
 */
export const initialAuthError: string | null = (() => {
  const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search);
  return params.get('error_code') ?? params.get('error');
})();

export const supabase =
  url && key
    ? createClient(url, key, {
        // Sessions are kept in localStorage (no cookies, GO-LIVE.md Phase 4). The implicit
        // flow lets an e-mail link work on another device than the one used to register.
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit' },
      })
    : null;

/** Full address of a page on this site, for the links in Supabase's e-mails. */
export function siteUrl(path: string, locale: Locale) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return new URL(`${base}${localizePath(path, locale)}`, window.location.origin).href;
}
