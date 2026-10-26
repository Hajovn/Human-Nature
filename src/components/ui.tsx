// Small shared UI pieces (DESIGN.md §4.5–4.7, §4.15, §5).
import type { CSSProperties, ReactNode } from 'react';
import starFilled from '../assets/svg/star-filled.svg';
import starOutline from '../assets/svg/star-outline.svg';
import { useLocale, useT } from '../i18n/locale';
import { useSavedResources } from '../lib/storage';
import styles from './ui.module.css';

/**
 * LessonTag, Figma 192:26 (DESIGN.md §4.4). Not interactive.
 * The type comes first as "filled", then theme, grade and duration as "plain".
 * "deeper" is the ink tag that labels a Go-deeper callout.
 */
export function Tag({ children, tone = 'plain' }: { children: ReactNode; tone?: 'filled' | 'plain' | 'deeper' }) {
  return <span className={`${styles.tag} ${styles[`tag-${tone}`]}`}>{children}</span>;
}

/** Callout, Figma 193:42 (DESIGN.md §4.5). Under 30 words, no lists or buttons inside. */
export type CalloutKind = 'teacher-tip' | 'did-you-know' | 'talk-about-it' | 'ask-your-class';

export function Callout({ kind, label, children }: { kind: CalloutKind; label: string; children: ReactNode }) {
  return (
    <aside className={`${styles.callout} ${styles[`callout-${kind}`]}`}>
      <p className={styles.calloutLabel}>
        <span className={styles.calloutMarker} aria-hidden="true" />
        {label}
      </p>
      <div className={styles.calloutBody}>{children}</div>
    </aside>
  );
}

/** Star toggle = "Save resource" bookmark (§4.6, §8.5 #23). */
export function SaveStar({ slug, title, className }: { slug: string; title: string; className?: string }) {
  const { isSaved, toggle } = useSavedResources();
  const t = useT();
  const saved = isSaved(slug);
  return (
    <button
      type="button"
      className={`${styles.star} ${className ?? ''}`}
      aria-pressed={saved}
      aria-label={t('card.save', { title })}
      title={saved ? t('card.saved') : t('card.saveShort')}
      onClick={() => toggle(slug)}
    >
      <img src={saved ? starFilled : starOutline} alt="" width={43} height={41} />
    </button>
  );
}

/** Progress bar (§4.7). Label uses the primary colour: Figma's #D9D9D9 label fails contrast (§8.1). */
export function ProgressBar({ value, label }: { value: number; label: string }) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div className={styles.progress}>
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={label}
      >
        <div className={styles.progressFill} style={{ width: `${percent}%` }} />
      </div>
      <span className={styles.progressLabel}>
        {label}: {percent}%
      </span>
    </div>
  );
}

/** Grey wireframe placeholder for content not designed yet (§4.15, §8.4 #17). */
export function Placeholder({
  label,
  ratio = '4 / 3',
  shape = 'rect',
  className,
}: {
  label?: string;
  ratio?: string;
  shape?: 'rect' | 'round';
  className?: string;
}) {
  const style: CSSProperties = { aspectRatio: shape === 'round' ? '1 / 1' : ratio };
  return (
    <div className={`${styles.placeholder} ${shape === 'round' ? styles.round : ''} ${className ?? ''}`} style={style}>
      {label && <span>{label}</span>}
    </div>
  );
}

const CC_COLOURS = ['yellow', 'red', 'orange', 'cyan', 'green', 'yellow', 'purple', null, 'green', 'teal', 'orange', 'pink', 'yellow'];

/** Multicolour "Climate Class" wordmark (§2.2, §8.7 #30): live text, read as one phrase. */
export function ClimateClass({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <span className={`${styles.climateClass} ${size === 'lg' ? styles.climateClassLg : ''}`} role="img" aria-label="Climate Class">
      {'Climate Class'.split('').map((char, i) => (
        <span key={i} aria-hidden="true" style={CC_COLOURS[i] ? { color: `var(--cc-${CC_COLOURS[i]})` } : undefined}>
          {char}
        </span>
      ))}
    </span>
  );
}

/** Inner-page title block: H1 at y=175 plus intro line (§3.2). */
export function PageIntro({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <div className={`container ${styles.pageIntro}`}>
      <h1 className={styles.h1}>{title}</h1>
      {children && <p className={styles.introText}>{children}</p>}
    </div>
  );
}

/** Section heading: 32px Inter Medium (h2) or the 32px Regular "Subtitle" style (§2.3). */
export function SectionTitle({
  children,
  as: Heading = 'h2',
  variant = 'h2',
  id,
  className,
}: {
  children: ReactNode;
  as?: 'h2' | 'h3';
  variant?: 'h2' | 'subtitle';
  id?: string;
  className?: string;
}) {
  return (
    <Heading id={id} className={`${variant === 'h2' ? styles.h2 : styles.subtitle} ${className ?? ''}`}>
      {children}
    </Heading>
  );
}

/**
 * Shown when a page has no translation in the visitor's language and falls back to
 * English (DESIGN.md §8.10). Wrap the content in `lang="en"` alongside it.
 */
export function FallbackNotice({ show }: { show: boolean }) {
  const locale = useLocale();
  const t = useT();
  if (!show || locale === 'en') return null;
  return (
    <div className="container">
      <p className={styles.notice} role="note">
        {t('notice.notTranslatedId')}
      </p>
    </div>
  );
}

/** Grey sub-heading chip from the wireframes (§4.15). */
export function Chip({ children }: { children: ReactNode }) {
  return <p className={styles.chip}>{children}</p>;
}
