# Supabase: maintenance guide

For whoever looks after the teacher accounts: the project team now, later IBF or its web agency. How it was built is in [SUPABASE-PLAN.md](SUPABASE-PLAN.md).

## What runs where

| Part | Where |
|---|---|
| Website, CMS | GitHub Pages, built from this repository |
| Teacher accounts, progress, invite codes, votes | Supabase project **Live** (`uifazscyhvybdxvlmzmv`, Seoul), Free plan |
| Teacher-only files | Supabase Storage, private bucket `teacher-files` in the Live project |
| Account e-mails (confirm, reset password, change e-mail) | Brevo, set up as custom SMTP in Supabase (Auth → Emails) |
| Testing | Supabase project **development** (`ooxiiugjudqijtcgefnp`, Mumbai) |
| Database structure and rules | `supabase/migrations/*.sql` in this repository |

## Keys and secrets

| Name | Secret? | Where it lives |
|---|---|---|
| Project URL, publishable key (`sb_publishable_…`) | No, public by design | **`.env.production`** in the repository (Live), used by every production build (Vercel and GitHub Actions). The same values are also GitHub Actions **Variables** `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`, used by the keep-alive job. Locally in `.env.local` (dev). Variables set in Vercel override `.env.production`. |
| Secret key (`sb_secret_…`), database password | **Yes** | Supabase dashboard and the password manager only. The dev secret key may be in your own `.env.local` for `npm run test:rls`; never commit it. |
| `SUPABASE_DB_URL` (Live session-pooler connection string with password) | **Yes** | GitHub Actions **secret**, used by the backup |
| `BACKUP_PASSPHRASE` | **Yes** | GitHub Actions **secret** and the password manager. Without it the backups can't be opened. |
| Brevo SMTP key | **Yes** | Supabase (Auth → Emails → SMTP) and Brevo. If it ever leaks, generate a new key in Brevo, paste it into Supabase, and delete the old one. |

## Scheduled jobs (GitHub Actions)

- **Supabase keep-alive** (`.github/workflows/supabase-keepalive.yml`, every 3 days): calls `ping()` so the Free project doesn't pause.
  - If it fails, the project may be paused. Open it in the Supabase dashboard and click **Restore**. A paused Free project can be restored for 90 days.
- **Supabase backup** (`.github/workflows/supabase-backup.yml`, Sundays): encrypted dump of the Live database, kept 90 days. Run it by hand under Actions → Supabase backup → **Run workflow**.
- GitHub e-mails the person who last edited a workflow when a scheduled run fails.
- **GitHub switches scheduled workflows off after 60 days without commits.** If that happens, Actions shows a banner. Click **Enable workflow**.

## Everyday tasks

**Invite codes and feedback:** on the website at `/profile/admin`, logged in as an admin. See [CMS.md](CMS.md), "Invite codes and feedback".

**Teacher-only files:** upload in Supabase → Storage → `teacher-files`, then paste the path into the resource in the CMS. See [CMS.md](CMS.md), "Teacher-only files".

**Make someone admin** (Supabase → SQL editor, Live project):

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'name@example.com');
```

Use `role = 'teacher'` to take it away again.

**Verify a teacher by hand** (when someone has no invite code):

```sql
update public.profiles set verified_at = now()
where id = (select id from auth.users where email = 'name@example.com');
```

**Monthly check** (Supabase → Live → Usage):
- download traffic (egress) stays under 5 GB;
- file storage stays under 1 GB;
- database stays under 500 MB.

If one of these keeps getting close, compress the teacher PDFs or consider the Pro plan.

## Log-in settings (both projects)

These live in the Supabase dashboard, not in this repository. Set them on **Live** and **development**. Restore them after a restore from backup.

1. **Authentication → Sign In / Providers → Email:**
   - Email provider **on**;
   - **Confirm email** on;
   - **Secure email change** on;
   - minimum password length **8**;
   - **Email OTP expiration 86400** seconds (24 hours; the site's texts say so).
2. **Authentication → URL Configuration:**
   - Site URL: `https://hajovn.github.io/Human-Nature/` (Live) or `http://localhost:5173/` (development).
   - Redirect URLs: `https://hajovn.github.io/Human-Nature/**`. On development, also `http://localhost:5173/**`. Later add `https://edukasi.indonesiabiru.id/**`.
3. **Authentication → Emails → SMTP Settings:** custom SMTP with Brevo:
   - host `smtp-relay.brevo.com`, port `587`;
   - the Brevo SMTP login, and an SMTP key as the password;
   - sender name `Human Nature`.
4. **Authentication → Rate Limits:** e-mails sent per hour about **30** (Brevo free: 300 a day).
5. **Authentication → Emails → Templates:** paste these and save:

   | Template | Subject | Message body |
   |---|---|---|
   | Confirm sign up | `Konfirmasi akun Anda · Confirm your account – Human Nature` | `supabase/templates/confirmation.html` |
   | Reset password | `Atur ulang kata sandi · Reset your password – Human Nature` | `supabase/templates/recovery.html` |
   | Change email address | `Konfirmasi perubahan email · Confirm your new e-mail – Human Nature` | `supabase/templates/email_change.html` |

   Each body switches between Indonesian and English by the teacher's language. That language is set at registration and can be changed under "My details" on the profile page.

## Changing the database

1. Add a new file in `supabase/migrations/`, named `YYYYMMDDHHMMSS_what_it_does.sql`. Never edit a migration that has already been applied.
2. Apply and test it on development:
   - `npx supabase link --project-ref ooxiiugjudqijtcgefnp`
   - `npx supabase db push`
   - `npm run test:rls`
   - `npx supabase db advisors --linked`, which must report no issues.
3. Apply it to Live: `npx supabase link --project-ref uifazscyhvybdxvlmzmv`, then `npx supabase db push`.
4. Link back to development afterwards, so nothing is pushed to Live by accident.

On Windows PowerShell, type `npx.cmd` instead of `npx` if scripts are blocked.

## Restoring a backup

You need:
- the **backup passphrase**;
- `gpg`, which comes with Git for Windows;
- PostgreSQL's `psql` **version 17 or newer**. On Windows, install "PostgreSQL command line tools", or use WSL.

1. **Download the backup:** GitHub → Actions → Supabase backup → the run you want → **Artifacts**. You get a `.zip` with one `supabase-backup-YYYY-MM-DD.tar.gz.gpg` inside.
2. **Unpack it:**
   ```bash
   gpg --decrypt supabase-backup-YYYY-MM-DD.tar.gz.gpg > backup.tar.gz
   ```
   It asks for the passphrase. Then:
   ```bash
   tar -xzf backup.tar.gz
   ```
   This gives `roles.sql`, `schema.sql` and `data.sql`.
3. **Prepare an empty project.** Create a new Supabase project, or use one that has nothing in it. Copy its **Session pooler** connection string (Connect → Session pooler), with the database password filled in.
4. **Load the backup** in one go:
   ```bash
   psql --single-transaction --variable ON_ERROR_STOP=1 --file roles.sql --file schema.sql --command "SET session_replication_role = replica" --file data.sql --dbname "postgresql://postgres.REF:PASSWORD@HOST:5432/postgres"
   ```
   If anything fails, nothing is changed. Read the first error message.
5. **Redo what isn't in the database:**
   - Auth settings: e-mail confirmation, minimum password length, redirect URLs, Brevo SMTP, rate limits (SUPABASE-PLAN.md, Stage 2).
   - Re-upload the teacher files to a `teacher-files` bucket. The bucket and its rules come back with the backup; the files themselves don't.
   - If it's a new project, update `.env.production`, the GitHub variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`, and the `SUPABASE_DB_URL` secret. Then deploy the website again.
6. **Check:**
   - log in as an existing teacher;
   - open `/profile/admin`;
   - download a teacher file.

Teachers keep their passwords, because the password hashes are in the backup.

**Status:** the backup job is set up, but a full restore hasn't been rehearsed yet. Rehearse it once before launch, into an empty spare project.
