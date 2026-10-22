# Supabase implementation plan

Written 2026-10-22. This is GO-LIVE.md Phase 2 worked out step by step.

**Starting points**
- The Supabase account uses the project's own e-mail address. Ownership moves to IBF later (Stage 9).
- The site launches on the **Free plan**. Stage 0 lists what that means and how this plan works around it.
- Scope of v1 (GO-LIVE.md Phase 0):
  - teacher accounts;
  - verification with invite codes;
  - progress and saved items across devices;
  - teacher-only files;
  - feedback votes the team can see.
- **Not in v1:** comments, classes and student accounts.

**Who does what**
- **You** work in the dashboards: Supabase, the e-mail sender, Cloudflare and GitHub settings.
- **I** write the code and SQL, and test it.

Each stage ends in something that works and can be committed. The live site keeps the current mock log-in until Stage 8, so nothing half-built goes live.

---

## Stage 0 — What the Free plan means

The limits below are as of 2025–2026; check them on supabase.com/pricing when you create the project.

| Limit (Free) | What it means here | How we handle it |
|---|---|---|
| **Pauses after 7 days without activity** | Log-in, progress and teacher files stop working until someone restores the project in the dashboard. | A GitHub Actions job pings the database every 3 days (Stage 7). Note: GitHub switches off scheduled jobs in a repo with no commits for 60 days, so the uptime check (GO-LIVE Phase 5) must also watch Supabase. |
| **No backups** | A mistake or an outage can lose all accounts and progress. | A weekly encrypted database dump, made by GitHub Actions (Stage 7). Keep the original teacher files somewhere else too (e.g. IBF's drive). |
| **2 active projects** | Enough for one development and one production project. | We use exactly those two. |
| **500 MB database** | Plenty: accounts, progress and votes are tiny. | — |
| **1 GB file storage, 50 MB per file** | Enough for teacher PDFs if they are compressed. | Keep PDFs small (aim < 10 MB). |
| **5 GB egress (download traffic) per month** | Teacher-file downloads count. 5 GB is ~500 downloads of a 10 MB PDF. | Small PDFs; usage is checked monthly in the dashboard. Public files stay on GitHub Pages, which doesn't count. |
| **50,000 monthly active users** | Far more than needed. | — |
| **Built-in e-mail only reaches the project's own team members, a few per hour** | Real teachers would never get their confirmation e-mail. | **Custom SMTP sender** (Stage 2). It is allowed on Free. |
| No "leaked password" check, no support, no point-in-time restore | Weaker password safety and no help desk. | Minimum password length 8 and Supabase's built-in rate limits. |

If the site grows, upgrading to Pro later needs no code changes.

---

## Stage 1 — Accounts and projects (You, ~30 min)

1. Sign up at supabase.com with the **project e-mail**. Turn on two-factor log-in.
2. Create an **organisation** named "Human Nature". Ownership is transferred at the organisation level later, which moves everything at once.
3. Create two projects in the **Singapore** region (`ap-southeast-1`), each with a strong database password stored in a password manager:
   - `human-nature-dev`, for building and testing;
   - `human-nature-prod`, for the live site.
4. From each project, copy and send me:
   - the **Project URL**;
   - the **publishable key** (`sb_publishable_…`, called "anon key" in older projects). It is public by design.
5. **Never** send or commit:
   - the **secret / service_role key**;
   - the **database password**.

   They go only into GitHub Actions secrets (Stage 7).

**Done when** both projects exist and I have their URLs and publishable keys.

**Status 2026-10-22: done.** The regions differ from the plan:
- **Live** (`uifazscyhvybdxvlmzmv`) is in **Seoul** (`ap-northeast-2`).
- **Development** (`ooxiiugjudqijtcgefnp`) is in **Mumbai** (`ap-south-1`).

The owner decided to keep Live in Seoul. It is somewhat slower from Indonesia than Singapore would be. A region can't be changed later without recreating the project and moving its data.

## Stage 2 — Log-in settings (You, with my instructions, ~1 h)

Do this for both projects; it can wait until Stage 4 for `prod`.

1. **Auth → Providers → Email:**
   - on;
   - "Confirm email" on;
   - minimum password length 8.
2. **Auth → URL configuration:**
   - Site URL: `https://hajovn.github.io/Human-Nature/` (prod) or `http://localhost:5173/` (dev).
   - Redirect URLs: `http://localhost:5173/**`, `https://hajovn.github.io/Human-Nature/**` and, later, `https://edukasi.indonesiabiru.id/**`.
3. **Custom SMTP with Brevo:**
   1. Create a free account at brevo.com with the project e-mail.
   2. **Senders, Domains & Dedicated IPs → Senders:** add the project e-mail as a sender and confirm it.
   3. **SMTP & API → SMTP:** generate an **SMTP key**. Note the SMTP server, port and login shown there.
   4. In Supabase **Auth → Emails → SMTP Settings**, turn on custom SMTP:
      - sender e-mail: the project e-mail;
      - sender name: `Human Nature`;
      - host: `smtp-relay.brevo.com`;
      - port: `587`;
      - username: the Brevo SMTP login (looks like `…@smtp-brevo.com`);
      - password: the SMTP key.
   5. **Auth → Rate Limits:** set "emails sent per hour" to about 30, safely under Brevo's 300 a day.
4. **E-mail templates** (confirm sign-up, reset password, change e-mail):
   - I write them in Indonesian and English;
   - each template picks the language from the teacher's saved choice.
5. ~~Bot protection (Cloudflare Turnstile)~~: **dropped (decided 2026-10-22).** Fake sign-ups are limited by Supabase's e-mail rate limit and by e-mail confirmation, and they get nothing without an invite code. Add Turnstile later if spam accounts show up in the dashboard.

**Status 2026-10-22: done for `dev`** (custom SMTP with Brevo). Repeat steps 1–4 for `prod` before Stage 8.

**Done when** a test account on `dev` receives its confirmation e-mail through the custom sender.

## Stage 3 — Database (Me, ~2 days)

All of this lives as SQL migrations in `supabase/migrations/` in this repo. They are applied to dev and prod with the Supabase CLI (`npx supabase db push`), so the agency can always rebuild the database. Every table has row-level security (RLS) on.

| Table / function | Contents | Who can do what |
|---|---|---|
| `profiles` | One row per teacher: name, school name, school number (NPSN, 8 digits), phone (optional), language, `role` (teacher / admin), `verified_at`, the invite code used. Created automatically at sign-up. | A teacher reads and edits only their own name, school, NPSN, phone and language. Nobody can make themselves verified or admin from the website. |
| `invite_codes` | Code, label (training / school / region), optional end date, optional maximum uses, times used, on/off. | Admins only. |
| `redeem_invite_code(code)` | Checks the code (exists, on, not expired, not used up) and marks the teacher verified. | Any logged-in teacher. At most 5 wrong tries per hour, so codes can't be guessed. |
| `saved_resources` | Teacher + resource slug. | Own rows only. |
| `progress` | Teacher + kind (theme visited / module opened / test attempted / test finished) + item. Same as today's localStorage `Progress`. | Own rows only. |
| `feedback_votes` | Resource, up/down, an anonymous browser id (or the teacher's id). | Anyone can vote once per resource. Only admins see the totals. |
| `delete_my_account()`, `export_my_data()` | Personal-data rights (GO-LIVE Phase 4). | Own account only. |
| Storage bucket `teacher-files` (private) | Teacher-only PDFs. | Read: verified teachers, through links that expire after 60 s. Upload: admins (or you, in the dashboard). |

Admins are set by hand with one SQL line (documented). At first that's you, later someone at IBF.

**Files:**
- `supabase/migrations/20261022120000_teacher_accounts.sql` holds everything above.
- Two details:
  - An invite code typed at registration is applied at sign-up.
  - An invalid NPSN or phone number is dropped rather than blocking the sign-up. The form checks them first anyway.

**Testing:**
- `npm run test:rls` (`scripts/test-rls.mjs`) creates throw-away teachers, an admin, invite codes and a file on `dev`. It checks what each can and can't do, then deletes them again.
- It needs the dev project's **secret key** as `SUPABASE_SECRET_KEY` in `.env.local`. You add that yourself; it's never pasted in chat or committed.
- The script refuses to run against the live project.
- After that, Supabase's Security Advisor must show no warnings.

**Status 2026-10-22:**
- Both migrations are on `dev`. The second, `…130000_private_function_bodies.sql`, moves the privileged function bodies into the `private` schema.
- The Security Advisor reports no issues at any level.
- A visitor-only smoke test passed: no access to profiles, codes, votes or teacher files; `ping` works.
- **`npm run test:rls`: all 45 checks pass**, and it leaves the dev database empty afterwards. **Stage 3 is done.**
- Applying migrations:
  - `npx supabase link --project-ref <ref>`, then `npx supabase db push`.
  - On Windows PowerShell, use `npx.cmd` if scripts are blocked.

**Making someone admin** (SQL editor), with their e-mail:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'name@example.com');
```

**Done when** the migrations are on `dev`, the RLS test passes, and the Security Advisor is clean.

## Stage 4 — Design of the new screens (Me proposes, You approve)

CLAUDE.md requires new UI to be agreed in DESIGN.md first. All of it reuses the existing log-in card, buttons and form styles. Still needed:
- **An error colour and a success colour.** Neither is in Figma, so you have to approve them.
- Screens:
  - register (name, school name, NPSN, e-mail, password, optional phone, optional invite code, privacy consent);
  - "check your e-mail";
  - e-mail confirmed / link expired;
  - forgot password and set a new password.
- Profile additions:
  - the invite-code block;
  - change password / e-mail;
  - download my data;
  - delete my account.
- The locked teacher-file state, and the admin page for invite codes (plain styling).
- Loading, empty and error states for all of the above.

**Done when** DESIGN.md has a new §8.12 that you've approved.

**Status 2026-10-22: done.** Designed in house style (DESIGN.md §8.12), built together with Stage 5, and approved by the owner.

## Stage 5 — Log-in in the website (Me, ~3 days)

1. Add `@supabase/supabase-js` and a client in `src/lib/supabase.ts`.
   - It reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`: from `.env.local` locally (not committed), and from GitHub Actions variables in production.
   - The session is kept in localStorage, so no cookies and no cookie banner.
2. An `AuthProvider` + `useAuth()` that replaces `useMockUser` in the Header, LoginPage and ProfilePage.
3. Real pages in both languages, with every text in `src/i18n/strings.ts`:
   - `/login` and `/register`;
   - `/forgot-password`, replacing the placeholder;
   - new `/reset-password` and `/auth/callback` (where the e-mail links land).
4. Profile:
   - real name and school;
   - invite-code block and verified badge;
   - change password / e-mail;
   - log out;
   - download my data;
   - delete account.
5. If the Supabase variables are missing, the site still works without accounts.

**Done when** on `dev`, a teacher can register, confirm, log in, reset the password, enter an invite code and delete the account, in both languages.

**Status 2026-10-22: built and tested on `dev`.**
- Tested in the browser with a throw-away account:
  - registration form checks;
  - log-in with a wrong and a right password;
  - invite code, wrong and right;
  - saving details, changing the password;
  - downloading my data and deleting the account;
  - expired-link pages and the language versions.
- Not yet tested: the actual sign-up and reset **e-mails**. They need a real inbox; test with your own address.
- The live site is unchanged: without the Supabase variables the build keeps the mock log-in.
- Code: `src/lib/supabase.ts`, `src/lib/auth.tsx`, `src/components/Form.tsx` and the pages `Register`, `ForgotPassword`, `ResetPassword`, `AuthCallback`, `ProfileAccount`.

## Stage 6 — Data features (Me, ~3 days)

1. **Saved items and progress**
   - Logged out: they keep working in localStorage, exactly as now.
   - Logged in: they are read from and written to Supabase.
   - On first log-in in a browser, local items are merged into the account, so nothing is lost.
   - On log-out, personal data is removed from the browser. Classroom computers are often shared.
2. **Teacher-only files**
   - New CMS field "Teacher-only file (path in Supabase)" on resources. It's added to `types.ts`, `src/admin/config.ts` and the JSON together, as CLAUDE.md requires.
   - Verified teachers get a download button that fetches a 60-second link.
   - Everyone else sees the locked state.
   - Editors upload the file in the Supabase dashboard; the steps go into `docs/CMS.md`.
3. **Feedback votes** go to the database as well as the browser.
4. **Admin page** for invite codes and vote totals, visible only to admins.

**Done when** all of the above works on `dev`, and a non-verified account can't fetch a teacher file even by calling Supabase directly.

**Status 2026-10-22: built and tested on `dev`.** In the browser with a throw-away admin and teacher:
- **Sync:** a visitor's saved item moved into the account at log-in, and progress recorded while logged in reached the account. Removing a saved item synced too. Log-out cleared the browser, and logging in again brought everything back.
- **Votes:** a visitor's vote reached the database, and the totals show on the admin page.
- **Teacher files:** the locked block shows "Log in" for visitors and "Enter your invite code" for unverified teachers. A verified teacher gets a working download link. The rule that unverified accounts are refused is also covered by `npm run test:rls`.
- **Admin page:** create a code (typed or generated, with end date and limit), switch it off, the duplicate-code message, and the feedback totals.

Code: `src/lib/sync.ts`, `TeacherDownload` in `src/components/Feedback.tsx`, `src/pages/AdminPage.tsx`. The new CMS field `teacherFile` is optional, so the existing content files need no change.

## Stage 7 — Keep-alive and backups (Me writes, You add the secrets)

1. **Keep-alive:**
   - `.github/workflows/supabase-keepalive.yml` runs every 3 days;
   - it calls a tiny `ping()` function on prod, which counts as activity;
   - it fails visibly if the project is paused.
2. **Backup:**
   - `.github/workflows/supabase-backup.yml` runs weekly;
   - it dumps roles, schema and data with the Supabase CLI over the connection pooler (GitHub's runners can't use the direct IPv6 address);
   - it encrypts the dump with a passphrase and keeps it 90 days as a workflow artifact.

   The repo is public, so **the dump must be encrypted**. GitHub secrets needed: `SUPABASE_DB_URL` (prod pooler URL with password) and `BACKUP_PASSPHRASE`.
3. A written restore procedure, tested once by restoring a backup into `dev`.

**Done when** both workflows have run successfully and a restore into `dev` worked.

**Status 2026-10-22: workflows written, not yet run.**
- `supabase-keepalive.yml` and `supabase-backup.yml` are in `.github/workflows/`.
- The backup checks that every table is in the dump before it encrypts it.
- Restore steps and the maintenance guide are in [SUPABASE.md](SUPABASE.md).
- Still to do:
  1. Apply the migrations to Live; the backup's table check fails on an empty database.
  2. Add the variables and secrets in GitHub.
  3. Run both workflows once by hand.
  4. Rehearse one restore into an empty spare project. This can't be done into `dev`, which already has the schema, and the Free plan allows only two active projects.

## Stage 8 — Go live on prod

1. Run the migrations on `prod`, and finish the Stage 2 settings for prod.
2. Make yourself admin and create the first invite codes.
3. Add the GitHub Actions variables:
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (prod).
4. Remove the mock log-in code.
5. Test end to end on the live site: register, the e-mail arrives, log in, enter a code, download a teacher file, delete the account.
6. Before teachers use it, the privacy policy and terms (GO-LIVE Phase 4) must cover accounts. That is content for the team.

## Stage 9 — Hand-over to IBF (later)

1. In the Supabase organisation, invite IBF's e-mail as **Owner**. After they accept, remove the project e-mail, or keep it as a developer.
2. Move the other project-e-mail accounts as well: the Brevo account and the password manager entry.
3. When the domain moves to `edukasi.indonesiabiru.id`, add it to:
   - Site URL and redirect URLs;
   - the e-mail sender's domain.
4. Hand the agency `docs/SUPABASE.md`, a maintenance guide I write during the stages above: structure, admins, invite codes, uploads, backups, restore, keys.

---

## Decisions (2026-10-22)

1. **E-mail sender: Brevo** (free, 300 e-mails/day). It starts with the project e-mail as the sender address. Later it moves to a sender on `indonesiabiru.id`, with Brevo's DNS records added by the agency, which also improves delivery.
2. **Registration fields:**
   - name;
   - school name;
   - **school number (NPSN**, the 8-digit national school ID);
   - e-mail;
   - password;
   - **phone number (optional)**;
   - invite code (optional);
   - privacy consent.

   No region or province field: the NPSN and school name already locate the school.
3. **Admin page:** `/profile/admin`, shown only to admins. (`/admin/` is already the CMS.)

**Keys:**
- The publishable keys of both projects are known.
- The dev key is in `.env.local`, which is not committed. The prod key goes into GitHub Actions variables in Stage 8.
- Still needed: both **Project URLs** (`https://<project-ref>.supabase.co`).
