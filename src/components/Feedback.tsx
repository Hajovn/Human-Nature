import { useAsset } from '../content/assets';
import { useT } from '../i18n/locale';
import { useFeedback, useProgress } from '../lib/storage';
import pdfIcon from '../assets/img/pdf-icon.webp';
import thumb from '../assets/img/thumb.webp';
import styles from './Feedback.module.css';

/** "What did you think of this resource?" thumbs up/down (DESIGN.md §4.11). Stored locally. */
export function FeedbackWidget({ id, size = 'lg' }: { id: string; size?: 'md' | 'lg' }) {
  const { vote, setVote } = useFeedback(id);
  const t = useT();
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
