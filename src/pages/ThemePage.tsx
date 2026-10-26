import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ContentSection } from '../components/Blocks';
import { Button } from '../components/Button';
import { CardLink, InfoCards, NextCard } from '../components/cards';
import { CommentBox, DownloadPdf, FeedbackWidget } from '../components/Feedback';
import { FullHero } from '../components/Hero';
import { FallbackNotice, Label, Placeholder, Section, SectionChips, ShapedImage } from '../components/ui';
import { sectionId } from '../content/load';
import { accentOf } from '../content/site';
import type { IntroCard, Theme } from '../content/types';
import { useThemes } from '../content/useContent';
import { useT } from '../i18n/locale';
import { useProgress } from '../lib/storage';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import NotFoundPage from './NotFoundPage';
import styles from './ThemePage.module.css';

/** Theme page route (DESIGN.md §5.2). */
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

/** One of the three cards under the hero: explanation, lesson module, news article. */
function IntroCardView({ card }: { card: IntroCard }) {
  const t = useT();
  const shape = card.kind === 'module' ? 'circle' : 'rounded';
  return (
    <article className={`${styles.introCard} ${card.link ? styles.linkCard : ''}`}>
      {card.image ? (
        <ShapedImage src={card.image} alt={card.alt} shape={shape} className={card.kind === 'module' ? styles.introCircle : styles.introImage} />
      ) : (
        <Placeholder shape={shape} className={card.kind === 'module' ? styles.introCircle : styles.introImage} />
      )}
      {card.kind && <Label className={styles.introLabel}>{t(`introCard.${card.kind}`)}</Label>}
      <h2 className={`${styles.introTitle} ${card.kind === 'news' ? styles.newsTitle : ''}`}>
        {card.link ? <CardLink to={card.link}>{card.title}</CardLink> : card.title}
      </h2>
      {card.text && <p className={styles.small}>{card.text}</p>}
    </article>
  );
}

/** Theme page content in the order of DESIGN.md §5.2. Also used by the CMS live preview. */
export function ThemeView({ theme, themes }: { theme: Theme; themes: Theme[] }) {
  const t = useT();
  const sections = useMemo(() => theme.sections ?? [], [theme.sections]);
  const chips = useMemo(
    () => [
      ...sections.map((s, i) => ({ id: sectionId(s, i), label: s.navLabel || s.title || '' })),
      { id: 'check', label: t('theme.test') },
    ],
    [sections, t],
  );

  const index = themes.findIndex((x) => x.slug === theme.slug);
  const prev = index > 0 ? themes[index - 1] : undefined;
  const next = index >= 0 ? themes[index + 1] : undefined;
  const testHref = theme.testResource ? `/resources/${theme.testResource}/test` : `/resources?type=test&theme=${theme.slug}`;

  return (
    <div lang={theme.fallback ? 'en' : undefined}>
      <FullHero
        label={t('theme.numberOf', { n: theme.number ?? '', total: themes.length })}
        title={theme.title}
        lead={theme.lead}
        intro={theme.intro}
        image={theme.heroImage}
        alt={theme.heroAlt}
        background={accentOf(theme)}
      >
        <Button to={testHref}>{t('theme.test')}</Button>
      </FullHero>

      <FallbackNotice show={theme.fallback} />

      <Section>
        <SectionChips items={chips} />
        {!!theme.introCards?.length && (
          <ul className={styles.introCards}>
            {theme.introCards.map((card, i) => (
              <li key={i}>
                <IntroCardView card={card} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      {sections.map((section, i) => (
        <ContentSection key={i} section={section} index={i} />
      ))}

      {!!theme.glossary?.length && (
        <Section id="hard-words" title={t('theme.hardWords')} background="sky">
          <InfoCards items={theme.glossary.map((g) => ({ title: g.term, text: g.meaning }))} />
        </Section>
      )}

      <Section id="check" className={styles.check}>
        <div className={styles.checkInner}>
          <h2 className={styles.checkTitle}>{t('theme.checkTitle')}</h2>
          <p>{t('theme.checkText')}</p>
          <Button to={testHref}>{t('theme.test')}</Button>
        </div>
      </Section>

      <Section>
        <div className={styles.end}>
          <div className={styles.endMain}>
            <DownloadPdf id={`theme-${theme.slug}`} file={theme.pdf || undefined} />
            <FeedbackWidget id={`theme-${theme.slug}`} />
            <CommentBox id={`theme-${theme.slug}`} />
          </div>
          <nav className={styles.pager} aria-label={t('theme.navigation')}>
            <span className={styles.pagerShape} aria-hidden="true" />
            <Button to={`/resources?type=lesson-plan&theme=${theme.slug}`}>{t('theme.lessonExamples')}</Button>
            {next ? (
              <NextCard
                to={`/themes/${next.slug}`}
                label={t('theme.next', { n: next.number ?? '' })}
                title={next.title ?? ''}
                accent={next}
              />
            ) : (
              <NextCard to="/resources" label={t('theme.nextAll')} title={t('theme.allResources')} />
            )}
            {prev && (
              <Button to={`/themes/${prev.slug}`} variant="secondary">
                {t('theme.back', { n: prev.number ?? '' })}
              </Button>
            )}
          </nav>
        </div>
      </Section>
    </div>
  );
}
