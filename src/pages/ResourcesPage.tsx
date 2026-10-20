import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { ResourceCard } from '../components/cards';
import { FilterSidebar, countFilters, type Filters } from '../components/FilterSidebar';
import { Icon } from '../components/Icon';
import { PageIntro, SectionTitle } from '../components/ui';
import { RESOURCES } from '../content/resources';
import type { Resource, ResourceType, ThemeSlug } from '../content/types';
import { useProgress, type Progress } from '../lib/storage';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import styles from './ResourcesPage.module.css';

// URL format (§8.5 #26): ?theme=climate,solutions&type=lesson-plan&for=teachers
function parseFilters(params: URLSearchParams): Filters {
  const list = (key: string) => (params.get(key) ?? '').split(',').filter(Boolean);
  return {
    themes: list('theme') as ThemeSlug[],
    types: list('type') as ResourceType[],
    forTeachers: params.get('for') === 'teachers',
  };
}

function toParams(f: Filters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.themes.length) p.set('theme', f.themes.join(','));
  if (f.types.length) p.set('type', f.types.join(','));
  if (f.forTeachers) p.set('for', 'teachers');
  return p;
}

const matches = (r: Resource, f: Filters) =>
  (f.themes.length === 0 || f.themes.includes(r.theme)) &&
  (f.types.length === 0 || f.types.includes(r.type)) &&
  (!f.forTeachers || r.forTeachers);

/** Tests show progress: attempted = 50%, finished = 100% (§4.7). */
function testProgress(r: Resource, progress: Progress): number | undefined {
  if (r.type !== 'test') return undefined;
  if (progress.testsFinished.includes(r.slug)) return 1;
  if (progress.testsAttempted.includes(r.slug)) return 0.5;
  return undefined;
}

/** Resource library (DESIGN.md §5.7). */
export default function ResourcesPage() {
  useDocumentTitle('Resources');
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { progress } = useProgress();
  const filters = useMemo(() => parseFilters(params), [params]);
  const results = useMemo(() => RESOURCES.filter((r) => matches(r, filters)), [filters]);

  const showRandom = () => {
    const pool = results.length ? results : RESOURCES;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    navigate(`/resources/${pick.slug}`);
  };

  return (
    <>
      <PageIntro title="Resources">
        Lesson plans, tests and extra materials for every theme. Use the filters to find what you need.
      </PageIntro>

      <div className={`container ${styles.layout}`}>
        <aside className={styles.sidebar}>
          <FilterSidebar filters={filters} onChange={(next) => setParams(toParams(next), { replace: true })} />
        </aside>

        <section className={styles.main} aria-labelledby="results-title">
          <div className={styles.resultsHead}>
            <SectionTitle id="results-title">Resources ({results.length})</SectionTitle>
            <Button onClick={showRandom}>
              <Icon name="shuffle" size={16} />
              Show a random resource
            </Button>
          </div>
          <p className="visually-hidden" role="status">
            {results.length} resources shown
          </p>

          {results.length > 0 ? (
            <ul className={styles.grid}>
              {results.map((r) => (
                <li key={r.slug}>
                  <ResourceCard resource={r} progress={testProgress(r, progress)} />
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>
              <p>No resources match {countFilters(filters) === 1 ? 'this filter' : 'these filters'}.</p>
              <Button onClick={() => setParams(new URLSearchParams(), { replace: true })}>Clear filters</Button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
