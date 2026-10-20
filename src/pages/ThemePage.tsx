import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Blocks } from '../components/Blocks';
import { Button } from '../components/Button';
import { SubCardView } from '../components/cards';
import { DownloadModule, FeedbackWidget } from '../components/Feedback';
import { Icon } from '../components/Icon';
import { SectionNav } from '../components/SectionNav';
import { SectionTitle } from '../components/ui';
import { THEMES, getTheme } from '../content/themes';
import { useProgress } from '../lib/storage';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import NotFoundPage from './NotFoundPage';
import styles from './ThemePage.module.css';

/** Theme page template (DESIGN.md §5.3–5.6, order from §8.3 #11). */
export default function ThemePage() {
  const { slug } = useParams();
  const theme = getTheme(slug);
  const { record } = useProgress();
  useDocumentTitle(theme ? `${theme.number}. ${theme.title}` : 'Page not found');

  useEffect(() => {
    if (theme) record('themesVisited', theme.slug);
  }, [theme, record]);

  const navLinks = useMemo(
    () =>
      theme
        ? [
            { id: 'introduction', label: 'Introduction' },
            ...theme.sections.map((s) => ({ id: s.id, label: s.navLabel ?? s.title })),
            { id: 'test', label: 'Test your knowledge!' },
          ]
        : [],
    [theme],
  );

  if (!theme) return <NotFoundPage />;

  const index = THEMES.indexOf(theme);
  const prev = THEMES[index - 1];
  const next = THEMES[index + 1];
  const testHref = theme.testSlug ? `/resources/${theme.testSlug}/test` : `/resources?type=test&theme=${theme.slug}`;

  return (
    <>
      <section className={styles.hero} aria-labelledby="theme-title">
        <img
          className={styles.heroImage}
          src={theme.hero.src}
          alt=""
          width={theme.hero.width}
          height={theme.hero.height}
          fetchPriority="high"
        />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroPanel}>
            <p className={styles.eyebrow}>Theme {theme.number}</p>
            <h1 id="theme-title" className={styles.heroTitle}>
              {theme.title}
            </h1>
            <p className={styles.heroSubtitle}>{theme.subtitle}</p>
            <Button to={testHref} size="sm">
              Test your knowledge
            </Button>
          </div>
        </div>
      </section>

      <div className={`container ${styles.body}`}>
        <aside className={styles.sidebar}>
          <SectionNav links={navLinks} />
        </aside>

        <div className={styles.content}>
          <section id="introduction" aria-label="Introduction" className={styles.subCards}>
            {theme.subCards.map((card) => (
              <SubCardView key={card.title} card={card} />
            ))}
          </section>

          {theme.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className={`${styles.section} ${styles[`align-${section.align ?? 'left'}`] ?? ''}`}
            >
              <SectionTitle id={`${section.id}-title`} variant="subtitle" className={styles.sectionTitle}>
                {section.title}
              </SectionTitle>
              {section.layout === 'split' && section.aside ? (
                <div className={styles.split}>
                  <Blocks blocks={section.main} />
                  <Blocks blocks={section.aside} />
                </div>
              ) : (
                <Blocks blocks={section.main} />
              )}
            </section>
          ))}

          <section id="test" className={styles.cta} aria-label="Test your knowledge">
            <Button to={testHref} size="xl">
              Test your knowledge!
            </Button>
          </section>

          <div className={styles.extras}>
            <DownloadModule id={`theme-${theme.slug}`} />
            <FeedbackWidget id={`theme-${theme.slug}`} size="md" />
          </div>

          <nav className={styles.pager} aria-label="Theme navigation">
            <div>
              {prev && (
                <Button to={`/themes/${prev.slug}`} wide>
                  <Icon name="arrow-left" size={16} />
                  Theme {prev.number}: {prev.title}
                </Button>
              )}
            </div>
            <Button to={`/resources?type=lesson-plan&theme=${theme.slug}`} wide>
              Go to lesson examples
            </Button>
            <div className={styles.pagerEnd}>
              {next ? (
                <Button to={`/themes/${next.slug}`} wide>
                  Theme {next.number}: {next.title}
                  <Icon name="arrow-right" size={16} />
                </Button>
              ) : (
                <Button to="/resources" wide>
                  All resources
                  <Icon name="arrow-right" size={16} />
                </Button>
              )}
            </div>
          </nav>
          <p className={styles.backLink}>
            <Link to="/#themes-title">Back to all themes</Link>
          </p>
        </div>
      </div>
    </>
  );
}
