# Go-live checklist (backend and design)

Written 2026-10-22. Content work (copy, translations, quiz answers, PDFs, logos, photo rights) is **not** on this list.

Tags:
- **[Decided]**: already agreed (HANDOFF / DESIGN.md §8.11).
- **[New]**: suggested here and not agreed yet.
- **[Decide]**: the team or IBF has to choose before the work can start.

The phases run roughly in order. Phase 0 blocks most of the others.

---

## Phase 0 — Decisions (decided 2026-10-22)

| # | Topic | Decision |
|---|---|---|
| 1 | Subdomain | **`edukasi.indonesiabiru.id`**. It matches IBF's "Education" menu item. Still needs the agency's agreement and the CNAME. |
| 2 | Supabase | **IBF owns it** (an IBF e-mail). Free plan while building; **upgrade to Pro (~$25/month) before launch**, because the free plan pauses after ~1 week without traffic and has no backups. |
| 3 | Teacher verification | **Invite codes, one per group** (training, school or region). Each code can have an end date and a usage limit, and IBF can switch off one code without affecting the others. |
| 4 | Comments | **Not in v1.** When they are added later, only logged-in teachers can read them. Moderation is decided then. |
| 5 | Class management | **Not in v1.** Designed later together with student accounts. |
| 6 | Ownership | **Move to an IBF GitHub organisation before launch**: the repo (with GitHub Pages) and the CMS OAuth app. The CMS log-in worker moves to IBF's or the agency's Cloudflare account. |
| 7 | Visitor statistics | **Cloudflare Web Analytics**: free, cookieless, no consent banner. |

To do from these decisions:
- [ ] Ask the agency to agree to `edukasi.indonesiabiru.id` and the "Education" menu item.
- [ ] IBF creates the Supabase project with an IBF e-mail (free plan) and invites the developers.
- [ ] IBF creates a GitHub organisation. Then:
  - transfer the repo; GitHub redirects the old address;
  - create a new OAuth app under the organisation;
  - deploy the log-in worker in IBF's or the agency's Cloudflare;
  - update `CMS_REPO` and `CMS_AUTH_URL` in `src/admin/settings.ts`;
  - re-add the editors as members of the organisation.
- [x] Update DESIGN.md §8.11 to match these decisions (done 2026-10-22).

## Phase 1 — Domain and IBF integration

- [x] **[Decided]** Indonesian becomes the default: Indonesian at `/` and English at `/en/…` (done 2026-10-22).
  - Old `/id/…` links redirect to the same page without `/id`, keeping filters and anchors.
  - DESIGN.md §8.10 and the README are updated.
  - The CMS still edits English first (`default_locale: 'en'`), on purpose: English is the source text, and Indonesian pages fall back to it until they are translated. Revisit once the Indonesian copy is final.

**Waiting for the agency's CNAME record** (`edukasi` → `hajovn.github.io`, or the IBF organisation's address after the move in Phase 0). Do these steps together, on the same day, and preferably after the repo has moved:
- [ ] In the repo's Settings → Pages, set the custom domain to `edukasi.indonesiabiru.id` and turn on "Enforce HTTPS". The site is deployed by GitHub Actions, so the setting is what counts, not a `CNAME` file.
- [ ] `BASE_PATH: /` in `.github/workflows/deploy.yml`.
- [ ] Update `SITE_URL` in `src/admin/settings.ts`.
- [ ] Add the subdomain to the CMS worker's `ALLOWED_DOMAINS`.
- [ ] Check that the old `hajovn.github.io/Human-Nature/` address redirects to the subdomain.

**Content, for the editors:**
- [ ] IBF credit in the existing Collaboration sections (home and Our mission). The sections are there; they need IBF's logo file and text, added through the CMS.

## Phase 2 — Supabase backend

### 2.1 Project setup
- [ ] Create the project in the region closest to Indonesia (probably Singapore, `ap-southeast-1`).
- [ ] **[New]** Keep the database schema, RLS policies and storage rules as SQL migrations in this repo (Supabase CLI), so the agency can rebuild and maintain it.
- [ ] Put the Supabase URL and public (anon) key in the GitHub Actions build. The anon key is public by design; security comes from row-level security (RLS).
- [ ] **[New]** Separate development and production projects, or at least never test on production data.

### 2.2 Accounts (replaces the mock log-in in `src/lib/storage.ts` `useMockUser`)
- [ ] Register, log in, log out.
- [ ] E-mail confirmation after registering.
- [ ] Forgot password + a "set a new password" page (replace the placeholders in `AuthPlaceholderPage`).
- [ ] Change password and e-mail on the profile page.
- [ ] **[New]** Delete account (a user-data right under Indonesia's personal-data law, see Phase 4).
- [ ] **[New]** **Custom SMTP sender** (e.g. Resend, Brevo or IBF's mail server). Supabase's built-in mail is for testing only and sends just a few e-mails per hour, so registrations would silently fail at launch.
- [ ] **[New]** E-mail templates in Indonesian and English (confirm, reset password, verified).
- [ ] **[New]** Bot protection on registration (Cloudflare Turnstile is free and Supabase supports it).
- [ ] Set the allowed redirect URLs (subdomain, localhost) in Supabase Auth.

### 2.3 Teacher verification (invite codes) and roles
- [ ] `profiles` table with a `verified` flag, the code used, and a `role` (teacher / admin).
- [ ] `invite_codes` table: the code, a label (the training, school or region), optional end date, optional usage limit, times used, and on/off.
- [ ] Code check on the server (a database function), so codes can't be read or guessed from the browser. Limit the number of wrong attempts.
- [ ] A teacher can enter a code at registration, or later on the profile page.
- [ ] A small admin page for IBF: create, switch off and count codes, and see which teachers used which code. The Supabase dashboard is the fallback.

### 2.4 Progress, saved items and feedback
- [ ] Tables for progress and saved resources, with RLS so each teacher can only read and write their own rows.
- [ ] Keep the current localStorage mode for visitors without an account (the site must still work without logging in, DESIGN.md §8.5 #25).
- [ ] **[New]** On first log-in, copy existing localStorage progress and saved items to the account, so nothing is lost.
- [ ] **[New]** Store the thumbs-up/down feedback in the database (anonymous allowed). Today the votes stay in each visitor's browser, so the team never sees them.

### 2.5 Teacher-only materials
- [ ] Private Supabase Storage bucket. Files are served by short-lived signed URLs, only to verified teachers.
- [ ] A CMS field that points to the protected file. The CMS cannot upload it: everything in the repo is public.
- [ ] **[New]** A simple upload route for editors (Supabase dashboard + written steps in `docs/CMS.md`, or a small upload page).
- [ ] **[New]** Check that no teacher-only file ends up in `public/` or in the repo history.
- [ ] Note: the existing "For teachers" tag (`forTeachers`) only labels a resource; it does not protect anything.

### 2.6 Comments: later, not in v1
When they are built: only logged-in teachers read them; decide the moderation then. Add a report button, a rate limit and a maximum length, and e-mail the moderators.

### 2.7 Running it
- [ ] Upgrade the project to Pro before launch, so it doesn't pause.
- [ ] **[New]** Backups: daily on Pro. On the free tier, a scheduled `pg_dump`.
- [ ] **[New]** Run Supabase's Security Advisor and review every RLS policy before launch.
- [ ] **[New]** A maintenance document for the agency: architecture, where the secrets are, how to deploy, how to restore a backup.

### 2.8 Optional
- [ ] **[New]** Contact form (today "Contact" is a section of Our mission). For example a Supabase Edge Function that e-mails IBF, with Turnstile against spam. A plain `mailto:` link is the zero-backend alternative.
- [ ] **[New]** Site search across themes and resources. A client-side index built from `content/**/*.json` is enough, with no backend.

## Phase 3 — Design

Per CLAUDE.md, every new value is agreed in DESIGN.md first.

### 3.1 Close the open design items
- [ ] Owner review of the build-time values in DESIGN.md §8.8 (status "pending review").
- [ ] Update DESIGN.md §8.5 ("v1 is a static site with no backend"), §8.10 (URLs) and §8.11 once the backend and the language switch are built.

### 3.2 Screens that are not designed yet
- [ ] Register (with a consent checkbox for the privacy policy).
- [ ] Forgot password, "check your e-mail", and set a new password.
- [ ] E-mail confirmed / link expired.
- [ ] Invite-code field at registration (optional), and an "Enter your invite code" block on the profile for teachers who don't have one yet. Include the wrong, expired and used-up code messages.
- [ ] Account settings: change password and e-mail, delete account (with confirmation).
- [ ] Locked teacher-only resource: what a visitor or a teacher without a code sees ("Log in and enter your invite code to download").
- [ ] Admin page for invite codes (plain styling is fine).
- [ ] Profile page with real data (initials avatar or uploaded photo?).
- [ ] The e-mails (Phase 2.2) in the site's style.
- Later, not v1: comment section (§4.12) and class management.

### 3.3 System states across the site
- [ ] **[Decide]** An error colour and success colour. Neither is defined in Figma or DESIGN.md, and they have to be checked for contrast.
- [ ] Form validation and error messages (the §8.6 table has no "error" column).
- [ ] Loading states for data from Supabase (skeleton or spinner).
- [ ] Empty states: no saved items, no progress yet.
- [ ] A confirmation pattern (toast or inline message) for "saved", "code accepted", "password changed".
- [ ] Offline / server-unreachable message.

### 3.4 Small design assets
- [ ] **[New]** Share image (1200 × 630) for link previews in WhatsApp, Facebook and others. Teachers in Indonesia mostly share links through WhatsApp.
- [ ] **[New]** Full icon set: PNG favicon, `apple-touch-icon`, and a `manifest.webmanifest` (today only `favicon.svg` exists).
- [ ] **[New]** Print stylesheet for lesson plans and lesson steps (hide the nav, footer and feedback; black text on white).

## Phase 4 — Privacy and legal

The page texts are content, but the backend creates obligations. This isn't legal advice: IBF should check it.

- [ ] Rewrite the privacy policy for accounts. Indonesia's Personal Data Protection Law (UU PDP, No. 27/2022) applies: what is collected, why, how long it is kept, the processors (Supabase, the mail sender) and the user's rights.
- [ ] Consent at registration, plus account deletion (2.2) and a way to get a copy of one's data.
- [ ] A cookie banner is **not** needed if Supabase stores its session in localStorage and statistics are cookieless. Re-check this if anything with cookies is added.
- [ ] Mention Cloudflare Web Analytics in the privacy policy (cookieless, no personal data).
- [ ] Comment rules in the terms of use: later, together with comments.

## Phase 5 — Findability, quality and monitoring

### 5.1 Search engines and link previews **[New]**
The site is built in the browser only. Search engines and WhatsApp previews see an almost empty page, and deep links return HTTP 404 (the 404.html fallback).
- [ ] Pre-render every route to static HTML at build time, in both languages. This fixes the 404 status and makes link previews work.
- [ ] Per-page title, description and Open Graph tags (from the CMS content).
- [ ] `hreflang` links between the Indonesian and English pages, and a canonical URL.
- [ ] `sitemap.xml` and `robots.txt` (`/admin/` excluded).
- [ ] Register the site in Google Search Console.

### 5.2 Testing **[New]**
There are no tests or lint today.
- [ ] Add a linter and a few end-to-end tests (Playwright): every route loads in both languages, log-in works, a test can be finished.
- [ ] Run typecheck, lint and the tests on every pull request, before deploying.
- [ ] Broken-link check over the built site.
- [ ] Accessibility audit for WCAG 2.2 AA: automatic (axe / Lighthouse), plus keyboard-only and a screen reader on the main flows.
- [ ] Performance on a cheap Android phone over a slow mobile connection (many schools). Set a budget, e.g. Lighthouse mobile ≥ 90.
- [ ] Browsers: Android Chrome, iOS Safari, desktop Chrome/Edge/Firefox, and the WhatsApp in-app browser.

### 5.3 Security **[New]**
- [ ] Branch protection on `main` (offered earlier, not answered), so only approved changes reach the live site.
- [ ] Dependabot for dependency updates.
- [ ] Two-factor log-in on every GitHub, Supabase and Cloudflare account that controls the site.
- [ ] Note: GitHub Pages can't set security headers (e.g. Content-Security-Policy). That needs a Cloudflare proxy or another host. Decide whether that's acceptable.

### 5.4 Monitoring **[New]**
- [ ] Cloudflare Web Analytics (decided). Add the snippet, or turn it on for the domain in Cloudflare (that needs the agency, since they manage the DNS).
- [ ] Error reporting, e.g. Sentry's free tier, so broken pages and failed log-ins are visible.
- [ ] Uptime check on the site and Supabase (e.g. UptimeRobot, free).

## Phase 6 — Launch

- [ ] Content freeze and a final pass through the editorial workflow.
- [ ] Run the full Phase 5 checks on the production subdomain.
- [ ] Switch DNS. Check HTTPS, the redirects, CMS log-in and account e-mails on the real domain.
- [ ] Submit the sitemap in Search Console.
- [ ] Hand over to the agency: maintenance document, accounts and secrets, and who to call for what.
- [ ] Plan a check two weeks after launch: errors, feedback votes, comments, statistics.
