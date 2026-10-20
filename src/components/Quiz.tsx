import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ContentImage } from '../content/assets';
import type { QuizQuestion } from '../content/types';
import { useT } from '../i18n/locale';
import { useProgress } from '../lib/storage';
import { Button } from './Button';
import { Icon } from './Icon';
import styles from './Quiz.module.css';

type Answers = Record<string, number[]>;

/**
 * Quiz (DESIGN.md §4.10, §5.10). Single-answer questions are radios and "check all
 * that apply" questions are checkboxes; both are drawn as the Figma squares.
 * Scoring switches on once every question has at least one option marked correct
 * in the CMS (§8.4 #19).
 */
export function Quiz({ questions, resourceSlug }: { questions: QuizQuestion[]; resourceSlug: string }) {
  const t = useT();
  const { record } = useProgress();
  const [answers, setAnswers] = useState<Answers>({});
  const [missing, setMissing] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  // After a submit, move focus to the error summary or the result once it has rendered.
  const [focusTarget, setFocusTarget] = useState<{ el: 'summary' | 'result' } | null>(null);

  useEffect(() => {
    if (!focusTarget) return;
    (focusTarget.el === 'summary' ? summaryRef : resultRef).current?.focus();
  }, [focusTarget]);

  const items = questions.map((q, i) => ({
    ...q,
    id: `q${i + 1}`,
    options: q.options ?? [],
    correct: (q.options ?? []).flatMap((o, oi) => (o.correct ? [oi] : [])),
  }));

  const canScore = items.length > 0 && items.every((q) => q.correct.length > 0);
  const isRight = (id: string) => {
    const q = items.find((x) => x.id === id)!;
    return [...(answers[id] ?? [])].sort().join() === [...q.correct].sort().join();
  };
  const score = items.filter((q) => isRight(q.id)).length;

  function choose(questionId: string, option: number, multiple: boolean) {
    setSubmitted(false);
    setAnswers((prev) => {
      const current = prev[questionId] ?? [];
      const next = multiple
        ? current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option]
        : [option];
      return { ...prev, [questionId]: next };
    });
    setMissing((m) => m.filter((id) => id !== questionId));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const unanswered = items.filter((q) => !answers[q.id]?.length).map((q) => q.id);
    setMissing(unanswered);
    record('testsAttempted', resourceSlug);
    if (unanswered.length > 0) {
      setSubmitted(false);
      setFocusTarget({ el: 'summary' });
      return;
    }
    record('testsFinished', resourceSlug);
    setSubmitted(true);
    setFocusTarget({ el: 'result' });
  }

  return (
    <form className={styles.quiz} onSubmit={onSubmit} noValidate>
      {missing.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} className={styles.errorSummary} role="alert">
          <p>{missing.length === 1 ? t('quiz.answerFirstOne') : t('quiz.answerFirstMany', { n: missing.length })}</p>
          <ul>
            {missing.map((id) => (
              <li key={id}>
                <a href={`#${id}`}>{t('quiz.question', { n: items.findIndex((q) => q.id === id) + 1 })}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ol className={styles.questions}>
        {items.map((q, qi) => {
          const showResult = submitted && canScore;
          const right = showResult && isRight(q.id);
          return (
            <li key={q.id} className={styles.question}>
              <fieldset
                id={q.id}
                className={styles.fieldset}
                aria-describedby={missing.includes(q.id) ? `${q.id}-error` : undefined}
              >
                <legend className={styles.legend}>
                  <span className={styles.number}>{qi + 1}.</span> {q.question}
                </legend>
                {missing.includes(q.id) && (
                  <p id={`${q.id}-error`} className={styles.fieldError}>
                    {q.multiple ? t('quiz.chooseMany') : t('quiz.chooseOne')}
                  </p>
                )}
                <div className={styles.questionBody}>
                  <div className={styles.options}>
                    {q.options.map((option, oi) => (
                      <label key={oi} className={styles.option}>
                        <input
                          type={q.multiple ? 'checkbox' : 'radio'}
                          name={q.id}
                          className={styles.input}
                          checked={answers[q.id]?.includes(oi) ?? false}
                          onChange={() => choose(q.id, oi, !!q.multiple)}
                        />
                        <span className={styles.box} aria-hidden="true">
                          <Icon name="check" size={14} />
                        </span>
                        {option.text}
                      </label>
                    ))}
                  </div>
                  {q.image && <ContentImage className={styles.image} src={q.image} alt={q.alt} />}
                </div>
                {showResult && (
                  <p className={right ? styles.right : styles.wrong}>{right ? t('quiz.correct') : t('quiz.wrong')}</p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div className={styles.actions}>
        <Button type="submit">{t('quiz.check')}</Button>
      </div>

      {submitted && (
        <div ref={resultRef} tabIndex={-1} className={styles.result} role="status">
          <p>{canScore ? t('quiz.score', { score, total: items.length }) : t('quiz.noScore')}</p>
        </div>
      )}
    </form>
  );
}
