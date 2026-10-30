// Cards (DESIGN.md §4.7–4.9, §4.15). Link cards use a "stretched link" on the title so
// nested buttons (the save star) stay valid HTML.
import type { ReactNode } from 'react';
import arrowRight from '../assets/svg/arrow-right.svg';
import { ContentImage } from '../content/assets';
import { accentOf } from '../content/site';
import type { InfoCardItem, Person, Resource, Theme } from '../content/types';
import { useThemes } from '../content/useContent';
import { Link, useT } from '../i18n/locale';
import { Label, Placeholder, SaveStar, Tag, bgClass } from './ui';
import styles from './cards.module.css';

export function CardLink({ to, children }: { to: string; children: ReactNode }) {
  return to.startsWith('#') ? (
    <a href={to} className={styles.stretched}>
      {children}
    </a>
  ) : to.startsWith('/') ? (
    <Link to={to} className={styles.stretched}>
      {children}
    </Link>
  ) : (
    <a href={to} className={styles.stretched} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

/** ThemeCard, Figma 193:26: accent card with a round photo, "THEME n", title and one line. */
export function ThemeCard({ theme }: { theme: Theme }) {
  const t = useT();
  return (
    <article className={`${styles.card} ${styles.link} ${styles.themeCard} ${bgClass(accentOf(theme))}`}>
      {theme.cardImage ? (
        <ContentImage className={styles.themePhoto} src={theme.cardImage} alt="" />
      ) : (
        <Placeholder shape="circle" className={styles.themePhoto} />
      )}
      <div className={styles.themeText}>
        <Label>{t('theme.number', { n: theme.number ?? '' })}</Label>
        <h3 className={styles.title}>
          <CardLink to={`/themes/${theme.slug}`}>{theme.title}</CardLink>
        </h3>
        {theme.cardText && <p className={styles.small}>{theme.cardText}</p>}
      </div>
    </article>
  );
}

/** LessonTags for a resource: type (filled), then grade and duration (plain), §4.4. */
export function ResourceTags({ resource }: { resource: Resource }) {
  const t = useT();
  return (
    <div className={styles.tags}>
      {resource.type && <Tag tone="filled">{t(`type.${resource.type}`)}</Tag>}
      {resource.grade && <Tag>{resource.grade}</Tag>}
      {resource.duration && <Tag>{resource.duration}</Tag>}
    </div>
  );
}

/** Theme dot + name, as on LessonCards (§4.8). */
export function ThemeDot({ slug }: { slug: string | undefined }) {
  const theme = useThemes().find((th) => th.slug === slug);
  if (!theme) return null;
  return (
    <span className={styles.themeDot}>
      <span className={`${styles.dot} ${bgClass(accentOf(theme))}`} aria-hidden="true" />
      {theme.title}
    </span>
  );
}

/** "Lesson plan: " / "Rencana pelajaran: " at the start of a lesson plan's page title. */
const LESSON_PLAN_PREFIX = /^\s*(lesson plan|rencana pelajaran)\s*:\s*/i;

/** Card title: a lesson plan's card leaves out the "Lesson plan:" prefix, the type tag says it (§4.8). */
export const cardTitle = (resource: Resource) => {
  const title = resource.title ?? resource.slug;
  return resource.type === 'lesson-plan' ? title.replace(LESSON_PLAN_PREFIX, '') || title : title;
};

/** LessonCard, Figma 260:1692: image, tags, title, one line, theme dot and save star. */
export function LessonCard({ resource, showImage = true }: { resource: Resource; showImage?: boolean }) {
  const title = cardTitle(resource);
  return (
    <article className={`${styles.card} ${styles.link} ${styles.lessonCard}`}>
      {showImage &&
        (resource.image ? (
          <ContentImage className={styles.lessonImage} src={resource.image} alt="" />
        ) : (
          <Placeholder className={styles.lessonImage} />
        ))}
      <ResourceTags resource={resource} />
      <h3 className={styles.title}>
        <CardLink to={`/resources/${resource.slug}`}>{title}</CardLink>
      </h3>
      {resource.description && <p className={styles.muted}>{resource.description}</p>}
      <div className={styles.lessonFoot}>
        <ThemeDot slug={resource.theme} />
        <SaveStar slug={resource.slug} title={title} className={styles.raised} />
      </div>
    </article>
  );
}

/** Card colours (InfoCardItem.background) as tokens. */
const CARD_FILL = {
  sky: 'var(--surface-sky)',
  sun: 'var(--sun)',
  ember: 'var(--ember)',
  leaf: 'var(--leaf-bright)',
  lagoon: 'var(--lagoon)',
} as const;

const DOT_CLASS: Record<string, string> = {
  red: styles.dotRed,
  orange: styles.dotOrange,
  blue: styles.dotBlue,
  ink: styles.dotInk,
};

/**
 * Info card (DESIGN.md §4.9): title + text, with an optional number, coloured dot or
 * image. White by default; "sky" for lesson materials; an accent for impact cards.
 */
export function InfoCard({
  item,
  number,
  tone = 'white',
  align = 'start',
  bodyText,
}: {
  item: InfoCardItem;
  number?: number;
  tone?: 'white' | 'sky';
  align?: 'start' | 'center';
  /** Text in the body size (glossary cards) instead of small. */
  bodyText?: boolean;
}) {
  const dotClass = item.dot ? (DOT_CLASS[item.dot] ?? bgClass(item.dot as never)) : undefined;
  const filled = !!item.background && item.background !== 'white';
  return (
    <article
      className={`${styles.card} ${styles.infoCard} ${tone === 'sky' ? styles.infoSky : ''} ${filled ? styles.filled : ''} ${
        align === 'center' ? styles.center : ''
      }`}
      style={filled ? { background: CARD_FILL[item.background as keyof typeof CARD_FILL] } : undefined}
    >
      {number !== undefined && (
        <span className={styles.number} aria-hidden="true">
          {number}
        </span>
      )}
      {item.image && <ContentImage className={styles.infoImage} src={item.image} alt={item.alt} />}
      {item.title && (
        <h3 className={`${styles.title} ${tone === 'white' && !filled ? styles.blueTitle : ''}`}>
          {dotClass && <span className={`${styles.dot} ${styles.titleDot} ${dotClass}`} aria-hidden="true" />}
          {item.title}
        </h3>
      )}
      {item.text && <p className={`${styles.muted} ${bodyText ? styles.bodyText : ''}`}>{item.text}</p>}
    </article>
  );
}

export function InfoCards({
  items,
  columns = 3,
  numbered,
  tone,
  bodyText,
}: {
  items: InfoCardItem[] | undefined;
  columns?: number;
  numbered?: boolean;
  tone?: 'white' | 'sky';
  bodyText?: boolean;
}) {
  if (!items?.length) return null;
  return (
    <ul className={styles.grid} data-columns={columns}>
      {items.map((item, i) => (
        <li key={i}>
          <InfoCard item={item} number={numbered ? i + 1 : undefined} tone={tone} bodyText={bodyText} />
        </li>
      ))}
    </ul>
  );
}

/** Team member card on Our mission (§5.7): round photo, role, name, study. */
export function PersonCard({ person }: { person: Person }) {
  return (
    <article className={`${styles.card} ${styles.infoCard} ${styles.center}`}>
      {person.photo ? (
        <ContentImage className={styles.personPhoto} src={person.photo} alt="" />
      ) : (
        <Placeholder shape="circle" className={styles.personPhoto} />
      )}
      {person.role && <Label className={styles.blueLabel}>{person.role}</Label>}
      <h3 className={styles.title}>{person.name}</h3>
      {person.study && <p className={styles.caption}>{person.study}</p>}
    </article>
  );
}

/** "Next: theme n" card button in the next theme's accent, Figma 226:3115 (§4.15). */
export function NextCard({ to, label, title, accent }: { to: string; label: string; title: string; accent?: Theme }) {
  return (
    <Link to={to} className={`${styles.nextCard} ${accent ? bgClass(accentOf(accent)) : styles.nextPlain}`}>
      <span className={styles.nextText}>
        <Label>{label}</Label>
        <span className={styles.nextTitle}>{title}</span>
      </span>
      <img src={arrowRight} alt="" width={68} height={52} className={styles.nextArrow} />
    </Link>
  );
}
