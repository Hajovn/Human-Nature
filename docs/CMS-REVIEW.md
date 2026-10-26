# CMS usability review (2026-10-26)

Goal: someone with no web experience can find and change any text on the website.

## What was hard

| # | Problem | Seen where |
|---|---|---|
| 1 | No way to find **which page** a text is on. "Search all" only matches titles, and "Find on this page" only works once the right page is open. | Every screen |
| 2 | **Resources** mixed four kinds in one list, and every resource showed every field ("Lesson plans only", "Tests only" in the hints). | Resources |
| 3 | Entries with a theme or test picker were marked **"Unsaved changes"** as soon as they opened. Decap then asked "leave this page?" on every click away, and publishing could save a change nobody made. | Themes, all resources |
| 4 | The Glossary page entry has no words in it; the words live in the themes, with no hint where. | Pages → Glossary |
| 5 | Menu names were developer words ("Site settings", "Pages"); the three cards at the top of a theme showed internal codes ("explanation: …"). | Menu, Themes |

## What changed

1. **Find text** (bottom right on every screen, or Ctrl+Shift+F) answers "where do I change this?":
   - type words you see on the website, in English or Indonesian;
   - or paste a web address from the site to open that page in the editor;
   - results on the open page come first, then other pages; a click opens the page, opens the collapsed items and selects the words.
2. **Menu** follows the website: Themes · Lesson plans · Tests · Teacher material · Extra resources · Other pages · Footer. Each kind of resource only shows its own fields, and each list can be filtered by theme.
3. **Theme and test pickers** are plain dropdowns ("Theme 1: Climate"). This removes the false "Unsaved changes".
4. **Hints**: the Glossary entry says where the words are; each menu item has a one-line description.
5. `docs/CMS.md` (the editor guide) is updated.

Checked locally (`npm run dev` + `npm run cms`): search across pages in both languages, jumping between pages, pasting addresses, the filtered lists, no "Unsaved changes" on open, build and type check pass. Not checked on the live CMS (GitHub log-in, drafts workflow).

## Decisions made (please review)

Each was the recommended option. Say which to change.

| # | Decision | Alternative |
|---|---|---|
| D1 | Resources split into **four menu items**, one per kind. | One "Resources" list with a "Filter by type" menu (all fields shown again). |
| D2 | Theme and test are **fixed dropdowns**. A fifth theme or a second test per theme needs a developer (a new theme also needs colours, so it would anyway). | Keep Decap's look-up widget and live with the false "Unsaved changes". |
| D3 | Menu names **"Other pages"** and **"Footer"**; glossary words **stay in the themes** (a hint points there). | A separate "Glossary" menu item for the words (moves content; bigger change). |
| D4 | "On other pages" searches the **published** website. Unpublished drafts are found once opened. | Search drafts too: needs GitHub calls for every search; slower and can hit GitHub limits. |
| D5 | The editor's menus and buttons stay **English**: Decap has no Indonesian translation. Field names and hints are ours and could be translated. | Translate our field names and hints into Indonesian (or show both). |
| D6 | English stays the **left (main) column**, Indonesian the right. | Indonesian on the left. The site's fallback logic assumes English is complete, so this needs code changes. |
| D7 | Keep **Draft → In review → Ready → Publish**. | Publish directly (fewer steps, no safety net). |

## Not done

- Continued sections ("Continue the section above") show as "No title" in the section list. Decap can't show another field there.
- On the open page, rich-text fields are labelled "Field" instead of their name in the search results.
- The media library is one flat folder of images.
