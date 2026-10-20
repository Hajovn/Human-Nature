import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Logo } from '../components/Logo';
import { resolveAsset } from '../content/assets';
import { Link, useLocalNavigate, useT } from '../i18n/locale';
import { useMockUser } from '../lib/storage';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import styles from './LoginPage.module.css';

const BACKGROUND = '/uploads/theme-climate-change-bromo.webp';

/**
 * Log-in screen (DESIGN.md §4.10, §5.13, §8.5 #25). Mock only: no real
 * authentication; any username + password "logs in" on this device.
 */
export default function LoginPage() {
  const t = useT();
  useDocumentTitle(t('login.title'));
  const navigate = useLocalNavigate();
  const { logIn } = useMockUser();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ user?: string; password?: string }>({});
  const userRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const userId = useId();
  const passwordId = useId();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user = String(data.get('username') ?? '').trim();
    const password = String(data.get('password') ?? '');
    const next = {
      user: user ? undefined : t('login.errUser'),
      password: password ? undefined : t('login.errPassword'),
    };
    setErrors(next);
    if (next.user) return userRef.current?.focus();
    if (next.password) return passwordRef.current?.focus();
    logIn(user);
    navigate('/profile');
  }

  return (
    <AuthShell>
      <h1 className={styles.title}>{t('login.welcome')}</h1>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor={userId}>{t('login.user')}</label>
          <input
            ref={userRef}
            id={userId}
            name="username"
            type="text"
            autoComplete="username"
            aria-invalid={errors.user ? true : undefined}
            aria-describedby={errors.user ? `${userId}-error` : undefined}
          />
          {errors.user && (
            <p id={`${userId}-error`} className={styles.error}>
              {errors.user}
            </p>
          )}
        </div>
        <div className={styles.field}>
          <label htmlFor={passwordId}>{t('login.password')}</label>
          <div className={styles.passwordWrap}>
            <input
              ref={passwordRef}
              id={passwordId}
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? `${passwordId}-error` : undefined}
            />
            <button
              type="button"
              className={styles.reveal}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((s) => !s)}
            >
              <Icon name={showPassword ? 'eye-off' : 'eye'} />
              <span className="visually-hidden">{t('login.showPassword')}</span>
            </button>
          </div>
          {errors.password && (
            <p id={`${passwordId}-error`} className={styles.error}>
              {errors.password}
            </p>
          )}
        </div>
        <div className={styles.row}>
          <Button type="submit" size="sm">
            {t('login.submit')}
          </Button>
          <Link to="/forgot-password" className={styles.forgot}>
            {t('login.forgot')}
          </Link>
        </div>
        <p className={styles.note}>{t('login.demo')}</p>
      </form>
      <p>
        <Link to="/register" className={styles.register}>
          {t('login.register')}
        </Link>
      </p>
    </AuthShell>
  );
}

/** Full-bleed Bromo photo with the rounded light-blue card on the right (§5.13). */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <section className={styles.page}>
      <img className={styles.bg} src={resolveAsset(BACKGROUND)} alt="" width={1200} height={1600} />
      <div className={`container ${styles.inner}`}>
        <div className={styles.card}>
          {children}
          <div className={styles.logo}>
            <Logo size="large" asLink={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
