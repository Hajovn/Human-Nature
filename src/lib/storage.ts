// Browser-only persistence for v1 (DESIGN.md §8.5: no backend). Values live in
// localStorage and stay in sync across components and tabs. Every access is guarded so
// the site still works when storage is blocked (private mode, disabled cookies).
import { useCallback, useSyncExternalStore } from 'react';

const PREFIX = 'human-nature:';
const CHANGE_EVENT = 'human-nature-storage';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage unavailable: the change lasts until reload, which is acceptable for v1.
  }
  memory.set(key, value);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: key }));
}

// Snapshot cache so useSyncExternalStore gets a stable reference between changes.
const memory = new Map<string, unknown>();

function subscribe(callback: () => void) {
  const onChange = (event: Event) => {
    if (event instanceof StorageEvent && event.key?.startsWith(PREFIX)) {
      memory.delete(event.key.slice(PREFIX.length));
    }
    callback();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

export function useStoredState<T>(key: string, fallback: T): [T, (next: T | ((prev: T) => T)) => void] {
  const getSnapshot = () => {
    if (!memory.has(key)) memory.set(key, read(key, fallback));
    return memory.get(key) as T;
  };
  const value = useSyncExternalStore(subscribe, getSnapshot, () => fallback);
  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = (memory.has(key) ? memory.get(key) : read(key, fallback)) as T;
      write(key, typeof next === 'function' ? (next as (p: T) => T)(prev) : next);
    },
    // fallback is a literal at every call site; key alone identifies the value.
    [key],
  );
  return [value, setValue];
}

/* ── Saved (starred) resources, §8.5 #23 ─────────────────────── */

export function useSavedResources() {
  const [saved, setSaved] = useStoredState<string[]>('saved', []);
  const toggle = useCallback(
    (slug: string) =>
      setSaved((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug])),
    [setSaved],
  );
  return { saved, isSaved: (slug: string) => saved.includes(slug), toggle };
}

/* ── Progress and learner level, §8.5 #24 ─────────────────────── */

export interface Progress {
  themesVisited: string[];
  modulesOpened: string[];
  testsAttempted: string[];
  testsFinished: string[];
}

const EMPTY_PROGRESS: Progress = { themesVisited: [], modulesOpened: [], testsAttempted: [], testsFinished: [] };

export function useProgress() {
  const [progress, setProgress] = useStoredState<Progress>('progress', EMPTY_PROGRESS);
  const record = useCallback(
    (field: keyof Progress, id: string) =>
      setProgress((prev) => (prev[field].includes(id) ? prev : { ...prev, [field]: [...prev[field], id] })),
    [setProgress],
  );
  return { progress, record };
}

// Level names come from the level graphic in Figma. The point thresholds are
// PLACEHOLDERS until the team decides them (DESIGN.md §8.5 #24: thresholds = Owner).
export const LEVELS = [
  { name: 'Climate Beginner', minPoints: 0 },
  { name: 'Climate Curious', minPoints: 2 },
  { name: 'Climate Enthusiast', minPoints: 5 },
  { name: 'Climate Scholar', minPoints: 9 },
  { name: 'Climate Visionary', minPoints: 14 },
  { name: 'Climate Expert', minPoints: 20 },
] as const;

export function levelFor(progress: Progress) {
  const points =
    progress.themesVisited.length +
    progress.modulesOpened.length +
    progress.testsAttempted.length +
    2 * progress.testsFinished.length;
  let index = 0;
  LEVELS.forEach((level, i) => {
    if (points >= level.minPoints) index = i;
  });
  return { index, name: LEVELS[index].name, points };
}

/* ── Resource feedback (thumbs), §4.11 ───────────────────────── */

export type Vote = 'up' | 'down';

export function useFeedback(id: string) {
  const [all, setAll] = useStoredState<Record<string, Vote>>('feedback', {});
  const vote = all[id];
  const setVote = useCallback(
    (next: Vote) =>
      setAll((prev) => {
        const copy = { ...prev };
        if (copy[id] === next) delete copy[id];
        else copy[id] = next;
        return copy;
      }),
    [id, setAll],
  );
  return { vote, setVote };
}

/* ── Mock account, §8.5 #25 (UI only, no real authentication) ─ */

export interface MockUser {
  name: string;
  email: string;
}

export function useMockUser() {
  const [user, setUser] = useStoredState<MockUser | null>('user', null);
  return {
    user,
    logIn: (identifier: string) => {
      const name = identifier.includes('@') ? identifier.split('@')[0] : identifier;
      setUser({ name: name.charAt(0).toUpperCase() + name.slice(1), email: identifier.includes('@') ? identifier : '' });
    },
    logOut: () => setUser(null),
  };
}

export function clearAllStoredData() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // ignore
  }
  memory.clear();
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}
