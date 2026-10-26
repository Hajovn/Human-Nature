// Cards (DESIGN.md §4.4). All cards use radius 18 (§8.3 #8). Link cards use a
// "stretched link" on the title so nested buttons (the save star) stay valid HTML.
import type { ReactNode } from 'react';
import { ContentImage } from '../content/assets';
import type { Resource, SubCard, Theme } from '../content/types';
import { useThemeTitles } from '../content/useContent';
import { Link, useT } from '../i18n/locale';
import { ClimateClass, Placeholder, ProgressBar, SaveStar, Tag } from './ui';
import styles from './cards.module.css';

function CardLink({ to, children }: { to: string; children: ReactNode }) {
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

/** Landing-page theme card: photo, white title + text (§4.4). */
export function ThemeCard({ theme }: { theme: Theme }) {
  return (
    <article className={`${styles.card} ${styles.photoCard} ${styles.tall}`}>
      {theme.cardImage ? <ContentImage className={styles.media} src={theme.cardImage} alt="" /> : null}
      <div className={styles.photoText}>
        <h3 className={styles.photoTitle}>
          <CardLink to={`/themes/${theme.slug}`}>{theme.title}</CardLink>
        </h3>
        {theme.cardText && <p>{theme.cardText}</p>}
      </div>
    </article>
  );
}

/** Tags shown on resource cards and detail pages: type, theme, audience. */
export function ResourceTags({ resource, className }: { resource: Resource; className?: string }) {
  const t = useT();
  const themeTitles = useThemeTitles();
  return (
    <div className={className ?? styles.tags}>
      {resource.type && <Tag tone="filled">{t(`type.${resource.type}`)}</Tag>}
      {resource.theme && <Tag>{themeTitles[resource.theme] ?? resource.theme}</Tag>}
      {resource.forTeachers && <Tag>{t('tag.forTeachers')}</Tag>}
    </div>
  );
}

/** Resource card: placeholder/photo, tags, save star, title, text, optional progress (§4.4). */
export function ResourceCard({ resource, progress }: { resource: Resource; progress?: number }) {
  const t = useT();
  const title = resource.title ?? resource.slug;
  return (
    <article className={`${styles.card} ${styles.resource} ${styles.tall}`}>
      {resource.image ? (
        <ContentImage className={styles.media} src={resource.image} alt="" />
      ) : (
        <Placeholder className={styles.media} ratio="299 / 414" />
      )}
      <div className={styles.resourceTop}>
        <ResourceTags resource={resource} />
        <SaveStar
          slug={resource.slug}
          title={title}
          className={`${styles.raised} ${resource.image ? styles.starOnPhoto : ''}`}
        />
      </div>
      <div className={`${styles.resourceBody} ${resource.image ? styles.onPhoto : ''}`}>
        <h3 className={styles.cardTitle}>
          <CardLink to={`/resources/${resource.slug}`}>{title}</CardLink>
        </h3>
        {resource.description && <p>{resource.description}</p>}
        {progress !== undefined && <ProgressBar value={progress} label={t('card.progress')} />}
      </div>
    </article>
  );
}

/** Lesson-plan mini card / tip tile, 175×247 in Figma (§4.4). */
export function MiniCard({
  title,
  text,
  to,
  saveSlug,
}: {
  title: string;
  text?: string;
  to?: string;
  saveSlug?: string;
}) {
  return (
    <article className={`${styles.card} ${styles.mini}`}>
      {saveSlug && (
        <div className={styles.miniStar}>
          <SaveStar slug={saveSlug} title={title} className={styles.raised} />
        </div>
      )}
      <div className={styles.miniBody}>
        <h3 className={styles.miniTitle}>{to ? <CardLink to={to}>{title}</CardLink> : title}</h3>
        {text && <p>{text}</p>}
      </div>
    </article>
  );
}

/** Theme sub-card under the hero (§4.4). Photo variant has white text. */
export function SubCardView({ card }: { card: SubCard }) {
  return (
    <article className={`${styles.card} ${styles.sub} ${card.image ? styles.photoCard : ''}`}>
      {card.image ? (
        <ContentImage className={styles.media} src={card.image} alt="" />
      ) : (
        <Placeholder className={styles.media} ratio="300 / 306" />
      )}
      {card.climateClass && (
        <div className={styles.ccOverlay}>
          <ClimateClass />
        </div>
      )}
      <div className={card.image ? styles.photoText : styles.subText}>
        <h3 className={styles.cardTitle}>{card.link ? <CardLink to={card.link}>{card.title}</CardLink> : card.title}</h3>
        {card.text && <p>{card.text}</p>}
      </div>
    </article>
  );
}
