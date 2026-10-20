import { Link, useT } from '../i18n/locale';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { AuthShell } from './LoginPage';
import styles from './LoginPage.module.css';

/** Register / Forgot password placeholders (DESIGN.md §8.5 #25: not designed yet). */
export default function AuthPlaceholderPage({ kind }: { kind: 'register' | 'forgot' }) {
  const t = useT();
  const title = kind === 'register' ? t('register.title') : t('forgot.title');
  useDocumentTitle(title);
  return (
    <AuthShell>
      <h1 className={styles.title}>{title}</h1>
      <p>{kind === 'register' ? t('register.text') : t('forgot.text')}</p>
      <p>
        <Link to="/login">{t('auth.back')}</Link>
      </p>
    </AuthShell>
  );
}
