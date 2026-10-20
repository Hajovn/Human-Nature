// Cards (DESIGN.md §4.4). All cards use radius 18 (§8.3 #8). Link cards use a
// "stretched link" on the title so nested buttons (the save star) stay valid HTML.
import { Link } from 'react-router-dom';
import { RESOURCE_TYPE_LABELS } from '../content/resources';
import { THEME_TITLES } from '../content/themes';
import type { ImageAsset, Resource, SubCard, Theme } from '../content/types';
import { ClimateClass, Placeholder, ProgressBar, SaveStar, Tag } from './ui';
import styles from './cards.module.css';

function Img({ image, eager = false }: { image: ImageAsset; eager?: boolean }) {
  return (
    <img
      className={styles.media}
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

/** Landing-page theme card: photo, white title + text (§4.4). */
export function ThemeCard({ theme }: { theme: Theme }) {
  return (
    <article className={`${styles.card} ${styles.photoCard} ${styles.tall}`}>
      <Img image={{ ...theme.cardImage, alt: '' }} />
      <div className={styles.photoText}>
        <h3 className={styles.photoTitle}>
          <Link to={`/themes/${theme.slug}`} className={styles.stretched}>
            {theme.title}
          </Link>
        </h3>
        <p>{theme.cardText}</p>
      </div>
    </article>
  );
}

/** Resource card: placeholder/photo, tags, save star, title, text, optional progress (§4.4). */
export function ResourceCard({ resource, progress }: { resource: Resource; progress?: number }) {
  return (
    <article className={`${styles.card} ${styles.resource} ${styles.tall}`}>
      {resource.image ? (
        <Img image={{ ...resource.image, alt: '' }} />
      ) : (
        <Placeholder className={styles.media} ratio="299 / 414" />
      )}
      <div className={styles.resourceTop}>
        <div className={styles.tags}>
          <Tag>{RESOURCE_TYPE_LABELS[resource.type]}</Tag>
          <Tag>{THEME_TITLES[resource.theme]}</Tag>
          {resource.forTeachers && <Tag>For teachers</Tag>}
        </div>
        <SaveStar
          slug={resource.slug}
          title={resource.title}
          className={`${styles.raised} ${resource.image ? styles.starOnPhoto : ''}`}
        />
      </div>
      <div className={`${styles.resourceBody} ${resource.image ? styles.onPhoto : ''}`}>
        <h3 className={styles.cardTitle}>
          <Link to={`/resources/${resource.slug}`} className={styles.stretched}>
            {resource.title}
          </Link>
        </h3>
        <p>{resource.description}</p>
        {progress !== undefined && <ProgressBar value={progress} label="Progress" />}
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
  text: string;
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
        <h3 className={styles.miniTitle}>
          {to ? (
            <Link to={to} className={styles.stretched}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        <p>{text}</p>
      </div>
    </article>
  );
}

/** Theme sub-card under the hero (§4.4). Photo variant has white text. */
export function SubCardView({ card }: { card: SubCard }) {
  const isInternal = !card.href.startsWith('#');
  const link = isInternal ? (
    <Link to={card.href} className={styles.stretched}>
      {card.title}
    </Link>
  ) : (
    <a href={card.href} className={styles.stretched}>
      {card.title}
    </a>
  );
  return (
    <article className={`${styles.card} ${styles.sub} ${card.image ? styles.photoCard : ''}`}>
      {card.image ? <Img image={{ ...card.image, alt: '' }} /> : <Placeholder className={styles.media} ratio="300 / 306" />}
      {card.climateClass && (
        <div className={styles.ccOverlay}>
          <ClimateClass />
        </div>
      )}
      <div className={card.image ? styles.photoText : styles.subText}>
        <h3 className={styles.cardTitle}>{link}</h3>
        <p>{card.text}</p>
      </div>
    </article>
  );
}
