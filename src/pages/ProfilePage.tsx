import { AvatarChooser } from '../components/Avatar';
import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { LessonCard } from '../components/cards';
import { Icon } from '../components/Icon';
import { BigNumber, Label, LevelTrack, PageHero, Section } from '../components/ui';
import { useResources, useThemes } from '../content/useContent';
import { useLocalNavigate, useT } from '../i18n/locale';
import { useAuth } from '../lib/auth';
import { LEVELS, levelFor, useProgress, useSavedResources } from '../lib/storage';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { AccountSection, InviteCodeBox } from './ProfileAccount';
import styles from './ProfilePage.module.css';

/**
 * Personal page, Figma 272:868 (DESIGN.md §5.8). Progress is kept in this browser and,
 * with a teacher account, synced. The account parts (§5.10) follow below.
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
  const levelNames = LEVELS.map((_, i) => t(`level.${i}` as `level.${0 | 1 | 2 | 3 | 4 | 5}`));

  const savedResources = resources.filter((r) => saved.includes(r.slug));
  const suggestions = resources.filter((r) => !saved.includes(r.slug) && !progress.testsFinished.includes(r.slug)).slice(0, 4);

  async function logOut() {
    await signOut();
    navigate('/');
  }

  return (
    <>
      <PageHero
        title={t('profile.hello', { name: user?.name ?? t('profile.there') })}
        lead={user ? t('profile.progressIntro') : t('profile.guestIntro')}
      />

      <Section>
        <div className={styles.top}>
          <section className={styles.profileCard} aria-label={t('profile.card')}>
            {configured && user && profile ? (
              <AvatarChooser accountId={user.id} current={profile.avatar} />
            ) : (
              <span className={styles.avatar} aria-hidden="true" />
            )}
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
                  <dt>
                    <Label>{label}</Label>
                  </dt>
                  <dd>{value || '—'}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.actions}>
              {user ? (
                <>
                  <Button size="sm" variant="secondary" onClick={logOut}>
                    {t('profile.logout')}
                  </Button>
                  {configured && (
                    <Button size="sm" variant="secondary" href="#account-password">
                      {t('profile.changePassword')}
                    </Button>
                  )}
                  {configured && (
                    <Button size="sm" variant="secondary" href="#account-delete" className={styles.danger}>
                      {t('profile.delete')}
                    </Button>
                  )}
                  {profile?.role === 'admin' && (
                    <Button size="sm" variant="secondary" to="/profile/admin">
                      {t('profile.admin')}
                    </Button>
                  )}
                </>
              ) : (
                <Button to="/login">{t('nav.login')}</Button>
              )}
            </div>
          </section>

          <section className={styles.progress} aria-labelledby="progress-title">
            <h2 id="progress-title" className={styles.h2}>
              {t('profile.yourProgress')}
            </h2>
            <p>{t('profile.progressText')}</p>
            <ul className={styles.stats}>
              <li>
                <BigNumber
                  item={{ value: `${progress.themesVisited.length}/${themes.length}`, caption: t('profile.themesVisited'), style: 'sun' }}
                  
                />
              </li>
              <li>
                <BigNumber item={{ value: String(progress.testsFinished.length), caption: t('profile.testsFinished'), style: 'leaf' }} />
              </li>
              <li>
                <BigNumber item={{ value: String(progress.testsAttempted.length), caption: t('profile.testsAttempted'), style: 'lagoon' }} />
              </li>
              <li>
                <BigNumber item={{ value: String(progress.modulesOpened.length), caption: t('profile.modulesOpened'), style: 'ember' }} />
              </li>
            </ul>
          </section>
        </div>
      </Section>

      {configured && user && inviteShown && <InviteCodeBox />}

      <Section id="level" title={t('level.yours')} background="sky">
        <LevelTrack levels={levelNames} current={level.index} />
        <p className={styles.levelText}>{t('profile.levelHint')}</p>
      </Section>

      {savedResources.length > 0 && (
        <Section id="saved" title={t('profile.saved')}>
          <ul className={styles.grid}>
            {savedResources.map((r) => (
              <li key={r.slug}>
                <LessonCard resource={r} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {suggestions.length > 0 && (
        <Section id="suggested" title={t('profile.suggested')}>
          <ul className={styles.grid}>
            {suggestions.map((r) => (
              <li key={r.slug}>
                <LessonCard resource={r} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {configured && user && <AccountSection account={user} />}
    </>
  );
}
