import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ContentImage } from '../content/assets';
import type { QuizQuestion } from '../content/types';
import { useT } from '../i18n/locale';
import { Button } from './Button';
import styles from './Quiz.module.css';

/** Chosen option indexes per question index. */
export type Answers = number[][];

export const correctOptions = (q: QuizQuestion) => (q.options ?? []).flatMap((o, i) => (o.correct ? [i] : []));

export const isAnsweredRight = (q: QuizQuestion, chosen: number[] | undefined) =>
  [...(chosen ?? [])].sort().join() === correctOptions(q).sort().join();

/** Scoring needs a correct option on every question (set in the CMS). */
export const canScore = (questions: QuizQuestion[]) => questions.length > 0 && questions.every((q) => correctOptions(q).length > 0);

/**
 * Test questions, Figma 269:3256 / 270:3735 (DESIGN.md §4.10). Single-answer questions are
 * radios and "check all that apply" questions are checkboxes. On submit with every question
 * answered, `onFinish` receives the answers and the page shows the result (§5.5–5.6).
 */
export function Quiz({
  questions,
  initial,
  onFinish,
  onAttempt,
}: {
  questions: QuizQuestion[];
  initial?: Answers;
  onFinish: (answers: Answers) => void;
  onAttempt?: () => void;
}) {
  const t = useT();
  const [answers, setAnswers] = useState<Answers>(initial ?? []);
  const [missing, setMissing] = useState<number[]>([]);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [focusSummary, setFocusSummary] = useState(0);

  useEffect(() => {
    if (focusSummary) summaryRef.current?.focus();
  }, [focusSummary]);

  function choose(qi: number, option: number, multiple: boolean) {
    setAnswers((prev) => {
      const next = [...prev];
      const current = next[qi] ?? [];
      next[qi] = multiple ? (current.includes(option) ? current.filter((o) => o !== option) : [...current, option]) : [option];
      return next;
    });
    setMissing((m) => m.filter((i) => i !== qi));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    onAttempt?.();
    const unanswered = questions.flatMap((_, i) => (answers[i]?.length ? [] : [i]));
    setMissing(unanswered);
    if (unanswered.length > 0) {
      setFocusSummary((n) => n + 1);
      return;
    }
    onFinish(answers);
  }

  return (
    <form className={styles.quiz} onSubmit={onSubmit} noValidate>
      {missing.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} className={styles.errorSummary} role="alert">
          <p>{missing.length === 1 ? t('quiz.answerFirstOne') : t('quiz.answerFirstMany', { n: missing.length })}</p>
          <ul>
            {missing.map((qi) => (
              <li key={qi}>
                <a href={`#q${qi + 1}`}>{t('quiz.question', { n: qi + 1 })}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ol className={styles.questions}>
        {questions.map((q, qi) => {
          const id = `q${qi + 1}`;
          const isMissing = missing.includes(qi);
          return (
            <li key={qi} className={styles.question}>
              <fieldset id={id} className={styles.fieldset} aria-describedby={isMissing ? `${id}-error` : undefined}>
                <legend className={styles.legend}>
                  <span className={styles.number}>{qi + 1}.</span>
                  <span>
                    {q.question}
                    {q.multiple && <span className={styles.hint}> {t('quiz.checkAll')}</span>}
                  </span>
                </legend>
                {isMissing && (
                  <p id={`${id}-error`} className={styles.fieldError}>
                    {q.multiple ? t('quiz.chooseMany') : t('quiz.chooseOne')}
                  </p>
                )}
                <div className={styles.questionBody}>
                  <div className={styles.options}>
                    {(q.options ?? []).map((option, oi) => (
                      <label key={oi} className={styles.option}>
                        <input
                          type={q.multiple ? 'checkbox' : 'radio'}
                          name={id}
                          className={styles.input}
                          checked={answers[qi]?.includes(oi) ?? false}
                          onChange={() => choose(qi, oi, !!q.multiple)}
                        />
                        <span className={`${styles.box} ${q.multiple ? styles.square : styles.round}`} aria-hidden="true" />
                        {option.text}
                      </label>
                    ))}
                  </div>
                  {q.image && <ContentImage className={styles.image} src={q.image} alt={q.alt} />}
                </div>
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div>
        <Button type="submit">{t('quiz.check')}</Button>
      </div>
    </form>
  );
}
