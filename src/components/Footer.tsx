import { Link } from 'react-router-dom';
import { FOOTER_COLUMNS, FOOTER_LEGAL, TAGLINE } from '../content/site';
import { Logo } from './Logo';
import styles from './Footer.module.css';

/** Footer rebuilt in HTML from the Figma bitmap (DESIGN.md §4.2, §8.3 #7). */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.tagline}>{TAGLINE}</p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.heading} aria-label={`Footer: ${column.heading}`} className={styles.column}>
            <h2 className={styles.heading}>{column.heading}</h2>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <p>© {new Date().getFullYear()} Human Nature. All rights reserved.</p>
          <ul className={styles.legal}>
            {FOOTER_LEGAL.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
