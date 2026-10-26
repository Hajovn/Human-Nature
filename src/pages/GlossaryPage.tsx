import { useMemo } from 'react';
import { InfoCards } from '../components/cards';
import { FallbackNotice, PageHero, Section } from '../components/ui';
import { getGlossaryPage } from '../content/load';
import { accentOf } from '../content/site';
import { useThemes } from '../content/useContent';
import { useLocale, useT } from '../i18n/locale';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import styles from './GlossaryPage.module.css';

/**
 * Glossary, Figma 299:1502 (DESIGN.md §5.9): one section per theme in its accent. The
 * terms are edited in each theme ("Hard words, simple meanings").
 */
export default function GlossaryPage() {
  const locale = useLocale();
  const t = useT();
  const { data, fallback } = useMemo(() => getGlossaryPage(locale), [locale]);
  const themes = useThemes();
  useDocumentTitle(data.title ?? t('nav.glossary'));

  return (
    <div lang={fallback ? 'en' : undefined}>
      <PageHero title={data.title ?? t('nav.glossary')} lead={data.lead} intro={data.intro} />
      <FallbackNotice show={fallback} />
      {themes
        .filter((theme) => theme.glossary?.length)
        .map((theme) => (
          <Section key={theme.slug} id={`theme-${theme.slug}`} background={accentOf(theme)}>
            <h2 className={styles.themeTitle}>{t('theme.pager', { n: theme.number ?? '', title: theme.title ?? '' })}</h2>
            <div lang={theme.fallback ? 'en' : undefined}>
              <InfoCards items={theme.glossary!.map((g) => ({ title: g.term, text: g.meaning }))} bodyText />
            </div>
          </Section>
        ))}
    </div>
  );
}
