import { Link, useT } from '../i18n/locale';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { AuthShell } from './LoginPage';
import styles from './LoginPage.module.css';

const TITLES = { login: 'login.title', register: 'register.title', forgot: 'forgot.title' } as const;

/** Account pages on a copy of the site without Supabase (e.g. no .env.local). */
export default function AuthPlaceholderPage({ kind }: { kind: keyof typeof TITLES }) {
  const t = useT();
  const title = t(TITLES[kind]);
  useDocumentTitle(title);
  return (
    <AuthShell>
      <h1 className={styles.title}>{title}</h1>
      <p>{t('auth.unavailable')}</p>
      <p>
        <Link to="/">{t('notFound.home')}</Link>
      </p>
    </AuthShell>
  );
}
