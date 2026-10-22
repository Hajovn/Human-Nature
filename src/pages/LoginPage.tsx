import { useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '../components/Button';
import {
  EMAIL_PATTERN,
  Message,
  PasswordField,
  TextButton,
  TextField,
  focusFirstError,
  formStyles,
  readForm,
  useBusy,
  type FieldErrors,
} from '../components/Form';
import { Logo } from '../components/Logo';
import { resolveAsset } from '../content/assets';
import { Link, useLocalNavigate, useLocale, useT } from '../i18n/locale';
import type { StringKey } from '../i18n/strings';
import { authErrorKey, useAuth } from '../lib/auth';
import { siteUrl, supabase } from '../lib/supabase';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import AuthPlaceholderPage from './AuthPlaceholderPage';
import styles from './LoginPage.module.css';

const BACKGROUND = '/uploads/theme-climate-change-bromo.webp';

/**
 * Log-in screen (DESIGN.md §4.10, §5.13, §8.12): teacher accounts, by e-mail.
 */
export default function LoginPage() {
  const t = useT();
  useDocumentTitle(t('login.title'));
  const { configured } = useAuth();
  if (!configured) return <AuthPlaceholderPage kind="login" />;
  return (
    <AuthShell>
      <h1 className={styles.title}>{t('login.welcome')}</h1>
      <AccountLogin />
      <p className={styles.register}>
        {t('login.noAccount')} <Link to="/register">{t('login.register')}</Link>
      </p>
    </AuthShell>
  );
}

function AccountLogin() {
  const t = useT();
  const locale = useLocale();
  const navigate = useLocalNavigate();
  const { busy, run } = useBusy();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<StringKey | null>(null);
  const [email, setEmail] = useState('');
  const [resent, setResent] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const get = readForm(form);
    const next: FieldErrors = {
      email: EMAIL_PATTERN.test(get('email')) ? undefined : t('form.errEmail'),
      password: get('password') ? undefined : t('login.errPassword'),
    };
    setErrors(next);
    setResult(null);
    if (focusFirstError(form, next)) return;
    setEmail(get('email'));
    const { error } = await run(() =>
      supabase!.auth.signInWithPassword({ email: get('email'), password: get('password') }),
    );
    if (error) return setResult(authErrorKey(error));
    navigate('/profile');
  }

  async function resend() {
    const { error } = await run(() =>
      supabase!.auth.resend({ type: 'signup', email, options: { emailRedirectTo: siteUrl('/auth/callback', locale) } }),
    );
    if (error) setResult(authErrorKey(error));
    else setResent(true);
  }

  return (
    <form className={formStyles.form} onSubmit={onSubmit} noValidate>
      {result && (
        <Message tone={result === 'auth.err.notConfirmed' ? 'info' : 'error'}>
          <p>{t(result)}</p>
          {result === 'auth.err.notConfirmed' &&
            (resent ? <p>{t('auth.resent')}</p> : <TextButton onClick={resend} disabled={busy}>{t('auth.resend')}</TextButton>)}
        </Message>
      )}
      <TextField label={t('form.email')} name="email" type="email" autoComplete="email" error={errors.email} />
      <PasswordField label={t('login.password')} name="password" autoComplete="current-password" error={errors.password} />
      <div className={styles.row}>
        <Button type="submit" size="sm" disabled={busy}>
          {busy ? t('form.busy') : t('login.submit')}
        </Button>
        <Link to="/forgot-password" className={styles.forgot}>
          {t('login.forgot')}
        </Link>
      </div>
    </form>
  );
}

/** Full-bleed Bromo photo with the rounded light-blue card on the right (§5.13). */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <section className={styles.page}>
      <img className={styles.bg} src={resolveAsset(BACKGROUND)} alt="" width={1200} height={1600} />
      <div className={`container ${styles.inner}`}>
        <div className={styles.card}>
          {children}
          <div className={styles.logo}>
            <Logo size="large" asLink={false} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** "Check your e-mail" and similar result screens inside the log-in card (§8.12). */
export function AuthStatus({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.status}>{children}</div>
    </>
  );
}

export { styles as authStyles };
