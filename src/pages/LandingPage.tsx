import { useMemo } from 'react';
import { MiniCard, ThemeCard } from '../components/cards';
import { Markdown } from '../components/Markdown';
import { FallbackNotice, Placeholder } from '../components/ui';
import { ContentImage, useAsset } from '../content/assets';
import { getHome } from '../content/load';
import type { HomeData, Resource, Theme } from '../content/types';
import { useResources, useThemes } from '../content/useContent';
import { Link, useLocale, useT } from '../i18n/locale';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import styles from './LandingPage.module.css';

/** Landing page route (DESIGN.md §5.2). */
export function LandingPage() {
  useDocumentTitle(null);
  const locale = useLocale();
  const { data, fallback } = useMemo(() => getHome(locale), [locale]);
  return <HomeView home={data} fallback={fallback} themes={useThemes()} resources={useResources()} />;
}

/** Landing page content. Also used by the CMS live preview. */
export function HomeView({
  home,
  fallback = false,
  themes,
  resources,
}: {
  home: HomeData;
  fallback?: boolean;
  themes: Theme[];
  resources: Resource[];
}) {
  const t = useT();
  const resolve = useAsset();
  const featured = resources.slice(0, 6);

  return (
    <div lang={fallback ? 'en' : undefined}>
      <section className={styles.hero} aria-labelledby="hero-title">
        {home.heroImage && (
          <img className={styles.heroImage} src={resolve(home.heroImage)} alt="" fetchPriority="high" />
        )}
        <div className={`container ${styles.heroContent}`}>
          <h1 id="hero-title" className={styles.heroTitle}>
            {home.heroTitleLine1}
            {home.heroTitleLine2 && (
              <>
                <br />
                {home.heroTitleLine2}
              </>
            )}
          </h1>
          {home.heroIntro && <p className={styles.heroIntro}>{home.heroIntro}</p>}
        </div>
      </section>

      <FallbackNotice show={fallback} />

      <section className={`container ${styles.section}`} aria-labelledby="themes-title">
        <h2 id="themes-title" className={styles.bigHeading}>
          {home.themesTitle}
        </h2>
        {home.themesIntro && <p className={styles.lede}>{home.themesIntro}</p>}
        <ul className={styles.themeGrid}>
          {themes.map((theme) => (
            <li key={theme.slug}>
              <ThemeCard theme={theme} />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.band} aria-labelledby="how-title">
        <div className="container">
          <h2 id="how-title" className={styles.italicHeading}>
            {home.howItWorksTitle}
          </h2>
          <Markdown className={styles.bandText}>{home.howItWorks}</Markdown>
        </div>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="lessons-title">
        <div className={styles.headingRow}>
          <h2 id="lessons-title" className={styles.bigHeading}>
            {home.lessonsTitle}
          </h2>
          <Link to="/resources" className={styles.moreLink}>
            {t('landing.seeAll')}
          </Link>
        </div>
        <ul className={styles.miniGrid}>
          {featured.map((r) => (
            <li key={r.slug}>
              <MiniCard title={r.title ?? r.slug} text={r.description} to={`/resources/${r.slug}`} saveSlug={r.slug} />
            </li>
          ))}
        </ul>
      </section>

      {home.quote && (
        <section className={styles.band} aria-label={t('landing.quote')}>
          <figure className={`container ${styles.quote}`}>
            <blockquote>
              <Markdown>{home.quote}</Markdown>
            </blockquote>
            {home.quoteAttribution && <figcaption>— {home.quoteAttribution}</figcaption>}
          </figure>
        </section>
      )}

      <section className={styles.band} aria-labelledby="collab-title">
        <div className="container">
          <h2 id="collab-title" className={`${styles.italicHeading} ${styles.collabHeading}`}>
            {home.collaborationTitle}
          </h2>
          <ul className={styles.partners} aria-label={t('landing.partners')}>
            {(home.partners ?? []).map((partner, i) => {
              const logo = partner.logo ? (
                <ContentImage className={styles.partnerLogo} src={partner.logo} alt={partner.name} />
              ) : (
                <Placeholder label={partner.name} ratio="3 / 1" />
              );
              return (
                <li key={i}>
                  {partner.url ? (
                    <a href={partner.url} target="_blank" rel="noopener noreferrer">
                      {logo}
                    </a>
                  ) : (
                    logo
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
