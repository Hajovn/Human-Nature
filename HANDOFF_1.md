# HANDOFF — read this fully before any work

Generated: 2026-10-21T08:30+02:00 · Git HEAD: cdc5563
To resume: run /handoff — it re-verifies this file against the current repo before proceeding.
Trust rule: `[V]` = verified against the repo during the handoff run. `[?]` = unverified memory — treat as a lead, re-check before relying on it.

## 1. Current goal

Human Nature: a bilingual (Indonesian/English) climate-education site for Indonesian primary-school teachers, built from a Figma design (DESIGN.md is the source of truth; read CLAUDE.md first). The base site, CMS and live deploy are DONE. The two remaining objectives are decided but **not started; no code written** (DESIGN.md §8.11):
1. **Teacher log-in** with Supabase: progress across devices, teacher-only materials, class management, comments.
2. **Integration into indonesiabiru.id** (IBF website) as its own subdomain, with Indonesian as the default language.
The user explicitly said "do not start coding" these yet. Get a go-ahead before building either.

## 2. Verified state — where the work ACTUALLY stands

- [V] `main` is clean and in sync with `origin` = https://github.com/Hajovn/Human-Nature (GitHub user **Hajovn**; an older remote under roverhoofdman007 is obsolete).
- [V] `npm run build` succeeds (output below). There is **no test or lint script**; `package.json` scripts are: dev, cms, build, preview, typecheck, images.
- [V] Live site: https://hajovn.github.io/Human-Nature/ returns 200, `/admin/` returns 200. The latest Actions deploy for cdc5563 finished with conclusion "success".
- [V] CMS log-in worker `https://human-nature-cms-auth.hajo-van-nieuwstadt2.workers.dev/auth?provider=github&site_id=hajovn.github.io&scope=repo` answers **302** to github.com/login/oauth/authorize, so its variables are configured.
- [?] The user confirmed logging in to the live CMS works end to end (said "It works, I am in the CMS"). Not re-tested this run.
- [V] `src/admin/settings.ts`: CMS_REPO `Hajovn/Human-Nature`, CMS_AUTH_URL = the worker above, SITE_URL `https://hajovn.github.io/Human-Nature/`.
- [V] Languages today: English at `/…`, Indonesian at `/id/…`. `src/i18n/locale.tsx:8` has `DEFAULT_LOCALE: Locale = 'en'`. The switch shows **ID | EN** (`src/i18n/LanguageSwitch.tsx:5`).
- [V] Header dropdowns open on mouse hover (`src/components/Header.tsx:17` HOVER_CLOSE_DELAY = 200; pointer handlers around lines 72–80 and 147), plus click, tap and keyboard.
- [V] Log-in on the site itself is still a **mock** in localStorage (`src/lib/storage.ts:147` useMockUser). Progress, saved items and feedback are also localStorage only.
- [V] Quiz has no correct answers marked yet (0 × `"correct": true` in `content/resources/test-climate-change.json`). Learner-level thresholds are placeholders (`src/lib/storage.ts:97-98`).

### Test/build output (tail, from this handoff run)

```
✓ built in 2.76s
(the only other output was Rolldown [EVAL] warnings from Decap dependencies @iarna/toml and gray-matter; admin bundle only)
```

## 3. Decisions made & WHY

- **Stack:** React 19 + TypeScript + Vite, CSS Modules with tokens in `src/styles/tokens.css`, React Router. Static site on GitHub Pages; `vite.config.ts:106` base = `BASE_PATH` set by `.github/workflows/deploy.yml:30`. [V]
- **CMS = Decap**, not Sveltia, chosen for its live preview built from the real page components (`src/admin/previews.tsx`). Content lives in `content/**/*.json` as `{ "en": {…}, "id": {…} }`. Editorial workflow (drafts → review → publish) on GitHub. [V] (`src/admin/config.ts:586-603`)
- **CMS log-in = sveltia-cms-auth Cloudflare Worker** plus a GitHub OAuth app owned by Hajovn. GitHub Pages can't hold the OAuth secret. [V] worker redirect works.
- **Editors** are added as GitHub collaborators with Write access. Non-collaborators can log in but can't edit. On a personal repo nobody else can be admin; that needs an org. [?]
- **IBF integration (§8.11):** own subdomain of indonesiabiru.id, not iframe or subfolder. Reason: the host is Next.js on Vercel with DNS in Cloudflare and managed by an agency, so a subdomain is one DNS CNAME and keeps CMS and deploys independent. IBF menu label **"Education"** (not "Free Resource"). **Branding option A:** keep the Human Nature design; credit IBF in the existing Collaboration sections. [V] in DESIGN.md
- **Default language → Indonesian at `/`, English at `/en/…`** (reverses the current setup). [V] decided in DESIGN.md §8.11, not implemented.
- **Supabase** chosen over Hostinger PHP, Firebase or the agency's stack: managed auth, Postgres with row-level security, protected storage for teacher-only files, free tier. **Region: the lowest-latency one for Indonesian users** (the user does not require EU data storage); likely Supabase's Singapore region (`ap-southeast-1`), but check the region list when creating the project. **We** (this repo) develop it and the agency maintains it. [?] (user said yes in chat)
- Nav text is blue on the light strip and landing hero (contrast); white on photo heroes. DESIGN.md §8.9. [?]

## 4. Failed approaches / dead ends — DO NOT RETRY THESE

- [?] **Cloudflare "Import a repository" for the CMS worker** deployed a copy of the *website* (`human-nature.hajo-van-nieuwstadt2.workers.dev`), so `/auth` returned index.html. The fix was a separate worker from github.com/sveltia/sveltia-cms-auth's Deploy button. [V] the old worker URL now returns 404, so it was likely deleted. Don't point CMS_AUTH_URL at a repo-import worker.
- [?] **CMS worker variables were first added to the wrong worker.** `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` and `ALLOWED_DOMAINS=hajovn.github.io` must be on `human-nature-cms-auth` and deployed. A missing config shows "OAuth app client ID or secret is not configured" in the popup.
- [?] **Rubber-band overscroll effect** (`src/lib/rubberBand.ts`) was built, then removed at the user's request (commit 20c72a8). Do not re-add it.
- [?] **Checking whether a deploy is live by grepping the bundle for "pointerType"** gave a false "LIVE": React itself contains that string. Use the Actions API instead: `curl -s "https://api.github.com/repos/Hajovn/Human-Nature/actions/runs?per_page=1"` and look at status and conclusion.
- [?] **Building with `BASE_PATH=/x/` in Git Bash** gets mangled to `/Program Files/Git/x/` (MSYS path conversion). Prefix with `MSYS_NO_PATHCONV=1`. CI on Linux is unaffected.
- [?] **`git clone` into the session scratchpad** failed with "Filename too long" (Windows path length). Clone to `$TEMP/<short>` instead.

## 5. Known traps in this codebase

- [V] **Deep links return HTTP 404 on GitHub Pages but still work:** the 404.html SPA fallback (copied in `vite.config.ts` plugin githubPagesFallback) serves the app. Don't "fix" the 404 status by chasing it. Check page content, not status code.
- [V] **Adding or renaming a content field means updating three places together:** `src/content/types.ts`, the CMS fields in `src/admin/config.ts`, and the existing `content/**/*.json` (also in CLAUDE.md).
- [V] **Indonesian falls back to English per file** unless that language's title field is filled (`src/content/load.ts:57-65`; home uses `heroTitleLine1`, line 89). Decap copies duplicate fields (images, type) into `id`, which is why only the title counts.
- [V] **Interface text** lives in `src/i18n/strings.ts` (en + id, typed keys), not in the CMS. Internal links must use `Link` / `useLocalNavigate` from `src/i18n/locale.tsx` so visitors stay in their language. Switching the default language to Indonesian means changing `DEFAULT_LOCALE`, `isIdPath` / `localizePath` / `stripLocale` (lines 8–19), the routes in `src/App.tsx`, the CMS `default_locale` (`src/admin/config.ts:603`) and the CMS preview links.
- [V] **CMS images** are uploaded to `public/uploads`; their sizes come from the `virtual:image-sizes` plugin in `vite.config.ts`. Everything in the repo is **public**, so teacher-only materials can NOT go through the current CMS upload. They need Supabase Storage.
- [?] **Local CMS:** run `npm run dev` + `npm run cms`, then open http://localhost:5173/admin/. Port 8081 alone shows "Cannot GET /", which is normal. The editorial workflow is off locally (Decap's local_fs limitation).
- [?] **Desktop nav appears at ≥1024 px.** The Claude browser pane was 1000 px wide and showed the mobile menu, which looked like "hover doesn't work".
- [?] **Windows environment:**
  - Controlled Folder Access blocked shell writes in Documents earlier. The user turned it off.
  - The Bash sandbox can't write to the project; writes need `dangerouslyDisableSandbox`.
  - Use `git -c core.autocrlf=false` for commits (`.gitattributes` enforces LF).
- [?] **Commits** end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Push only after the user says so; they've approved each push individually.

## 6. Next steps (ordered)

1. **Wait for the user's go-ahead.** They said "do not start coding" the integration or the log-in.
2. **Subdomain** (the user is requesting it from the agency; the name isn't chosen yet). When the DNS CNAME exists:
   - add `public/CNAME` and set the custom domain in GitHub Pages;
   - set BASE_PATH to `/` in `.github/workflows/deploy.yml`;
   - update `src/admin/settings.ts` SITE_URL;
   - add the subdomain to the worker's `ALLOWED_DOMAINS`.
3. **Indonesian default:** make `/` Indonesian and `/en/…` English (see the files in §5). Keep old `/id/…` links working by redirecting them. Update the CMS `default_locale` and the DESIGN.md §8.10 wording.
4. **IBF credit:** fill the existing Collaboration sections (`content/pages/home.json` partners; `content/pages/mission.json` section `collaboration`) with IBF's logo and text. No restyle.
5. **Supabase backend** (only after the plan is confirmed with the user):
   - project owned by an IBF e-mail, in the region closest to Indonesia (lowest latency; EU not required);
   - teacher auth replacing `useMockUser`, with a `verified` flag since the method is TBD;
   - tables for progress and saved items, with row-level security;
   - protected Storage for teacher-only files and a CMS-side way to mark them;
   - comments with moderation.

   Note: the free tier pauses after about 1 week of inactivity.
6. Optional, offered but not answered: a GitHub branch protection rule so only the owner can publish CMS changes.

## 7. Open questions for the user

- **Subdomain name** (e.g. `belajar.` / `learn.indonesiabiru.id`), and whether the agency agrees to it and to maintaining Supabase.
- **How teachers get verified** ("determined later").
- **Who creates and owns the Supabase account** (recommended: an IBF e-mail), and whether the paid tier (~$25/month) is acceptable once the free tier's inactivity pause matters.
- **Should the repo move to an IBF GitHub organisation** so others can be admins? It isn't decided yet.
- **Content still owed by the team:**
  - final copy;
  - quiz answers;
  - level thresholds;
  - module PDFs;
  - partner logos;
  - a native-speaker review of the Indonesian translations.
