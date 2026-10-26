// Small shared UI pieces (DESIGN.md §4).
import type { CSSProperties, ReactNode } from 'react';
import starFilled from '../assets/svg/star-filled.svg';
import starOutline from '../assets/svg/star-outline.svg';
import { ContentImage } from '../content/assets';
import type { Background, BigNumberItem, CalloutKind, ImageShape } from '../content/types';
import { Link, useLocale, useT } from '../i18n/locale';
import { useSavedResources } from '../lib/storage';
import styles from './ui.module.css';

/** CSS class for a section background or accent (DESIGN.md §2.1–2.2). */
export const bgClass = (background: Background | undefined) => styles[`bg-${background ?? 'page'}`];

/**
 * LessonTag, Figma 192:26 (DESIGN.md §4.4). Not interactive.
 * The type comes first as "filled", then theme, grade and duration as "plain".
 * "deeper" is the ink tag that labels a Go-deeper callout.
 */
export function Tag({ children, tone = 'plain' }: { children: ReactNode; tone?: 'filled' | 'plain' | 'deeper' }) {
  return <span className={`${styles.tag} ${styles[`tag-${tone}`]}`}>{children}</span>;
}

/**
 * Callout, Figma 193:42 (DESIGN.md §4.5). Under 30 words, no lists or buttons inside.
 * "go-deeper" is the white variant with a "Go deeper" tag and a title.
 */
export function Callout({
  kind,
  label,
  title,
  children,
}: {
  kind: CalloutKind;
  label?: string;
  title?: string;
  children: ReactNode;
}) {
  const t = useT();
  const text = label || t(`callout.${kind}`);
  return (
    <aside className={`${styles.callout} ${styles[`callout-${kind}`]}`}>
      {kind === 'go-deeper' ? (
        <Tag tone="deeper">{text}</Tag>
      ) : (
        <p className={styles.calloutLabel}>
          <span className={styles.calloutMarker} aria-hidden="true" />
          {text}
        </p>
      )}
      {title && <h3 className={styles.calloutTitle}>{title}</h3>}
      <div className={styles.calloutBody}>{children}</div>
    </aside>
  );
}

/** BigNumber, Figma 193:52 (DESIGN.md §4.6): one key fact in a circle. */
export function BigNumber({ item, size = 'md' }: { item: BigNumberItem; size?: 'md' | 'sm' }) {
  return (
    <div className={`${styles.bigNumber} ${styles[`num-${item.style ?? 'quiet'}`]} ${size === 'sm' ? styles.bigNumberSm : ''}`}>
      <span className={styles.bigNumberValue}>{item.value}</span>
      {item.caption && <span className={styles.bigNumberCaption}>{item.caption}</span>}
    </div>
  );
}

export function BigNumbers({ items, size }: { items: BigNumberItem[] | undefined; size?: 'md' | 'sm' }) {
  if (!items?.length) return null;
  return (
    <ul className={styles.bigNumbers}>
      {items.map((item, i) => (
        <li key={i}>
          <BigNumber item={item} size={size} />
        </li>
      ))}
    </ul>
  );
}

/** Numbered circle for steps ("How it works"), DESIGN.md §4.6. */
export function StepCircles({ steps }: { steps: string[] | undefined }) {
  if (!steps?.length) return null;
  return (
    <ol className={styles.bigNumbers}>
      {steps.map((step, i) => (
        <li key={i} className={`${styles.bigNumber} ${styles['num-white']}`}>
          <span className={`${styles.bigNumberValue} ${styles.stepNumber}`} aria-hidden="true">
            {i + 1}
          </span>
          <span className={styles.bigNumberCaption}>{step}</span>
        </li>
      ))}
    </ol>
  );
}

/** Image in one of the design's shapes: rounded, arch, circle or oval (DESIGN.md §4.12). */
export function ShapedImage({
  src,
  alt,
  shape = 'rounded',
  source,
  className,
  eager,
}: {
  src: string | undefined;
  alt: string | undefined;
  shape?: ImageShape;
  source?: string;
  className?: string;
  /** Load at once (the hero photo), instead of when scrolled into view. */
  eager?: boolean;
}) {
  const t = useT();
  const img = src ? (
    <ContentImage
      className={`${styles.shaped} ${styles[`shape-${shape}`]}`}
      src={src}
      alt={alt}
      {...(eager ? { loading: 'eager' as const, fetchPriority: 'high' as const } : {})}
    />
  ) : (
    <Placeholder shape={shape} />
  );
  if (!source) return <div className={className}>{img}</div>;
  return (
    <figure className={`${styles.figure} ${className ?? ''}`}>
      {img}
      <figcaption className={styles.source}>{t('block.source', { source })}</figcaption>
    </figure>
  );
}

/** Star toggle = "Save resource" bookmark (DESIGN.md §4.8). */
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
      <img src={saved ? starFilled : starOutline} alt="" width={28} height={28} />
    </button>
  );
}

/** Progress bar: leaf fill on a grey track, 11px (DESIGN.md §4.14). */
export function ProgressBar({ value, label }: { value: number; label: string }) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
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
  );
}

/** Neutral block for an image the team hasn't supplied yet (DESIGN.md §8). */
export function Placeholder({
  label,
  ratio = '4 / 3',
  shape = 'rounded',
  className,
}: {
  label?: string;
  ratio?: string;
  shape?: ImageShape;
  className?: string;
}) {
  const style: CSSProperties = { aspectRatio: shape === 'circle' ? '1 / 1' : shape === 'arch' ? '6 / 7' : ratio };
  return (
    <div className={`${styles.placeholder} ${styles[`shape-${shape}`]} ${className ?? ''}`} style={style}>
      {label && <span>{label}</span>}
    </div>
  );
}

/** Breadcrumb on detail heroes: "Resources / lesson plan" (DESIGN.md §4.15). */
export function Breadcrumb({ parent, current }: { parent: { label: string; to: string }; current: string }) {
  const t = useT();
  return (
    <nav aria-label={t('a11y.breadcrumb')} className={styles.breadcrumb}>
      <Link to={parent.to}>{parent.label}</Link>
      <span aria-hidden="true"> / </span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}

/**
 * Page hero for pages without a photo (DESIGN.md §3.2): sky on resources, profile and
 * glossary; the theme accent on lesson plans and tests.
 */
export function PageHero({
  title,
  lead,
  intro,
  background = 'sky',
  breadcrumb,
  children,
}: {
  title: ReactNode;
  lead?: ReactNode;
  intro?: ReactNode;
  background?: Background;
  breadcrumb?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className={`${styles.pageHero} ${bgClass(background)}`}>
      <div className="container">
        {breadcrumb}
        <h1 className={styles.h1}>{title}</h1>
        {lead && <p className={styles.heroLead}>{lead}</p>}
        {intro && <p className={styles.heroIntro}>{intro}</p>}
        {children}
      </div>
    </section>
  );
}

/** Section wrapper: background, 96px padding, optional h2 and lead (DESIGN.md §3.1). */
export function Section({
  id,
  title,
  intro,
  background,
  wide,
  pad = 'lg',
  flushTop,
  className,
  children,
}: {
  id?: string;
  title?: ReactNode;
  intro?: ReactNode;
  background?: Background;
  /** The 1312px frame (64px margins at 1440) instead of the 1200px content width. */
  wide?: boolean;
  /** Vertical padding: 96px (lg, default) or 64px (md), as in the frame. */
  pad?: 'lg' | 'md';
  /** No top padding: the section continues the one above (same background). */
  flushTop?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const headingId = id ? `${id}-title` : undefined;
  const padding = `${pad === 'md' ? styles.padMd : ''} ${flushTop ? styles.flushTop : ''}`;
  return (
    <section
      id={id}
      className={`${styles.section} ${padding} ${bgClass(background)} ${className ?? ''}`}
      aria-labelledby={title ? headingId : undefined}
    >
      <div className={`container ${wide ? 'container-wide' : ''}`}>
        {(title || intro) && (
          <div className={styles.sectionHead}>
            {title && (
              <h2 id={headingId} className={styles.h2}>
                {title}
              </h2>
            )}
            {intro && <p className={styles.sectionIntro}>{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** Section heading in the Display/h2 style. */
export function SectionTitle({ children, id, className }: { children: ReactNode; id?: string; className?: string }) {
  return (
    <h2 id={id} className={`${styles.h2} ${className ?? ''}`}>
      {children}
    </h2>
  );
}

/** Small uppercase label above a heading ("THEME 1 OF 4"). */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={`${styles.label} ${className ?? ''}`}>{children}</p>;
}

/** "On this page" chips linking to the sections (DESIGN.md §4.4). */
export function SectionChips({ items }: { items: { id: string; label: string }[] }) {
  const t = useT();
  if (items.length === 0) return null;
  return (
    <nav className={styles.chips} aria-label={t('section.onThisPage')}>
      <p className={styles.label}>{t('section.onThisPage')}</p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={`${styles.tag} ${styles['tag-plain']} ${styles.chip}`}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** "✓ Correct" / "✗ Not quite" pill on test results (DESIGN.md §4.15). */
export function ResultPill({ correct, children }: { correct: boolean; children: ReactNode }) {
  return <span className={`${styles.pill} ${correct ? styles.pillCorrect : styles.pillReview}`}>{children}</span>;
}

/** Six-step learner level track, Figma 274:1547 (DESIGN.md §4.14). */
export function LevelTrack({ levels, current }: { levels: string[]; current: number }) {
  const t = useT();
  return (
    <div className={styles.levelTrack}>
      <div className={styles.levelNow}>
        <span className={styles.levelBadge} aria-hidden="true" />
        <p className={styles.levelName}>{levels[current]}</p>
      </div>
      <ol className={styles.levels} aria-label={t('level.all')}>
        {levels.map((level, i) => (
          <li key={level} className={i <= current ? styles.levelReached : undefined} aria-current={i === current ? 'step' : undefined}>
            <span className={styles.levelCircle} aria-hidden="true" />
            <span className={styles.levelLabel}>{level}</span>
            <span className={styles.levelBar} aria-hidden="true" />
            {i <= current && <span className="visually-hidden">{t('level.reached')}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Shown when a page has no translation in the visitor's language and falls back to
 * English (DESIGN.md §7). Wrap the content in `lang="en"` alongside it.
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
