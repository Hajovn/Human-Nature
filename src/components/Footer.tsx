import { footerColumns, footerLegal } from '../content/site';
import { useSettings, useThemes } from '../content/useContent';
import { Link, useT } from '../i18n/locale';
import { Logo } from './Logo';
import styles from './Footer.module.css';

/** Footer, Figma 198:125 and 198:159 (DESIGN.md §4.2). The same on every page. */
export function Footer() {
  const t = useT();
  const settings = useSettings();
  const columns = footerColumns(t, useThemes());
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div className={styles.brand}>
          <Logo />
          {settings.tagline && <p className={styles.tagline}>{settings.tagline}</p>}
        </div>
        {columns.map((column) => (
          <nav key={column.heading} aria-label={t('footer.nav', { heading: column.heading })} className={styles.column}>
            <h2 className={styles.heading}>{column.heading}</h2>
            <ul>
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <p>
            © {new Date().getFullYear()} {settings.organisation ?? 'Human Nature'}. {t('footer.rights')}
          </p>
          <ul className={styles.legal}>
            {footerLegal(t).map((link) => (
              <li key={link.to + link.label}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
