import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { stripLocale, useLocale, useT } from '../i18n/locale';
import { Footer } from './Footer';
import { Header } from './Header';

// Pages that start with a full-bleed hero photo get the transparent overlay header.
const OVERLAY_ROUTES = [/^\/$/, /^\/themes\//, /^\/login/, /^\/register/, /^\/forgot-password/, /^\/reset-password/, /^\/auth\//];

export function Layout() {
  const { pathname, hash, state } = useLocation();
  const locale = useLocale();
  const t = useT();
  const path = stripLocale(pathname);
  const keepScroll = (state as { keepScroll?: boolean } | null)?.keepScroll === true;
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  const variant = OVERLAY_ROUTES.some((r) => r.test(path)) ? 'overlay' : 'strip';
  // The landing hero shows its photo at 44% on white, so like the strip it is a light
  // background; theme and log-in heroes show the photo at full strength.
  const tone = variant === 'strip' || path === '/' ? 'light' : 'photo';

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
      <Header variant={variant} tone={tone} />
      <main id="main" ref={mainRef} tabIndex={-1} style={{ outline: 'none' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
