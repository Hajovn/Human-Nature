import { useState, type FormEvent } from 'react';
import { Button } from '../components/Button';
import { MIN_PASSWORD, Message, PasswordField, focusFirstError, formStyles, readForm, useBusy, type FieldErrors } from '../components/Form';
import { useT } from '../i18n/locale';
import type { StringKey } from '../i18n/strings';
import { authErrorKey, useAuth, useClearAuthHash } from '../lib/auth';
import { initialAuthError, supabase } from '../lib/supabase';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { AuthShell, AuthStatus, authStyles } from './LoginPage';

/**
 * New password (DESIGN.md §8.12). The reset e-mail's link logs the teacher in and lands
 * here; without a session (expired or reused link) it offers a new link instead.
 */
export default function ResetPasswordPage() {
  const t = useT();
  const { loading, account } = useAuth();
  const expired = !loading && (!!initialAuthError || !account);
  useDocumentTitle(t(expired ? 'auth.expiredTitle' : 'reset.title'));
  useClearAuthHash(loading);
  const { busy, run } = useBusy();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<StringKey | null>(null);
  const [saved, setSaved] = useState(false);

  if (loading) return <Waiting />;
  if (expired) return <LinkExpired retry="/forgot-password" />;

  if (saved) {
    return (
      <AuthShell>
        <AuthStatus title={t('reset.doneTitle')}>
          <Message tone="success">
            <p>{t('reset.done')}</p>
          </Message>
          <Button to="/profile" size="sm">
            {t('auth.toProfile')}
          </Button>
        </AuthStatus>
      </AuthShell>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const get = readForm(form);
    const next: FieldErrors = {
      password: get('password').length >= MIN_PASSWORD ? undefined : t('form.errPasswordLength'),
      password_repeat: get('password_repeat') === get('password') ? undefined : t('form.errPasswordRepeat'),
    };
    setErrors(next);
    setResult(null);
    if (focusFirstError(form, next)) return;
    const { error } = await run(() => supabase!.auth.updateUser({ password: get('password') }));
    if (error) setResult(authErrorKey(error));
    else setSaved(true);
  }

  return (
    <AuthShell>
      <h1 className={authStyles.title}>{t('reset.title')}</h1>
      <form className={formStyles.form} onSubmit={onSubmit} noValidate>
        {result && (
          <Message tone="error">
            <p>{t(result)}</p>
          </Message>
        )}
        <PasswordField
          label={t('form.newPassword')}
          name="password"
          hint={t('form.passwordHint')}
          autoComplete="new-password"
          error={errors.password}
        />
        <PasswordField
          label={t('form.repeatPassword')}
          name="password_repeat"
          autoComplete="new-password"
          error={errors.password_repeat}
        />
        <div className={authStyles.row}>
          <Button type="submit" size="sm" disabled={busy}>
            {busy ? t('form.busy') : t('reset.submit')}
          </Button>
        </div>
      </form>
    </AuthShell>
  );
}

export function Waiting() {
  const t = useT();
  return (
    <AuthShell>
      <AuthStatus title={t('auth.waitTitle')}>
        <p aria-live="polite">{t('form.busy')}</p>
      </AuthStatus>
    </AuthShell>
  );
}

export function LinkExpired({ retry }: { retry: '/forgot-password' | '/login' }) {
  const t = useT();
  return (
    <AuthShell>
      <AuthStatus title={t('auth.expiredTitle')}>
        <p>{t('auth.expiredText')}</p>
        <Button to={retry} size="sm">
          {retry === '/login' ? t('login.submit') : t('auth.newLink')}
        </Button>
      </AuthStatus>
    </AuthShell>
  );
}
