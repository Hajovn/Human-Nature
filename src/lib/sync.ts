// Keeps saved items and progress in the teacher's account (docs/SUPABASE-PLAN.md, Stage 6).
// The browser copy in storage.ts stays what the pages read; this module merges it with
// the account at log-in and forwards every later change.
import type { SupabaseClient } from '@supabase/supabase-js';
import { EMPTY_PROGRESS, getStored, setRemoteStore, setStored, type Progress } from './storage';
import { supabase } from './supabase';

const KINDS: Record<keyof Progress, string> = {
  themesVisited: 'theme_visited',
  modulesOpened: 'module_opened',
  testsAttempted: 'test_attempted',
  testsFinished: 'test_finished',
};
const FIELDS = Object.fromEntries(Object.entries(KINDS).map(([field, kind]) => [kind, field])) as Record<
  string,
  keyof Progress
>;

// Failures are only logged: the browser copy still works, and the next log-in or page
// load merges again.
const report = (what: string) => (result: { error: unknown }) => {
  if (result.error) console.warn(`Account sync: ${what} failed`, result.error);
};

/** Start syncing for a logged-in teacher: merge both copies, then forward changes. */
export async function startSync(client: SupabaseClient, userId: string) {
  setRemoteStore({
    setSaved(slug, saved) {
      const table = client.from('saved_resources');
      void (saved
        ? table.upsert({ user_id: userId, resource_slug: slug }, { ignoreDuplicates: true })
        : table.delete().eq('user_id', userId).eq('resource_slug', slug)
      ).then(report('saving'));
    },
    record(field, id) {
      void client
        .from('progress')
        .upsert({ user_id: userId, kind: KINDS[field], item_slug: id }, { ignoreDuplicates: true })
        .then(report('progress'));
    },
  });

  const [savedRows, progressRows] = await Promise.all([
    client.from('saved_resources').select('resource_slug'),
    client.from('progress').select('kind, item_slug'),
  ]);
  if (savedRows.error || progressRows.error) return report('loading')({ error: savedRows.error ?? progressRows.error });

  // Saved items: everything in either copy.
  const localSaved = getStored<string[]>('saved', []);
  const accountSaved = savedRows.data.map((r) => r.resource_slug as string);
  const toUpload = localSaved.filter((slug) => !accountSaved.includes(slug));
  setStored('saved', [...accountSaved, ...toUpload]);
  if (toUpload.length) {
    void client
      .from('saved_resources')
      .upsert(toUpload.map((slug) => ({ user_id: userId, resource_slug: slug })), { ignoreDuplicates: true })
      .then(report('uploading saved items'));
  }

  // Progress: everything in either copy.
  const local = getStored<Progress>('progress', EMPTY_PROGRESS);
  const merged: Progress = { themesVisited: [], modulesOpened: [], testsAttempted: [], testsFinished: [] };
  for (const row of progressRows.data) {
    const field = FIELDS[row.kind as string];
    if (field && !merged[field].includes(row.item_slug)) merged[field].push(row.item_slug);
  }
  const progressUpload: { user_id: string; kind: string; item_slug: string }[] = [];
  for (const field of Object.keys(KINDS) as (keyof Progress)[]) {
    for (const id of local[field] ?? []) {
      if (merged[field].includes(id)) continue;
      merged[field].push(id);
      progressUpload.push({ user_id: userId, kind: KINDS[field], item_slug: id });
    }
  }
  setStored('progress', merged);
  if (progressUpload.length) {
    void client.from('progress').upsert(progressUpload, { ignoreDuplicates: true }).then(report('uploading progress'));
  }
}

/**
 * Stop syncing at log-out and remove the teacher's saved items and progress from this
 * browser: classroom computers are often shared.
 */
export function stopSync() {
  setRemoteStore(null);
  setStored('saved', []);
  setStored('progress', EMPTY_PROGRESS);
}

/* ── Feedback votes (§4.11) ─────────────────────────────────── */

/** Random id for this browser, so a visitor's vote can be changed later. Not personal. */
function voterId() {
  let id = getStored<string | null>('voter-id', null);
  if (!id) {
    id = crypto.randomUUID();
    setStored('voter-id', id);
  }
  return id;
}

/** Send a vote (or its removal, with null) to the database, if accounts are set up. */
export function castVote(resource: string, vote: 'up' | 'down' | null) {
  if (!supabase) return;
  void supabase
    .rpc('cast_vote', { p_resource: resource, p_voter: voterId(), p_vote: vote })
    .then(report('feedback vote'));
}
