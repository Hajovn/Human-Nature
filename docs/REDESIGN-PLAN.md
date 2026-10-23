# Redesign plan: from the new Figma designs to the live site

Written 2026-10-23. The site was built from the first, rough Figma draft (DESIGN.md). The designs have since been polished and expanded. This plan brings the website in line with them **without downtime**.

**Who does what:** **You** handle Figma access, approvals and reviews. **I** handle reading Figma, the reports, the code and the checks.

---

## How downtime is avoided

- All redesign work happens on the git branch **`redesign`**. The live site is built only from `main`, so it stays exactly as it is until the redesign is finished and approved.
- *Why a branch and not a fork:* GitHub doesn't let you fork your own repository into the same account. A branch gives the same protection, and merging back is simpler.
- **Editors can keep using the CMS** during the redesign. Their edits go to `main`, and I merge `main` into `redesign` regularly so nothing is lost.
  - If the redesign changes the content structure (new or renamed CMS fields), the existing content files are converted in the same step.
- **Teacher accounts are not affected:** the Supabase database and settings stay as they are.
- Going live is one merge of `redesign` into `main`. If something is wrong afterwards, undoing that merge restores the old site within minutes.

## Phase A — Set-up

| # | Step | Who | Status |
|---|---|---|---|
| A1 | Create the branch `redesign` from `main` | Me | ✅ Done (local; pushed when there is work on it) |
| A2 | Connect the Figma MCP server | Me | ✅ Connected, as `hajo.van.nieuwstadt2@gmail.com` |
| A3 | **Fix the Figma read limit**: see below | You | ❌ Open |
| A4 | Send the Figma share link of the new designs. Say which pages and frames are final, and whether there are mobile versions. | You | ❌ Open |
| A5 | Check that the Figma account above can open the file ("can view" is enough) | Me | After A4 |

### A3: the Figma read limit

The connected Figma account is on the **Starter plan with a View seat**. Figma limits the MCP server to **about 6 tool calls per month** for that combination. A full redesign needs roughly **40–80 reads**: one per frame for the layout, plus screenshots, plus the colour and text styles.

**Options, best first:**
1. **Figma for Education (free).** As a TU Delft student you can apply at figma.com/education with your university e-mail. You get the Professional plan with a **Full seat**, which raises the limit to a per-minute rate that is plenty for this work. Verification usually takes a few days.
2. **One month of a paid Dev or Full seat** on the Professional plan, about €12–16. Cancel after the redesign.
3. **Connect a different Figma account** that already has a Dev or Full seat on a paid plan, for example the designer's or IBF's. That account must be able to open the file.
4. **Work with exports, without the paid limit.** Possible, but less exact:
   - the designer exports every frame as PNG (2×) into `design-assets/redesign/`, which costs no MCP reads;
   - I use the ~6 reads for the file structure and the colour and text styles;
   - I rebuild the pages from the images.

   Measurements and spacing are then estimated rather than read, so expect more back-and-forth.

## Phase B — Read and compare (no code changes yet)

| # | Step |
|---|---|
| B1 | Open the file: list all pages and frames, and mark which are final. |
| B2 | Read the colour, text and effect styles and variables, i.e. the new **tokens**. |
| B3 | Take a reference screenshot of every final frame, saved in `design-assets/redesign/`. |
| B4 | **Change report** (`docs/REDESIGN-REPORT.md`) comparing the new design with today's DESIGN.md. It covers: token changes; changed shared parts (header, footer, buttons, cards, forms); changed, new and removed pages; content changes that need CMS changes; and **conflicts with decisions in DESIGN.md §8** (mobile layouts, hover states, contrast fixes such as the blue nav text, the account screens of §8.12). For each conflict you choose: new design, or keep the decision. |
| B5 | **You approve the report.** |
| B6 | Rewrite DESIGN.md to match, so it stays the single source of truth. |

## Phase C — Build (on `redesign`)

Order: biggest visible effect first, page by page after that.

| # | Step |
|---|---|
| C1 | **Tokens** in `src/styles/tokens.css`: colours, fonts, sizes, spacing, radii, shadows. One change updates the whole site. |
| C2 | **Shared parts:** header and menu, footer, buttons, cards, tags, forms, the language switch. |
| C3 | **Pages**, one at a time: home → theme pages → resources and resource detail (lesson plan, test) → Our mission → profile and account screens → privacy/terms → 404. Each page: read its Figma frame, build it, then compare with the reference screenshot at desktop and phone width, in Indonesian and English. |
| C4 | **CMS and content:** new or changed fields go into `src/content/types.ts`, `src/admin/config.ts` and the content files together (CLAUDE.md), so editors see the new structure. |
| C5 | **New images and icons** from Figma, optimised (`npm run images`). |
| C6 | **Checks:** typecheck and build; the account flows still work (log-in, invite code, teacher file); contrast and keyboard checks on the new design. |

After each page I commit to `redesign` and push the branch, so the work is safe on GitHub. That doesn't change the live site.

## Phase D — Review

| # | Step |
|---|---|
| D1 | You review the redesign locally: open the dev server on the `redesign` branch and go through every page, also on your phone. |
| D2 | Feedback rounds on the branch. |
| D3 | Merge the latest `main` (CMS edits by editors) into `redesign`, one final time. |

## Phase E — Go live ("uploading the new designs")

| # | Step |
|---|---|
| E1 | Your final go-ahead. |
| E2 | Merge `redesign` into `main` and push. GitHub Actions deploys within ~2 minutes. |
| E3 | Check the live site: every page, both languages, log-in, the CMS at `/admin/`. |
| E4 | If anything is badly wrong: revert the merge, and the old design is back after the next deploy. |
| E5 | Update the handoff/docs; delete the branch. |
