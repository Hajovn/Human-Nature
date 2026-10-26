import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { InfoCards, ResourceTags } from '../components/cards';
import { DEFAULT_MODULE_FILE, FeedbackSection, TeacherDownload } from '../components/Feedback';
import { FilterSidebar } from '../components/FilterSidebar';
import { Markdown } from '../components/Markdown';
import { Quiz, type Answers } from '../components/Quiz';
import { TestResult } from '../components/TestResult';
import { Breadcrumb, Callout, FallbackNotice, Label, PageHero, SaveStar, ShapedImage } from '../components/ui';
import { useAsset } from '../content/assets';
import { accentOf } from '../content/site';
import type { Resource, Theme } from '../content/types';
import { useResources, useThemes } from '../content/useContent';
import { useT } from '../i18n/locale';
import { useProgress } from '../lib/storage';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import NotFoundPage from './NotFoundPage';
import layout from './ResourcesPage.module.css';
import styles from './ResourceDetailPage.module.css';

/**
 * Resource detail route (DESIGN.md §5.4 lesson plan, §5.5–5.6 test and result).
 * /resources/:slug/test is the same page; tests start with the questions.
 */
export default function ResourceDetailPage() {
  const { slug } = useParams();
  const resources = useResources();
  const themes = useThemes();
  const resource = resources.find((r) => r.slug === slug);
  const t = useT();
  useDocumentTitle(resource?.title ?? t('notFound.title'));
  if (!resource) return <NotFoundPage />;
  // key: a new resource starts with a fresh test (no answers carried over).
  return <ResourceView key={resource.slug} resource={resource} themes={themes} />;
}

/** Resource detail content. Also used by the CMS live preview. */
export function ResourceView({ resource, themes }: { resource: Resource; themes: Theme[] }) {
  const t = useT();
  const theme = themes.find((th) => th.slug === resource.theme);
  const nextTheme = theme ? themes.find((th) => th.number === (theme.number ?? 0) + 1) : undefined;
  const { record } = useProgress();
  const [answers, setAnswers] = useState<Answers | null>(null);
  const isTest = resource.type === 'test';

  if (isTest && answers) {
    return (
      <div lang={resource.fallback ? 'en' : undefined}>
        <TestResult
          resource={resource}
          theme={theme}
          nextTheme={nextTheme}
          answers={answers}
          onRetry={() => {
            setAnswers(null);
            window.scrollTo(0, 0);
          }}
        />
      </div>
    );
  }

  const questions = resource.questions ?? [];
  const meta = isTest
    ? [theme?.title, t('detail.questions', { n: questions.length })].filter(Boolean).join(' · ')
    : resource.author && t('detail.author', { author: resource.author });

  return (
    <div lang={resource.fallback ? 'en' : undefined}>
      <PageHero
        background={accentOf(theme) ?? 'sky'}
        breadcrumb={
          <Breadcrumb
            parent={{ label: t('resources.title'), to: '/resources' }}
            current={resource.type ? t(`breadcrumb.${resource.type}`) : resource.title ?? ''}
          />
        }
        title={isTest ? t('type.test') : resource.title}
        lead={meta || undefined}
      />
      <FallbackNotice show={resource.fallback} />

      <div className={`container container-wide ${layout.layout}`}>
        <aside className={layout.sidebar}>
          <FilterSidebar />
        </aside>
        <div className={layout.main}>
          {isTest ? (
            <>
              <article className={styles.testIntro}>
                {theme && <h2 className={styles.testTheme}>{theme.title}</h2>}
                {resource.intro && <p className={styles.small}>{resource.intro}</p>}
              </article>
              {questions.length > 0 ? (
                <Quiz
                  questions={questions}
                  onAttempt={() => record('testsAttempted', resource.slug)}
                  onFinish={(result) => {
                    record('testsFinished', resource.slug);
                    setAnswers(result);
                    window.scrollTo(0, 0);
                  }}
                />
              ) : (
                <p>{t('detail.questionsSoon')}</p>
              )}
            </>
          ) : (
            <LessonView resource={resource} />
          )}
          {resource.teacherFile && <TeacherDownload path={resource.teacherFile} />}
        </div>
      </div>

      <FeedbackSection id={resource.slug} />
    </div>
  );
}

/** Lesson plan (and "for teachers" / extra resources), DESIGN.md §5.4. */
function LessonView({ resource }: { resource: Resource }) {
  const t = useT();
  const resolve = useAsset();
  const { record } = useProgress();
  const file = resource.file || (resource.type === 'lesson-plan' || resource.type === 'for-teachers' ? DEFAULT_MODULE_FILE : '');
  const steps = resource.steps ?? [];

  return (
    <>
      <div className={styles.top}>
        <div className={styles.media}>
          <ShapedImage src={resource.image} alt={resource.alt} shape="arch" />
          <div className={styles.mediaActions}>
            {file ? (
              <Button href={resolve(file)} download onClick={() => record('modulesOpened', resource.slug)}>
                {t('detail.download')}
              </Button>
            ) : resource.link ? (
              <Button href={resource.link} target="_blank" rel="noopener noreferrer">
                {t('detail.open')}
                <span className="visually-hidden"> {t('a11y.newTab')}</span>
              </Button>
            ) : (
              <span />
            )}
            <SaveStar slug={resource.slug} title={resource.title ?? resource.slug} />
          </div>
        </div>
        <div className={styles.about}>
          <ResourceTags resource={resource} />
          <h2 className={styles.h2}>{t('detail.about')}</h2>
          {(resource.about || resource.description) && <p className={styles.lead}>{resource.about || resource.description}</p>}
          {!!resource.goals?.length && (
            <>
              <Label>{t('detail.goals')}</Label>
              <ul className={styles.goals}>
                {resource.goals.map((goal, i) => (
                  <li key={i}>{goal}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {(resource.context || !!resource.materials?.length) && (
        <section className={styles.block} aria-labelledby="context-title">
          <h2 id="context-title" className={styles.h2}>
            {t('detail.context')}
          </h2>
          {resource.context && <Markdown className={styles.body}>{resource.context}</Markdown>}
          <InfoCards items={resource.materials} columns={4} tone="sky" />
        </section>
      )}

      {steps.length > 0 && (
        <section className={styles.block} aria-labelledby="steps-title">
          <h2 id="steps-title" className={styles.h2}>
            {t('detail.stepsN', { n: steps.length })}
          </h2>
          <ol className={styles.steps}>
            {steps.map((step, i) => (
              <li key={i} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  {step.title && <h3 className={styles.stepTitle}>{step.title}</h3>}
                  <Markdown className={styles.body}>{step.text}</Markdown>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {(resource.keyMessage || resource.teacherTip) && (
        <div className={styles.messages}>
          {resource.keyMessage && (
            <Callout kind="ask-your-class" label={t('detail.keyMessage')}>
              {resource.keyMessage}
            </Callout>
          )}
          {resource.teacherTip && <Callout kind="did-you-know" label={t('callout.teacher-tip')}>{resource.teacherTip}</Callout>}
        </div>
      )}

      {!!resource.photos?.length && (
        <ul className={styles.photos}>
          {resource.photos.map((photo, i) => (
            <li key={i}>
              <ShapedImage src={photo.image} alt={photo.alt} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
