// Hooks that return CMS content in the visitor's current language.
import { useMemo } from 'react';
import { useLocale } from '../i18n/locale';
import { getResources, getSettings, getThemes } from './load';

export function useThemes() {
  const locale = useLocale();
  return useMemo(() => getThemes(locale), [locale]);
}

export function useResources() {
  const locale = useLocale();
  return useMemo(() => getResources(locale), [locale]);
}

export function useSettings() {
  const locale = useLocale();
  return useMemo(() => getSettings(locale), [locale]);
}

/** Theme slug → title, for tags and labels. */
export function useThemeTitles() {
  const themes = useThemes();
  return useMemo(() => Object.fromEntries(themes.map((t) => [t.slug, t.title ?? t.slug])), [themes]);
}
