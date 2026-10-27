import type { ResourceType } from '../content/types';
import { useThemes } from '../content/useContent';
import { useLocalNavigate, useT } from '../i18n/locale';
import type { StringKey } from '../i18n/strings';
import { Button } from './Button';
import styles from './FilterSidebar.module.css';

export interface Filters {
  themes: string[];
  types: ResourceType[];
  /** Only the resources the visitor starred (the save star, §4.8). */
  favorites: boolean;
}

export const NO_FILTERS: Filters = { themes: [], types: [], favorites: false };

export const countFilters = (f: Filters) => f.themes.length + f.types.length + (f.favorites ? 1 : 0);

const TYPE_OPTIONS: { value: ResourceType; label: StringKey }[] = [
  { value: 'for-teachers', label: 'filters.forTeachers' },
  { value: 'lesson-plan', label: 'filters.lessonPlans' },
  { value: 'test', label: 'filters.tests' },
  { value: 'extra', label: 'filters.extra' },
];

// URL format: ?theme=climate,solutions&type=lesson-plan&favorites=1
export function parseFilters(params: URLSearchParams): Filters {
  const list = (key: string) => (params.get(key) ?? '').split(',').filter(Boolean);
  return { themes: list('theme'), types: list('type') as ResourceType[], favorites: params.get('favorites') === '1' };
}

export function filtersToParams(f: Filters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.themes.length) p.set('theme', f.themes.join(','));
  if (f.types.length) p.set('type', f.types.join(','));
  if (f.favorites) p.set('favorites', '1');
  return p;
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/**
 * Filter column, Figma 260:1434 (DESIGN.md §4.11): Theme and Type checkbox groups and
 * "Clear filters". "Favourites" (last in Type) narrows any other choice to the starred resources. Collapses into a disclosure below 1024px. Without `onChange` (lesson
 * and test pages), choosing a filter opens the resource library with that filter.
 */
export function FilterSidebar({ filters = NO_FILTERS, onChange }: { filters?: Filters; onChange?: (next: Filters) => void }) {
  const t = useT();
  const themes = useThemes();
  const navigate = useLocalNavigate();
  const count = countFilters(filters);
  const change = (next: Filters) => {
    if (onChange) onChange(next);
    else navigate(`/resources?${filtersToParams(next).toString()}`);
  };

  const checkbox = (key: string, label: string, checked: boolean, onToggle: () => void) => (
    <label key={key} className={styles.option}>
      <input type="checkbox" className={styles.input} checked={checked} onChange={onToggle} />
      <span className={styles.box} aria-hidden="true" />
      {label}
    </label>
  );

  const body = (
    <div className={styles.body}>
      <fieldset className={styles.group}>
        <legend className={styles.groupTitle}>{t('filters.theme')}</legend>
        {themes.map((theme) =>
          checkbox(theme.slug, theme.title ?? theme.slug, filters.themes.includes(theme.slug), () =>
            change({ ...filters, themes: toggle(filters.themes, theme.slug) }),
          ),
        )}
      </fieldset>
      <fieldset className={styles.group}>
        <legend className={styles.groupTitle}>{t('filters.type')}</legend>
        {TYPE_OPTIONS.map((o) =>
          checkbox(o.value, t(o.label), filters.types.includes(o.value), () =>
            change({ ...filters, types: toggle(filters.types, o.value) }),
          ),
        )}
        {checkbox('favorites', t('filters.favorites'), filters.favorites, () =>
          change({ ...filters, favorites: !filters.favorites }),
        )}
      </fieldset>
      <Button variant="secondary" disabled={count === 0} onClick={() => change(NO_FILTERS)}>
        {t('resources.clear')}
      </Button>
    </div>
  );

  return (
    <section className={styles.sidebar} aria-label={t('filters.label')}>
      <details className={styles.mobile}>
        <summary className={styles.summary}>{t('filters.title', { n: count })}</summary>
        {body}
      </details>
      <div className={styles.desktop}>
        <h2 className={styles.heading}>{t('filters.label')}</h2>
        {body}
      </div>
    </section>
  );
}
