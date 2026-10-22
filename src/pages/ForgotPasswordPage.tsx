import { useState, type FormEvent } from 'react';
import { Button } from '../components/Button';
import { EMAIL_PATTERN, Message, TextField, focusFirstError, formStyles, readForm, useBusy, type FieldErrors } from '../components/Form';
import { Link, useLocale, useT } from '../i18n/locale';
import type { StringKey } from '../i18n/strings';
import { authErrorKey, useAuth } from '../lib/auth';
import { siteUrl, supabase } from '../lib/supabase';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import AuthPlaceholderPage from './AuthPlaceholderPage';
import { AuthShell, authStyles } from './LoginPage';
import { CheckEmail } from './RegisterPage';

/** Forgot password (DESIGN.md §8.12): e-mails a link to /reset-password. */
export default function ForgotPasswordPage() {
  const t = useT();
  const locale = useLocale();
  const { configured } = useAuth();
  useDocumentTitle(t('forgot.title'));
  const { busy, run } = useBusy();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<StringKey | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (!configured) return <AuthPlaceholderPage kind="forgot" />;
  if (sentTo) return <CheckEmail email={sentTo} kind="recovery" />;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const get = readForm(form);
    const next: FieldErrors = { email: EMAIL_PATTERN.test(get('email')) ? undefined : t('form.errEmail') };
    setErrors(next);
    setResult(null);
    if (focusFirstError(form, next)) return;
    const { error } = await run(() =>
      supabase!.auth.resetPasswordForEmail(get('email'), { redirectTo: siteUrl('/reset-password', locale) }),
    );
    // Unknown addresses get the same answer, so the form doesn't reveal who has an account.
    if (error) setResult(authErrorKey(error));
    else setSentTo(get('email'));
  }

  return (
    <AuthShell>
      <h1 className={authStyles.title}>{t('forgot.title')}</h1>
      <form className={formStyles.form} onSubmit={onSubmit} noValidate>
        <p className={authStyles.note}>{t('forgot.intro')}</p>
        {result && (
          <Message tone="error">
            <p>{t(result)}</p>
          </Message>
        )}
        <TextField label={t('form.email')} name="email" type="email" autoComplete="email" error={errors.email} />
        <div className={authStyles.row}>
          <Button type="submit" size="sm" disabled={busy}>
            {busy ? t('form.busy') : t('forgot.submit')}
          </Button>
          <Link to="/login" className={authStyles.forgot}>
            {t('auth.back')}
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
