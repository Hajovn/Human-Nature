// "Find text" panel for the content editor (docs/CMS.md, "Finding text"). It answers the
// editor's question "where do I change this?":
// - On the open page, it searches the editor's own fields (also inside collapsed items, and
//   in both languages), so it sees the current text, including unsaved changes. A result
//   jumps to the field: it expands the collapsed items around it, scrolls to it, selects the
//   text and briefly outlines the field.
// - Everywhere else, it searches the published text of every page (contentIndex.ts). A
//   result opens that page in the editor and then jumps to the field.
// - A pasted web address opens the editor for that page.
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { contentIndex, placeForUrl, type IndexedText, type Place } from './contentIndex';
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
  // Near the top, so the panel (bottom right) doesn't cover it.
  hit.element.style.scrollMarginTop = '160px';
  hit.element.scrollIntoView({ block: 'start' });
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

/** The editor address of the page that is open, e.g. "#/collections/themes/entries/climate". */
const openRoute = () => window.location.hash.match(/^#\/collections\/[^/]+\/entries\/[^/?]+/)?.[0] ?? null;

/** Published text elsewhere on the website (not on the open page). Pages whose title
 * matches come first, then pages with the most matches. */
function findElsewhere(words: string[], exclude: string | null): IndexedText[] {
  if (!words.length) return [];
  const has = (text: string) => words.every((w) => fold(text).includes(w));
  const found = contentIndex.filter((t) => t.place.route !== exclude && has(t.text));
  const score = new Map<string, number>();
  for (const t of found) {
    const base = score.get(t.place.route) ?? (has(t.place.title) ? 1000 : 0);
    score.set(t.place.route, base + 1);
  }
  return found.sort(
    (a, b) =>
      (score.get(b.place.route) ?? 0) - (score.get(a.place.route) ?? 0) || a.place.route.localeCompare(b.place.route),
  );
}

/** "Theme: Climate", or just the title when it already says what it is ("Lesson plan: …"). */
const placeName = (place: Place) =>
  fold(place.title).startsWith(fold(place.kind)) ? place.title : `${place.kind}: ${place.title}`;

/** After opening another page from the results: the words to jump to once it has loaded. */
let pendingJump: { words: string[]; language: string } | null = null;

function SearchPanel() {
  const [available, setAvailable] = useState(isLoggedIn);
  const [route, setRoute] = useState(openRoute);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [current, setCurrent] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const words = fold(query).split(/\s+/).filter((w) => w.length > 0);
  const wordsKey = words.join(' ');
  const onPage = route !== null && isEditorRoute();
  const page = placeForUrl(query);
  const elsewhere = page ? [] : findElsewhere(words, route);

  // On every screen once logged in. Follow the open page.
  useEffect(() => {
    const check = () => {
      setAvailable(isLoggedIn());
      setRoute(openRoute());
    };
    window.addEventListener('hashchange', check);
    const timer = window.setInterval(check, 2000);
    return () => {
      window.removeEventListener('hashchange', check);
      window.clearInterval(timer);
    };
  }, []);

  // Search again when the words or the open page change, and when the text in the editor changes.
  const refresh = useCallback(() => {
    setHits(isEditorRoute() ? findHits(wordsKey ? wordsKey.split(' ') : []) : []);
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
  }, [open, refresh, route]);

  // A page opened from the results: wait for its fields, then jump to the first match in the
  // same language.
  useEffect(() => {
    if (!pendingJump || !route) return;
    const { words: jumpWords, language } = pendingJump;
    let tries = 0;
    const timer = window.setInterval(() => {
      const found = findHits(jumpWords);
      if (found.length || ++tries > 40) {
        window.clearInterval(timer);
        pendingJump = null;
        setHits(found);
        const index = Math.max(0, found.findIndex((h) => h.language === language));
        if (found.length) {
          setCurrent(index);
          void jumpTo(found[index], jumpWords);
        }
      }
    }, 250);
    return () => window.clearInterval(timer);
  }, [route]);

  // Ctrl+Shift+F (Cmd+Shift+F on a Mac) opens the panel.
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'f' && isLoggedIn()) {
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

  function openPlace(target: Place, language?: string) {
    const show = () => {
      pendingJump = language ? { words, language } : null;
      setHits([]);
      setCurrent(-1);
      window.location.hash = target.route.slice(1);
    };
    // Go through the list the page is in. Straight from one open page to another, Decap shows
    // an empty form; from another list, it shows a "Failed to load preview" error. If someone
    // cancels Decap's "leave this page?" question, stay.
    const list = target.route.replace(/\/entries\/.*$/, '');
    if (window.location.hash === list) return show();
    window.location.hash = list.slice(1);
    // Wait until the editor has closed and the list has settled, or Decap shows an error.
    let tries = 0;
    const timer = window.setInterval(() => {
      const closed = !document.querySelector('[class*="ControlPaneContainer"]');
      if (window.location.hash !== list || tries++ > 30) return window.clearInterval(timer);
      if (closed && tries > 4) {
        window.clearInterval(timer);
        show();
      }
    }, 150);
  }

  function onInputKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (page) openPlace(page);
    else if (hits.length) go(event.shiftKey ? current - 1 : current + 1);
    else if (elsewhere.length) openPlace(elsewhere[0].place, elsewhere[0].language);
  }

  function onPanelKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') close();
  }

  const status = !words.length
    ? 'Type words you see on the website, or paste the address of a page. Capitals and accents don’t matter.'
    : page
      ? 'This is the address of a page on the website.'
      : !hits.length && !elsewhere.length
        ? 'Not found. Check the spelling, or try fewer words.'
        : [
            onPage && `${current >= 0 && hits.length ? `${current + 1} of ` : ''}${hits.length} on this page`,
            `${elsewhere.length} elsewhere`,
          ]
            .filter(Boolean)
            .join(' · ');

  return (
    <>
      <style>{`.${FLASH_CLASS} { outline: 3px solid #ffb800 !important; outline-offset: 4px; border-radius: 4px; }`}</style>
      {!open && (
        <button ref={openerRef} type="button" className={styles.opener} onClick={() => setOpen(true)}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Find text
        </button>
      )}
      {open && (
        <div className={styles.panel} role="dialog" aria-labelledby="content-search-title" onKeyDown={onPanelKey}>
          <div className={styles.head}>
            <h2 id="content-search-title">Find text</h2>
            <button type="button" className={styles.close} onClick={close}>
              Close
            </button>
          </div>
          <div className={styles.searchRow}>
            <label className={styles.hidden} htmlFor="content-search-input">
              Words or web address to find
            </label>
            <input
              ref={inputRef}
              id="content-search-input"
              className={styles.input}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKey}
              placeholder="Words or web address"
              autoComplete="off"
            />
            {onPage && (
              <>
                <button type="button" className={styles.step} onClick={() => go(current - 1)} disabled={!hits.length}>
                  <span aria-hidden="true">↑</span>
                  <span className={styles.hidden}>Previous on this page</span>
                </button>
                <button type="button" className={styles.step} onClick={() => go(current + 1)} disabled={!hits.length}>
                  <span aria-hidden="true">↓</span>
                  <span className={styles.hidden}>Next on this page</span>
                </button>
              </>
            )}
          </div>
          <p className={styles.status} role="status">
            {status}
          </p>
          {(page || hits.length > 0 || elsewhere.length > 0) && (
            <div className={styles.results}>
              {page && (
                <button type="button" className={styles.result} onClick={() => openPlace(page)}>
                  <span className={styles.meta}>{page.kind}</span>
                  <span className={styles.pageTitle}>Edit “{page.title}”</span>
                </button>
              )}
              {hits.length > 0 && (
                <>
                  <h3 className={styles.group}>On this page</h3>
                  <ul className={styles.list}>
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
                </>
              )}
              {elsewhere.length > 0 && (
                <>
                  <h3 className={styles.group}>{onPage ? 'On other pages' : 'Found on these pages'}</h3>
                  <ul className={styles.list}>
                    {elsewhere.slice(0, MAX_RESULTS).map((item, i) => (
                      <li key={i}>
                        <button type="button" className={styles.result} onClick={() => openPlace(item.place, item.language)}>
                          <span className={styles.pageTitle}>{placeName(item.place)}</span>
                          <span className={styles.meta}>
                            <span className={styles.lang}>{item.language}</span>
                            {item.label}
                          </span>
                          <Snippet text={item.text} words={words} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

/** Add the "Find text" button to the editor. */
export function mountContentSearch() {
  const root = document.createElement('div');
  root.id = 'content-search';
  document.body.appendChild(root);
  createRoot(root).render(<SearchPanel />);
}
