import { useState } from 'react';
import { useAsset } from '../content/assets';
import { useT } from '../i18n/locale';
import { useAuth } from '../lib/auth';
import { useFeedback, useProgress, type Vote } from '../lib/storage';
import { supabase } from '../lib/supabase';
import { castVote } from '../lib/sync';
import { Button } from './Button';
import { Message, useBusy } from './Form';
import { Icon } from './Icon';
import pdfIcon from '../assets/img/pdf-icon.webp';
import thumb from '../assets/img/thumb.webp';
import styles from './Feedback.module.css';

/**
 * "What did you think of this resource?" thumbs up/down (DESIGN.md §4.11). Stored in the
 * browser, and sent to the database so the team can see the totals (sync.ts).
 */
export function FeedbackWidget({ id, size = 'lg' }: { id: string; size?: 'md' | 'lg' }) {
  const { vote, setVote: storeVote } = useFeedback(id);
  const t = useT();
  const setVote = (next: Vote) => {
    // Clicking the selected thumb again removes the vote.
    castVote(id, vote === next ? null : next);
    storeVote(next);
  };
  return (
    <section className={`${styles.feedback} ${styles[size]}`} aria-labelledby={`feedback-${id}`}>
      <h2 id={`feedback-${id}`} className={styles.prompt}>
        {t('feedback.prompt')}
      </h2>
      <div className={styles.buttons}>
        <button type="button" className={styles.thumb} aria-pressed={vote === 'down'} onClick={() => setVote('down')}>
          <img src={thumb} alt="" className={styles.down} width={93} height={93} />
          <span className="visually-hidden">{t('feedback.dislike')}</span>
        </button>
        <button type="button" className={styles.thumb} aria-pressed={vote === 'up'} onClick={() => setVote('up')}>
          <img src={thumb} alt="" width={93} height={93} />
          <span className="visually-hidden">{t('feedback.like')}</span>
        </button>
      </div>
      <p className={styles.status} role="status">
        {vote ? t('feedback.thanks') : ''}
      </p>
    </section>
  );
}

export const DEFAULT_MODULE_FILE = '/downloads/module-placeholder.pdf'; // §8.5 #27 placeholder

/** "Download the module" block with PDF icon (DESIGN.md §4.13). */
export function DownloadModule({ id, file = DEFAULT_MODULE_FILE }: { id: string; file?: string }) {
  const { record } = useProgress();
  const resolve = useAsset();
  const t = useT();
  return (
    <a className={styles.download} href={resolve(file)} download onClick={() => record('modulesOpened', id)}>
      <img src={pdfIcon} alt="" width={98} height={120} />
      <span>
        <strong>{t('download.module')}</strong>
        <span className={styles.meta}>{t('download.meta')}</span>
      </span>
    </a>
  );
}

/**
 * Teacher-only file from the private Supabase bucket (DESIGN.md §8.12): a download for
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
    <section className={`${styles.download} ${styles.teacherFile}`} aria-labelledby="teacher-file-title">
      <span className={styles.lock} aria-hidden="true">
        <Icon name={verified ? 'check' : 'lock'} size={32} />
      </span>
      <div className={styles.teacherText}>
        <h3 id="teacher-file-title">{t('teacherFile.title')}</h3>
        <p className={styles.meta}>{verified ? t('teacherFile.forYou') : t('teacherFile.locked')}</p>
        {failed && (
          <Message tone="error">
            <p>{t('teacherFile.failed')}</p>
          </Message>
        )}
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
    </section>
  );
}
