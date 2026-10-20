import { useMemo } from 'react';
import { Blocks } from '../components/Blocks';
import { SectionNav } from '../components/SectionNav';
import { FallbackNotice, PageIntro, SectionTitle } from '../components/ui';
import { getMission, sectionId } from '../content/load';
import type { MissionData } from '../content/types';
import { useLocale, useT } from '../i18n/locale';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import themeStyles from './ThemePage.module.css';
import styles from './MissionPage.module.css';

/** Our mission route (DESIGN.md §5.11). */
export default function MissionPage() {
  const locale = useLocale();
  const t = useT();
  const { data, fallback } = useMemo(() => getMission(locale), [locale]);
  useDocumentTitle(data.title ?? t('nav.mission'));
  return <MissionView mission={data} fallback={fallback} />;
}

/** Mission page content. Also used by the CMS live preview. */
export function MissionView({ mission, fallback = false }: { mission: MissionData; fallback?: boolean }) {
  const t = useT();
  const sections = useMemo(
    () => (mission.sections ?? []).map((s, i) => ({ ...s, anchor: sectionId(s, i) })),
    [mission.sections],
  );
  const links = useMemo(() => sections.map((s) => ({ id: s.anchor, label: s.title ?? s.anchor })), [sections]);

  return (
    <div lang={fallback ? 'en' : undefined}>
      <PageIntro title={mission.title}>{mission.intro}</PageIntro>
      <FallbackNotice show={fallback} />

      <div className={`container ${themeStyles.body}`}>
        <aside className={themeStyles.sidebar}>
          <SectionNav links={links} label={t('theme.onThisPage')} />
        </aside>
        <div className={themeStyles.content}>
          {sections.map((s) => (
            <section key={s.anchor} id={s.anchor} aria-labelledby={`${s.anchor}-title`} className={styles.section}>
              <SectionTitle id={`${s.anchor}-title`}>{s.title}</SectionTitle>
              <Blocks blocks={s.blocks} />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
