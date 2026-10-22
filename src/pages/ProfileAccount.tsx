import { useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '../components/Button';
import {
  EMAIL_PATTERN,
  MIN_PASSWORD,
  Message,
  NPSN_PATTERN,
  PHONE_PATTERN,
  PasswordField,
  TextField,
  focusFirstError,
  formStyles,
  readForm,
  useBusy,
  type FieldErrors,
} from '../components/Form';
import { useLocalNavigate, useLocale, useT } from '../i18n/locale';
import type { StringKey } from '../i18n/strings';
import { authErrorKey, useAuth, type Account } from '../lib/auth';
import { siteUrl, supabase } from '../lib/supabase';
import styles from './ProfileAccount.module.css';

// Personal-page parts for real teacher accounts (DESIGN.md §8.12).

type Result = { tone: 'success' | 'error'; key: StringKey } | null;

function ResultMessage({ result }: { result: Result }) {
  const t = useT();
  if (!result) return null;
  return (
    <Message tone={result.tone}>
      <p>{t(result.key)}</p>
    </Message>
  );
}

function Box({ title, id, children, className }: { title: string; id: string; children: ReactNode; className?: string }) {
  return (
    <section className={`${styles.box} ${className ?? ''}`} aria-labelledby={id}>
      <h3 id={id} className={styles.boxTitle}>
        {title}
      </h3>
      {children}
    </section>
  );
}

/* ── Invite code ─────────────────────────────────────────────── */

const REDEEM_RESULTS: Record<string, Result> = {
  ok: { tone: 'success', key: 'invite.ok' },
  already_verified: { tone: 'success', key: 'invite.ok' },
  not_found: { tone: 'error', key: 'invite.notFound' },
  expired: { tone: 'error', key: 'invite.expired' },
  used_up: { tone: 'error', key: 'invite.usedUp' },
  too_many_attempts: { tone: 'error', key: 'invite.tooMany' },
};

/** "Unlock teacher materials": shown until the teacher has used a valid invite code. */
export function InviteCodeBox() {
  const t = useT();
  const { refreshProfile } = useAuth();
  const { busy, run } = useBusy();
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<Result>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const code = readForm(form)('code');
    const errors: FieldErrors = { code: code ? undefined : t('invite.errEmpty') };
    setError(errors.code);
    setResult(null);
    if (focusFirstError(form, errors)) return;
    const { data, error } = await run(() => supabase!.rpc('redeem_invite_code', { p_code: code }));
    if (error) return setResult({ tone: 'error', key: authErrorKey(error) });
    setResult(REDEEM_RESULTS[data as string] ?? { tone: 'error', key: 'auth.err.generic' });
    if (data === 'ok' || data === 'already_verified') await refreshProfile();
  }

  return (
    <div className="container">
      <section id="invite" className={`${styles.box} ${styles.invite}`} aria-labelledby="invite-title">
        <h2 id="invite-title" className={styles.inviteTitle}>
          {t('invite.title')}
        </h2>
        <p>{t('invite.text')}</p>
        <ResultMessage result={result} />
        {result?.tone !== 'success' && (
          <form className={`${formStyles.outlined} ${styles.inline}`} onSubmit={onSubmit} noValidate>
            <TextField label={t('form.inviteCode')} name="code" autoCapitalize="characters" maxLength={32} error={error} />
            <Button type="submit" disabled={busy}>
              {busy ? t('form.busy') : t('invite.submit')}
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}

/* ── Account section ─────────────────────────────────────────── */

export function AccountSection({ account }: { account: Account }) {
  const t = useT();
  return (
    <section className={`container ${styles.section}`} aria-labelledby="account-title">
      <h2 id="account-title" className={styles.sectionTitle}>
        {t('account.title')}
      </h2>
      <div className={styles.grid}>
        {/* Remount once the profile has loaded, so the fields start with its values. */}
        <DetailsBox key={account.profile ? 'loaded' : 'loading'} account={account} />
        <div className={styles.column}>
          <EmailBox current={account.email} />
          <PasswordBox />
          <DataBox />
        </div>
      </div>
      <DeleteAccount />
    </section>
  );
}

function DetailsBox({ account }: { account: Account }) {
  const t = useT();
  const { refreshProfile } = useAuth();
  const { busy, run } = useBusy();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<Result>(null);
  const p = account.profile;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const get = readForm(form);
    const next: FieldErrors = {
      full_name: get('full_name') ? undefined : t('register.errName'),
      school_name: get('school_name') ? undefined : t('register.errSchool'),
      school_npsn: NPSN_PATTERN.test(get('school_npsn')) ? undefined : t('form.errNpsn'),
      phone: !get('phone') || PHONE_PATTERN.test(get('phone')) ? undefined : t('form.errPhone'),
    };
    setErrors(next);
    setResult(null);
    if (focusFirstError(form, next)) return;
    const { error } = await run(() =>
      supabase!
        .from('profiles')
        .update({
          full_name: get('full_name'),
          school_name: get('school_name'),
          school_npsn: get('school_npsn'),
          phone: get('phone') || null,
          locale: get('locale') === 'en' ? 'en' : 'id',
        })
        .eq('id', account.id),
    );
    if (error) return setResult({ tone: 'error', key: authErrorKey(error) });
    // Supabase's e-mail templates read the language from the account's metadata.
    await supabase!.auth.updateUser({ data: { locale: get('locale') === 'en' ? 'en' : 'id' } });
    await refreshProfile();
    setResult({ tone: 'success', key: 'account.saved' });
  }

  return (
    <Box title={t('account.details')} id="account-details">
      <form className={`${formStyles.form} ${formStyles.outlined}`} onSubmit={onSubmit} noValidate>
        <ResultMessage result={result} />
        <TextField
          label={t('form.fullName')}
          name="full_name"
          autoComplete="name"
          maxLength={120}
          defaultValue={p?.full_name}
          error={errors.full_name}
        />
        <TextField
          label={t('form.schoolName')}
          name="school_name"
          autoComplete="organization"
          maxLength={200}
          defaultValue={p?.school_name}
          error={errors.school_name}
        />
        <TextField
          label={t('form.npsn')}
          name="school_npsn"
          hint={t('form.npsnHint')}
          inputMode="numeric"
          maxLength={8}
          defaultValue={p?.school_npsn ?? ''}
          error={errors.school_npsn}
        />
        <TextField
          label={t('form.phone')}
          name="phone"
          type="tel"
          autoComplete="tel"
          optional
          maxLength={20}
          defaultValue={p?.phone ?? ''}
          error={errors.phone}
        />
        <fieldset className={styles.choice}>
          <legend>{t('account.emailLanguage')}</legend>
          {(['id', 'en'] as const).map((value) => (
            <label key={value}>
              <input type="radio" name="locale" value={value} defaultChecked={(p?.locale ?? 'id') === value} />
              {t(value === 'id' ? 'lang.id' : 'lang.en')}
            </label>
          ))}
        </fieldset>
        <div>
          <Button type="submit" disabled={busy}>
            {busy ? t('form.busy') : t('account.save')}
          </Button>
        </div>
      </form>
    </Box>
  );
}

function EmailBox({ current }: { current: string }) {
  const t = useT();
  const locale = useLocale();
  const { busy, run } = useBusy();
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<Result>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = readForm(form)('email');
    const errors: FieldErrors = {
      email: !EMAIL_PATTERN.test(email) ? t('form.errEmail') : email === current ? t('account.sameEmail') : undefined,
    };
    setError(errors.email);
    setResult(null);
    if (focusFirstError(form, errors)) return;
    const { error } = await run(() =>
      supabase!.auth.updateUser({ email }, { emailRedirectTo: siteUrl('/auth/callback', locale) }),
    );
    if (error) return setResult({ tone: 'error', key: authErrorKey(error) });
    form.reset();
    setResult({ tone: 'success', key: 'account.emailSent' });
  }

  return (
    <Box title={t('account.email')} id="account-email">
      <p>
        {t('account.currentEmail')} <strong className={styles.email}>{current}</strong>
      </p>
      <form className={`${formStyles.form} ${formStyles.outlined}`} onSubmit={onSubmit} noValidate>
        <ResultMessage result={result} />
        <TextField label={t('account.newEmail')} name="email" type="email" autoComplete="email" error={error} />
        <div>
          <Button type="submit" disabled={busy}>
            {busy ? t('form.busy') : t('account.changeEmail')}
          </Button>
        </div>
      </form>
    </Box>
  );
}

function PasswordBox() {
  const t = useT();
  const { busy, run } = useBusy();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<Result>(null);

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
    if (error) return setResult({ tone: 'error', key: authErrorKey(error) });
    form.reset();
    setResult({ tone: 'success', key: 'account.passwordSaved' });
  }

  return (
    <Box title={t('account.password')} id="account-password">
      <form className={`${formStyles.form} ${formStyles.outlined}`} onSubmit={onSubmit} noValidate>
        <ResultMessage result={result} />
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
        <div>
          <Button type="submit" disabled={busy}>
            {busy ? t('form.busy') : t('account.changePassword')}
          </Button>
        </div>
      </form>
    </Box>
  );
}

function DataBox() {
  const t = useT();
  const { busy, run } = useBusy();
  const [result, setResult] = useState<Result>(null);

  async function download() {
    setResult(null);
    const { data, error } = await run(() => supabase!.rpc('export_my_data'));
    if (error) return setResult({ tone: 'error', key: authErrorKey(error) });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'human-nature-my-data.json';
    link.click();
    // Revoking right away can cancel the download in some browsers.
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  return (
    <Box title={t('account.data')} id="account-data">
      <p>{t('account.dataText')}</p>
      <ResultMessage result={result} />
      <div>
        <Button onClick={download} disabled={busy}>
          {busy ? t('form.busy') : t('account.download')}
        </Button>
      </div>
    </Box>
  );
}

function DeleteAccount() {
  const t = useT();
  const navigate = useLocalNavigate();
  const { busy, run } = useBusy();
  const [result, setResult] = useState<Result>(null);

  async function remove() {
    // Destructive: confirm first (§8.6).
    if (!window.confirm(t('account.deleteConfirm'))) return;
    const { error } = await run(() => supabase!.rpc('delete_my_account'));
    if (error) return setResult({ tone: 'error', key: authErrorKey(error) });
    // The account is gone on the server; only this browser's session remains.
    await supabase!.auth.signOut({ scope: 'local' });
    navigate('/');
  }

  return (
    <div className={styles.delete}>
      <ResultMessage result={result} />
      <button type="button" className={styles.danger} onClick={remove} disabled={busy}>
        {busy ? t('form.busy') : t('profile.delete')}
      </button>
    </div>
  );
}
