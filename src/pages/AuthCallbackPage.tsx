import { Button } from '../components/Button';
import { useT } from '../i18n/locale';
import { useAuth, useClearAuthHash } from '../lib/auth';
import { initialAuthError } from '../lib/supabase';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { AuthShell, AuthStatus } from './LoginPage';
import { LinkExpired, Waiting } from './ResetPasswordPage';

/** Where confirmation links land: new account or changed e-mail address (DESIGN.md §8.12). */
export default function AuthCallbackPage() {
  const t = useT();
  const { loading, account } = useAuth();
  const expired = !loading && (!!initialAuthError || !account);
  useDocumentTitle(t(expired ? 'auth.expiredTitle' : 'callback.title'));
  useClearAuthHash(loading);

  if (loading) return <Waiting />;
  if (expired) return <LinkExpired retry="/login" />;
  return (
    <AuthShell>
      <AuthStatus title={t('callback.title')}>
        <p>{t('callback.text')}</p>
        <Button to="/profile" size="sm">
          {t('auth.toProfile')}
        </Button>
      </AuthStatus>
    </AuthShell>
  );
}
