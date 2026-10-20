import { Link } from 'react-router-dom';
import { MiniCard, ThemeCard } from '../components/cards';
import { Placeholder } from '../components/ui';
import { IMAGES } from '../content/images';
import { PH_PARAGRAPH, PH_SHORT } from '../content/placeholders';
import { RESOURCES } from '../content/resources';
import { LANDING } from '../content/site';
import { THEMES } from '../content/themes';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import styles from './LandingPage.module.css';

/** Landing page (DESIGN.md §5.2). */
export function LandingPage() {
  useDocumentTitle(null);
  const featured = RESOURCES.slice(0, 6);

  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <img
          className={styles.heroImage}
          src={IMAGES.heroBeachClass.src}
          alt=""
          width={IMAGES.heroBeachClass.width}
          height={IMAGES.heroBeachClass.height}
          fetchPriority="high"
        />
        <div className={`container ${styles.heroContent}`}>
          <h1 id="hero-title" className={styles.heroTitle}>
            {LANDING.title[0]}
            <br />
            {LANDING.title[1]}
          </h1>
          <p className={styles.heroIntro}>{LANDING.intro}</p>
        </div>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="themes-title">
        <h2 id="themes-title" className={styles.bigHeading}>
          Themes
        </h2>
        <p className={styles.lede}>{PH_SHORT}</p>
        <ul className={styles.themeGrid}>
          {THEMES.map((theme) => (
            <li key={theme.slug}>
              <ThemeCard theme={theme} />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.band} aria-labelledby="how-title">
        <div className="container">
          <h2 id="how-title" className={styles.italicHeading}>
            How it works
          </h2>
          <p className={styles.bandText}>{PH_PARAGRAPH}</p>
        </div>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="lessons-title">
        <div className={styles.headingRow}>
          <h2 id="lessons-title" className={styles.bigHeading}>
            Lesson plans
          </h2>
          <Link to="/resources" className={styles.moreLink}>
            See all resources
          </Link>
        </div>
        <ul className={styles.miniGrid}>
          {featured.map((r) => (
            <li key={r.slug}>
              <MiniCard title={r.title} text={r.description} to={`/resources/${r.slug}`} saveSlug={r.slug} />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.band} aria-label="Quote">
        <figure className={`container ${styles.quote}`}>
          <blockquote>
            <p>
              {LANDING.quote.before}
              <strong>{LANDING.quote.emphasis}</strong>
              {LANDING.quote.after}
            </p>
          </blockquote>
          <figcaption>— {LANDING.quote.attribution}</figcaption>
        </figure>
      </section>

      <section className={styles.band} aria-labelledby="collab-title">
        <div className="container">
          <h2 id="collab-title" className={`${styles.italicHeading} ${styles.collabHeading}`}>
            Collaboration
          </h2>
          <ul className={styles.partners} aria-label="Partners">
            <li>
              <Placeholder label="IBF logo" ratio="3 / 1" />
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
