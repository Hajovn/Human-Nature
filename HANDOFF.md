# HANDOFF — read this fully before any work

Generated: 2026-10-29 · Git HEAD: `e0e6808` on branch `figma-final-2026-10-29` (base `main` = `677b51b`)
For: the next developer (and their Claude Code session) taking over the Human Nature website.
To resume with Claude Code: run /handoff — it re-verifies this file against the current repo before proceeding.
Trust rule: `[V]` = verified against the repo during the handoff run. `[?]` = unverified memory — treat as a lead, re-check before relying on it.

Supersedes `HANDOFF_1.md` (2026-10-21). That file is out of date: it says English is the default language and log-in is a mock; both changed since.

## 1. Current goal

Human Nature is a bilingual (Indonesian/English) climate-education site for primary-school teachers on Lombok, built with the Indonesia Biru Foundation (IBF). The last piece of work brought the site in line with the **final Figma design** (2026-10-29) on branch `figma-final-2026-10-29`, with a pull request to `main`.
Done when:
- that PR is reviewed and merged;
- the team has worked through the open content points in `docs/FIGMA-CHANGES-2026-10-29.md` §5.

Read first: `CLAUDE.md` (rules), `DESIGN.md` (design source of truth), `docs/CMS.md` (how editors work).

## 2. Verified state — where the work ACTUALLY stands

- [V] **Branch and PR.** Branch `figma-final-2026-10-29` has one commit, `e0e6808` "Final Figma update of 2026-10-29", on top of `main` `677b51b`. A PR to `main` was opened from it.
- [V] **Two files are untracked on purpose:** `docs/TRANSLATE-PLAN.md` (a CMS translate-button plan, shelved) and `docs/report/` (the owner's study report). They are not part of the website.
- [V] **Typecheck and build pass** (`npx tsc -b`, `npx vite build`). There is no test or lint script. `npm run test:rls` checks Supabase row-level security against `.env.local`.
- [V] **Live sites answer 200:**
  - https://edukasi.indonesiabiru.id/ and `/admin/` (Vercel, `vercel.json`);
  - https://human-nature-lombok.github.io/Human-Nature/ (GitHub Pages, `.github/workflows/deploy.yml` on every push to `main`).
- [V] **Languages.** Indonesian is the default, at `/…`; English is at `/en/…` (`src/i18n/locale.tsx:8` `DEFAULT_LOCALE = 'id'`).
- [V] **CMS.** Decap at `/admin/`.
  - Repo `Human-Nature-Lombok/Human-Nature`, branch `main`.
  - Log-in worker `https://sveltia-cms-auth.humannature.workers.dev`.
  - Site URL `https://edukasi.indonesiabiru.id/`.
  - All three are set in `src/admin/settings.ts`.
- [V] **Teacher accounts are real (Supabase),** no longer a mock.
  - Code: `src/lib/auth.tsx` and `src/lib/supabase.ts`.
  - Migrations: `supabase/migrations/` (4 files, the last `20261027120000_profile_avatar.sql`).
  - Production keys (public by design) are in `.env.production`; `npm run dev` uses `.env.local`.
- [V] **What the Figma update changed:** `docs/FIGMA-CHANGES-2026-10-29.md` lists every item, the owner's decisions and what is still open (§5). The earlier update is in `docs/FIGMA-CHANGES.md`. Its groups A–C were never built until this branch.
- [?] **Ownership transfer** (`docs/OWNERSHIP-TRANSFER.md`). Stages 3–5 look done: the repo lives under `Human-Nature-Lombok` and the worker is in the new Cloudflare account (commits `677b51b`, `2d4a368`). Stages 6–9 (Vercel team, Figma file, removing old e-mails, final check) are not confirmed.
- [?] **Not tested** on this branch: the "Favorites" resource filter while logged in, and the CMS editing the new fields in a real Decap session.

### Test/build output (tail, from this handoff run)

```
tsc OK
✓ built in 7.05s
(the only other build output is Rolldown "Use of direct eval" warnings from Decap's dependencies, e.g. @iarna/toml; admin bundle only)
```

## 3. Decisions made & WHY

- **Stack:** React 19 + TypeScript + Vite, CSS Modules with tokens in `src/styles/tokens.css`, React Router. [V] `package.json`
- **Content** lives in `content/**/*.json` as `{ "en": {…}, "id": {…} }`, edited through Decap CMS. Decap was chosen for its live preview built from the real page components (`src/admin/previews.tsx`). [V]
- **CMS edits beat Figma** (owner, 2026-10-29). The team edits copy in the CMS, sometimes ahead of the design. A Figma change is applied only where the site still has the old design text, a `TODO`, or nothing; the rest is listed as "kept CMS edit". Don't overwrite team copy with Figma text. [V] `docs/FIGMA-CHANGES-2026-10-29.md` decision 1.
- **When a lesson's Resources card and its page differ** in grade or duration, the lesson page wins. Both use one field. [V] same doc, §4.1.
- **Slugs of existing resources never change.** Saved favourites and links use them. So `lesson-plan-climate-change.json` is the lesson now titled "Choosing with Care" (theme Human and Nature), and `lesson-plan-solutions-for-plastic.json` is "Plastic Waste Solutions". [V]
- **Unfinished Figma lessons were published anyway** (owner): "Adaptation and Mitigation" and "Nature Bingo" carry text copied from other lessons in Figma. [V] doc §2.4–2.5.
- **Indonesian** written by Claude is a **draft for native review**. The existing Indonesian was corrected by a native speaker: keep it where the English didn't change. [V] docs.
- **Hosting:** Vercel serves the subdomain; GitHub Pages also deploys from `main`. Vercel was chosen because IBF's main site and DNS sit with an agency (Next.js on Vercel, DNS in Cloudflare), so a subdomain is one record and keeps deploys independent. [?] `docs/VERCEL-PLAN.md`

## 4. Failed approaches / dead ends — DO NOT RETRY THESE

- **Asking the Figma MCP for the whole of Page 2 at once** (`get_metadata` on `188:394`) fails: the response is about 424 KB and breaks the transport ("Failed to parse SSE message"). Read it per frame or per section instead, with a read-only `use_figma` script. Also:
  - a `use_figma` return value must stay under **48,000 bytes**; split big dumps;
  - escapes like ` ` inside the script string become real line breaks and cause `SyntaxError: unexpected line terminator`. Build those characters with `String.fromCharCode(0x2028)`.

  [V] seen this session.
- **Figma renders masked shapes upside down.** The Theme 4 Mitigation/Adaptation images (boolean "Intersect" nodes `260:531`/`260:543`) came back from `get_design_context` rotated 180°, as a bowl instead of a dome. The fix is to rotate the render 180° (done; the sources are `design-assets/figma-2026-10-29/theme-4-solutions/*-upright.png`). Look at every exported masked image before using it. [V]
- **Don't run `npm run images` just to add a few images.** It re-encodes all ~150 files in `design-assets/raw/` and rewrites every `public/uploads/*.webp`, which gives a huge diff. Convert only the new files, with the same settings (`sharp`: WebP q80, width 1600, 2400 for names containing `-hero`, 600 for interface images). [V] `scripts/optimize-images.mjs`
- **Mission "Our product" photo** (`269:3616`) sits at x = 1320 in a 1440 px clipped frame, so almost none of it shows in the design. It was deliberately not added. Don't "fix" it without asking. [V]
- [?] Carried over from `HANDOFF_1.md`:
  - **Checking a deploy by grepping the bundle** for a string gave false positives (React contains many strings). Check the GitHub Actions run, or the Vercel deployment, instead.
  - **Building with `BASE_PATH=/x/` in Git Bash** gets mangled to `/Program Files/Git/x/`. Prefix the command with `MSYS_NO_PATHCONV=1`.
  - **Cloning into a deep Windows path** fails with "Filename too long". Clone to a short path.
  - **A "rubber-band" overscroll effect** was built and then removed at the owner's request (commit `20c72a8`). Don't re-add it.

## 5. Known traps in this codebase

- [V] **Adding or renaming a content field means three places at once:**
  - the type in `src/content/types.ts`;
  - the CMS field in `src/admin/config.ts`;
  - the existing `content/**/*.json` files.

  If the CMS lacks a field the JSON has, Decap may drop that value when an editor saves [?]. That's why this branch added `image`, `alt` and `duration` to the tests and `duration` to the teacher material.
- [V] **The Indonesian page falls back to English per file** unless that file's `id` title is filled (`src/content/load.ts:61-69`; `titleKey` can be a nested path such as `hero.title`).
- [V] **Interface text** (buttons, labels) lives in `src/i18n/strings.ts`, with both languages and typed keys. Internal links must use `Link` / `useLocalNavigate` from `src/i18n/locale.tsx` so visitors stay in their language.
- [V] **`TODO` placeholders are shown on the live site as is.** For example, the four lesson modules' card lines still read `TODO: one line about this module`. Search `content/` for `TODO` before calling content done.
- [V] **Lesson-plan cards hide the "Lesson plan:" prefix:**
  - `cardTitle()` in `src/components/cards.tsx:78` strips "Lesson plan: " / "Rencana pelajaran: ";
  - the detail page keeps the full title, which is shown in ink via `.inkHero` in `src/pages/ResourceDetailPage.module.css:25`.

  New lesson titles must keep the prefix in content.
- [V] **Level badges** are drawn in `LevelTrack` (`src/components/ui.tsx:323-333`). The Figma exports have example colours baked in, so an SVG filter keeps only the white icon and CSS paints the circle. There are 5 badges but 6 levels in code (`LEVELS` in `src/lib/storage.ts`); "Climate Expert" has no badge.
- [V] **Images:**
  - full-size sources go in `design-assets/raw/`;
  - content images are converted to `public/uploads/<name>.webp`; interface images (`avatar`, `level-*`) go to `src/assets/img/`;
  - JSON refers to `/uploads/<name>.webp`;
  - image sizes come from the `virtual:image-sizes` plugin in `vite.config.ts`.
- [V] **Everything in the repo is public.** Teacher-only files must go through Supabase Storage, not the CMS upload.
- [V] **Deep links return HTTP 404 on GitHub Pages but still work** (the 404.html SPA fallback). Check the page content, not the status code. Vercel rewrites to `index.html` instead.
- [?] **CMS edits arrive as PRs** from `cms/...` branches (editorial workflow). A code PR that touches the same JSON files can conflict with them; merge them in time order.
- [?] **Windows:**
  - commit with `git -c core.autocrlf=false` (`.gitattributes` enforces LF);
  - Controlled Folder Access once blocked writes in Documents.
- [?] **Local CMS:** run `npm run dev` + `npm run cms`, then open http://localhost:5173/admin/. The editorial workflow is off locally.

## 6. Next steps (ordered)

1. Review the PR from `figma-final-2026-10-29`, ideally in the Vercel preview: Resources, a new lesson plan, Theme 4, Our mission, Profile. Then merge it. Expect conflicts only if CMS PRs touched the same `content/` files meanwhile; keep the newer team text.
2. Work through `docs/FIGMA-CHANGES-2026-10-29.md` §5 with the team. Most items are content and can be done in the CMS:
   - the Indonesian impact number "150+" (EN is "100+");
   - the links of six extra resources;
   - download files for the five new lessons;
   - the lesson-module card lines (`TODO`);
   - alt texts of two news images;
   - native review of the Indonesian drafts.
3. Get decisions, then build: tags on extra-resource cards (needs a new field in three places, see §5); faded "Coming soon" cards; the sixth level with no badge; team portraits 107 px vs Figma 180 px (`src/components/cards.module.css:222`); the PDF thumbnail size.
4. Test the Favorites filter while logged in, and edit one new field (e.g. the mission photo strip) in the live CMS.
5. Finish the ownership transfer, stages 6–9 of `docs/OWNERSHIP-TRANSFER.md`.
6. Optional: `docs/GO-LIVE.md` lists remaining go-live work (analytics, backups, monitoring). Re-check its status before acting.

## 7. Open questions for the user

- Which of the "not built" items in §5 of the change doc should be built, and how: card tags, faded "Coming soon" cards, a sixth level, portrait size, PDF thumbnail size?
- Should "Adaptation and Mitigation" and "Nature Bingo" stay live with copied text, or be hidden until the Jagabumi lessons are written?
- Who reviews the Indonesian drafts, and who owns content (CMS) going forward?
- Should `HANDOFF_1.md` be deleted now that this file replaces it?
