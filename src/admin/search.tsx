// "Find on this page" panel for the content editor (docs/CMS.md, "Finding text"). While a
// page, theme or resource is open, it searches the fields of the editor on the left (also
// inside collapsed items, and in both languages when both are shown) and jumps to the
// matching field: it expands the collapsed items around it, scrolls to it, selects the text
// and briefly outlines the field.
//
// It reads the editor's own form fields, so it always sees the current text, including
// unsaved changes.
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import styles from './search.module.css';

const MAX_RESULTS = 100;
const FIELD_SELECTOR = 'input[type="text"], input:not([type]), textarea, [contenteditable="true"]';
const FLASH_CLASS = 'hn-search-flash';

interface Hit {
  element: HTMLElement;
  text: string;
  label: string;
  language: string | null;
}

/** Lower-case and drop accents, so "nino" also finds "Niño". */
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Fold character by character, remembering where each folded character came from. */
function foldWithMap(s: string) {
  let folded = '';
  const map: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const f = fold(s[i]);
    folded += f;
    for (let k = 0; k < f.length; k++) map.push(i);
  }
  return { folded, map };
}

/** Start and end (in the original text) of the match: the whole phrase if it appears as
 * typed, otherwise the first word. */
function matchRange(text: string, words: string[]): [number, number] | null {
  const { folded, map } = foldWithMap(text);
  for (const needle of [words.join(' '), words[0]]) {
    const at = folded.indexOf(needle);
    if (at >= 0) return [map[at], map[at + needle.length - 1] + 1];
  }
  return null;
}

const isEditorRoute = () => /^#\/collections\/[^/]+\/(entries\/.+|new)/.test(window.location.hash);

function isLoggedIn() {
  try {
    return window.localStorage.getItem('decap-cms-user') !== null;
  } catch {
    return true; // Storage blocked: show the button rather than hide it for good.
  }
}

function valueOf(element: HTMLElement) {
  return element.isContentEditable ? element.innerText : (element as HTMLInputElement).value;
}

/** The field's label, plus the labels of the items it sits in (e.g. "Sections › Text"). */
function labelOf(element: HTMLElement) {
  const clean = (s: string | null | undefined) => (s ?? '').replace(/\s*\(optional\)/gi, '').trim();
  // Text fields are tied to their own label by id; rich-text fields are not.
  const own = element.id ? clean(document.querySelector(`label[for="${CSS.escape(element.id)}"]`)?.textContent) : '';
  const parts: string[] = own ? [own] : [];
  for (let node = element.parentElement; node && !node.matches('[class*="ControlPaneContainer"]'); node = node.parentElement) {
    // Decap puts each field's label directly inside the field's wrapper.
    const text = clean(node.querySelector(':scope > label')?.textContent);
    if (text && !parts.includes(text)) parts.unshift(text);
  }
  return parts.slice(-3).join(' › ');
}

/** "EN" or "ID": the language of the editor column the field is in ("Writing in EN"). */
function languageOf(element: HTMLElement): string | null {
  const pane = element.closest('[class*="ControlPaneContainer"]');
  const button = pane?.querySelector('[class*="LocaleButtonWrapper"]');
  return button?.textContent?.match(/Writing in ([A-Z]{2})/)?.[1] ?? null;
}

/** All editor fields whose text contains every word. */
function findHits(words: string[]): Hit[] {
  if (!words.length) return [];
  const hits: Hit[] = [];
  for (const element of document.querySelectorAll<HTMLElement>(FIELD_SELECTOR)) {
    if (element.closest('#content-search')) continue;
    const text = valueOf(element);
    if (!text?.trim()) continue;
    const folded = fold(text);
    if (!words.every((w) => folded.includes(w))) continue;
    hits.push({ element, text, label: labelOf(element), language: languageOf(element) });
  }
  return hits;
}

/** Open every collapsed list and list item around the field, so it can be seen. */
async function reveal(element: HTMLElement) {
  const pane = element.closest('[class*="ControlPaneContainer"]') ?? document;
  for (let round = 0; round < 20 && element.offsetParent === null; round++) {
    // Decap's "Expand" buttons sit in the header of a list or list item. Open the first
    // (outermost) one whose list or item holds the field, then look again.
    const toggle = [...pane.querySelectorAll<HTMLElement>('[data-testid="expand-button"][aria-label="Expand"]')].find(
      (button) => button.closest('[class*="ListItem"], [class*="ControlContainer"]')?.contains(element),
    );
    if (!toggle) break;
    toggle.click();
    await new Promise((r) => setTimeout(r, 60));
  }
}

/** Select the matching text inside the field. */
function selectMatch(element: HTMLElement, text: string, words: string[]) {
  const range = matchRange(text, words);
  if (!range) return;
  if (!element.isContentEditable) {
    (element as HTMLInputElement).setSelectionRange(range[0], range[1]);
    return;
  }
  // Rich text: walk the text nodes to find the same characters.
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let offset = 0;
  const domRange = document.createRange();
  let started = false;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const length = node.textContent?.length ?? 0;
    if (!started && range[0] < offset + length) {
      domRange.setStart(node, range[0] - offset);
      started = true;
    }
    if (started && range[1] <= offset + length) {
      domRange.setEnd(node, range[1] - offset);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(domRange);
      return;
    }
    offset += length;
  }
}

async function jumpTo(hit: Hit, words: string[]) {
  await reveal(hit.element);
  hit.element.focus({ preventScroll: true });
  selectMatch(hit.element, hit.text, words);
  // Scroll last: focusing and selecting can move the page themselves.
  await new Promise((r) => setTimeout(r, 50));
  hit.element.scrollIntoView({ block: 'center' });
  const box = hit.element.closest<HTMLElement>('[class*="ControlContainer"]') ?? hit.element;
  box.classList.add(FLASH_CLASS);
  setTimeout(() => box.classList.remove(FLASH_CLASS), 2000);
}

/** Text around the match, with the words marked. */
function Snippet({ text, words }: { text: string; words: string[] }) {
  const flat = text.replace(/\s+/g, ' ');
  const range = matchRange(flat, words) ?? [0, 0];
  const start = Math.max(0, range[0] - 50);
  const end = Math.min(flat.length, range[0] + 110);
  const part = flat.slice(start, end);
  const { folded, map } = foldWithMap(part);
  const marks: [number, number][] = [];
  for (const w of words) {
    for (let i = folded.indexOf(w); i >= 0; i = folded.indexOf(w, i + w.length)) {
      marks.push([map[i], map[i + w.length - 1] + 1]);
    }
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
      {end < flat.length && '…'}
    </span>
  );
}

function SearchPanel() {
  const [available, setAvailable] = useState(() => isLoggedIn() && isEditorRoute());
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [current, setCurrent] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const words = fold(query).split(/\s+/).filter((w) => w.length > 0);
  const wordsKey = words.join(' ');

  // Only on an open page/theme/resource, and only when logged in.
  useEffect(() => {
    const check = () => {
      const now = isLoggedIn() && isEditorRoute();
      setAvailable(now);
      if (!now) setOpen(false);
    };
    window.addEventListener('hashchange', check);
    const timer = window.setInterval(check, 2000);
    return () => {
      window.removeEventListener('hashchange', check);
      window.clearInterval(timer);
    };
  }, []);

  // Search again when the words change, and when the text in the editor changes.
  const refresh = useCallback(() => {
    setHits(findHits(wordsKey ? wordsKey.split(' ') : []));
  }, [wordsKey]);
  useEffect(() => {
    if (!open) return;
    refresh();
    setCurrent(-1);
    const onEdit = (event: Event) => {
      if (!(event.target as HTMLElement).closest?.('#content-search')) refresh();
    };
    document.addEventListener('input', onEdit, true);
    return () => document.removeEventListener('input', onEdit, true);
  }, [open, refresh]);

  // Ctrl+Shift+F (Cmd+Shift+F on a Mac) opens the panel.
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'f' && isEditorRoute()) {
        event.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.select(), 0);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!available) return null;

  function close() {
    setOpen(false);
    openerRef.current?.focus();
  }

  function go(index: number) {
    if (!hits.length) return;
    const next = (index + hits.length) % hits.length;
    setCurrent(next);
    void jumpTo(hits[next], words);
  }

  function onInputKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      go(event.shiftKey ? current - 1 : current + 1);
    }
  }

  function onPanelKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') close();
  }

  return (
    <>
      <style>{`.${FLASH_CLASS} { outline: 3px solid #ffb800 !important; outline-offset: 4px; border-radius: 4px; }`}</style>
      {!open && (
        <button ref={openerRef} type="button" className={styles.opener} onClick={() => setOpen(true)}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Find on this page
        </button>
      )}
      {open && (
        <div className={styles.panel} role="dialog" aria-labelledby="content-search-title" onKeyDown={onPanelKey}>
          <div className={styles.head}>
            <h2 id="content-search-title">Find on this page</h2>
            <button type="button" className={styles.close} onClick={close}>
              Close
            </button>
          </div>
          <div className={styles.searchRow}>
            <label className={styles.hidden} htmlFor="content-search-input">
              Words to find
            </label>
            <input
              ref={inputRef}
              id="content-search-input"
              className={styles.input}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKey}
              placeholder="Words to find"
              autoComplete="off"
            />
            <button type="button" className={styles.step} onClick={() => go(current - 1)} disabled={!hits.length}>
              <span aria-hidden="true">↑</span>
              <span className={styles.hidden}>Previous</span>
            </button>
            <button type="button" className={styles.step} onClick={() => go(current + 1)} disabled={!hits.length}>
              <span aria-hidden="true">↓</span>
              <span className={styles.hidden}>Next</span>
            </button>
          </div>
          <p className={styles.status} role="status">
            {!words.length
              ? 'Searches the fields of this page, also inside collapsed items. Enter jumps to the next match.'
              : hits.length === 0
                ? 'Not on this page. Check the spelling, or try fewer words.'
                : `${current >= 0 ? `${current + 1} of ` : ''}${hits.length} ${hits.length === 1 ? 'field' : 'fields'}`}
          </p>
          {hits.length > 0 && (
            <ul className={styles.results}>
              {hits.slice(0, MAX_RESULTS).map((hit, i) => (
                <li key={i}>
                  <button
                    type="button"
                    className={`${styles.result} ${i === current ? styles.current : ''}`}
                    aria-current={i === current ? 'true' : undefined}
                    onClick={() => go(i)}
                  >
                    <span className={styles.meta}>
                      {hit.language && <span className={styles.lang}>{hit.language}</span>}
                      {hit.label || 'Field'}
                    </span>
                    <Snippet text={hit.text} words={words} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

/** Add the "Find on this page" button to the editor. */
export function mountContentSearch() {
  const root = document.createElement('div');
  root.id = 'content-search';
  document.body.appendChild(root);
  createRoot(root).render(<SearchPanel />);
}
