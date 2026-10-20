import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { AuthShell } from './LoginPage';
import styles from './LoginPage.module.css';

/** Register / Forgot password placeholders (DESIGN.md §8.5 #25: not designed yet). */
export default function AuthPlaceholderPage({ kind }: { kind: 'register' | 'forgot' }) {
  const title = kind === 'register' ? 'Register' : 'Forgot password';
  useDocumentTitle(title);
  return (
    <AuthShell>
      <h1 className={styles.title}>{title}</h1>
      <p>
        {kind === 'register'
          ? 'Creating an account is not available yet. You can use every lesson and test without an account.'
          : 'Resetting your password is not available yet.'}
      </p>
      <p>
        <Link to="/login">Back to log in</Link>
      </p>
    </AuthShell>
  );
}
