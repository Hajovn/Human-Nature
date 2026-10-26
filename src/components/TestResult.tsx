import { useEffect, useRef } from 'react';
import type { QuizQuestion, Resource, Theme } from '../content/types';
import { Link, useT } from '../i18n/locale';
import { LEVELS, levelFor, useProgress } from '../lib/storage';
import { Button } from './Button';
import { CardLink } from './cards';
import { correctOptions, isAnsweredRight, type Answers } from './Quiz';
import { Label, ProgressBar, ResultPill, Section, bgClass } from './ui';
import { accentOf } from '../content/site';
import styles from './TestResult.module.css';

const optionText = (q: QuizQuestion, indexes: number[] | undefined) =>
  (indexes ?? []).map((i) => q.options?.[i]?.text ?? '').join(', ');

/**
 * Test result, Figma 312:1947 (DESIGN.md §5.6): score, level, every answer with its
 * explanation, and what to do next. Replaces the questions on the test page.
 */
export function TestResult({
  resource,
  theme,
  nextTheme,
  answers,
  onRetry,
}: {
  resource: Resource;
  theme: Theme | undefined;
  nextTheme: Theme | undefined;
  answers: Answers;
  onRetry: () => void;
}) {
  const t = useT();
  const { progress } = useProgress();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const questions = resource.questions ?? [];
  const right = questions.map((q, i) => isAnsweredRight(q, answers[i]));
  const score = right.filter(Boolean).length;
  const total = questions.length;
  const percent = total ? Math.round((score / total) * 100) : 0;
  const level = levelFor(progress);
  const next = LEVELS[level.index + 1];
  const levelNames = LEVELS.map((_, i) => t(`level.${i}` as 'level.0'));

  // Move focus to the result heading when it appears.
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <>
      <section className={`${styles.hero} ${bgClass(accentOf(theme) ?? 'sky')}`}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <Label>{t('result.test', { theme: theme?.title ?? '' })}</Label>
            <h1 ref={headingRef} tabIndex={-1} className={styles.h1}>
              {t('result.title')}
            </h1>
            <p className={styles.lead}>{percent >= 50 ? t('result.good') : t('result.keepGoing')}</p>
            <p className={styles.small}>{t('result.hint')}</p>
            <div>
              <Button onClick={onRetry}>{t('result.tryAgain')}</Button>
            </div>
          </div>
          <div className={styles.score}>
            <Label>{t('result.yourScore')}</Label>
            <p className={styles.scoreValue}>
              <span className="visually-hidden">{t('result.scoreA11y', { score, total })}</span>
              <span aria-hidden="true">
                {score}/{total}
              </span>
            </p>
            <p className={styles.lead}>{t('result.percent', { n: percent })}</p>
          </div>
        </div>
      </section>

      <Section title={t('level.yours')} background="sky">
        <div className={styles.levelCard}>
          <span className={styles.badge} aria-hidden="true" />
          <div className={styles.levelText}>
            <h3 className={styles.h3}>{t('result.youAre', { level: levelNames[level.index] })}</h3>
            {next && <p className={styles.small}>{t('result.nextLevel', { level: levelNames[level.index + 1] })}</p>}
            <ProgressBar value={next ? (level.points - LEVELS[level.index].minPoints) / (next.minPoints - LEVELS[level.index].minPoints) : 1} label={t('level.progress')} />
          </div>
        </div>
      </Section>

      <Section title={t('result.answers')} intro={t('result.summary', { right: score, review: total - score })}>
        <p className={styles.pills}>
          <ResultPill correct>✓ {t('result.correctCount', { n: score })}</ResultPill>
          {total - score > 0 && <ResultPill correct={false}>✗ {t('result.reviewCount', { n: total - score })}</ResultPill>}
        </p>
        <ol className={styles.answers}>
          {questions.map((q, i) => (
            <li key={i} className={styles.answer}>
              <div className={styles.answerHead}>
                <Label className={styles.muted}>{t('quiz.question', { n: i + 1 })}</Label>
                <ResultPill correct={right[i]}>{right[i] ? `✓ ${t('quiz.correct')}` : `✗ ${t('quiz.wrong')}`}</ResultPill>
              </div>
              <h3 className={styles.question}>{q.question}</h3>
              {!right[i] && (
                <p className={styles.small}>
                  <strong>{t('result.youAnswered')}</strong> {optionText(q, answers[i])}
                </p>
              )}
              <p className={styles.small}>
                <strong>{t('result.correctAnswer')}</strong> {optionText(q, correctOptions(q))}
              </p>
              {q.explanation && <p className={`${styles.small} ${styles.muted}`}>{q.explanation}</p>}
            </li>
          ))}
        </ol>
      </Section>

      <Section title={t('result.whatNext')} background="sky">
        <ul className={styles.nextCards}>
          {theme && (
            <li className={styles.nextCard}>
              <Label className={styles.muted}>{t('result.readAgain')}</Label>
              <h3 className={styles.nextTitle}>
                <CardLink to={`/themes/${theme.slug}`}>{t('theme.pager', { n: theme.number ?? '', title: theme.title ?? '' })}</CardLink>
              </h3>
              <p className={styles.small}>{t('result.readAgainText')}</p>
            </li>
          )}
          <li className={styles.nextCard}>
            <Label className={styles.muted}>{t('result.teachIt')}</Label>
            <h3 className={styles.nextTitle}>
              <CardLink to="/resources?type=lesson-plan">{t('result.tryLesson')}</CardLink>
            </h3>
            <p className={styles.small}>{t('result.tryLessonText')}</p>
          </li>
          {nextTheme && (
            <li className={`${styles.nextCard} ${bgClass(accentOf(nextTheme))}`}>
              <Label>{t('result.nextTheme')}</Label>
              <h3 className={styles.nextTitle}>
                <CardLink to={`/themes/${nextTheme.slug}`}>
                  {t('theme.pager', { n: nextTheme.number ?? '', title: nextTheme.title ?? '' })}
                </CardLink>
              </h3>
              {nextTheme.cardText && <p className={styles.small}>{nextTheme.cardText}</p>}
            </li>
          )}
        </ul>
        <div className={styles.actions}>
          <Button onClick={onRetry}>{t('result.tryTestAgain')}</Button>
          <Button to="/resources" variant="secondary">
            {t('result.backToResources')}
          </Button>
        </div>
      </Section>
      <p className="visually-hidden">
        <Link to={`/resources/${resource.slug}`}>{resource.title}</Link>
      </p>
    </>
  );
}
