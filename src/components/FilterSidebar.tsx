import { useId, useState } from 'react';
import { THEMES } from '../content/themes';
import type { ResourceType, ThemeSlug } from '../content/types';
import { Icon } from './Icon';
import styles from './FilterSidebar.module.css';

export interface Filters {
  themes: ThemeSlug[];
  types: ResourceType[];
  forTeachers: boolean;
}

export const countFilters = (f: Filters) => f.themes.length + f.types.length + (f.forTeachers ? 1 : 0);

const TYPE_OPTIONS: { value: ResourceType; label: string }[] = [
  { value: 'lesson-plan', label: 'Lesson plans' },
  { value: 'test', label: 'Test your knowledge' },
  { value: 'extra', label: 'Extra resources' },
  { value: 'module', label: 'Module downloads' },
];

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/**
 * Resource filters (DESIGN.md §4.8, §8.5 #26): multi-select checkboxes drawn as the
 * Figma circles. Collapses into a disclosure below 1024px.
 */
export function FilterSidebar({ filters, onChange }: { filters: Filters; onChange: (next: Filters) => void }) {
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
          Themes
          <Icon name="caret" size={16} className={themesOpen ? styles.caretOpen : styles.caret} />
        </button>
        <fieldset id={themesId} className={styles.subGroup} hidden={!themesOpen}>
          <legend className="visually-hidden">Themes</legend>
          {THEMES.map((t) =>
            checkbox(t.slug, t.title, filters.themes.includes(t.slug), () => onChange({ ...filters, themes: toggle(filters.themes, t.slug) }), true),
          )}
        </fieldset>
      </div>
      <fieldset className={styles.fieldset}>
        <legend className="visually-hidden">Resource type</legend>
        {checkbox('for', 'For teachers', filters.forTeachers, () => onChange({ ...filters, forTeachers: !filters.forTeachers }))}
        {TYPE_OPTIONS.map((o) =>
          checkbox(o.value, o.label, filters.types.includes(o.value), () => onChange({ ...filters, types: toggle(filters.types, o.value) })),
        )}
      </fieldset>
      {count > 0 && (
        <button type="button" className={styles.clear} onClick={() => onChange({ themes: [], types: [], forTeachers: false })}>
          Clear filters
        </button>
      )}
    </div>
  );

  return (
    <section className={styles.sidebar} aria-label="Filters">
      <details className={styles.mobile}>
        <summary className={styles.summary}>Filters ({count})</summary>
        {body}
      </details>
      <div className={styles.desktop}>
        <h2 className={styles.heading}>Filters ({count})</h2>
        {body}
      </div>
    </section>
  );
}
