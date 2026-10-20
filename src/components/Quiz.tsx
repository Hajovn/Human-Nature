import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Quiz as QuizData } from '../content/types';
import { useProgress } from '../lib/storage';
import { Button } from './Button';
import { Icon } from './Icon';
import styles from './Quiz.module.css';

type Answers = Record<string, number[]>;

/**
 * Quiz (DESIGN.md §4.10, §5.10). Single-answer questions are radios and "check all
 * that apply" questions are checkboxes; both are drawn as the Figma squares.
 * Scoring only works once every question has `correct` answers (§8.4 #19).
 */
export function Quiz({ quiz, resourceSlug }: { quiz: QuizData; resourceSlug: string }) {
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

  const canScore = quiz.questions.every((q) => q.correct.length > 0);
  const isRight = (id: string) => {
    const q = quiz.questions.find((x) => x.id === id)!;
    const given = [...(answers[id] ?? [])].sort().join();
    return given === [...q.correct].sort().join();
  };
  const score = quiz.questions.filter((q) => isRight(q.id)).length;

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
    const unanswered = quiz.questions.filter((q) => !(answers[q.id]?.length)).map((q) => q.id);
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
          <p>
            Please answer {missing.length === 1 ? 'this question' : `these ${missing.length} questions`} first:
          </p>
          <ul>
            {missing.map((id) => {
              const n = quiz.questions.findIndex((q) => q.id === id) + 1;
              return (
                <li key={id}>
                  <a href={`#${id}`}>Question {n}</a>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <ol className={styles.questions}>
        {quiz.questions.map((q, qi) => {
          const showResult = submitted && canScore;
          const right = showResult && isRight(q.id);
          return (
            <li key={q.id} className={styles.question}>
              <fieldset id={q.id} className={styles.fieldset} aria-describedby={missing.includes(q.id) ? `${q.id}-error` : undefined}>
                <legend className={styles.legend}>
                  <span className={styles.number}>{qi + 1}.</span> {q.question}
                </legend>
                {missing.includes(q.id) && (
                  <p id={`${q.id}-error`} className={styles.fieldError}>
                    Choose {q.multiple ? 'at least one answer' : 'an answer'}.
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
                          onChange={() => choose(q.id, oi, q.multiple)}
                        />
                        <span className={styles.box} aria-hidden="true">
                          <Icon name="check" size={14} />
                        </span>
                        {option}
                      </label>
                    ))}
                  </div>
                  {q.image && (
                    <img
                      className={styles.image}
                      src={q.image.src}
                      alt={q.image.alt}
                      width={q.image.width}
                      height={q.image.height}
                      loading="lazy"
                    />
                  )}
                </div>
                {showResult && (
                  <p className={right ? styles.right : styles.wrong}>{right ? 'Correct!' : 'Not quite.'}</p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div className={styles.actions}>
        <Button type="submit">Check your answers</Button>
      </div>

      {submitted && (
        <div ref={resultRef} tabIndex={-1} className={styles.result} role="status">
          {canScore ? (
            <p>
              You got {score} out of {quiz.questions.length} right.
            </p>
          ) : (
            <p>
              Thanks — your test is marked as finished. Scoring will be switched on once the correct answers have been
              added.
            </p>
          )}
        </div>
      )}
    </form>
  );
}
