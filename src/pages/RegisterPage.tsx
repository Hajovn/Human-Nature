import { useState, type FormEvent } from 'react';
import { Button } from '../components/Button';
import {
  CheckboxField,
  EMAIL_PATTERN,
  MIN_PASSWORD,
  Message,
  NPSN_PATTERN,
  PHONE_PATTERN,
  PasswordField,
  TextButton,
  TextField,
  focusFirstError,
  formStyles,
  readForm,
  useBusy,
  type FieldErrors,
} from '../components/Form';
import { Link, useLocale, useT } from '../i18n/locale';
import type { StringKey } from '../i18n/strings';
import { authErrorKey, useAuth } from '../lib/auth';
import { siteUrl, supabase } from '../lib/supabase';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import AuthPlaceholderPage from './AuthPlaceholderPage';
import { AuthShell, AuthStatus, authStyles } from './LoginPage';

/** Teacher registration (DESIGN.md §8.12). The form goes to Supabase as user metadata. */
export default function RegisterPage() {
  const t = useT();
  const locale = useLocale();
  const { configured } = useAuth();
  useDocumentTitle(t('register.title'));
  const { busy, run } = useBusy();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<StringKey | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (!configured) return <AuthPlaceholderPage kind="register" />;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const get = readForm(form);
    const consent = (form.elements.namedItem('consent') as HTMLInputElement).checked;
    const next: FieldErrors = {
      full_name: get('full_name') ? undefined : t('register.errName'),
      school_name: get('school_name') ? undefined : t('register.errSchool'),
      school_npsn: NPSN_PATTERN.test(get('school_npsn')) ? undefined : t('form.errNpsn'),
      phone: !get('phone') || PHONE_PATTERN.test(get('phone')) ? undefined : t('form.errPhone'),
      email: EMAIL_PATTERN.test(get('email')) ? undefined : t('form.errEmail'),
      password: get('password').length >= MIN_PASSWORD ? undefined : t('form.errPasswordLength'),
      consent: consent ? undefined : t('register.errConsent'),
    };
    setErrors(next);
    setResult(null);
    if (focusFirstError(form, next)) return;

    const { error } = await run(() =>
      supabase!.auth.signUp({
        email: get('email'),
        password: get('password'),
        options: {
          emailRedirectTo: siteUrl('/auth/callback', locale),
          data: {
            full_name: get('full_name'),
            school_name: get('school_name'),
            school_npsn: get('school_npsn'),
            phone: get('phone'),
            invite_code: get('invite_code'),
            locale,
          },
        },
      }),
    );
    if (error) return setResult(authErrorKey(error));
    // An address that already has an account gets the same answer (Supabase sends no new
    // account), so the form doesn't reveal who is registered.
    setSentTo(get('email'));
  }

  if (sentTo) return <CheckEmail email={sentTo} kind="signup" />;

  return (
    <AuthShell>
      <h1 className={authStyles.title}>{t('register.heading')}</h1>
      <form className={formStyles.form} onSubmit={onSubmit} noValidate>
        {result && (
          <Message tone="error">
            <p>{t(result)}</p>
          </Message>
        )}
        <TextField label={t('form.fullName')} name="full_name" autoComplete="name" maxLength={120} error={errors.full_name} />
        <TextField
          label={t('form.schoolName')}
          name="school_name"
          autoComplete="organization"
          maxLength={200}
          error={errors.school_name}
        />
        <TextField
          label={t('form.npsn')}
          name="school_npsn"
          hint={t('form.npsnHint')}
          inputMode="numeric"
          maxLength={8}
          error={errors.school_npsn}
        />
        <TextField label={t('form.phone')} name="phone" type="tel" autoComplete="tel" optional maxLength={20} error={errors.phone} />
        <TextField label={t('form.email')} name="email" type="email" autoComplete="email" error={errors.email} />
        <PasswordField
          label={t('login.password')}
          name="password"
          hint={t('form.passwordHint')}
          autoComplete="new-password"
          error={errors.password}
        />
        <TextField
          label={t('form.inviteCode')}
          name="invite_code"
          hint={t('register.inviteHint')}
          optional
          autoCapitalize="characters"
          maxLength={32}
        />
        <CheckboxField name="consent" error={errors.consent}>
          {t('register.consentBefore')} <Link to="/privacy">{t('register.privacy')}</Link> {t('register.consentAnd')}{' '}
          <Link to="/terms">{t('register.terms')}</Link>
          {t('register.consentAfter')}
        </CheckboxField>
        <div className={authStyles.row}>
          <Button type="submit" size="sm" disabled={busy}>
            {busy ? t('form.busy') : t('register.submit')}
          </Button>
        </div>
      </form>
      <p className={authStyles.register}>
        {t('register.haveAccount')} <Link to="/login">{t('login.submit')}</Link>
      </p>
    </AuthShell>
  );
}

/** "Check your e-mail" after registering or asking for a reset link (§8.12). */
export function CheckEmail({ email, kind }: { email: string; kind: 'signup' | 'recovery' }) {
  const t = useT();
  const locale = useLocale();
  const { busy, run } = useBusy();
  const [state, setState] = useState<'idle' | 'sent' | StringKey>('idle');

  async function resend() {
    const error = await run(async () => {
      const response =
        kind === 'signup'
          ? await supabase!.auth.resend({ type: 'signup', email, options: { emailRedirectTo: siteUrl('/auth/callback', locale) } })
          : await supabase!.auth.resetPasswordForEmail(email, { redirectTo: siteUrl('/reset-password', locale) });
      return response.error;
    });
    setState(error ? authErrorKey(error) : 'sent');
  }

  return (
    <AuthShell>
      <AuthStatus title={t('auth.checkTitle')}>
        <p>
          {t('auth.checkText')} <strong>{email}</strong>.
        </p>
        <p>{kind === 'signup' ? t('auth.checkSignup') : t('auth.checkRecovery')}</p>
        {state === 'sent' ? (
          <Message tone="success">
            <p>{t('auth.resent')}</p>
          </Message>
        ) : (
          <>
            {state !== 'idle' && (
              <Message tone="error">
                <p>{t(state)}</p>
              </Message>
            )}
            <p>
              {t('auth.noEmail')} <TextButton onClick={resend} disabled={busy}>{t('auth.resend')}</TextButton>
            </p>
          </>
        )}
      </AuthStatus>
    </AuthShell>
  );
}
