import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Blocks } from '../components/Blocks';
import { Button } from '../components/Button';
import { SubCardView } from '../components/cards';
import { DownloadModule, FeedbackWidget } from '../components/Feedback';
import { Icon } from '../components/Icon';
import { SectionNav } from '../components/SectionNav';
import { FallbackNotice, SectionTitle } from '../components/ui';
import { useAsset } from '../content/assets';
import { sectionId } from '../content/load';
import type { Theme } from '../content/types';
import { useThemes } from '../content/useContent';
import { Link, useT } from '../i18n/locale';
import { useProgress } from '../lib/storage';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import NotFoundPage from './NotFoundPage';
import styles from './ThemePage.module.css';

/** Theme page route (DESIGN.md §5.3–5.6). */
export default function ThemePage() {
  const { slug } = useParams();
  const themes = useThemes();
  const theme = themes.find((t) => t.slug === slug);
  const { record } = useProgress();
  const t = useT();
  useDocumentTitle(theme ? `${theme.number}. ${theme.title}` : t('notFound.title'));

  useEffect(() => {
    if (theme) record('themesVisited', theme.slug);
  }, [theme, record]);

  if (!theme) return <NotFoundPage />;
  return <ThemeView theme={theme} themes={themes} />;
}

/** Theme page content, in the order from §8.3 #11. Also used by the CMS live preview. */
export function ThemeView({ theme, themes }: { theme: Theme; themes: Theme[] }) {
  const t = useT();
  const resolve = useAsset();
  const sections = useMemo(
    () => (theme.sections ?? []).map((section, i) => ({ ...section, anchor: sectionId(section, i) })),
    [theme.sections],
  );
  const navLinks = useMemo(
    () => [
      { id: 'introduction', label: t('theme.introduction') },
      ...sections.map((s) => ({ id: s.anchor, label: s.navLabel || s.title || s.anchor })),
      { id: 'test', label: t('theme.testCta') },
    ],
    [sections, t],
  );

  const index = themes.findIndex((x) => x.slug === theme.slug);
  const prev = index > 0 ? themes[index - 1] : undefined;
  const next = index >= 0 ? themes[index + 1] : undefined;
  const testHref = theme.testResource
    ? `/resources/${theme.testResource}/test`
    : `/resources?type=test&theme=${theme.slug}`;

  return (
    <div lang={theme.fallback ? 'en' : undefined}>
      <section className={styles.hero} aria-labelledby="theme-title">
        {theme.heroImage && (
          <img className={styles.heroImage} src={resolve(theme.heroImage)} alt="" fetchPriority="high" />
        )}
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroPanel}>
            <p className={styles.eyebrow}>{t('theme.eyebrow', { n: theme.number ?? '' })}</p>
            <h1 id="theme-title" className={styles.heroTitle}>
              {theme.title}
            </h1>
            {theme.subtitle && <p className={styles.heroSubtitle}>{theme.subtitle}</p>}
            <Button to={testHref} size="sm">
              {t('theme.test')}
            </Button>
          </div>
        </div>
      </section>

      <FallbackNotice show={theme.fallback} />

      <div className={`container ${styles.body}`}>
        <aside className={styles.sidebar}>
          <SectionNav links={navLinks} label={t('theme.onThisPage')} />
        </aside>

        <div className={styles.content}>
          <section id="introduction" aria-label={t('theme.introduction')} className={styles.subCards}>
            {(theme.subCards ?? []).map((card, i) => (
              <SubCardView key={i} card={card} />
            ))}
          </section>

          {sections.map((section) => (
            <section
              key={section.anchor}
              id={section.anchor}
              aria-labelledby={`${section.anchor}-title`}
              className={`${styles.section} ${styles[`align-${section.align ?? 'left'}`] ?? ''}`}
            >
              <SectionTitle id={`${section.anchor}-title`} variant="subtitle" className={styles.sectionTitle}>
                {section.title}
              </SectionTitle>
              {section.layout === 'split' && section.aside?.length ? (
                <div className={styles.split}>
                  <Blocks blocks={section.blocks} />
                  <Blocks blocks={section.aside} />
                </div>
              ) : (
                <>
                  <Blocks blocks={section.blocks} />
                  <Blocks blocks={section.aside} />
                </>
              )}
            </section>
          ))}

          <section id="test" className={styles.cta} aria-label={t('theme.test')}>
            <Button to={testHref} size="xl">
              {t('theme.testCta')}
            </Button>
          </section>

          <div className={styles.extras}>
            <DownloadModule id={`theme-${theme.slug}`} />
            <FeedbackWidget id={`theme-${theme.slug}`} size="md" />
          </div>

          <nav className={styles.pager} aria-label={t('theme.navigation')}>
            <div>
              {prev && (
                <Button to={`/themes/${prev.slug}`} wide>
                  <Icon name="arrow-left" size={16} />
                  {t('theme.pager', { n: prev.number ?? '', title: prev.title ?? '' })}
                </Button>
              )}
            </div>
            <Button to={`/resources?type=lesson-plan&theme=${theme.slug}`} wide>
              {t('theme.lessonExamples')}
            </Button>
            <div className={styles.pagerEnd}>
              {next ? (
                <Button to={`/themes/${next.slug}`} wide>
                  {t('theme.pager', { n: next.number ?? '', title: next.title ?? '' })}
                  <Icon name="arrow-right" size={16} />
                </Button>
              ) : (
                <Button to="/resources" wide>
                  {t('theme.allResources')}
                  <Icon name="arrow-right" size={16} />
                </Button>
              )}
            </div>
          </nav>
          <p className={styles.backLink}>
            <Link to="/#themes-title">{t('theme.backToThemes')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
