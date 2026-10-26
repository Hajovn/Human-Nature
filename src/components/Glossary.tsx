import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import type { Element, ElementContent, Root, Text } from 'hast';
import type { ExtraProps } from 'react-markdown';
import { useThemes } from '../content/useContent';
import { stripLocale } from '../i18n/locale';
import styles from './Glossary.module.css';

// Glossary words in running text (DESIGN.md §4.16). The words come from each theme's
// "Hard words, simple meanings" list. In text written in the CMS, the first time a word
// appears on a page it is shown in bold; hovering, focusing or tapping it shows the meaning.

interface Entry {
  term: string;
  meaning: string;
  pattern: RegExp;
}

interface GlossaryState {
  entries: Entry[];
  /** Claim a word for one text block; only the first block on the page gets it. */
  claim: (term: string, owner: string) => boolean;
}

const GlossaryContext = createContext<GlossaryState | null>(null);

const LEGAL_PAGES = ['/privacy', '/terms'];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Whole words only, any capitals, with an optional English plural ("gas" → "gases"). */
const patternFor = (term: string) =>
  new RegExp(`(?<![\\p{L}\\p{N}])${escape(term.trim()).replace(/\s+/g, '\\s+')}(?:e?s)?(?![\\p{L}\\p{N}])`, 'iu');

export function GlossaryProvider({ children }: { children: ReactNode }) {
  const themes = useThemes();
  const { pathname } = useLocation();
  const entries = useMemo(() => {
    const seen = new Set<string>();
    const list: Entry[] = [];
    for (const theme of themes) {
      for (const { term, meaning } of theme.glossary ?? []) {
        const key = term?.trim().toLowerCase();
        if (!key || !meaning?.trim() || seen.has(key)) continue;
        seen.add(key);
        list.push({ term: term!.trim(), meaning: meaning.trim(), pattern: patternFor(term!) });
      }
    }
    // Longer terms first, so "greenhouse gas" wins over "gas".
    return list.sort((a, b) => b.term.length - a.term.length);
  }, [themes]);

  // A fresh register for every page. Claims are keyed by the text block, so rendering a
  // block twice (React strict mode) gives the same answer.
  // Not on the legal pages, where explanations would be out of place.
  const off = LEGAL_PAGES.includes(stripLocale(pathname));
  const value = useMemo<GlossaryState>(() => {
    const owners = new Map<string, string>();
    return {
      entries: off ? [] : entries,
      claim: (term, owner) => {
        const current = owners.get(term);
        if (current === undefined) owners.set(term, owner);
        return current === undefined || current === owner;
      },
    };
    // pathname: start counting again on every page.
  }, [entries, off, pathname]);

  return <GlossaryContext.Provider value={value}>{children}</GlossaryContext.Provider>;
}

/**
 * For one Markdown text block: the glossary entries to mark in it, as a rehype plugin, and
 * the matching `span` renderer for react-markdown.
 */
export function useGlossaryMarkup(source: string | undefined) {
  const glossary = useContext(GlossaryContext);
  const owner = useId();
  const entries = glossary && source ? glossary.entries.filter((e) => e.pattern.test(source) && glossary.claim(e.term, owner)) : [];
  const byTerm = new Map(entries.map((e) => [e.term, e]));
  return {
    rehypePlugin: () => (tree: Root) => markFirst(tree, entries),
    renderSpan: ({ node: _node, ...props }: ComponentPropsWithoutRef<'span'> & ExtraProps) => {
      const entry = byTerm.get(String((props as Record<string, unknown>)['data-glossary-term'] ?? ''));
      if (!entry) return <span {...props} />;
      return (
        <GlossaryTerm term={entry.term} meaning={entry.meaning}>
          {props.children}
        </GlossaryTerm>
      );
    },
  };
}

const SKIP = new Set(['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'pre', 'button']);

/** Wrap the first occurrence of each entry in a `<span data-glossary-term>`. */
function markFirst(tree: Root, entries: Entry[]) {
  const remaining = [...entries];
  const visit = (parent: Root | Element) => {
    for (let i = 0; i < parent.children.length && remaining.length; i++) {
      const child = parent.children[i];
      if (child.type === 'element') {
        if (!SKIP.has(child.tagName)) visit(child);
        continue;
      }
      if (child.type !== 'text') continue;
      // The earliest match of any remaining entry in this piece of text.
      let best: { entry: Entry; index: number; length: number } | null = null;
      for (const entry of remaining) {
        const m = entry.pattern.exec(child.value);
        if (m && (!best || m.index < best.index)) best = { entry, index: m.index, length: m[0].length };
      }
      if (!best) continue;
      const { value } = child as Text;
      const pieces: ElementContent[] = [];
      if (best.index > 0) pieces.push({ type: 'text', value: value.slice(0, best.index) });
      pieces.push({
        type: 'element',
        tagName: 'span',
        properties: { dataGlossaryTerm: best.entry.term },
        children: [{ type: 'text', value: value.slice(best.index, best.index + best.length) }],
      });
      const rest = value.slice(best.index + best.length);
      if (rest) pieces.push({ type: 'text', value: rest });
      parent.children.splice(i, 1, ...(pieces as typeof parent.children));
      remaining.splice(remaining.indexOf(best.entry), 1);
      // Continue with the text after the marked word.
      i += best.index > 0 ? 1 : 0;
    }
  };
  visit(tree);
}

/** A bold glossary word with its meaning in a tooltip (hover, keyboard focus or tap). */
export function GlossaryTerm({ term, meaning, children }: { term: string; meaning: string; children: ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const [placement, setPlacement] = useState<{ shift: number; below: boolean }>({ shift: 0, below: false });

  // Close on Escape and on a tap elsewhere.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  // Keep the tooltip on screen: shift it sideways, and show it below the word when there
  // is no room above (e.g. under the top bar).
  useLayoutEffect(() => {
    if (!open || !tipRef.current || !wrapRef.current) return;
    const margin = 12;
    const tip = tipRef.current.getBoundingClientRect();
    const word = wrapRef.current.getBoundingClientRect();
    const center = word.left + word.width / 2;
    const left = center - tip.width / 2;
    const shift =
      left < margin ? margin - left : left + tip.width > window.innerWidth - margin ? window.innerWidth - margin - (left + tip.width) : 0;
    setPlacement({ shift, below: word.top - tip.height - 8 < 96 });
  }, [open]);

  const onPointerEnter = (e: ReactPointerEvent) => e.pointerType === 'mouse' && setOpen(true);
  const onPointerLeave = (e: ReactPointerEvent) => e.pointerType === 'mouse' && setOpen(false);

  return (
    <span ref={wrapRef} className={styles.wrap} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      <button
        type="button"
        className={styles.term}
        aria-describedby={id}
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </button>
      <span
        ref={tipRef}
        id={id}
        role="tooltip"
        className={`${styles.tip} ${placement.below ? styles.below : ''}`}
        style={{ '--tip-shift': `${placement.shift}px` } as CSSProperties}
        hidden={!open}
      >
        <strong>{term}:</strong> {meaning}
      </span>
    </span>
  );
}
