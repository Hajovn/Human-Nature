import { IMAGES } from '../content/images';
import { MODULE_PDF_PATH } from '../content/resources';
import { useFeedback, useProgress } from '../lib/storage';
import styles from './Feedback.module.css';

/** "What did you think of this resource?" thumbs up/down (DESIGN.md §4.11). Stored locally. */
export function FeedbackWidget({ id, size = 'lg' }: { id: string; size?: 'md' | 'lg' }) {
  const { vote, setVote } = useFeedback(id);
  return (
    <section className={`${styles.feedback} ${styles[size]}`} aria-labelledby={`feedback-${id}`}>
      <h2 id={`feedback-${id}`} className={styles.prompt}>
        What did you think of this resource?
      </h2>
      <div className={styles.buttons}>
        <button type="button" className={styles.thumb} aria-pressed={vote === 'down'} onClick={() => setVote('down')}>
          <img src={IMAGES.thumb.src} alt="" className={styles.down} width={93} height={93} />
          <span className="visually-hidden">I didn't like it</span>
        </button>
        <button type="button" className={styles.thumb} aria-pressed={vote === 'up'} onClick={() => setVote('up')}>
          <img src={IMAGES.thumb.src} alt="" width={93} height={93} />
          <span className="visually-hidden">I liked it</span>
        </button>
      </div>
      <p className={styles.status} role="status">
        {vote ? 'Thanks for your feedback!' : ''}
      </p>
    </section>
  );
}

/** "Download the module" block with PDF icon (DESIGN.md §4.13, §8.5 #27). */
export function DownloadModule({ id }: { id: string }) {
  const { record } = useProgress();
  return (
    <a
      className={styles.download}
      href={`${import.meta.env.BASE_URL}${MODULE_PDF_PATH}`}
      download
      onClick={() => record('modulesOpened', id)}
    >
      <img src={IMAGES.pdfIcon.src} alt="" width={98} height={120} />
      <span>
        <strong>Download the module</strong>
        <span className={styles.meta}>PDF · placeholder file</span>
      </span>
    </a>
  );
}
