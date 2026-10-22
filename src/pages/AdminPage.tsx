import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Button } from '../components/Button';
import { Message, TextField, focusFirstError, formStyles, readForm, useBusy, type FieldErrors } from '../components/Form';
import { PageIntro, SectionTitle } from '../components/ui';
import { useResources, useThemes } from '../content/useContent';
import { useLocale, useT } from '../i18n/locale';
import { authErrorKey, useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import styles from './AdminPage.module.css';

interface InviteCode {
  id: string;
  code: string;
  label: string;
  expires_at: string | null;
  max_uses: number | null;
  uses: number;
  active: boolean;
}

interface VoteTotal {
  resource_slug: string;
  up: number;
  down: number;
}

const CODE_PATTERN = /^[A-Z0-9-]{6,32}$/;
// No 0/O or 1/I, so codes read out at a training are typed correctly.
const CODE_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function newCode() {
  const pick = () => CODE_LETTERS[crypto.getRandomValues(new Uint32Array(1))[0] % CODE_LETTERS.length];
  const part = () => Array.from({ length: 4 }, pick).join('');
  return `${part()}-${part()}`;
}

/** Admin page (DESIGN.md §8.12): invite codes and feedback totals. Admins only. */
export default function AdminPage() {
  const t = useT();
  useDocumentTitle(t('admin.title'));
  const { configured, loading, account } = useAuth();
  const isAdmin = configured && account?.profile?.role === 'admin';

  if (loading || (account && !account.profile)) return <PageIntro title={t('admin.title')}>{t('form.busy')}</PageIntro>;
  if (!isAdmin) return <PageIntro title={t('admin.title')}>{t('admin.only')}</PageIntro>;
  return (
    <>
      <PageIntro title={t('admin.title')}>{t('admin.intro')}</PageIntro>
      <InviteCodes userId={account!.id} />
      <FeedbackTotals />
    </>
  );
}

function InviteCodes({ userId }: { userId: string }) {
  const t = useT();
  const locale = useLocale();
  const [codes, setCodes] = useState<InviteCode[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const { busy, run } = useBusy();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase!
      .from('invite_codes')
      .select('id, code, label, expires_at, max_uses, uses, active')
      .order('created_at', { ascending: false });
    setLoadError(!!error);
    setCodes((data as InviteCode[] | null) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const get = readForm(form);
    const code = (get('code') || newCode()).toUpperCase();
    const maxUses = get('max_uses');
    const next: FieldErrors = {
      code: CODE_PATTERN.test(code) ? undefined : t('admin.errCode'),
      label: get('label') ? undefined : t('admin.errLabel'),
      max_uses: !maxUses || /^[1-9][0-9]*$/.test(maxUses) ? undefined : t('admin.errMax'),
    };
    setErrors(next);
    setResult(null);
    if (focusFirstError(form, next)) return;
    const { error } = await run(() =>
      supabase!.from('invite_codes').insert({
        code,
        label: get('label'),
        // End of the chosen day, in the admin's time zone.
        expires_at: get('expires_at') ? new Date(`${get('expires_at')}T23:59:59`).toISOString() : null,
        max_uses: maxUses ? Number(maxUses) : null,
        created_by: userId,
      }),
    );
    if (error) {
      const text = error.code === '23505' ? t('admin.errDuplicate') : t(authErrorKey(error));
      return setResult({ tone: 'error', text });
    }
    form.reset();
    setResult({ tone: 'success', text: t('admin.created', { code }) });
    await load();
  }

  async function toggle(code: InviteCode) {
    const { error } = await supabase!.from('invite_codes').update({ active: !code.active }).eq('id', code.id);
    if (error) setResult({ tone: 'error', text: t(authErrorKey(error)) });
    await load();
  }

  const date = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-GB') : t('admin.noEnd');

  return (
    <section className={`container ${styles.section}`} aria-labelledby="codes-title">
      <SectionTitle id="codes-title">{t('admin.codes')}</SectionTitle>

      <form className={`${formStyles.form} ${formStyles.outlined} ${styles.box}`} onSubmit={onSubmit} noValidate>
        <h3 className={styles.boxTitle}>{t('admin.newCode')}</h3>
        {result && (
          <Message tone={result.tone}>
            <p>{result.text}</p>
          </Message>
        )}
        <div className={styles.fields}>
          <TextField label={t('admin.label')} name="label" hint={t('admin.labelHint')} maxLength={200} error={errors.label} />
          <TextField
            label={t('admin.code')}
            name="code"
            hint={t('admin.codeHint')}
            optional
            autoCapitalize="characters"
            maxLength={32}
            error={errors.code}
          />
          <TextField label={t('admin.expires')} name="expires_at" type="date" optional />
          <TextField
            label={t('admin.maxUses')}
            name="max_uses"
            inputMode="numeric"
            optional
            maxLength={6}
            error={errors.max_uses}
          />
        </div>
        <div>
          <Button type="submit" disabled={busy}>
            {busy ? t('form.busy') : t('admin.create')}
          </Button>
        </div>
      </form>

      {loadError && (
        <Message tone="error">
          <p>{t('auth.err.generic')}</p>
        </Message>
      )}
      {codes === null ? (
        <p>{t('form.busy')}</p>
      ) : codes.length === 0 ? (
        <p>{t('admin.noCodes')}</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">{t('admin.code')}</th>
                <th scope="col">{t('admin.label')}</th>
                <th scope="col">{t('admin.uses')}</th>
                <th scope="col">{t('admin.expires')}</th>
                <th scope="col">{t('admin.status')}</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((code) => (
                <tr key={code.id} className={code.active ? undefined : styles.off}>
                  <td className={styles.code}>{code.code}</td>
                  <td>{code.label}</td>
                  <td>
                    {code.uses} / {code.max_uses ?? t('admin.unlimited')}
                  </td>
                  <td>{date(code.expires_at)}</td>
                  <td className={styles.status}>
                    <span>{code.active ? t('admin.on') : t('admin.off')}</span>
                    <button type="button" className={styles.textButton} onClick={() => toggle(code)}>
                      {code.active ? t('admin.switchOff') : t('admin.switchOn')}
                      <span className="visually-hidden"> {code.code}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function FeedbackTotals() {
  const t = useT();
  const resources = useResources();
  const themes = useThemes();
  const [totals, setTotals] = useState<VoteTotal[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    supabase!.rpc('feedback_totals').then(({ data, error }) => {
      setFailed(!!error);
      setTotals((data as VoteTotal[] | null) ?? []);
    });
  }, []);

  // Votes are stored per resource slug, or "theme-<slug>" for the theme pages.
  const titleOf = (slug: string) =>
    resources.find((r) => r.slug === slug)?.title ??
    themes.find((th) => `theme-${th.slug}` === slug)?.title ??
    slug;

  return (
    <section className={`container ${styles.section}`} aria-labelledby="feedback-title">
      <SectionTitle id="feedback-title">{t('admin.feedback')}</SectionTitle>
      {failed && (
        <Message tone="error">
          <p>{t('auth.err.generic')}</p>
        </Message>
      )}
      {totals === null ? (
        <p>{t('form.busy')}</p>
      ) : totals.length === 0 ? (
        <p>{t('admin.noVotes')}</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">{t('admin.resource')}</th>
                <th scope="col">{t('admin.up')}</th>
                <th scope="col">{t('admin.down')}</th>
              </tr>
            </thead>
            <tbody>
              {totals.map((row) => (
                <tr key={row.resource_slug}>
                  <td>{titleOf(row.resource_slug)}</td>
                  <td>{row.up}</td>
                  <td>{row.down}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
