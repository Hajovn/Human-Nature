// Loads the CMS content files (/content/**/*.json) at build time and resolves them for a
// language. Indonesian falls back to English field by field, so a half-translated page
// still renders completely.
import type { Locale } from '../i18n/locale';
import type {
  HomeData,
  Localized,
  MissionData,
  Resolved,
  Resource,
  ResourceData,
  SimplePageData,
  SiteSettings,
  Theme,
  ThemeData,
} from './types';

const themeFiles = import.meta.glob<Localized<ThemeData>>('/content/themes/*.json', { eager: true, import: 'default' });
const resourceFiles = import.meta.glob<Localized<ResourceData>>('/content/resources/*.json', {
  eager: true,
  import: 'default',
});
const pageFiles = import.meta.glob<Localized<unknown>>('/content/pages/*.json', { eager: true, import: 'default' });
const settingsFiles = import.meta.glob<Localized<SiteSettings>>('/content/settings/*.json', {
  eager: true,
  import: 'default',
});

const slugOf = (path: string) => path.split('/').pop()!.replace(/\.json$/, '');

const isEmpty = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === 'object' && !Array.isArray(value) && Object.keys(value as object).length === 0);

/** Translation wins where it has a value; English fills the gaps. Lists are taken whole. */
export function mergeLocale<T>(base: T, translation: unknown): T {
  if (isEmpty(translation)) return base;
  if (Array.isArray(base) || Array.isArray(translation)) return translation as T;
  if (typeof base === 'object' && base !== null && typeof translation === 'object' && translation !== null) {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [key, value] of Object.entries(translation as Record<string, unknown>)) {
      out[key] = mergeLocale(out[key], value);
    }
    return out as T;
  }
  return translation as T;
}

/**
 * Resolve a content file for a language. A file counts as translated once its main text
 * field (`titleKey`) is filled in for that language. Decap also copies language-independent
 * fields (images, type, theme) into every language, so those alone don't count.
 */
export function resolveLocale<T>(
  file: Localized<T> | undefined,
  locale: Locale,
  titleKey = 'title',
): { data: T; fallback: boolean } {
  const english = (file?.en ?? {}) as T;
  if (locale === 'en') return { data: english, fallback: false };
  const translation = file?.[locale] as Record<string, unknown> | undefined;
  if (isEmpty(translation?.[titleKey])) return { data: english, fallback: true };
  return { data: mergeLocale(english, translation), fallback: false };
}

function resolveAll<T>(files: Record<string, Localized<T>>, locale: Locale): Resolved<T>[] {
  return Object.entries(files).map(([path, file]) => {
    const { data, fallback } = resolveLocale(file, locale);
    return { ...data, slug: slugOf(path), fallback };
  });
}

export const getThemes = (locale: Locale): Theme[] =>
  resolveAll(themeFiles, locale).sort((a, b) => (a.number ?? 99) - (b.number ?? 99));

export const getTheme = (slug: string | undefined, locale: Locale): Theme | undefined =>
  getThemes(locale).find((t) => t.slug === slug);

export const getResources = (locale: Locale): Resource[] =>
  resolveAll(resourceFiles, locale).sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.slug.localeCompare(b.slug));

export const getResource = (slug: string | undefined, locale: Locale): Resource | undefined =>
  getResources(locale).find((r) => r.slug === slug);

export function getPage<T = SimplePageData>(name: 'home' | 'mission' | 'privacy' | 'terms', locale: Locale) {
  const titleKey = name === 'home' ? 'heroTitleLine1' : 'title';
  return resolveLocale(pageFiles[`/content/pages/${name}.json`] as Localized<T> | undefined, locale, titleKey);
}

export const getHome = (locale: Locale) => getPage<HomeData>('home', locale);
export const getMission = (locale: Locale) => getPage<MissionData>('mission', locale);

export const getSettings = (locale: Locale): SiteSettings =>
  resolveLocale(settingsFiles['/content/settings/site.json'], locale, 'tagline').data;

/** Anchor id for a section: the editor's id, or one made from the title. */
export const sectionId = (section: { id?: string; title?: string }, index: number) =>
  section.id?.trim() ||
  (section.title ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-') ||
  `section-${index + 1}`;
