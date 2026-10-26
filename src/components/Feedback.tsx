import { useId, useState, type FormEvent } from 'react';
import { useAsset } from '../content/assets';
import { useT } from '../i18n/locale';
import { useAuth } from '../lib/auth';
import { useFeedback, useProgress, type Vote } from '../lib/storage';
import { supabase } from '../lib/supabase';
import { castVote } from '../lib/sync';
import { Button } from './Button';
import { Message, useBusy } from './Form';
import { Icon } from './Icon';
import styles from './Feedback.module.css';

/**
 * "What did you think of this resource?" with Helpful / Not yet, Figma 311:1691
 * (DESIGN.md §4.13). Stored in the browser, and sent to the database so the team can see
 * the totals (sync.ts).
 */
export function FeedbackWidget({ id }: { id: string }) {
  const { vote, setVote: storeVote } = useFeedback(id);
  const t = useT();
  const setVote = (next: Vote) => {
    // Clicking the selected answer again removes the vote.
    castVote(id, vote === next ? null : next);
    storeVote(next);
  };
  const option = (value: Vote, label: string) => (
    <button
      type="button"
      className={`${styles.choice} ${vote === value ? styles.chosen : ''}`}
      aria-pressed={vote === value}
      onClick={() => setVote(value)}
    >
      {label}
    </button>
  );
  return (
    <section className={styles.feedback} aria-labelledby={`feedback-${id}`}>
      <h2 id={`feedback-${id}`} className={styles.prompt}>
        {t('feedback.prompt')}
      </h2>
      <div className={styles.buttons}>
        {option('up', t('feedback.helpful'))}
        {option('down', t('feedback.notYet'))}
      </div>
      <p className={styles.status} role="status">
        {vote ? t('feedback.thanks') : ''}
      </p>
    </section>
  );
}

/**
 * "Comments / Questions?" box (DESIGN.md §4.13). Sends the message privately to the team
 * (Supabase table `comments`, readable only by admins). Only logged-in teachers can send.
 */
export function CommentBox({ id }: { id: string }) {
  const t = useT();
  const fieldId = useId();
  const { configured, account } = useAuth();
  const { busy, run } = useBusy();
  const [result, setResult] = useState<'sent' | 'failed' | 'empty' | null>(null);
  if (!configured) return null;

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const body = String(new FormData(form).get('comment') ?? '').trim();
    if (!body) return setResult('empty');
    const { error } = await run(() => supabase!.from('comments').insert({ resource_slug: id, body }));
    if (error) return setResult('failed');
    form.reset();
    setResult('sent');
  }

  return (
    <form className={styles.comment} onSubmit={send} noValidate>
      <div className={styles.commentBox}>
        <label htmlFor={fieldId} className={styles.commentLabel}>
          {t('comment.label')}
        </label>
        <textarea
          id={fieldId}
          name="comment"
          rows={3}
          maxLength={2000}
          disabled={!account}
          aria-describedby={`${fieldId}-hint`}
          onChange={() => setResult(null)}
        />
      </div>
      <p id={`${fieldId}-hint`} className={styles.commentHint}>
        {account ? t('comment.private') : t('comment.loginFirst')}
      </p>
      {result === 'sent' && (
        <Message tone="success">
          <p>{t('comment.sent')}</p>
        </Message>
      )}
      {result === 'failed' && (
        <Message tone="error">
          <p>{t('comment.failed')}</p>
        </Message>
      )}
      {result === 'empty' && (
        <Message tone="error">
          <p>{t('comment.empty')}</p>
        </Message>
      )}
      <div>
        {account ? (
          <Button type="submit" disabled={busy}>
            {busy ? t('form.busy') : t('comment.send')}
          </Button>
        ) : (
          <Button to="/login">{t('comment.login')}</Button>
        )}
      </div>
    </form>
  );
}

/** Feedback and comment box side by side, as at the bottom of resource pages (Figma 311:1691). */
export function FeedbackSection({ id }: { id: string }) {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.row}`}>
        <FeedbackWidget id={id} />
        <CommentBox id={id} />
      </div>
    </section>
  );
}

export const DEFAULT_MODULE_FILE = '/downloads/module-placeholder.pdf';

/** "Download this theme as a PDF": thumbnail + Secondary button (DESIGN.md §5.2). */
export function DownloadPdf({ id, file = DEFAULT_MODULE_FILE }: { id: string; file?: string }) {
  const { record } = useProgress();
  const resolve = useAsset();
  const t = useT();
  return (
    <div className={styles.download}>
      <span className={styles.pdfThumb} aria-hidden="true" />
      <div className={styles.downloadText}>
        <h2 className={styles.downloadTitle}>{t('download.themePdf')}</h2>
        <a className={styles.downloadButton} href={resolve(file)} download onClick={() => record('modulesOpened', id)}>
          {t('download.pdf')}
        </a>
      </div>
    </div>
  );
}

/**
 * Teacher-only file from the private Supabase bucket (DESIGN.md §5.10): a download for
 * verified teachers, a locked block for everyone else. Hidden when accounts are not set up.
 */
export function TeacherDownload({ path }: { path: string }) {
  const t = useT();
  const { configured, account } = useAuth();
  const { busy, run } = useBusy();
  const [failed, setFailed] = useState(false);
  if (!configured) return null;
  const verified = !!account?.profile?.verified_at;

  async function download() {
    setFailed(false);
    // A short-lived link; the bucket only answers verified teachers (supabase/migrations).
    const { data, error } = await run(() =>
      supabase!.storage.from('teacher-files').createSignedUrl(path, 60, { download: true }),
    );
    if (error || !data) return setFailed(true);
    window.location.assign(data.signedUrl);
  }

  return (
    <section className={styles.teacherFile} aria-labelledby="teacher-file-title">
      <span className={styles.lock} aria-hidden="true">
        <Icon name={verified ? 'check' : 'lock'} size={32} />
      </span>
      <div className={styles.teacherText}>
        <h3 id="teacher-file-title">{t('teacherFile.title')}</h3>
        <p>{verified ? t('teacherFile.forYou') : t('teacherFile.locked')}</p>
        {failed && (
          <Message tone="error">
            <p>{t('teacherFile.failed')}</p>
          </Message>
        )}
        <div>
          {verified ? (
            <Button onClick={download} disabled={busy}>
              {busy ? t('form.busy') : t('teacherFile.download')}
            </Button>
          ) : account ? (
            <Button to="/profile#invite">{t('teacherFile.enterCode')}</Button>
          ) : (
            <Button to="/login">{t('teacherFile.login')}</Button>
          )}
        </div>
      </div>
    </section>
  );
}
