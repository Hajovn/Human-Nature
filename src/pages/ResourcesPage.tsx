import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { LessonCard } from '../components/cards';
import { FeedbackSection } from '../components/Feedback';
import { FilterSidebar, countFilters, filtersToParams, parseFilters, type Filters } from '../components/FilterSidebar';
import { FallbackNotice, PageHero, SectionTitle } from '../components/ui';
import type { Resource } from '../content/types';
import { useResources } from '../content/useContent';
import { useT } from '../i18n/locale';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import styles from './ResourcesPage.module.css';

const matches = (r: Resource, f: Filters) =>
  (f.themes.length === 0 || (r.theme !== undefined && f.themes.includes(r.theme))) &&
  (f.types.length === 0 || (r.type !== undefined && f.types.includes(r.type)));

/** Resource library (DESIGN.md §5.3). */
export default function ResourcesPage() {
  const t = useT();
  useDocumentTitle(t('resources.title'));
  const [params, setParams] = useSearchParams();
  const resources = useResources();
  const filters = useMemo(() => parseFilters(params), [params]);
  const results = useMemo(() => resources.filter((r) => matches(r, filters)), [resources, filters]);

  return (
    <>
      <PageHero title={t('resources.title')} lead={t('resources.intro')} />
      <FallbackNotice show={resources.some((r) => r.fallback)} />

      <div className={`container container-wide ${styles.layout}`}>
        <aside className={styles.sidebar}>
          <FilterSidebar filters={filters} onChange={(next) => setParams(filtersToParams(next), { replace: true })} />
        </aside>

        <section className={styles.main} aria-labelledby="results-title">
          <SectionTitle id="results-title">{t('resources.count', { n: results.length })}</SectionTitle>
          <p className="visually-hidden" role="status">
            {t('resources.shown', { n: results.length })}
          </p>

          {results.length > 0 ? (
            <ul className={styles.grid}>
              {results.map((r) => (
                <li key={r.slug} lang={r.fallback ? 'en' : undefined}>
                  <LessonCard resource={r} />
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>
              <p>{countFilters(filters) === 1 ? t('resources.noneOne') : t('resources.noneMany')}</p>
              <Button variant="secondary" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                {t('resources.clear')}
              </Button>
            </div>
          )}
        </section>
      </div>

      <FeedbackSection id="resources" />
    </>
  );
}
