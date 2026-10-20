import { useMemo } from 'react';
import { SectionNav } from '../components/SectionNav';
import { PageIntro, Placeholder, SectionTitle } from '../components/ui';
import { PH_PARAGRAPH } from '../content/placeholders';
import { MISSION_SECTIONS } from '../content/site';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import themeStyles from './ThemePage.module.css';
import styles from './MissionPage.module.css';

/** Our mission (DESIGN.md §5.11). Mostly placeholder blocks until content exists (§8.4 #17). */
export default function MissionPage() {
  useDocumentTitle('Our mission');
  const links = useMemo(
    () => [{ id: 'mission', label: 'Mission' }, ...MISSION_SECTIONS.map((s) => ({ id: s.id, label: s.title }))],
    [],
  );

  return (
    <>
      <PageIntro title="Our mission">{PH_PARAGRAPH}</PageIntro>

      <div className={`container ${styles.heroBlocks}`}>
        <Placeholder label="Image to be added" ratio="652 / 266" />
        <Placeholder label="Image to be added" ratio="652 / 266" />
      </div>

      <div className={`container ${themeStyles.body}`}>
        <aside className={themeStyles.sidebar}>
          <SectionNav links={links} />
        </aside>
        <div className={themeStyles.content}>
          <section id="mission" aria-labelledby="mission-title" className={styles.section}>
            <SectionTitle id="mission-title">Mission</SectionTitle>
            <p className={styles.text}>{PH_PARAGRAPH}</p>
          </section>
          {MISSION_SECTIONS.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className={styles.section}>
              <SectionTitle id={`${s.id}-title`}>{s.title}</SectionTitle>
              {s.id === 'contact' ? (
                <p className={styles.text}>Contact details will be added by the Human Nature team.</p>
              ) : (
                <div className={styles.blocks}>
                  {s.blocks.map((ratio, i) => (
                    <Placeholder key={i} label="Content to be added" ratio={ratio} className={styles[`w${ratio.split(' ')[0]}`]} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
