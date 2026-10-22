import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { ResourceCard } from '../components/cards';
import { PageIntro, SectionTitle } from '../components/ui';
import { useResources, useThemes } from '../content/useContent';
import { useLocalNavigate, useT } from '../i18n/locale';
import { Icon } from '../components/Icon';
import { useAuth } from '../lib/auth';
import { LEVELS, clearAllStoredData, levelFor, useProgress, useSavedResources } from '../lib/storage';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import avatar from '../assets/img/avatar.webp';
import levelProgress from '../assets/img/level-progress.webp';
import { AccountSection, InviteCodeBox } from './ProfileAccount';
import styles from './ProfilePage.module.css';

/**
 * Personal page (DESIGN.md §5.12, §8.12). Progress is stored in this browser only
 * (§8.5 #24). With teacher accounts it also holds the invite code and account settings.
 */
export default function ProfilePage() {
  const t = useT();
  useDocumentTitle(t('profile.title'));
  const navigate = useLocalNavigate();
  const resources = useResources();
  const themes = useThemes();
  const { configured, account: user, signOut } = useAuth();
  const profile = user?.profile;
  // Keep the invite box (with its success message) after the code is accepted.
  const [inviteShown, setInviteShown] = useState(false);
  useEffect(() => {
    if (profile && !profile.verified_at) setInviteShown(true);
  }, [profile]);
  const { progress } = useProgress();
  const { saved } = useSavedResources();
  const level = levelFor(progress);
  const levelName = t(`level.${level.index}` as `level.${0 | 1 | 2 | 3 | 4 | 5}`);

  const savedResources = resources.filter((r) => saved.includes(r.slug));
  const suggestions = (
    savedResources.length ? savedResources : resources.filter((r) => !progress.testsFinished.includes(r.slug))
  ).slice(0, 4);

  const stats = [
    [t('profile.themesVisited'), t('profile.of', { a: progress.themesVisited.length, b: themes.length })],
    [t('profile.testsFinished'), progress.testsFinished.length],
    [t('profile.testsAttempted'), progress.testsAttempted.length],
    [t('profile.modulesOpened'), progress.modulesOpened.length],
    [t('profile.level'), levelName],
  ] as const;

  async function logOut() {
    await signOut();
    navigate('/');
  }

  // v1 mock only; real accounts are deleted in the Account section.
  function deleteAccount() {
    // Destructive: confirm first (§8.6, UX: confirmation-dialogs).
    if (window.confirm(t('profile.deleteConfirm'))) {
      clearAllStoredData();
      navigate('/');
    }
  }

  return (
    <>
      <PageIntro title={t('profile.hello', { name: user?.name ?? t('profile.there') })}>
        {user ? t('profile.progressIntro') : t('profile.guestIntro')}
      </PageIntro>

      <div className={`container ${styles.top}`}>
        <section className={styles.profileCard} aria-label={t('profile.card')}>
          <img className={styles.avatar} src={avatar} alt="" width={160} height={160} />
          {profile?.verified_at && (
            <p className={styles.verified}>
              <Icon name="check" size={16} />
              {t('profile.verified')}
            </p>
          )}
          <dl className={styles.fields}>
            {[
              [t('profile.name'), user?.name],
              [t('profile.email'), user?.email],
              [t('profile.school'), profile?.school_name],
              [t('form.npsn'), profile?.school_npsn],
              [t('form.phone'), profile?.phone],
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
                <Button onClick={logOut}>{t('profile.logout')}</Button>
                {profile?.role === 'admin' && <Button to="/profile/admin">{t('profile.admin')}</Button>}
                {!configured && <Button to="/forgot-password">{t('profile.changePassword')}</Button>}
              </>
            ) : (
              <Button to="/login">{t('nav.login')}</Button>
            )}
          </div>
          {!configured && (
            <button type="button" className={styles.danger} onClick={deleteAccount}>
              {t('profile.delete')}
            </button>
          )}
        </section>

        <section aria-labelledby="stats-title">
          <h2 id="stats-title" className="visually-hidden">
            {t('profile.yourProgress')}
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

      {configured && user && inviteShown && <InviteCodeBox />}

      <section className={`container ${styles.section}`} aria-labelledby="level-title">
        <SectionTitle id="level-title">{t('profile.levelTitle')}</SectionTitle>
        <div className={styles.levelCard}>
          <img
            src={levelProgress}
            alt={t('level.graphicAlt')}
            width={1189}
            height={357}
          />
        </div>
        <p className={styles.levelText}>
          {t('profile.levelText', { level: levelName, n: level.index + 1, total: LEVELS.length })}
        </p>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="suggest-title">
        <SectionTitle id="suggest-title">
          {savedResources.length ? t('profile.saved') : t('profile.suggested')}
        </SectionTitle>
        <ul className={styles.grid}>
          {suggestions.map((r) => (
            <li key={r.slug}>
              <ResourceCard resource={r} />
            </li>
          ))}
        </ul>
      </section>

      {configured && user && <AccountSection account={user} />}
    </>
  );
}
