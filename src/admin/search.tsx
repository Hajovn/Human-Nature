// "Find content" panel for the content editor (docs/CMS.md, "Finding text"). Searches the
// text of every page, theme, resource and setting, in both languages, and opens the entry
// in the editor. Decap's own search only looks at titles.
//
// The index is the published content at the time the editor was built (every publish
// rebuilds it within a few minutes). Unpublished drafts are not included.
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import type { CmsCollection, CmsField } from 'decap-cms-core';
import { cmsConfig } from './config';
import styles from './search.module.css';

const files = import.meta.glob<Record<string, unknown>>('/content/**/*.json', { eager: true, import: 'default' });

const LANGUAGES: Record<string, string> = { en: 'English', id: 'Indonesian' };
const MAX_RESULTS = 50;

interface Hit {
  collection: string;
  entry: string;
  entryLabel: string;
  collectionLabel: string;
  language: string;
  fieldLabel: string;
  text: string;
}

/** Lower-case and drop accents, so "eko" also finds "Éko". */
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Values that are file paths or addresses, not text an editor reads. */
const isTechnical = (s: string) => /^(\/(uploads|downloads)\/|https?:\/\/|#)/.test(s.trim());

type Field = CmsField & { fields?: Field[]; field?: Field; types?: Field[]; typeKey?: string; label_singular?: string };

function collectionOf(path: string) {
  // "/content/themes/climate.json" → collection "themes", entry "climate"
  const [, , folder, name] = path.split('/');
  const entry = name.replace(/\.json$/, '');
  const collection = (cmsConfig.collections as CmsCollection[]).find(
    (c) => c.folder === `content/${folder}` || c.files?.some((f) => f.file === `content${path.slice(8)}`),
  );
  const file = collection?.files?.find((f) => f.file === `content${path.slice(8)}`);
  return {
    collection: collection?.name ?? folder,
    collectionLabel: collection?.label ?? folder,
    entry: file?.name ?? entry,
    fileLabel: file?.label,
    fields: ((file?.fields ?? collection?.fields) as Field[] | undefined) ?? [],
  };
}

/** Walk one language's data, with the CMS field definitions alongside for readable labels. */
function walk(value: unknown, fields: Field[] | undefined, labels: string[], out: { label: string; text: string }[]) {
  if (typeof value === 'string') {
    if (value.trim() && !isTechnical(value)) out.push({ label: labels.join(' › '), text: value });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      // A list of typed blocks: find the block type's own fields.
      const typeName = item && typeof item === 'object' ? (item as Record<string, unknown>).type : undefined;
      const blockType = fields?.find((f) => f.name === typeName);
      const label = blockType ? `${i + 1}. ${blockType.label ?? blockType.name}` : `${i + 1}`;
      walk(item, blockType?.fields ?? fields, [...labels, label], out);
    });
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (key === 'type') continue;
      const field = fields?.find((f) => f.name === key);
      const next = field?.types ?? field?.fields ?? (field?.field ? [field.field] : undefined);
      walk(child, next, [...labels, field?.label ?? key], out);
    }
  }
}

function buildIndex(): Hit[] {
  const hits: Hit[] = [];
  for (const [path, data] of Object.entries(files)) {
    const { collection, collectionLabel, entry, fileLabel, fields } = collectionOf(path);
    for (const [language, content] of Object.entries(data ?? {})) {
      const title = (content as Record<string, unknown>)?.title;
      const entryLabel = fileLabel ?? (typeof title === 'string' && title ? title : entry);
      const texts: { label: string; text: string }[] = [];
      walk(content, fields, [], texts);
      for (const { label, text } of texts) {
        hits.push({ collection, collectionLabel, entry, entryLabel, language, fieldLabel: label, text });
      }
    }
  }
  return hits;
}

function isLoggedIn() {
  try {
    return window.localStorage.getItem('decap-cms-user') !== null;
  } catch {
    return true; // Storage blocked: show the button rather than hide it for good.
  }
}

/** Text around the first match, with the matched words marked. */
function Snippet({ text, words }: { text: string; words: string[] }) {
  const folded = fold(text);
  const first = Math.min(...words.map((w) => folded.indexOf(w)).filter((i) => i >= 0));
  const start = Math.max(0, first - 60);
  const end = Math.min(text.length, first + 140);
  const part = text.slice(start, end).replace(/\s+/g, ' ');
  const foldedPart = fold(part);
  const marks: [number, number][] = [];
  for (const w of words) {
    for (let i = foldedPart.indexOf(w); i >= 0; i = foldedPart.indexOf(w, i + w.length)) marks.push([i, i + w.length]);
  }
  marks.sort((a, b) => a[0] - b[0]);
  const pieces: ReactNode[] = [];
  let at = 0;
  marks.forEach(([from, to], n) => {
    if (from < at) return;
    pieces.push(part.slice(at, from), <mark key={n}>{part.slice(from, to)}</mark>);
    at = to;
  });
  pieces.push(part.slice(at));
  return (
    <span className={styles.snippet}>
      {start > 0 && '…'}
      {pieces}
      {end < text.length && '…'}
    </span>
  );
}

function SearchPanel() {
  const index = useMemo(buildIndex, []);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  const words = useMemo(() => fold(query).split(/\s+/).filter((w) => w.length > 1), [query]);
  const results = useMemo(() => {
    if (!words.length) return [];
    return index.filter((hit) => {
      const text = fold(hit.text);
      return words.every((w) => text.includes(w));
    });
  }, [index, words]);

  // Ctrl+Shift+F (Cmd+Shift+F on a Mac) opens the panel from anywhere in the editor.
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'f') {
        event.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Only offer the panel once someone is logged in to the editor (Decap stores the user).
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  useEffect(() => {
    const check = () => setLoggedIn(isLoggedIn());
    window.addEventListener('hashchange', check);
    window.addEventListener('storage', check);
    const timer = window.setInterval(check, 2000);
    return () => {
      window.removeEventListener('hashchange', check);
      window.removeEventListener('storage', check);
      window.clearInterval(timer);
    };
  }, []);
  if (!loggedIn) return null;

  function close() {
    setOpen(false);
    openerRef.current?.focus();
  }

  function onDialogKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') close();
  }

  function goTo(hit: Hit) {
    // Decap's editor uses hash routes; it asks first if there are unsaved changes.
    window.location.hash = `#/collections/${hit.collection}/entries/${hit.entry}`;
    setOpen(false);
  }

  return (
    <>
      <button ref={openerRef} type="button" className={styles.opener} onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Find content
      </button>
      {open && (
        <div className={styles.backdrop} onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="content-search-title"
            onKeyDown={onDialogKey}
          >
            <div className={styles.head}>
              <h2 id="content-search-title">Find content</h2>
              <button type="button" className={styles.close} onClick={close}>
                Close
              </button>
            </div>
            <label className={styles.label} htmlFor="content-search-input">
              Words to find, in English or Indonesian
            </label>
            <input
              ref={inputRef}
              id="content-search-input"
              className={styles.input}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. greenhouse, El Niño, tipping point"
              autoComplete="off"
            />
            <p className={styles.status} role="status">
              {!words.length
                ? 'Searches every page, theme, resource and setting. Shortcut: Ctrl+Shift+F.'
                : results.length === 0
                  ? 'Nothing found. Check the spelling, or try fewer words.'
                  : `${results.length} ${results.length === 1 ? 'place' : 'places'} found${results.length > MAX_RESULTS ? `; showing the first ${MAX_RESULTS}` : ''}.`}
            </p>
            {results.length > 0 && (
              <ul className={styles.results}>
                {results.slice(0, MAX_RESULTS).map((hit, i) => (
                  <li key={i}>
                    <a
                      className={styles.result}
                      href={`#/collections/${hit.collection}/entries/${hit.entry}`}
                      onClick={(e) => {
                        e.preventDefault();
                        goTo(hit);
                      }}
                    >
                      <span className={styles.where}>
                        <strong>{hit.entryLabel}</strong>
                        <span className={styles.meta}>
                          {hit.collectionLabel} · {LANGUAGES[hit.language] ?? hit.language}
                          {hit.fieldLabel && ` · ${hit.fieldLabel}`}
                        </span>
                      </span>
                      <Snippet text={hit.text} words={words} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <p className={styles.note}>
              Shows published content. In the editor, switch to the language shown to find the text.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/** Add the "Find content" button to the editor page. */
export function mountContentSearch() {
  const root = document.createElement('div');
  root.id = 'content-search';
  document.body.appendChild(root);
  createRoot(root).render(<SearchPanel />);
}
