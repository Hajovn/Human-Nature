# Ownership transfer plan

Written 2026-10-27. Moves every account that controls the website to **`humannature@indonesiabiru.id`** (the "new e-mail" below). Today the site belongs to two e-mail addresses: Hajovn's GitHub account and the project e-mail.

**Who does what**
- **You** work in the dashboards, while logged in as the current owner.
- **The new owner** accepts the invitations, logged in with the new e-mail.
- **I** change the code and docs, and run the checks.

The live site keeps running the whole time. The only short break is the CMS log-in, in Stage 5.

**Rule for every stage:** add the new e-mail as owner first, check it works, and only then remove the old e-mail. Never the other way round.

---

## What has to move

| Service | What it holds | Owned by now | How it moves |
|---|---|---|---|
| GitHub repo `Hajovn/Human-Nature` | The code, the CMS content, the Actions secrets, the keep-alive and backup jobs | Hajovn | Transfer to a GitHub organisation (Stage 3) |
| GitHub OAuth app | "Log in with GitHub" for the CMS | Hajovn | Transfer to the organisation (Stage 4) |
| Cloudflare Worker `human-nature-cms-auth` | The CMS log-in helper | Cloudflare account `hajo-van-nieuwstadt2` | Deploy again in the new account (Stage 5) |
| Supabase organisation "Human Nature" | Live and dev databases, teacher accounts, teacher files | Project e-mail | Invite as Owner (Stage 1) |
| Brevo | Account e-mails (confirm, reset password) | Project e-mail | Change the log-in and sender (Stage 2) |
| Vercel project | Hosting of `edukasi.indonesiabiru.id` | IBF's / the agency's team | Change team members, reconnect the repo (Stage 6) |
| Figma file `eK4SrAUxIup1f2HYEEBHF0` | The design | One of the two e-mails | Transfer the file (Stage 7) |
| Password manager | Database passwords, backup passphrase, recovery codes | Project e-mail | Move the entries (Stage 0) |

If any of these were also set up, move them the same way: Cloudflare Web Analytics, UptimeRobot, Sentry, Google Search Console.

---

## Stage 0 — Prepare (You + the new owner, ~30 min)

1. Check that the new e-mail receives mail. Send a test message to it.
2. Store the new e-mail's password and recovery codes in a password manager that IBF controls.
3. Move the existing password-manager entries there:
   - the Supabase database passwords (Live and dev);
   - `BACKUP_PASSPHRASE`, or the old backups can't be opened;
   - the Brevo log-in.
4. Write down the current status, so you can compare at the end: CMS log-in works, a teacher can log in, and the last keep-alive and backup jobs passed (GitHub → Actions).

## Stage 1 — Supabase (~15 min)

1. **New owner:** sign up at supabase.com with the new e-mail. Turn on two-factor log-in.
2. **You:** organisation "Human Nature" → **Team → Invite** the new e-mail with role **Owner**.
3. **New owner:** accept the invitation. Check that both projects (`human-nature-prod`, `human-nature-dev`) are visible.
4. **Website admin:** if the new owner should manage invite codes, they register on the website with the new e-mail. Then make that account admin with the SQL in [SUPABASE.md](SUPABASE.md), "Make someone admin".
5. Removing the old e-mails comes in Stage 8, after everything works.

## Stage 2 — Brevo (~20 min)

1. **Brevo → My profile:** change the log-in e-mail to the new e-mail, and confirm it from the new inbox.
   - If Brevo doesn't allow that, create a new Brevo account with the new e-mail. Make an SMTP key there, then paste the SMTP log-in and key into **Supabase Live → Authentication → Emails → SMTP Settings**.
2. **Sender address:** in Brevo → Senders, add `humannature@indonesiabiru.id` and verify it. Then set it as the sender e-mail in the Supabase SMTP settings (Live and dev).
3. **Better delivery (the agency):** authenticate the `indonesiabiru.id` domain in Brevo. Brevo shows the DNS records (DKIM, DMARC), which the agency adds in Cloudflare, where it already manages that domain's DNS. This is the same move SUPABASE-PLAN.md planned ("a sender on `indonesiabiru.id`").
4. **Test:** use "Forgot password" on the website with an address you can read. The e-mail should come from the new sender.

## Stage 3 — GitHub repository (~30 min)

1. **New owner:** create a GitHub account with the new e-mail. Turn on two-factor log-in.
2. **New owner:** create a free **organisation** (GitHub → **+ → New organization**), e.g. `indonesiabiru`. Invite Hajovn as a member for now.
3. **You (Hajovn):** repo → **Settings → General → Danger Zone → Transfer ownership** → the new organisation.
   - Issues, pull requests, CMS drafts (they are branches) and the history move along.
   - GitHub redirects the old repo address to the new one.
4. **Check after the transfer**, in the new repo → **Settings → Secrets and variables → Actions:**
   - Secrets: `SUPABASE_DB_URL`, `BACKUP_PASSPHRASE`;
   - Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.

   Add any that are missing again.
5. **CMS editors:** give each editor write access again (organisation → Teams, or repo → Collaborators).
6. **Failure e-mails:** GitHub sends the "scheduled job failed" e-mail to whoever last changed the schedule in the workflow file. So the new owner (or I, on their behalf) makes a small commit to `supabase-keepalive.yml` and `supabase-backup.yml`. Otherwise the warnings keep going to Hajovn.
7. **Old GitHub Pages address:** `hajovn.github.io/Human-Nature/` stops working after the transfer; GitHub doesn't redirect Pages addresses. The real site is on Vercel, so this is acceptable. Turn off `deploy.yml` at the same time (VERCEL-PLAN.md Stage V5).

## Stage 4 — GitHub OAuth app for the CMS (~10 min)

1. **You (Hajovn):** GitHub → **Settings → Developer settings → OAuth Apps** → the CMS app → **Transfer ownership** → the new organisation.
2. The Client ID and secret stay the same, so nothing breaks at this stage.

## Stage 5 — Cloudflare Worker for the CMS log-in (~30 min)

A Worker can't be moved between Cloudflare accounts, so it is deployed again.

1. **New owner:** create a free Cloudflare account with the new e-mail (decided 2026-10-28, instead of the agency's account). Turn on two-factor log-in.
2. Deploy a new worker from the **Deploy to Cloudflare Workers** button on github.com/sveltia/sveltia-cms-auth. Do **not** use "Import a repository": that deploys the website instead (HANDOFF_1.md).
3. In the worker → **Settings → Variables and Secrets**, copy the values from the old worker:
   - `GITHUB_CLIENT_ID`;
   - `GITHUB_CLIENT_SECRET` (Encrypt);
   - `ALLOWED_DOMAINS` = `edukasi.indonesiabiru.id` and the `.vercel.app` address.
4. In the OAuth app (now in the organisation): set the **Authorization callback URL** to `https://NEW-WORKER.workers.dev/callback`.
   - From this moment until step 5 goes live, the CMS log-in doesn't work. Do steps 4 and 5 together.
5. **Me:** set `CMS_REPO` and `CMS_AUTH_URL` in `src/admin/settings.ts`, then commit and deploy.
6. **Test:** log in at `https://edukasi.indonesiabiru.id/admin/` and save a small draft.
7. Delete the old worker in the `hajo-van-nieuwstadt2` account.

## Stage 6 — Vercel (the agency, ~15 min)

1. **The agency:** in the Vercel team, invite the new e-mail as a member of the project. Remove the old e-mails.
2. **Reconnect the repository:** project → **Settings → Git**. Install Vercel's GitHub app on the new organisation, and connect `NEW-ORG/Human-Nature`.
3. **Test:** a CMS edit (published) should start a new deployment and go live.

## Stage 7 — Figma (~5 min)

1. Open the file → **Share** → invite the new e-mail with "can edit".
2. Change that person to **Owner** (or move the file into a team the new owner owns).

## Stage 8 — Remove the old e-mails and change the secrets (~30 min)

Only after Stages 1–7 all work.

1. **Supabase:** remove the old e-mails from the organisation, or keep one as Developer for ongoing work.
2. **Supabase secrets:** the old owners have seen them, so make new ones:
   - Live project → Database → **reset the database password**. Update the `SUPABASE_DB_URL` secret in GitHub, and the password manager.
   - Live project → API keys → make a new **secret key** and delete the old one. (The publishable key can stay; it is public.)
3. **GitHub:** remove Hajovn from the organisation, or keep them as a member with limited rights.
4. **OAuth app:** generate a new client secret, put it in the new worker's `GITHUB_CLIENT_SECRET`, and delete the old secret.
5. **Brevo:** delete the old SMTP keys.
6. **Cloudflare:** check that nothing for the site is left in the old account.

## Stage 9 — Final check (Me + You, ~30 min)

- [ ] The website loads in both languages on `edukasi.indonesiabiru.id`.
- [ ] CMS: log in, save a draft, publish, and see it live.
- [ ] Teacher account: register, receive the confirmation e-mail from the new sender, log in, reset the password.
- [ ] `/profile/admin` works for the new owner's account.
- [ ] GitHub → Actions → run **Supabase keep-alive** and **Supabase backup** by hand. Both pass.
- [ ] **Me:** update the docs (CMS.md, SUPABASE.md, SUPABASE-PLAN.md Stage 9, GO-LIVE.md Phase 0, VERCEL-PLAN.md, README) with the new owner and addresses.
- [ ] The local copy points at the new repo: `git remote set-url origin https://github.com/NEW-ORG/Human-Nature`.
