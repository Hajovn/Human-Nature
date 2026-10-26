# Redesign plan: from the new Figma design to the live site

Written 2026-10-26. The website gets a **complete redesign**: a new look, a new site structure and a new content model. The new design is on **"Page 2"** of the Figma file `eK4SrAUxIup1f2HYEEBHF0`. The current site (built from "Page 1", described in today's DESIGN.md) stays live until the redesign is finished and approved.

**Who does what**
- **You** handle Figma access, the CMS freeze with editors, the decisions in the change report, and the final review.
- **I** handle reading Figma, the reports, the code and the checks.

---

## Decisions (agreed 2026-10-26)

| Topic | Decision |
|---|---|
| Design source | Figma file `eK4SrAUxIup1f2HYEEBHF0`, **Page 2**. Every frame on that page is final. |
| Figma access | Through an account whose seat isn't limited to ~6 MCP reads a month (see step A2). |
| Mobile | Page 2 has desktop frames only. I work out the tablet and phone layouts myself, in the spirit of DESIGN.md §8.2. |
| Code approach | **Keep the plumbing:** routing, content loading (`src/content/load.ts`), Decap CMS, i18n (`src/i18n/`), Supabase accounts (`src/lib/`). **Rebuild the UI:** tokens, shared components, page layouts and their CSS. |
| Styling | CSS Modules plus tokens as CSS variables in `src/styles/tokens.css`, as today. No new dependencies. |
| Site structure | Navigation, pages and content model change substantially. |
| Existing content | **Start fresh.** New content files carry the copy from Figma. The old content stays in git history only. |
| CMS during the redesign | **Frozen.** Editors don't edit until the redesign is live. |
| Old URLs | No redirects. Removed addresses show the 404 page. |
| Account pages | Log-in, register, password and profile pages stay largely the same. If Page 2 has a design for one of them, I build that design. If not, the existing page stays (only the new tokens apply). Supabase and the database don't change. |
| Indonesian | I write both languages. A native speaker checks the Indonesian before go-live. |
| DESIGN.md | Rewritten from Page 2. For each old §8 decision, I check whether the new design covers it. You decide the rest. |
| Gaps in the design | Missing states, placeholders, contrast failures etc. are **collected in the change report** and decided by you in one go, before I build. |
| Review | **One review at the end**, before going live. |
| Timing | **Redesign first, then the move to Vercel** ([VERCEL-PLAN.md](VERCEL-PLAN.md)). |

## How downtime is avoided

- All work happens on the git branch **`redesign`**. The live site is built only from `main`, so it doesn't change until the merge.
- The CMS freeze means no edits on `main` need to be converted into the new content model.
- Teacher accounts are not affected: the Supabase database and settings stay as they are.
- Going live is one merge of `redesign` into `main`. If something is badly wrong, reverting that merge brings the old site back after the next deploy.

---

## Phase A: Set-up

| # | Step | Who | Status |
|---|---|---|---|
| A1 | Branch `redesign` exists | Me | ✅ Done |
| A2 | **Connect the Figma account that has the unlimited seat**, see below | You | ✅ Done: `h.vannieuwstadt@student.tudelft.nl` |
| A3 | Check that the connected account can open the file, and whether reads are limited | Me | ✅ Can open it. Education ("student") plan, View seat; the seat can't be changed to Full. Limit not confirmed, see below |
| A4 | Tell the CMS editors about the freeze | You | ❌ Open |

### A2: the Figma account

Checked 2026-10-26: **two** Figma connections are active in Claude, and both are Starter plans with a View seat (the ~6 reads/month limit):

| Connection in Claude | Signed in as |
|---|---|
| `figma` (MCP server in your Claude Code config) | `hajo.van.nieuwstadt2@gmail.com` |
| `Figma` (claude.ai connector) | `wlvandenberg@tudelft.nl` |

Neither of them is the account with unlimited access yet. Steps to switch are in the chat; afterwards I run `whoami` again (A3).

**Update 2026-10-26:** the connector now uses `h.vannieuwstadt@student.tudelft.nl`: an Education plan with a View seat. The seat can't be changed to Full. Figma's docs ([rate limits](https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/)) say View seats get 20 reads a month, but Education plans get 200 a day. It isn't clear which applies here. So I read sparingly, larger pieces first. If a read is refused for the limit, phase B switches to the PNG/SVG exports fallback: you export the Page 2 frames into `design-assets/redesign/`.

**Update 2026-10-26 (later):** the limit was reached after 20 reads. Figma's error points to the **file's** team: `wlvandenberg's team`, a Starter plan. So the limit follows the plan that owns the file, not the reader's plan. **Fix:** duplicate the file into `h.vannieuwstadt's team` (the Education plan) and give me the new link. Until then, no more Figma reads.

**Phase B status:**
- B1, B2, B5, B6 and B7 are done.
- B3: 12 frames plus the component sheet. The rest come per page during the build.
- B4 (images and icons) comes per page during the build.

## Phase B: Read and compare (no code changes yet)

| # | Step |
|---|---|
| B1 | List all frames on Page 2 and match them to pages of the new site (the new sitemap). |
| B2 | Read the colour, text and effect styles and variables: the new **tokens**. |
| B3 | Take a reference screenshot of every frame, saved in `design-assets/redesign/`. |
| B4 | Download the images, icons and logos used on Page 2. |
| B5 | **Change report** (`docs/REDESIGN-REPORT.md`):<br>• the new sitemap and the routes in both languages (`/…` and `/id/…`), with old pages that disappear;<br>• the new content model per page (what becomes a CMS field);<br>• which account pages have a new design and which stay;<br>• each old DESIGN.md §8 decision: covered by the new design, or still to be decided;<br>• **all gaps**: missing hover/focus states, placeholders, colours that fail WCAG contrast, missing mobile behaviour, unclear interactions. Each with my proposal. |
| B6 | **You decide every open point in the report.** |
| B7 | Rewrite DESIGN.md from Page 2 plus your decisions, so it stays the single source of truth. Page 1 frames are no longer referenced. |

## Phase C: Build (on `redesign`)

| # | Step |
|---|---|
| C1 | **Tokens** in `src/styles/tokens.css` and base styles in `src/styles/global.css`, plus fonts. |
| C2 | **Shared components**, rebuilt: header and navigation (with the menu for phones), footer, buttons, cards, tags, forms, language switch, and whatever new components Page 2 introduces. Old components that are no longer used are removed. |
| C3 | **Content model:** new types in `src/content/types.ts`, the CMS collections in `src/admin/config.ts` (and its previews), and new JSON files in `content/` with the Figma copy in English and Indonesian. The old content files are removed. |
| C4 | **Routes** in `src/App.tsx` for the new sitemap, in both languages. Interface text in `src/i18n/strings.ts`. |
| C5 | **Pages**, one at a time. For each: read its frame, build it, compare with the reference screenshot at desktop, tablet and phone width, in both languages. |
| C6 | **Account pages:** build the ones that Page 2 redesigns; check the rest still look right with the new tokens and header. |
| C7 | **Images:** optimise with `npm run images`; remove uploads that are no longer used. |
| C8 | **Checks:** typecheck and build; the CMS at `/admin/` shows and saves the new collections (local `npm run cms`); log-in, invite code and profile still work; keyboard and contrast checks; no broken internal links. |

I commit to `redesign` regularly and push the branch, so the work is safe on GitHub. That doesn't change the live site.

## Phase D: Review

| # | Step |
|---|---|
| D1 | You review the whole redesign locally on the `redesign` branch: every page, both languages, also on your phone. |
| D2 | A native speaker checks the Indonesian copy. |
| D3 | Feedback rounds on the branch until approved. |

## Phase E: Go live

| # | Step |
|---|---|
| E1 | Your final go-ahead. |
| E2 | Merge `redesign` into `main` and push. GitHub Actions deploys to the current host within ~2 minutes. |
| E3 | Check the live site: every page, both languages, log-in, the CMS at `/admin/`. |
| E4 | If anything is badly wrong: revert the merge; the old design is back after the next deploy. |
| E5 | Lift the CMS freeze and tell editors where the new fields are. Update [CMS.md](CMS.md) and the handoff notes; delete the branch. |
| E6 | Continue with [VERCEL-PLAN.md](VERCEL-PLAN.md). |
