import { useEffect, useState } from 'react';
import styles from './SectionNav.module.css';

export interface SectionLink {
  id: string;
  label: string;
}

/**
 * "On this page" list with circle markers (DESIGN.md §4.9). The circle of the section
 * currently in view is filled (scroll-spy). Below 1024px it collapses into a disclosure
 * (§8.2 #1).
 */
export function SectionNav({ links, label }: { links: SectionLink[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '0px 0px -60% 0px' },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [links]);

  const list = (
    <ul className={styles.list}>
      {links.map((link) => (
        <li key={link.id}>
          <a href={`#${link.id}`} className={styles.link} aria-current={active === link.id ? 'location' : undefined}>
            <span className={styles.dot} aria-hidden="true" />
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <nav aria-label={label} className={styles.nav}>
      <details className={styles.mobile}>
        <summary className={styles.summary}>{label}</summary>
        {list}
      </details>
      <div className={styles.desktop}>{list}</div>
    </nav>
  );
}
