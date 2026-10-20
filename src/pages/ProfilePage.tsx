import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ResourceCard } from '../components/cards';
import { PageIntro, SectionTitle } from '../components/ui';
import { IMAGES } from '../content/images';
import { RESOURCES } from '../content/resources';
import { THEMES } from '../content/themes';
import { LEVELS, clearAllStoredData, levelFor, useMockUser, useProgress, useSavedResources } from '../lib/storage';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import styles from './ProfilePage.module.css';

/** Personal page (DESIGN.md §5.12). Progress is stored in this browser only (§8.5 #24). */
export default function ProfilePage() {
  useDocumentTitle('My profile');
  const navigate = useNavigate();
  const { user, logOut } = useMockUser();
  const { progress } = useProgress();
  const { saved } = useSavedResources();
  const level = levelFor(progress);

  const savedResources = RESOURCES.filter((r) => saved.includes(r.slug));
  const suggestions = (savedResources.length ? savedResources : RESOURCES.filter((r) => !progress.testsFinished.includes(r.slug))).slice(0, 4);

  const stats = [
    ['Themes visited', `${progress.themesVisited.length} of ${THEMES.length}`],
    ['Tests finished', progress.testsFinished.length],
    ['Tests attempted', progress.testsAttempted.length],
    ['Lesson modules opened', progress.modulesOpened.length],
    ['Learner level', level.name],
  ] as const;

  function deleteAccount() {
    // Destructive: confirm first (§8.6, UX: confirmation-dialogs).
    if (window.confirm('Delete your account and all progress saved in this browser? This cannot be undone.')) {
      clearAllStoredData();
      navigate('/');
    }
  }

  return (
    <>
      <PageIntro title={`Hello, ${user?.name ?? 'there'}`}>
        {user ? 'Here is your progress so far.' : 'Your progress is saved in this browser. Log in to keep it with your account.'}
      </PageIntro>

      <div className={`container ${styles.top}`}>
        <section className={styles.profileCard} aria-label="Profile">
          <img className={styles.avatar} src={IMAGES.avatar.src} alt="" width={160} height={160} />
          <dl className={styles.fields}>
            {[
              ['Name', user?.name],
              ['Email', user?.email],
              ['Age', undefined],
              ['Teacher of class', undefined],
              ['School', undefined],
            ].map(([label, value]) => (
              <div key={label} className={styles.field}>
                <dt>{label}:</dt>
                <dd>{value || '—'}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.actions}>
            {user ? (
              <>
                <Button onClick={logOut}>Log out</Button>
                <Button to="/forgot-password">Change password</Button>
              </>
            ) : (
              <Button to="/login">Log in</Button>
            )}
          </div>
          <button type="button" className={styles.danger} onClick={deleteAccount}>
            Delete account
          </button>
        </section>

        <section aria-labelledby="stats-title">
          <h2 id="stats-title" className="visually-hidden">
            Your progress
          </h2>
          <ul className={styles.stats}>
            {stats.map(([label, value]) => (
              <li key={label}>
                <span className={styles.dot} aria-hidden="true" />
                {label}: <strong>{value}</strong>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className={`container ${styles.section}`} aria-labelledby="level-title">
        <SectionTitle id="level-title">Level progress</SectionTitle>
        <div className={styles.levelCard}>
          <img src={IMAGES.levelProgress.src} alt={IMAGES.levelProgress.alt} width={IMAGES.levelProgress.width} height={IMAGES.levelProgress.height} />
        </div>
        <p className={styles.levelText}>
          You are <strong>{level.name}</strong> (level {level.index + 1} of {LEVELS.length}).
        </p>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="suggest-title">
        <SectionTitle id="suggest-title">
          {savedResources.length ? 'Your saved resources' : 'Resources you might be interested in'}
        </SectionTitle>
        <ul className={styles.grid}>
          {suggestions.map((r) => (
            <li key={r.slug}>
              <ResourceCard resource={r} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
