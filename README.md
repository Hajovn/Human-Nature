# Human Nature website

Free climate-change lessons for primary school teachers and their students. Built with React, TypeScript and Vite. The design comes from Figma and is documented in [DESIGN.md](DESIGN.md); read that before changing any UI.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run typecheck
```

## Where things live

| Path | What |
|---|---|
| `src/content/` | **All copy and data**: themes, resources, quiz questions, nav and footer. Edit text here, not in components. |
| `src/content/placeholders.ts` | Placeholder strings. Search for `PH_` to find everything that still needs final content. |
| `src/styles/tokens.css` | Design tokens (colours, type, radii, spacing) from DESIGN.md. |
| `src/components/`, `src/pages/` | UI. Each component has a `.module.css` file next to it. |
| `design-assets/raw/` | Full-size Figma exports (not in git). Run `npm run images` to regenerate `src/assets/img/*.webp`. |

## Things the team still needs to provide

See DESIGN.md §8.4–8.5 and §8.8. In short:
- final copy
- quiz answers (`correct` in `src/content/quizzes.ts`)
- level thresholds (`LEVELS` in `src/lib/storage.ts`)
- module PDFs (`public/downloads/`)
- partner logos
- photo permissions

## Deploying to GitHub Pages

Push to `main`; `.github/workflows/deploy.yml` builds the site with the right base path and publishes it. In the repository settings, set **Pages → Source** to **GitHub Actions** once.

Accounts, progress, saved resources and feedback are stored in the visitor's browser only (`localStorage`). There is no backend yet.
