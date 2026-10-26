# Editing the website (Decap CMS)

All text, images, videos and test questions are edited at **`/admin/`**, for example `https://OWNER.github.io/REPOSITORY/admin/`. No coding is needed.

- Part 1 is for **editors**.
- Part 2 is a one-time setup for whoever manages the website.
- Part 3 is for developers.

---

## Part 1 — For editors

### Logging in
1. Go to `/admin/` and click **Login with GitHub**.
2. You need a free GitHub account, and the website manager must have added you to the project (Part 2, step 6).

### What you can edit

| In the menu | What it is |
|---|---|
| **Themes** | The four theme pages (Climate, Climate Change, Human and Nature, Solutions), including their "Hard words" |
| **Resources** | Lesson plans, tests, material for teachers and extra resources |
| **Pages** | Home page, Our mission, Glossary, Privacy, Terms of use |
| **Site settings** | Footer text |

### How a theme page is built
A theme page has a coloured top with a photo, three cards, and then **sections**. Each section has a title, a **background colour**, a **layout** and a list of **blocks**:

| Block | Use it for |
|---|---|
| **Text** | Paragraphs, with bold text, lists, small headings and links |
| **Image** | One image: rounded, arch, circle or oval; optional source line |
| **Callout** | One tip, fact or question in a coloured box: Teacher tip, Did you know?, Talk about it, Ask your class, or Go deeper (with a title). Under 30 words. |
| **Big numbers** | Two to four key facts in circles |
| **Numbered cards** | Steps such as "Why it happens" (1, 2, 3 …) |
| **Cards with a title and text** | Examples, terms, actions; choose cards per row and a colour per card |
| **Quote** | A quote with who said it |
| **Buttons** | Links to other pages or websites |
| **Video (YouTube or Vimeo)** | Upload the video to YouTube/Vimeo, then paste its link |

**Layouts:** everything stacked; two columns (main blocks left, side blocks right); two columns with the title on the left; or a wide left column. Tick **Continue the section above** for a part with another layout under the same title, e.g. two columns under a full-width map.

- **Add** a block with the **Add block** button at the bottom of a section.
- **Move** a block by dragging its handle.
- **Delete** a block with its ✕.
- Sections work the same way.
- The **Hard words, simple meanings** list at the bottom of a theme also fills the **Glossary** page.

### Resources
- **Lesson plans:** author, about, "Students learn to", context, materials, steps, key message, teacher tip, photos and the download file.
- **Tests:** questions with answer options. Tick **Correct answer** on the right options and write an **Explanation**: it is shown on the result after the test. Scoring only works once every question has a correct answer.
- Tick **Show in "Lesson plans" on the home page** for the lesson plans on the home page.

### Text marked TODO
Some texts start with **TODO:**. They are places where the design had no real text yet. Replace them before the site goes live.

### Images
- Click **Choose an image** to upload one. Large photos are made smaller automatically.
- Always fill in the **Image description (alt text)**. Describe what the image shows (e.g. "Map of the Ring of Fire") for people who use a screen reader. Leave it empty only for purely decorative images.

### Live preview
The right-hand side shows the page **as it will look** while you type.
- 👁 (eye icon): turn the preview on or off.
- 📄 (page icon): switch between editing English and Indonesian side by side.

### English and Indonesian
- With translation mode on, the screen shows **Writing in EN** on the left and **Writing in ID** on the right.
- Easiest way to translate: on the Indonesian side, click **Fill in from another locale → EN**. This copies the English, then you replace the text.
- A page counts as translated once its Indonesian **title** is filled in. Until then, Indonesian visitors see the English version with a short notice.
- Images, theme numbers and switches are shared by both languages. Video links and download files can differ per language.

### Saving and publishing (drafts and review)
Nothing goes live by accident:
1. **Save**. Your change is stored as a **Draft**. The live site doesn't change yet.
2. In **Workflow** (top menu), move the card to **In review** and ask a colleague to check it.
3. Move it to **Ready**, then click **Publish**.
4. The live website updates within about **2 minutes**.

### Teacher-only files

Some files are only for verified teachers (they entered an invite code). They can't be uploaded through this CMS: everything here is public. Instead:

1. Log in to Supabase (supabase.com) and open the **Live** project → **Storage** → bucket **teacher-files**.
2. Upload the file. Folders are fine, e.g. `climate/lesson-1-answers.pdf`. Keep PDFs small (under 10 MB if possible): downloads count towards the free plan's monthly limit.
3. In the CMS, open the resource and paste that path into **Teacher-only file (path in Supabase)**. You can give the Indonesian version its own file.
4. Publish. On the resource page, verified teachers now see a **Download** button; everyone else sees a locked block.

The live preview in the CMS doesn't show this block.

### Invite codes and feedback

Admins manage invite codes on the website itself, at **/profile/admin** (log in first). There you can:
- create a code per training, school or region, with an optional end date and maximum number of uses;
- switch a code off when it has leaked;
- see the Helpful / Not yet totals per resource;
- read the comments and questions teachers sent from the "Comments / Questions?" boxes. These are private: only admins see them.

Who is an admin is set in Supabase (see docs/SUPABASE-PLAN.md, "Making someone admin").

### Please don't change
- The **Link name** of a section. Other pages and menus link to it; e.g. the menu links to `#the-team` on Our mission.
- File names of existing themes and resources. They are part of their web addresses.

---

## Part 2 — Go live: GitHub log-in (one time, about 20 minutes)

The CMS saves changes into the website's GitHub repository. On GitHub Pages, "Login with GitHub" needs a small free helper, a **Cloudflare Worker**.

1. **Put the website on GitHub.**
   - On github.com, create a new repository (e.g. `human-nature-website`).
   - In this folder, run:
     ```bash
     git remote add origin https://github.com/OWNER/human-nature-website.git
     ```
     ```bash
     git push -u origin main
     ```
   - In the repository: **Settings → Pages → Source → GitHub Actions**.
2. **Deploy the log-in helper.**
   - Open <https://github.com/sveltia/sveltia-cms-auth>. It works with Decap CMS.
   - Click **Deploy to Cloudflare Workers**, using a free Cloudflare account.
   - Note the worker address, e.g. `https://sveltia-cms-auth.YOUR-NAME.workers.dev`.
3. **Create a GitHub OAuth app.** GitHub → your profile → **Settings → Developer settings → OAuth Apps → New OAuth App**:
   - *Homepage URL*: your site, e.g. `https://OWNER.github.io/human-nature-website/`
   - *Authorization callback URL*: `https://YOUR-WORKER.workers.dev/callback`
   - After creating it, copy the **Client ID**, then **Generate a new client secret** and copy it.
4. **Connect the two.** In Cloudflare: your worker → **Settings → Variables and Secrets**. Add:
   - `GITHUB_CLIENT_ID` = the Client ID
   - `GITHUB_CLIENT_SECRET` = the client secret (choose **Encrypt**)
   - `ALLOWED_DOMAINS` = `OWNER.github.io`
5. **Tell the CMS.** Fill in `src/admin/settings.ts`, then commit and push:
   - `CMS_REPO` = `OWNER/human-nature-website`
   - `CMS_AUTH_URL` = the worker address
   - `SITE_URL` = the site address
6. **Invite editors.** Repository → **Settings → Collaborators → Add people**, with **Write** access. Each editor needs a GitHub account.

---

## Part 3 — For developers

**Edit content locally** (no log-in; saves straight into this folder). Run each in its own terminal:

```bash
npm run dev
```
```bash
npm run cms
```

Then open <http://localhost:5173/admin/>. Locally, the drafts-and-review workflow is switched off, so Save writes the file directly.

**Where things live:**

| Path | What |
|---|---|
| `content/**/*.json` | The content. Each file holds `{ "en": {…}, "id": {…} }`. |
| `public/uploads/`, `public/downloads/` | Uploaded images and files |
| `src/admin/config.ts` | CMS fields and hints. Field names must match `src/content/types.ts`. |
| `src/admin/previews.tsx` | Live previews (they reuse the real page components) |
| `src/content/load.ts` | Reads the content; Indonesian falls back to English field by field |
| `src/i18n/strings.ts` | Interface text (menus, buttons) in both languages. **Edited in code, not the CMS.** The Indonesian strings are draft translations to be checked by a native speaker. |

**Known:** `npm audit` reports issues inside Decap's own editor dependencies, such as an old Markdown parser. They run only in the admin editor for logged-in editors, never on the public site.
