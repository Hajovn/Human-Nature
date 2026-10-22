import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { useT } from '../i18n/locale';
import { Icon } from './Icon';
import styles from './Form.module.css';

// Shared form parts for the account screens (DESIGN.md §8.12).

export type FieldErrors = Record<string, string | undefined>;

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id'>;

interface FieldProps extends InputProps {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}

export function TextField({ label, name, hint, error, optional, type = 'text', ...rest }: FieldProps) {
  const t = useT();
  const id = useId();
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {optional && <span className={styles.optional}> {t('form.optional')}</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      <input
        id={id}
        name={name}
        type={type}
        className={styles.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

export function PasswordField({ label, name, hint, error, ...rest }: Omit<FieldProps, 'type' | 'optional'>) {
  const t = useT();
  const id = useId();
  const [show, setShow] = useState(false);
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      <div className={styles.passwordWrap}>
        <input
          id={id}
          name={name}
          type={show ? 'text' : 'password'}
          className={styles.input}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          {...rest}
        />
        <button type="button" className={styles.reveal} aria-pressed={show} onClick={() => setShow((s) => !s)}>
          <Icon name={show ? 'eye-off' : 'eye'} />
          <span className="visually-hidden">{t('login.showPassword')}</span>
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

export function CheckboxField({ name, error, children }: { name: string; error?: string; children: ReactNode }) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label className={styles.check}>
        <input
          type="checkbox"
          name={name}
          className={styles.checkInput}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <span className={styles.box} aria-hidden="true">
          <Icon name="check" size={16} />
        </span>
        <span>{children}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

/** Result of a form: error (role alert), success or info (role status). */
export function Message({ tone, children }: { tone: 'error' | 'success' | 'info'; children: ReactNode }) {
  return (
    <div className={`${styles.message} ${styles[`${tone}-tone`]}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon name={tone === 'success' ? 'check' : 'alert'} />
      <div className={styles.messageBody}>{children}</div>
    </div>
  );
}

export function TextButton({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" className={styles.textButton} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export const formStyles = styles;

function describedBy(id: string, hint?: string, error?: string) {
  return [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
}

/* ── Validation and helpers ───────────────────────────────────── */

export const NPSN_PATTERN = /^[0-9]{8}$/;
// Same rules as the checks in supabase/migrations (profiles.phone).
export const PHONE_PATTERN = /^\+?[0-9][0-9 ()-]{5,19}$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD = 8;

/** Read a form's text fields, trimmed (passwords untrimmed). */
export function readForm(form: HTMLFormElement) {
  const data = new FormData(form);
  return (name: string) => {
    const value = String(data.get(name) ?? '');
    return name.toLowerCase().includes('password') ? value : value.trim();
  };
}

/** Focus the first field with an error, in form order. Returns true if there was one. */
export function focusFirstError(form: HTMLFormElement, errors: FieldErrors) {
  const first = Object.keys(errors).find((name) => errors[name]);
  if (!first) return false;
  (form.elements.namedItem(first) as HTMLElement | null)?.focus();
  return true;
}

/** Busy flag for a submit button (disabled + "Please wait…" while a request runs). */
export function useBusy() {
  const [busy, setBusy] = useState(false);
  async function run<T>(task: () => PromiseLike<T>): Promise<T> {
    setBusy(true);
    try {
      return await task();
    } finally {
      setBusy(false);
    }
  }
  return { busy, run };
}
