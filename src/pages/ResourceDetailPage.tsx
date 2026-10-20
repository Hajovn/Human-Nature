import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { ResourceCard, ResourceTags } from '../components/cards';
import { DEFAULT_MODULE_FILE, FeedbackWidget } from '../components/Feedback';
import { FilterSidebar, type Filters } from '../components/FilterSidebar';
import { Icon } from '../components/Icon';
import { Markdown } from '../components/Markdown';
import { Quiz } from '../components/Quiz';
import { ClimateClass, FallbackNotice, PageIntro, Placeholder, SaveStar, SectionTitle } from '../components/ui';
import { ContentImage, useAsset } from '../content/assets';
import type { Resource } from '../content/types';
import { useResources } from '../content/useContent';
import { Link, useLocalNavigate, useT } from '../i18n/locale';
import { useProgress } from '../lib/storage';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import resourcesStyles from './ResourcesPage.module.css';
import { filtersToParams } from './ResourcesPage';
import NotFoundPage from './NotFoundPage';
import styles from './ResourceDetailPage.module.css';

/**
 * Resource detail route (DESIGN.md §5.8 lesson plan, §5.9 test intro, §5.10 quiz).
 * /resources/:slug/test opens a test with the questions already shown (§8.3 #14).
 */
export default function ResourceDetailPage({ startTest = false }: { startTest?: boolean }) {
  const { slug } = useParams();
  const resources = useResources();
  const resource = resources.find((r) => r.slug === slug);
  const t = useT();
  useDocumentTitle(resource?.title ?? t('notFound.title'));
  if (!resource) return <NotFoundPage />;
  return <ResourceView resource={resource} resources={resources} startTest={startTest} />;
}

/** Resource detail content. Also used by the CMS live preview. */
export function ResourceView({
  resource,
  resources,
  startTest = false,
}: {
  resource: Resource;
  resources: Resource[];
  startTest?: boolean;
}) {
  const t = useT();
  const navigate = useLocalNavigate();

  // The sidebar shows this resource's filters; changing them goes back to the library.
  const filters: Filters = {
    themes: resource.theme ? [resource.theme] : [],
    types: resource.type ? [resource.type] : [],
    forTeachers: false,
  };
  const goToLibrary = (next: Filters) => navigate(`/resources?${filtersToParams(next)}`);

  const others = resources.filter((r) => r.slug !== resource.slug);
  const related = [...others.filter((r) => r.theme === resource.theme), ...others.filter((r) => r.theme !== resource.theme)].slice(
    0,
    4,
  );

  const showRandom = () => {
    if (others.length) navigate(`/resources/${others[Math.floor(Math.random() * others.length)].slug}`);
  };

  return (
    <div lang={resource.fallback ? 'en' : undefined}>
      <PageIntro title={t('resources.title')} />
      <FallbackNotice show={resource.fallback} />

      <div className={`container ${resourcesStyles.layout}`}>
        <aside className={resourcesStyles.sidebar}>
          <FilterSidebar filters={filters} onChange={goToLibrary} />
        </aside>

        <div className={styles.main}>
          <p className={styles.breadcrumb}>
            <Link to="/resources">{t('detail.all')}</Link> <span aria-hidden="true">/</span>{' '}
            {resource.type ? t(`type.${resource.type}`) : null}
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
          <SectionTitle id="related-title">{t('detail.related')}</SectionTitle>
          <ul className={styles.relatedGrid}>
            {related.map((r) => (
              <li key={r.slug}>
                <ResourceCard resource={r} />
              </li>
            ))}
          </ul>
        </section>

        <nav className={styles.pager} aria-label={t('detail.more')}>
          <Button to="/resources" wide>
            <Icon name="arrow-left" size={16} />
            {t('detail.all')}
          </Button>
          <Button onClick={showRandom} wide>
            <Icon name="shuffle" size={16} />
            {t('resources.random')}
          </Button>
        </nav>
      </div>
    </div>
  );
}

/** Lesson plan / extra / module layout (§5.8). */
function LessonView({ resource }: { resource: Resource }) {
  const t = useT();
  const resolve = useAsset();
  const { record } = useProgress();
  const steps = resource.steps?.filter((s) => s.body?.trim()) ?? [];
  const file = resource.file || DEFAULT_MODULE_FILE;

  return (
    <>
      <div className={styles.lessonTop}>
        <div className={styles.cover}>
          {resource.image && <ContentImage className={styles.coverImage} src={resource.image} alt="" />}
          <div className={styles.coverBar}>
            <ResourceTags resource={resource} className={styles.tags} />
            <SaveStar slug={resource.slug} title={resource.title ?? resource.slug} />
          </div>
          {resource.image && (
            <div className={styles.coverWordmark}>
              <ClimateClass size="lg" />
            </div>
          )}
          <div className={styles.coverFoot}>
            <Button href={resolve(file)} download onClick={() => record('modulesOpened', resource.slug)}>
              {t('detail.download')}
            </Button>
          </div>
        </div>
        <div className={styles.objectives}>
          <h3 className={styles.h3}>{t('detail.goal')}</h3>
          <Markdown>{resource.goal}</Markdown>
          <h3 className={styles.h3}>{t('detail.objectives')}</h3>
          <Markdown>{resource.objectives}</Markdown>
          {resource.description && <p className={styles.description}>{resource.description}</p>}
        </div>
      </div>
      <ol className={styles.steps} aria-label={t('detail.steps')}>
        {steps.length > 0
          ? steps.map((step, i) => (
              <li key={i} className={styles.step}>
                <Markdown>{step.body}</Markdown>
              </li>
            ))
          : Array.from({ length: 6 }, (_, i) => (
              <li key={i}>
                <Placeholder label={t('detail.stepPlaceholder', { n: i + 1 })} ratio="478 / 197" />
              </li>
            ))}
      </ol>
    </>
  );
}

/** Test intro + quiz (§5.9, §5.10). */
function TestView({ resource, startTest }: { resource: Resource; startTest: boolean }) {
  const t = useT();
  const navigate = useLocalNavigate();
  const resolve = useAsset();
  const [started, setStarted] = useState(startTest);
  const questions = resource.questions?.filter((q) => q.question?.trim()) ?? [];

  return (
    <>
      <div className={styles.banner}>
        {resource.image && <img src={resolve(resource.image)} alt="" />}
        <div className={styles.bannerContent}>
          <ResourceTags resource={resource} className={styles.tags} />
          <p className={styles.bannerCount}>
            {questions.length > 0 ? t('detail.questions', { n: questions.length }) : t('detail.questionsSoon')}
          </p>
        </div>
        <div className={styles.bannerStar}>
          <SaveStar slug={resource.slug} title={resource.title ?? resource.slug} />
        </div>
      </div>

      {questions.length === 0 ? (
        <p className={styles.description}>{t('detail.questionsTeam')}</p>
      ) : started ? (
        <Quiz questions={questions} resourceSlug={resource.slug} />
      ) : (
        <div>
          <Button
            onClick={() => {
              setStarted(true);
              // Make the quiz deep-linkable without jumping back to the top of the page.
              navigate(`/resources/${resource.slug}/test`, { replace: true, state: { keepScroll: true } });
            }}
          >
            {t('detail.start')}
          </Button>
        </div>
      )}
    </>
  );
}
