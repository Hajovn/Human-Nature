import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { ResourceCard } from '../components/cards';
import { FeedbackWidget } from '../components/Feedback';
import { FilterSidebar, type Filters } from '../components/FilterSidebar';
import { Icon } from '../components/Icon';
import { Quiz } from '../components/Quiz';
import { ClimateClass, PageIntro, Placeholder, SaveStar, SectionTitle, Tag } from '../components/ui';
import { PH_PARAGRAPH } from '../content/placeholders';
import { QUIZZES } from '../content/quizzes';
import { MODULE_PDF_PATH, RESOURCES, RESOURCE_TYPE_LABELS, getResource } from '../content/resources';
import { THEME_TITLES } from '../content/themes';
import type { Resource } from '../content/types';
import { useProgress } from '../lib/storage';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import resourcesStyles from './ResourcesPage.module.css';
import NotFoundPage from './NotFoundPage';
import styles from './ResourceDetailPage.module.css';

/**
 * Resource detail (DESIGN.md §5.8 lesson plan, §5.9 test intro, §5.10 quiz).
 * /resources/:slug/test opens a test with the questions already shown (§8.3 #14).
 */
export default function ResourceDetailPage({ startTest = false }: { startTest?: boolean }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const resource = getResource(slug);
  useDocumentTitle(resource?.title ?? 'Page not found');

  if (!resource) return <NotFoundPage />;

  // The sidebar shows this resource's filters; changing them goes back to the library.
  const filters: Filters = { themes: [resource.theme], types: [resource.type], forTeachers: false };
  const goToLibrary = (next: Filters) => {
    const p = new URLSearchParams();
    if (next.themes.length) p.set('theme', next.themes.join(','));
    if (next.types.length) p.set('type', next.types.join(','));
    if (next.forTeachers) p.set('for', 'teachers');
    navigate(`/resources?${p}`);
  };

  const related = [
    ...RESOURCES.filter((r) => r.slug !== resource.slug && r.theme === resource.theme),
    ...RESOURCES.filter((r) => r.slug !== resource.slug && r.theme !== resource.theme),
  ].slice(0, 4);

  const showRandom = () => {
    const pool = RESOURCES.filter((r) => r.slug !== resource.slug);
    navigate(`/resources/${pool[Math.floor(Math.random() * pool.length)].slug}`);
  };

  return (
    <>
      <PageIntro title="Resources" />

      <div className={`container ${resourcesStyles.layout}`}>
        <aside className={resourcesStyles.sidebar}>
          <FilterSidebar filters={filters} onChange={goToLibrary} />
        </aside>

        <div className={styles.main}>
          <p className={styles.breadcrumb}>
            <Link to="/resources">All resources</Link> <span aria-hidden="true">/</span>{' '}
            {RESOURCE_TYPE_LABELS[resource.type]}
          </p>
          <SectionTitle as="h2">{resource.title}</SectionTitle>

          {resource.type === 'test' ? (
            <TestView key={resource.slug} resource={resource} startTest={startTest} />
          ) : (
            <LessonView resource={resource} />
          )}
        </div>
      </div>

      <div className={`container ${styles.after}`}>
        <FeedbackWidget id={resource.slug} />

        <section aria-labelledby="related-title" className={styles.related}>
          <SectionTitle id="related-title">Related resources</SectionTitle>
          <ul className={styles.relatedGrid}>
            {related.map((r) => (
              <li key={r.slug}>
                <ResourceCard resource={r} />
              </li>
            ))}
          </ul>
        </section>

        <nav className={styles.pager} aria-label="More resources">
          <Button to="/resources" wide>
            <Icon name="arrow-left" size={16} />
            All resources
          </Button>
          <Button onClick={showRandom} wide>
            <Icon name="shuffle" size={16} />
            Show a random resource
          </Button>
        </nav>
      </div>
    </>
  );
}

function Tags({ resource }: { resource: Resource }) {
  return (
    <div className={styles.tags}>
      <Tag>{RESOURCE_TYPE_LABELS[resource.type]}</Tag>
      <Tag>{THEME_TITLES[resource.theme]}</Tag>
      {resource.forTeachers && <Tag>For teachers</Tag>}
    </div>
  );
}

/** Lesson plan / extra / module layout (§5.8). */
function LessonView({ resource }: { resource: Resource }) {
  const { record } = useProgress();
  return (
    <>
      <div className={styles.lessonTop}>
        <div className={styles.cover}>
          {resource.image && (
            <img className={styles.coverImage} src={resource.image.src} alt={resource.image.alt} width={resource.image.width} height={resource.image.height} />
          )}
          <div className={styles.coverBar}>
            <Tags resource={resource} />
            <SaveStar slug={resource.slug} title={resource.title} />
          </div>
          {resource.image && (
            <div className={styles.coverWordmark}>
              <ClimateClass size="lg" />
            </div>
          )}
          <div className={styles.coverFoot}>
            <Button
              href={`${import.meta.env.BASE_URL}${MODULE_PDF_PATH}`}
              download
              onClick={() => record('modulesOpened', resource.slug)}
            >
              Download
            </Button>
          </div>
        </div>
        <div className={styles.objectives}>
          <h3 className={styles.h3}>Goal</h3>
          <p>{PH_PARAGRAPH}</p>
          <h3 className={styles.h3}>Learning objectives</h3>
          <p>{PH_PARAGRAPH}</p>
          <p className={styles.description}>{resource.description}</p>
        </div>
      </div>
      <ul className={styles.steps} aria-label="Lesson steps">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i}>
            <Placeholder label={`Lesson step ${i + 1} to be added`} ratio="478 / 197" />
          </li>
        ))}
      </ul>
    </>
  );
}

/** Test intro + quiz (§5.9, §5.10). */
function TestView({ resource, startTest }: { resource: Resource; startTest: boolean }) {
  const navigate = useNavigate();
  const [started, setStarted] = useState(startTest);
  const quiz = resource.quizId ? QUIZZES[resource.quizId] : undefined;
  const count = quiz?.questions.length ?? 0;

  return (
    <>
      <div className={styles.banner}>
        {resource.image && <img src={resource.image.src} alt="" width={resource.image.width} height={resource.image.height} />}
        <div className={styles.bannerContent}>
          <Tags resource={resource} />
          <p className={styles.bannerCount}>{count > 0 ? `${count} questions` : 'Questions coming soon'}</p>
        </div>
        <div className={styles.bannerStar}>
          <SaveStar slug={resource.slug} title={resource.title} />
        </div>
      </div>

      {!quiz || count === 0 ? (
        <p className={styles.description}>The questions for this test will be added by the Human Nature team.</p>
      ) : started ? (
        <Quiz quiz={quiz} resourceSlug={resource.slug} />
      ) : (
        <div>
          <Button
            onClick={() => {
              setStarted(true);
              // Make the quiz deep-linkable without jumping back to the top of the page.
              navigate(`/resources/${resource.slug}/test`, { replace: true, state: { keepScroll: true } });
            }}
          >
            Start the test
          </Button>
        </div>
      )}
    </>
  );
}
