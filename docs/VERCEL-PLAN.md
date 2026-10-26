# Vercel deployment plan

Written 2026-10-26. This moves the website from GitHub Pages to Vercel and puts it on `edukasi.indonesiabiru.id`. It replaces the GitHub Pages domain steps in GO-LIVE.md Phase 1.

**Who does what**
- **You** handle the Vercel and Supabase dashboards, and contact with IBF and the agency.
- **I** handle the code, the configuration files and the checks.

The current site at `hajovn.github.io/Human-Nature/` keeps running until the very last stage, so there is no downtime.

## Why Vercel helps

- **The same host as indonesiabiru.id.** The agency already manages that site on Vercel, and the domain's DNS in Cloudflare.
- **Deep links return a proper 200.** On GitHub Pages they return 404 behind the scenes (the 404.html trick), which hurts search engines.
- **A preview link for every branch.** Useful for the redesign branch and for CMS drafts before they are published.
- **Security headers** (GO-LIVE Phase 5.3), which GitHub Pages can't set.
- **The site sits at `/`** instead of `/Human-Nature/`.

What stays the same:
- The repository, and the CMS: Decap saves to GitHub, and Vercel builds every change.
- Supabase.
- The keep-alive and backup jobs in GitHub Actions.

---

## Decisions first

1. **Whose Vercel account?** **Decided 2026-10-26: IBF's / the agency's existing Vercel team**, the one that hosts indonesiabiru.id.
   - The domain is already verified there, and the agency maintains it.
   - Vercel's free Hobby plan wasn't an option: it is for personal, non-commercial use only.
   - So the agency does Stages V1 and V4. You send them the steps and the keys.
2. **Move the repo to an IBF GitHub organisation first?** *(Recommended: yes; decided in GO-LIVE Phase 0.)*
   - Vercel connects to the GitHub owner of the repo, so connecting after the move avoids doing it twice.
   - It can be done now and reconnected later if the move takes long.

---

## Stage V0 — Prepare the code (Me, ~1 h)

Harmless for the current GitHub Pages site. Done on a branch, merged when V1 starts.

1. **`vercel.json`:**
   - Send every address that isn't a file to `index.html`, so deep links like `/themes/climate` work. `/admin/` keeps its own page.
   - Long caching for `/assets/*`, whose file names change with every build.
   - Basic security headers: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and blocking the site from being framed by others. A full Content-Security-Policy comes later (GO-LIVE Phase 5.3), because the CMS and YouTube embeds need careful testing.
2. Pin the **Node version** in `package.json` (`engines`), so Vercel builds with the same Node as GitHub Actions (24).
3. **Build settings:**
   - Vercel serves the site at `/`, so `BASE_PATH` is simply not set. `vite.config.ts` already defaults to `/`.
   - The GitHub Pages `404.html` copy can stay; it does no harm.
4. Make the **CMS "view live" address** (`SITE_URL` in `src/admin/settings.ts`) easy to switch in V5.

## Stage V1 — Create the Vercel project (the agency, ~20 min; you send them this section)

1. In IBF's Vercel team: **Add New → Project → Import** the GitHub repository.
   - The team needs access to the repository. That's easiest once it lives in the IBF GitHub organisation. Until then, Hajovn installs Vercel's GitHub app for the team (Vercel asks during the import).
   - Ask the agency to add you, with the project e-mail, as a member of the project. Then you can see deployments and logs.
2. **Build settings:**
   - Framework preset **Vite**;
   - Build command `npm run build`;
   - Output directory `dist`;
   - Install command `npm ci`.
3. **Environment variables** (Settings → Environment Variables):

   | Name | Production | Preview |
   |---|---|---|
   | `VITE_SUPABASE_URL` | Live: `https://uifazscyhvybdxvlmzmv.supabase.co` | dev: `https://ooxiiugjudqijtcgefnp.supabase.co` |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Live publishable key | dev publishable key |

   Preview links then use the **dev** database, so testing a branch never touches real teachers' data.
4. **Deploy.** The agency gets an address like `human-nature-xxxx.vercel.app`. Send it to me.

## Stage V2 — Check the Vercel copy (Me, ~30 min)

On the `.vercel.app` address:
- every page loads in both languages;
- deep links answer **200**;
- old `/id/…` links redirect;
- `/admin/` opens the CMS;
- the security headers are present;
- images and downloads work.

Log-in will only work after V3, because Supabase doesn't know the new address yet.

## Stage V3 — Tell Supabase and the CMS log-in about the new addresses (You, ~15 min)

1. **Supabase Live** → Authentication → URL Configuration → Redirect URLs: add
   - `https://human-nature-xxxx.vercel.app/**`
   - `https://edukasi.indonesiabiru.id/**`

   Leave the Site URL for now.
2. **Supabase dev** → Redirect URLs: add the preview pattern `https://*-<team>.vercel.app/**`. Vercel shows the exact form under Settings → Domains.
3. **Cloudflare worker for the CMS log-in** (`human-nature-cms-auth`): add the new domains to the `ALLOWED_DOMAINS` variable, comma-separated, and deploy the worker.
4. **Me:** test log-in, registration (with an address you can read), password reset and the CMS on the Vercel address.

## Stage V4 — Connect the domain (the agency, ~30 min plus DNS time)

1. In Vercel: project → Settings → **Domains → Add** `edukasi.indonesiabiru.id`. In IBF's own team, the domain is usually verified straight away.
2. **The agency, in Cloudflare:** add a **CNAME** record `edukasi` → `cname.vercel-dns.com`, set to **DNS only** (grey cloud). Vercel then issues the HTTPS certificate itself. Vercel shows the exact record to use.
3. Wait until Vercel shows the domain as **Valid** (minutes to a few hours).
4. **Me:** repeat the V2 checks on `https://edukasi.indonesiabiru.id`.

## Stage V5 — Switch over (Me + You, ~1 h)

1. **Supabase Live** → Site URL: `https://edukasi.indonesiabiru.id/`. E-mail links already use the address the teacher registered from.
2. **Me:**
   - `SITE_URL` in `src/admin/settings.ts`;
   - the URLs in the docs (CMS.md, SUPABASE.md, README);
   - GO-LIVE.md Phase 1;
   - DESIGN.md §8.11 (hosting).
3. **Old address:** replace the GitHub Pages site with a small redirect page that sends every old link to the same page on `edukasi.indonesiabiru.id`, keeping the path. Then turn off the Pages deploy workflow (`deploy.yml`). The keep-alive and backup workflows stay.
4. **The agency:** add the **"Education"** menu item on indonesiabiru.id, linking to the new site.
5. **Test together:**
   - one CMS edit going live;
   - **the end-to-end test of teacher accounts**, postponed by the owner on 2026-10-23:
     1. Admin page: create a test code (label "Test").
     2. Second account, in a private window: register, confirm the e-mail, redeem the code. The "Verified teacher" badge should appear.
     3. Admin page: the code shows 1 use.
     4. Teacher file: upload a small PDF in Supabase Live → Storage → `teacher-files` (e.g. `test/sample.pdf`), and set that path on a resource in the CMS. Then check that the verified account can download it, and that logged-out visitors see "Log in to download".
     5. Clean up: remove the path in the CMS, delete the PDF, switch the code off, and delete the second account.

## Stage V6 — After the switch

- **Preview links:**
  - Every branch, including `redesign`, gets its own preview address on the dev database.
  - Vercel protects previews behind a Vercel log-in by default. Turn that off only if outsiders need to review.
- **CMS drafts:** each draft in the editorial workflow is a branch, so it gets a preview too. This uses build minutes; fine on IBF's plan.
- **Monthly check:** Vercel usage (bandwidth, build minutes), next to the Supabase usage check in SUPABASE.md.
- **Statistics:** Cloudflare Web Analytics stays the decision (GO-LIVE Phase 0 #7). Vercel Analytics is an alternative, if the agency prefers it.

---

## Checklist of addresses to update at the switch

| Where | What |
|---|---|
| Supabase Live: Site URL, Redirect URLs | `https://edukasi.indonesiabiru.id/` and `/**` |
| Supabase dev: Redirect URLs | Vercel preview pattern |
| Cloudflare worker `ALLOWED_DOMAINS` | `edukasi.indonesiabiru.id` and the `.vercel.app` address |
| `src/admin/settings.ts` `SITE_URL` | `https://edukasi.indonesiabiru.id/` |
| Docs (CMS.md, SUPABASE.md, README, GO-LIVE.md) | new address |
| indonesiabiru.id menu | "Education" → new site |
