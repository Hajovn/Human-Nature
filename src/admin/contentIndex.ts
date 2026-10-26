// Index of all published text for the "Find text" panel (search.tsx): every text field of
// every content file, with the field's name as the editor shows it (taken from the CMS
// config) and the editor address of the page it is on. Built from the content files the
// admin was built with, so it holds the published website, not unpublished drafts.
import type { CmsCollection, CmsField } from 'decap-cms-core';
import { cmsConfig, RESOURCE_COLLECTIONS, type ResourceType } from './config';

const files = import.meta.glob<Record<string, Record<string, unknown>>>('/content/**/*.json', {
  eager: true,
  import: 'default',
});

/** One page in the editor: a theme, a resource or one of the other pages. */
export interface Place {
  /** Editor address, e.g. "#/collections/themes/entries/climate". */
  route: string;
  /** e.g. "Theme" or "Lesson plan". */
  kind: string;
  title: string;
}

export interface IndexedText {
  place: Place;
  language: string;
  label: string;
  text: string;
}

/** Field types whose text is shown on the website. */
const TEXT_WIDGETS = new Set(['string', 'text', 'markdown', 'list', 'object']);
/** Text fields that hold addresses, not text people read. */
const SKIP_FIELDS = new Set(['id', 'url', 'link', 'teacherFile']);

type Field = CmsField & { fields?: Field[]; types?: Field[]; label_singular?: string };
type Collection = CmsCollection & { files?: { name: string; label: string; fields: Field[] }[] };

const collections = cmsConfig.collections as Collection[];
const clean = (label: string | undefined) => (label ?? '').replace(/\s*\(optional\)/gi, '').trim();

/** The name of a list item as the editor shows it, e.g. a section's or step's title. */
function itemName(item: unknown): string | null {
  if (!item || typeof item !== 'object') return null;
  const o = item as Record<string, unknown>;
  const name = [o.title, o.term, o.name, o.question, o.label].find((v) => typeof v === 'string' && v.trim());
  if (!name) return null;
  const s = (name as string).trim();
  return s.length > 40 ? `${s.slice(0, 39)}…` : s;
}

function collect(value: unknown, fields: Field[], path: string[], out: (label: string, text: string) => void) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return;
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    const field = fields.find((f) => f.name === key);
    if (!field || SKIP_FIELDS.has(key) || !TEXT_WIDGETS.has(field.widget ?? 'string')) continue;
    const here = [...path, clean(field.label)];
    if (typeof child === 'string') {
      out(here.join(' › '), child);
    } else if (Array.isArray(child)) {
      child.forEach((item, i) => {
        if (typeof item === 'string') {
          out(here.join(' › '), item);
        } else if (field.types) {
          const type = field.types.find((t) => t.name === (item as { type?: string })?.type);
          if (type) collect(item, type.fields ?? [], [...here, clean(type.label)], out);
        } else if (field.fields) {
          const name = itemName(item) ?? `${clean(field.label_singular) || 'item'} ${i + 1}`;
          collect(item, field.fields, [...here, name], out);
        }
      });
    } else if (field.fields) {
      collect(child, field.fields, here, out);
    }
  }
}

/** Which editor page a content file belongs to, and that page's fields. */
function placeOf(path: string, data: Record<string, Record<string, unknown>>): { place: Place; fields: Field[] } | null {
  const [, , folder, file] = path.split('/');
  const slug = file.replace(/\.json$/, '');
  const en = data.en ?? {};
  let name = folder;
  if (folder === 'resources') name = RESOURCE_COLLECTIONS[en.type as ResourceType] ?? '';
  const collection = collections.find((c) => c.name === name);
  if (!collection) return null;
  const route = `#/collections/${collection.name}/entries/${slug}`;
  if (collection.files) {
    const entry = collection.files.find((f) => f.name === slug);
    if (!entry) return null;
    return { place: { route, kind: clean(collection.label_singular ?? collection.label), title: entry.label }, fields: entry.fields };
  }
  return {
    place: { route, kind: clean(collection.label_singular ?? collection.label), title: String(en.title ?? slug) },
    fields: collection.fields as Field[],
  };
}

/** Keep the start (e.g. the section) and the end (the field) of a long field path. */
function shorten(label: string) {
  const parts = label.split(' › ');
  return parts.length > 4 ? [parts[0], parts[1], '…', ...parts.slice(-2)].join(' › ') : label;
}

export const contentIndex: IndexedText[] = Object.entries(files).flatMap(([path, data]) => {
  const found = placeOf(path, data);
  if (!found) return [];
  const texts: IndexedText[] = [];
  for (const [language, content] of Object.entries(data)) {
    collect(content, found.fields, [], (label, text) => {
      if (text.trim()) texts.push({ place: found.place, language: language.toUpperCase(), label: shorten(label), text });
    });
  }
  return texts;
});

/** The editor page for a website address someone pasted, e.g. ".../en/themes/climate". */
export function placeForUrl(input: string): Place | null {
  const value = input.trim();
  // A full address, a path ("/themes/climate") or an address without "https://".
  const path = /^https?:\/\//i.test(value)
    ? value.replace(/^https?:\/\/[^/]+/i, '')
    : value.startsWith('/')
      ? value
      : /^[\w-]+(\.[\w-]+)+(:\d+)?(\/|$)/.test(value) || /^localhost(:\d+)?(\/|$)/.test(value)
        ? value.replace(/^[^/]+/, '')
        : null;
  if (path === null) return null;
  const parts = path.split(/[?#]/)[0].split('/').filter(Boolean);
  // Skip the language ("en") and any base folder before the page itself.
  const at = parts.findIndex((p) => ['themes', 'resources', 'mission', 'glossary', 'privacy', 'terms'].includes(p));
  const [page, slug] = at < 0 ? [] : parts.slice(at);
  const ending = !page
    ? '/pages/entries/home'
    : page === 'themes'
      ? `/themes/entries/${slug}`
      : page === 'resources'
        ? `/entries/${slug}`
        : `/pages/entries/${page}`;
  const isResource = (route: string) => !/\/(themes|pages|settings)\//.test(route);
  const match = contentIndex.find(
    (t) => t.place.route.endsWith(ending) && (page !== 'resources' || isResource(t.place.route)),
  );
  return (page === 'themes' || page === 'resources') && !slug ? null : (match?.place ?? null);
}
