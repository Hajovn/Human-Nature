import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { ResourceCard } from '../components/cards';
import { FilterSidebar, countFilters, type Filters } from '../components/FilterSidebar';
import { Icon } from '../components/Icon';
import { FallbackNotice, PageIntro, SectionTitle } from '../components/ui';
import type { Resource, ResourceType } from '../content/types';
import { useResources } from '../content/useContent';
import { useLocalNavigate, useT } from '../i18n/locale';
import { useProgress, type Progress } from '../lib/storage';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import styles from './ResourcesPage.module.css';

// URL format (§8.5 #26): ?theme=climate,solutions&type=lesson-plan&for=teachers
function parseFilters(params: URLSearchParams): Filters {
  const list = (key: string) => (params.get(key) ?? '').split(',').filter(Boolean);
  return {
    themes: list('theme'),
    types: list('type') as ResourceType[],
    forTeachers: params.get('for') === 'teachers',
  };
}

export function filtersToParams(f: Filters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.themes.length) p.set('theme', f.themes.join(','));
  if (f.types.length) p.set('type', f.types.join(','));
  if (f.forTeachers) p.set('for', 'teachers');
  return p;
}

const matches = (r: Resource, f: Filters) =>
  (f.themes.length === 0 || (r.theme !== undefined && f.themes.includes(r.theme))) &&
  (f.types.length === 0 || (r.type !== undefined && f.types.includes(r.type))) &&
  (!f.forTeachers || !!r.forTeachers);

/** Tests show progress: attempted = 50%, finished = 100% (§4.7). */
function testProgress(r: Resource, progress: Progress): number | undefined {
  if (r.type !== 'test') return undefined;
  if (progress.testsFinished.includes(r.slug)) return 1;
  if (progress.testsAttempted.includes(r.slug)) return 0.5;
  return undefined;
}

/** Resource library (DESIGN.md §5.7). */
export default function ResourcesPage() {
  const t = useT();
  useDocumentTitle(t('resources.title'));
  const [params, setParams] = useSearchParams();
  const navigate = useLocalNavigate();
  const resources = useResources();
  const { progress } = useProgress();
  const filters = useMemo(() => parseFilters(params), [params]);
  const results = useMemo(() => resources.filter((r) => matches(r, filters)), [resources, filters]);

  const showRandom = () => {
    const pool = results.length ? results : resources;
    navigate(`/resources/${pool[Math.floor(Math.random() * pool.length)].slug}`);
  };

  return (
    <>
      <PageIntro title={t('resources.title')}>{t('resources.intro')}</PageIntro>
      <FallbackNotice show={resources.some((r) => r.fallback)} />

      <div className={`container ${styles.layout}`}>
        <aside className={styles.sidebar}>
          <FilterSidebar filters={filters} onChange={(next) => setParams(filtersToParams(next), { replace: true })} />
        </aside>

        <section className={styles.main} aria-labelledby="results-title">
          <div className={styles.resultsHead}>
            <SectionTitle id="results-title">{t('resources.count', { n: results.length })}</SectionTitle>
            <Button onClick={showRandom}>
              <Icon name="shuffle" size={16} />
              {t('resources.random')}
            </Button>
          </div>
          <p className="visually-hidden" role="status">
            {t('resources.shown', { n: results.length })}
          </p>

          {results.length > 0 ? (
            <ul className={styles.grid}>
              {results.map((r) => (
                <li key={r.slug} lang={r.fallback ? 'en' : undefined}>
                  <ResourceCard resource={r} progress={testProgress(r, progress)} />
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>
              <p>{countFilters(filters) === 1 ? t('resources.noneOne') : t('resources.noneMany')}</p>
              <Button onClick={() => setParams(new URLSearchParams(), { replace: true })}>{t('resources.clear')}</Button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
