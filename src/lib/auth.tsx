// Who is logged in: teacher accounts in Supabase (docs/SUPABASE-PLAN.md). Without the
// Supabase variables (e.g. a local copy without .env.local) the site has no accounts.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useLocation, useNavigate } from 'react-router-dom';
import type { StringKey } from '../i18n/strings';
import { supabase } from './supabase';
import { startSync, stopSync } from './sync';

/** A row of public.profiles (supabase/migrations). */
export interface Profile {
  full_name: string;
  school_name: string;
  school_npsn: string | null;
  phone: string | null;
  locale: 'id' | 'en';
  role: 'teacher' | 'admin';
  verified_at: string | null;
  /** Animal stamp id (src/content/avatars.ts). */
  avatar: string;
}

export interface Account {
  id: string;
  email: string;
  /** Shown in the header and greeting: the profile name, else the start of the e-mail. */
  name: string;
  profile: Profile | null;
}

interface AuthState {
  /** True when real accounts are available (Supabase configured). */
  configured: boolean;
  /** True until the stored session (or an e-mail link) has been checked. */
  loading: boolean;
  account: Account | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  return supabase ? <SupabaseAuth>{children}</SupabaseAuth> : <AuthContext.Provider value={NO_ACCOUNTS}>{children}</AuthContext.Provider>;
}

// Without Supabase, and outside <AuthProvider> (the CMS live preview), there are no accounts.
const NO_ACCOUNTS: AuthState = {
  configured: false,
  loading: false,
  account: null,
  refreshProfile: async () => {},
  signOut: async () => {},
};

export function useAuth(): AuthState {
  return useContext(AuthContext) ?? NO_ACCOUNTS;
}

/**
 * Drop the tokens an e-mail link put in the address. Supabase removes them from the
 * address bar, but the router still has them (they'd end up in e.g. the language switch).
 */
export function useClearAuthHash(loading: boolean) {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && hash) navigate({ pathname, search }, { replace: true });
  }, [loading, hash, pathname, search, navigate]);
}

/** Interface-text key for an error from Supabase Auth or the database. */
export function authErrorKey(error: { code?: string; status?: number } | null | undefined): StringKey {
  switch (error?.code) {
    case 'invalid_credentials':
      return 'auth.err.credentials';
    case 'email_not_confirmed':
      return 'auth.err.notConfirmed';
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return 'auth.err.rateLimit';
    case 'weak_password':
      return 'auth.err.weakPassword';
    case 'same_password':
      return 'auth.err.samePassword';
    case 'email_address_invalid':
      return 'auth.err.email';
    case 'email_exists':
    case 'user_already_exists':
      return 'auth.err.emailTaken';
  }
  if (error?.status === 429) return 'auth.err.rateLimit';
  if (error?.status === 0) return 'auth.err.network';
  return 'auth.err.generic';
}

const PROFILE_COLUMNS = 'full_name, school_name, school_npsn, phone, locale, role, verified_at, avatar';

function SupabaseAuth({ children }: { children: ReactNode }) {
  const client = supabase!;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const userId = session?.user.id;

  useEffect(() => {
    // getSession waits until an e-mail link in the address bar has been handled.
    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    // Only store state here: calling Supabase inside this callback can deadlock.
    const { data } = client.auth.onAuthStateChange((event, next) => {
      if (event === 'SIGNED_OUT') stopSync();
      setSession(next);
    });
    return () => data.subscription.unsubscribe();
  }, [client]);

  // Saved items and progress follow the account (sync.ts).
  useEffect(() => {
    if (userId) void startSync(client, userId);
  }, [client, userId]);

  const refreshProfile = useCallback(async () => {
    if (!userId) return setProfile(null);
    const { data } = await client.from('profiles').select(PROFILE_COLUMNS).eq('id', userId).maybeSingle();
    setProfile((data as Profile | null) ?? null);
  }, [client, userId]);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const signOut = useCallback(async () => {
    await client.auth.signOut();
  }, [client]);

  const value = useMemo<AuthState>(() => {
    const user = session?.user;
    const email = user?.email ?? '';
    return {
      configured: true,
      loading,
      account: user
        ? { id: user.id, email, name: profile?.full_name || email.split('@')[0], profile }
        : null,
      refreshProfile,
      signOut,
    };
  }, [session, loading, profile, refreshProfile, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
