# CLAUDE.md

## Design source of truth

- [DESIGN.md](DESIGN.md) is the source of truth for the website's design. It was extracted from the Figma file `eK4SrAUxIup1f2HYEEBHF0`.
- Read DESIGN.md before building or changing any UI.
- Use its tokens (colors, typography, radii, shadows, layout grid) and its shared components rather than inventing new styles. If a value is marked "not defined in Figma", ask before choosing one.
- If something in the code differs from DESIGN.md, tell the user instead of silently changing either the code or DESIGN.md.

## Content and languages

- Page content lives in `content/**/*.json` and is edited by non-developers through Decap CMS (`/admin/`, see [docs/CMS.md](docs/CMS.md)). Don't hard-code page copy in components; read it through `src/content/load.ts`.
- When adding or renaming a content field, update all three together: `src/content/types.ts`, the CMS fields in `src/admin/config.ts`, and the existing JSON files.
- The site is bilingual: Indonesian (default) at `/…`, English at `/en/…`. Interface text goes in `src/i18n/strings.ts` (both languages); internal links use the `Link` / `useLocalNavigate` helpers from `src/i18n/locale.tsx` so visitors stay in their language.
