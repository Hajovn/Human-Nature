// Language handling. Indonesian lives at /…, English at /en/… (DESIGN.md §8.11).
import { useCallback, type ComponentProps } from 'react';
import { Link as RouterLink, useLocation, useNavigate, type NavigateOptions } from 'react-router-dom';
import { STRINGS, type StringKey } from './strings';

export const LOCALES = ['en', 'id'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'id';

export const isEnPath = (pathname: string) => pathname === '/en' || pathname.startsWith('/en/');

export const localeFromPath = (pathname: string): Locale => (isEnPath(pathname) ? 'en' : 'id');

/** "/en/resources" → "/resources" */
export const stripLocale = (pathname: string) => (isEnPath(pathname) ? pathname.slice(3) || '/' : pathname);

/** Prefix an internal path with the locale. External links, #anchors and ?queries pass through. */
export function localizePath(to: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE || !to.startsWith('/') || isEnPath(to)) return to;
  return to === '/' ? '/en' : `/en${to}`;
}

export function useLocale(): Locale {
  return localeFromPath(useLocation().pathname);
}

/** Translate an interface string, filling {placeholders}. Falls back to English. */
export function useT() {
  const locale = useLocale();
  return useCallback(
    (key: StringKey, vars?: Record<string, string | number>) => {
      const template: string = STRINGS[locale][key] ?? STRINGS.en[key];
      return vars ? template.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`)) : template;
    },
    [locale],
  );
}

/** Router Link that keeps the visitor in their current language. */
export function Link({ to, ...rest }: ComponentProps<typeof RouterLink>) {
  const locale = useLocale();
  return <RouterLink to={typeof to === 'string' ? localizePath(to, locale) : to} {...rest} />;
}

/** useNavigate that keeps the visitor in their current language. */
export function useLocalNavigate() {
  const navigate = useNavigate();
  const locale = useLocale();
  return useCallback(
    (to: string, options?: NavigateOptions) => navigate(localizePath(to, locale), options),
    [navigate, locale],
  );
}
