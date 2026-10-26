import { useMemo } from 'react';
import { Button } from '../components/Button';
import { LessonCard, ThemeCard } from '../components/cards';
import { FullHero } from '../components/Hero';
import { Markdown } from '../components/Markdown';
import { BigNumbers, Callout, FallbackNotice, Label, Section, ShapedImage, StepCircles } from '../components/ui';
import shapes from '../assets/svg/shapes.svg';
import { ContentImage } from '../content/assets';
import { getHome } from '../content/load';
import type { HomeData, Resource, Theme } from '../content/types';
import { useResources, useThemes } from '../content/useContent';
import { useLocale, useT } from '../i18n/locale';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import styles from './LandingPage.module.css';

/** Landing page route (DESIGN.md §5.1). */
export function LandingPage() {
  useDocumentTitle(null);
  const locale = useLocale();
  const { data, fallback } = useMemo(() => getHome(locale), [locale]);
  return <HomeView home={data} fallback={fallback} themes={useThemes()} resources={useResources()} />;
}


/** Landing page content, in the order of DESIGN.md §5.1. Also used by the CMS live preview. */
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
  const featured = resources.filter((r) => r.featured).slice(0, 6);
  const solutions = themes.find((th) => th.number === 4);

  return (
    <div lang={fallback ? 'en' : undefined}>
      <FullHero title={home.hero?.title} lead={home.hero?.intro} image={home.hero?.image} alt={home.hero?.alt}>
        <Button to="/resources?type=lesson-plan">{home.hero?.buttonLabel || t('theme.lessonExamples')}</Button>
      </FullHero>

      <FallbackNotice show={fallback} />

      <Section id="themes" title={home.themes?.title} intro={home.themes?.intro} flushTop>
        <ul className={styles.themeGrid}>
          {themes.map((theme) => (
            <li key={theme.slug}>
              <ThemeCard theme={theme} />
            </li>
          ))}
        </ul>
      </Section>

      {home.numbers && (
        <Section id="numbers" title={home.numbers.title} intro={home.numbers.intro} background="sky">
          <div className={styles.numbers}>
            <BigNumbers items={home.numbers.items} />
            {(home.numbers.asideTitle || home.numbers.asideText) && (
              <div className={styles.numbersAside}>
                {home.numbers.asideTitle && <h3 className={styles.h3}>{home.numbers.asideTitle}</h3>}
                {home.numbers.asideText && <p className={styles.small}>{home.numbers.asideText}</p>}
                {solutions && (
                  <Button to={`/themes/${solutions.slug}`} variant="secondary">
                    {t('landing.toTheme', { title: solutions.title ?? '' })}
                  </Button>
                )}
              </div>
            )}
          </div>
          {home.numbers.tip && (
            <div className={styles.tip}>
              <Callout kind="teacher-tip">{home.numbers.tip}</Callout>
            </div>
          )}
        </Section>
      )}

      {home.lombok && (
        <Section id="lombok" pad="md">
          <div className={styles.lombok}>
            <ShapedImage src={home.lombok.image} alt={home.lombok.alt} shape="circle" className={styles.lombokPhoto} />
            <div className={styles.lombokText}>
              <div className={styles.headingBlock}>
                {home.lombok.label && <Label className={styles.blueLabel}>{home.lombok.label}</Label>}
                {home.lombok.title && <h2 className={styles.h2}>{home.lombok.title}</h2>}
                {home.lombok.body && <p className={styles.lead}>{home.lombok.body}</p>}
              </div>
              {home.lombok.callout && (
                <div className={styles.callout}>
                  <Callout kind="did-you-know">{home.lombok.callout}</Callout>
                </div>
              )}
              <div>
                <Button to="/mission" variant="secondary">
                  {t('nav.mission')}
                </Button>
              </div>
            </div>
          </div>
        </Section>
      )}

      {home.howItWorks && (
        <Section id="how-it-works" title={home.howItWorks.title} intro={home.howItWorks.intro} background="sky">
          <div className={styles.steps}>
            <StepCircles steps={home.howItWorks.steps} />
          </div>
          {home.howItWorks.tip && (
            <div className={styles.tip}>
              <Callout kind="teacher-tip">{home.howItWorks.tip}</Callout>
            </div>
          )}
        </Section>
      )}

      <Section id="lesson-plans" title={home.lessons?.title} intro={home.lessons?.intro}>
        {featured.length > 0 && (
          <ul className={styles.lessonGrid}>
            {featured.map((r) => (
              <li key={r.slug} lang={r.fallback ? 'en' : undefined}>
                <LessonCard resource={r} showImage={false} />
              </li>
            ))}
          </ul>
        )}
        <div className={styles.center}>
          <Button to="/resources?type=lesson-plan" variant="secondary">
            {t('landing.seeAllLessons')}
          </Button>
        </div>
      </Section>

      {home.quote?.quote && (
        <Section id="quote" background="sky" wide>
          <figure className={styles.quote}>
            <blockquote>
              <Markdown className={styles.quoteText}>{home.quote.quote}</Markdown>
            </blockquote>
            {home.quote.attribution && <figcaption className={styles.attribution}>{home.quote.attribution}</figcaption>}
            <ShapedImage src={home.quote.image} alt={home.quote.alt} shape="circle" className={styles.quotePhoto} />
          </figure>
        </Section>
      )}

      {home.ready && (
        <Section id="ready" wide>
          <div className={styles.ready}>
            <div className={styles.readyText}>
              <h2 className={styles.h2}>{home.ready.title}</h2>
              {home.ready.body && <p>{home.ready.body}</p>}
              <div className={styles.buttons}>
                <Button to="/resources?type=for-teachers">{t('landing.downloadModules')}</Button>
                <Button to="/resources?type=test" variant="secondary">
                  {t('theme.test')}
                </Button>
              </div>
            </div>
            <img src={shapes} alt="" width={444} height={302} className={styles.shapes} />
          </div>
        </Section>
      )}

      {home.collaboration && (
        <Section id="collaboration" className={styles.collaboration} wide>
          <div className={styles.collab}>
            <div className={styles.collabText}>
              <h2 className={styles.h2}>{home.collaboration.title}</h2>
              {home.collaboration.body && <p>{home.collaboration.body}</p>}
            </div>
            {home.collaboration.logo &&
              (home.collaboration.url ? (
                <a href={home.collaboration.url} target="_blank" rel="noopener noreferrer" className={styles.logoLink}>
                  <ContentImage className={styles.partnerLogo} src={home.collaboration.logo} alt={home.collaboration.logoAlt} />
                </a>
              ) : (
                <ContentImage className={styles.partnerLogo} src={home.collaboration.logo} alt={home.collaboration.logoAlt} />
              ))}
          </div>
        </Section>
      )}
    </div>
  );
}
