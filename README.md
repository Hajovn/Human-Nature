# Human Nature website

Free climate-change lessons for primary school teachers and their students, in **Bahasa Indonesia** (`/…`) and **English** (`/en/…`).

- Built with React, TypeScript and Vite.
- Content is edited through **Decap CMS** at `/admin/`.
- The design comes from Figma and is documented in [DESIGN.md](DESIGN.md); read that before changing any UI.

## Run it

```bash
npm install
```
```bash
npm run dev        # website at http://localhost:5173, editor at /admin/
```
```bash
npm run cms        # local editor backend (run next to `npm run dev`)
```
```bash
npm run build      # production build in dist/
```

## Editing content

Text, images, videos and test questions are edited in the CMS, not in code. See **[docs/CMS.md](docs/CMS.md)**, which covers:
- the editor guide;
- the one-time GitHub log-in setup for the live site;
- the developer notes.

| Path | What |
|---|---|
| `content/` | All page content (JSON, one file per theme/resource/page, English + Indonesian) |
| `public/uploads/` | Images uploaded through the CMS |
| `src/i18n/strings.ts` | Interface text (menus, buttons, messages) in both languages |
| `src/admin/` | CMS configuration and live previews |
| `src/styles/tokens.css` | Design tokens from DESIGN.md |
| `design-assets/raw/` | Full-size Figma exports (not in git). `npm run images` regenerates the WebP copies. |

## Things the team still needs to provide

See DESIGN.md §8.4–8.5 and §8.8. In short:
- final copy and Indonesian translations;
- quiz answers (tick **Correct answer** in the CMS);
- level thresholds (`LEVELS` in `src/lib/storage.ts`);
- module PDFs, partner logos and photo permissions;
- a native-speaker check of the Indonesian interface text.

## Deploying to GitHub Pages

Push to `main`; `.github/workflows/deploy.yml` builds the site with the right base path and publishes it. In the repository settings, set **Pages → Source** to **GitHub Actions** once. Publishing in the CMS also triggers a deploy.

Accounts, progress, saved resources and feedback are stored in the visitor's browser only (`localStorage`). There is no backend yet.
