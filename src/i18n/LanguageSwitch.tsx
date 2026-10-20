import { Link as RouterLink, useLocation } from 'react-router-dom';
import { localizePath, stripLocale, useLocale, useT, type Locale } from './locale';

// Display order in the switch: Indonesian first (main audience), then English.
const SWITCH_ORDER: Locale[] = ['id', 'en'];
import styles from './LanguageSwitch.module.css';

/**
 * ID | EN switch (DESIGN.md §8.10). Always visible in the header bar, on every page and
 * screen size. Links to the same page in the other language, keeping filters and anchors.
 */
export function LanguageSwitch({ className }: { className?: string }) {
  const { pathname, search, hash } = useLocation();
  const current = useLocale();
  const t = useT();
  const base = stripLocale(pathname);

  return (
    <nav aria-label={t('lang.label')} className={`${styles.switch} ${className ?? ''}`}>
      {SWITCH_ORDER.map((locale) => (
        <RouterLink
          key={locale}
          to={`${localizePath(base, locale)}${search}${hash}`}
          className={styles.option}
          aria-current={locale === current ? 'true' : undefined}
          hrefLang={locale}
          lang={locale}
          title={t(locale === 'en' ? 'lang.en' : 'lang.id')}
        >
          {locale.toUpperCase()}
          <span className="visually-hidden"> – {t(locale === 'en' ? 'lang.en' : 'lang.id')}</span>
        </RouterLink>
      ))}
    </nav>
  );
}
