import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useLocale, useT } from '../i18n/locale';
import { Footer } from './Footer';
import { GlossaryProvider } from './Glossary';
import { Header } from './Header';

export function Layout() {
  const { pathname, hash, state } = useLocation();
  const locale = useLocale();
  const t = useT();
  const keepScroll = (state as { keepScroll?: boolean } | null)?.keepScroll === true;
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // Tell browsers and screen readers which language the page is in.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // On navigation: jump to the #hash target, or to the top and move focus to <main>
  // so screen-reader users land on the new content.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      if (!hash) return;
    }
    if (keepScroll) return;
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return (
    <>
      <a className="skip-link" href="#main">
        {t('nav.skip')}
      </a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1} style={{ outline: 'none' }}>
        <GlossaryProvider>
          <Outlet />
        </GlossaryProvider>
      </main>
      <Footer />
    </>
  );
}
