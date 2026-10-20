import { useId, useState } from 'react';
import type { ResourceType } from '../content/types';
import { useThemes } from '../content/useContent';
import { useT } from '../i18n/locale';
import type { StringKey } from '../i18n/strings';
import { Icon } from './Icon';
import styles from './FilterSidebar.module.css';

export interface Filters {
  themes: string[];
  types: ResourceType[];
  forTeachers: boolean;
}

export const countFilters = (f: Filters) => f.themes.length + f.types.length + (f.forTeachers ? 1 : 0);

const TYPE_OPTIONS: { value: ResourceType; label: StringKey }[] = [
  { value: 'lesson-plan', label: 'filters.lessonPlans' },
  { value: 'test', label: 'filters.tests' },
  { value: 'extra', label: 'filters.extra' },
  { value: 'module', label: 'filters.modules' },
];

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/**
 * Resource filters (DESIGN.md §4.8, §8.5 #26): multi-select checkboxes drawn as the
 * Figma circles. Collapses into a disclosure below 1024px.
 */
export function FilterSidebar({ filters, onChange }: { filters: Filters; onChange: (next: Filters) => void }) {
  const t = useT();
  const themes = useThemes();
  const [themesOpen, setThemesOpen] = useState(filters.themes.length > 0);
  const themesId = useId();
  const count = countFilters(filters);

  const checkbox = (key: string, label: string, checked: boolean, onToggle: () => void, small = false) => (
    <label key={key} className={`${styles.option} ${small ? styles.small : ''}`}>
      <input type="checkbox" className={styles.input} checked={checked} onChange={onToggle} />
      <span className={styles.circle} aria-hidden="true" />
      {label}
    </label>
  );

  const body = (
    <div className={styles.body}>
      <div className={styles.group}>
        <button
          type="button"
          className={styles.groupToggle}
          aria-expanded={themesOpen}
          aria-controls={themesId}
          onClick={() => setThemesOpen((o) => !o)}
        >
          <span className={`${styles.circle} ${filters.themes.length ? styles.circleOn : ''}`} aria-hidden="true" />
          {t('filters.themes')}
          <Icon name="caret" size={16} className={themesOpen ? styles.caretOpen : styles.caret} />
        </button>
        <fieldset id={themesId} className={styles.subGroup} hidden={!themesOpen}>
          <legend className="visually-hidden">{t('filters.themes')}</legend>
          {themes.map((theme) =>
            checkbox(
              theme.slug,
              theme.title ?? theme.slug,
              filters.themes.includes(theme.slug),
              () => onChange({ ...filters, themes: toggle(filters.themes, theme.slug) }),
              true,
            ),
          )}
        </fieldset>
      </div>
      <fieldset className={styles.fieldset}>
        <legend className="visually-hidden">{t('filters.type')}</legend>
        {checkbox('for', t('filters.forTeachers'), filters.forTeachers, () =>
          onChange({ ...filters, forTeachers: !filters.forTeachers }),
        )}
        {TYPE_OPTIONS.map((o) =>
          checkbox(o.value, t(o.label), filters.types.includes(o.value), () =>
            onChange({ ...filters, types: toggle(filters.types, o.value) }),
          ),
        )}
      </fieldset>
      {count > 0 && (
        <button type="button" className={styles.clear} onClick={() => onChange({ themes: [], types: [], forTeachers: false })}>
          {t('resources.clear')}
        </button>
      )}
    </div>
  );

  return (
    <section className={styles.sidebar} aria-label={t('filters.label')}>
      <details className={styles.mobile}>
        <summary className={styles.summary}>{t('filters.title', { n: count })}</summary>
        {body}
      </details>
      <div className={styles.desktop}>
        <h2 className={styles.heading}>{t('filters.title', { n: count })}</h2>
        {body}
      </div>
    </section>
  );
}
