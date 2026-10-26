# DESIGN.md — Human Nature website

Source of truth for the website's design. Rewritten on 2026-10-26 for the redesign (docs/REDESIGN-PLAN.md).

- **Figma file:** `aqpCKUSoPFvGwAUbcgjF5j` ("web_design_copy", in the Education team; a copy of `eK4SrAUxIup1f2HYEEBHF0` with the same node IDs), page **"Page 2"** (`188:394`). Page 1 (the first design) is no longer used; the previous version of this file, describing Page 1, is in git history.
- Frame links: `https://www.figma.com/design/aqpCKUSoPFvGwAUbcgjF5j/web_design_copy?node-id=<id with - instead of :>`.
- The comparison with the old site and the decisions behind this document are in [docs/REDESIGN-REPORT.md](docs/REDESIGN-REPORT.md). All its open points (§9 there) were accepted on 2026-10-26.
- Reference screenshots: `design-assets/redesign/`.

**Where values come from.** Values marked *(Figma)* are named variables or component specs in the file. Values marked *(read)* are measured from layers. Values marked *(decision)* are agreed decisions that fill a gap in Figma. Anything else that's needed and not here is **not defined**: ask before choosing.

---

## 1. Overview

*Human Nature* offers free climate-change education for primary-school teachers in Lombok and their pupils. It's built with the Indonesia Biru Foundation (IBF) and will live at `edukasi.indonesiabiru.id`.

**Main areas:**
- four learning **themes**;
- a **resource library** of lesson plans, tests, teacher material and extra resources;
- a **glossary**;
- **Our mission**;
- **teacher accounts**, with progress, levels and saved resources.

**Frames on Page 2.** All frames are desktop, 1440 px wide; there are no mobile or tablet frames (§3.3).

| Frame | Node | Page |
|---|---|---|
| Human Nature components | `192:2` | Component sheet (§4) |
| Landing page | `196:6` | Home |
| Thema 1 / 2 / 3 / 4 | `222:2211` / `242:3344` / `242:3975` / `242:4453` | Theme pages |
| Thema 5 | `260:726` | Resource library |
| Thema 6, Thema 19 | `263:1878`, `278:4063` | Lesson plan (the template) |
| Thema 7 / 12 / 10 / 11 | `267:2843` / `276:2497` / `276:2143` / `276:2320` | Tests: Climate Change / Climate / Human and Nature / Solutions |
| Test result (×4) | `312:1947`, `312:1714`, `317:1481`, `316:1475` | Result after a test |
| Thema 8 | `269:3257` | Our mission |
| Thema 9 | `272:868` | Personal page |
| Glossary | `299:1502` | Glossary |
| Desktop - 3 | `274:2118` | Log in (unchanged design; §5.10) |

Not used: Thema 16, 17, 18 (an unfinished variant and two copies of Thema 19), and the Figma page "presentatie download".

---

## 2. Design tokens

All tokens live in `src/styles/tokens.css` under the same names.

### 2.1 Colour *(Figma)*

| Token | Value | Use |
|---|---|---|
| `--brand-blue` | `#1414C8` | Headings, links, primary buttons, filled tags, footer bar |
| `--on-brand` | `#FFFFFF` | Text on brand blue |
| `--ink` | `#14142B` | Body text; all text on accent colours |
| `--ink-muted` | `#4A4D6B` | Secondary text on page, card and sky only |
| `--on-accent` | `#14142B` | Text on sun, ember, leaf and lagoon |
| `--surface-page` | `#FAFBFF` | Page background |
| `--surface-card` | `#FFFFFF` | Cards |
| `--surface-sky` | `#D6E5FA` | Header, footer, plain tags, light sections, teacher tip |
| `--border` | `#C9D2EA` | Card and input borders |
| `--border-strong` | `#6F78A8` | Quiz and filter checkbox outlines (used in the Question component) |
| `--track` | `#D9D9D9` | Empty progress and level bars (raw value in Figma) |
| `--sun` | `#FFC93C` | Theme 1 Climate; "Did you know?" |
| `--ember` | `#F26B3A` | Theme 2 Climate Change; "Not quite" |
| `--leaf-bright` | `#6CC27A` | Theme 3 Human and Nature; "Talk about it" |
| `--lagoon` | `#1FB5A8` | Theme 4 Solutions |
| `Green` | `#198F51` | Logo ("nature") only |

**Added by decision** (report 9.6):

| Token | Value | Use |
|---|---|---|
| `--success` | `#1B7A52` | "Correct" pill background (white text), success messages, "Verified teacher" |
| `--error` | `#B00020` | Error text, the border of an invalid field, the edge of an error message |
| `--focus-ring` | `= --brand-blue` | Focus ring (§2.6) |

### 2.2 Theme colours

Each theme has one accent. It's used for the hero background on that theme's pages, its lesson plans and tests, its glossary section, its ThemeCard, its dot on LessonCards, and its "next theme" button.

| Theme | Accent |
|---|---|
| 1 Climate | `--sun` |
| 2 Climate Change | `--ember` |
| 3 Human and Nature | `--leaf-bright` |
| 4 Solutions | `--lagoon` |

Pages without a theme use `--surface-sky` for the hero, except Our mission, which uses `--leaf-bright`.

### 2.3 Contrast rules *(decision)*

Measured WCAG ratios are in the report, §7. The rules:

- On **sun, ember, leaf and lagoon**, all text under 24 px (or 18.7 px bold) is **`--ink`**: breadcrumbs, author lines, question counts, labels, body text.
- Brand blue is allowed on those colours only for large headings. On ember (3.5 : 1) and lagoon (4.2 : 1) it passes only as large text.
- `--ink-muted` and white are **never** used as text on the four accent colours.
- Green `#198F51` stays in the logo.
- Danger actions such as "Delete account" use ink text with an ember outline. Ember text fails on white.

### 2.4 Typography *(Figma)*

Two families, both under the SIL Open Font License and self-hosted via `@fontsource`:
- **Space Grotesk** for display;
- **Atkinson Hyperlegible** for text.

| Style | Font | Size / line-height | Weight | Notes |
|---|---|---|---|---|
| `Display/display-xl` | Space Grotesk | 72 / 76 | 700 | Page H1 (heroes) |
| `Display/h2` | Space Grotesk | 40 / 48 | 700 | Section headings |
| `Display/h3` | Space Grotesk | 28 / 36 | 700 | Card titles, sub-headings |
| `Display/big-number` | Space Grotesk | 64 / 64 | 700 | BigNumber, numbered circles |
| `Display/button` | Space Grotesk | 20 / 24 | 500 | Buttons |
| `Text/lead` | Atkinson Hyperlegible | 22 / 34 | 400 | Hero intro, section intros |
| `Text/body` | Atkinson Hyperlegible | 19 / 30 | 400 | Body |
| `Text/body-strong` | Atkinson Hyperlegible | 19 / 30 | 700 | |
| `Text/small` | Atkinson Hyperlegible | 16 / 24 | 400 | Card text, footer, nav |
| `Text/caption` | Atkinson Hyperlegible | 15 / 22 | 400 | Captions, sources |
| `Text/label` | Atkinson Hyperlegible | 14 / 18 | 700 | Uppercase, letter-spacing 0.06 em (0.84 px, as used in the components) |

**Responsive sizes** *(proposal 2026-10-26, pending your approval; Figma is desktop only)*. These apply below 1024 px. Everything else keeps its desktop size.

| Style | < 768 | 768–1023 |
|---|---|---|
| display-xl | 44 / 48 | 56 / 60 |
| h2 | 30 / 36 | 34 / 42 |
| h3 | 24 / 30 | 26 / 34 |
| big-number | 48 / 48 | 56 / 56 |
| lead | 19 / 30 | 20 / 32 |
| body | 17 / 28 | 18 / 28 |

Body text never goes below 16 px.

### 2.5 Spacing, radii, shadow *(Figma)*

| Spacing | `--space-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-5` 24 · `-6` 32 · `-7` 48 · `-8` 64 · `-9` 96 |
|---|---|
| **Radii** | `--radius-md` 16 (cards, callouts, inputs) · `--radius-lg` 28 (large panels, arch-photo corners) · `--radius-full` 999 (buttons, tags, circles) |
| **Shadow** | `shadow-lift`: `0 8px 24px rgba(20, 20, 43, 0.14)` (hover on buttons and cards) |

### 2.6 States *(Figma for buttons; decision for the rest)*

- **Hover:** the element gets `shadow-lift` and moves up 2 px. This applies to buttons (Figma) and to clickable cards *(decision)*. Text links get an underline.
- **Focus-visible:** a 3 px `--focus-ring` ring with a 2 px offset, on every interactive element.
- **Pressed:** the lift is removed. **Disabled:** opacity 0.4, no shadow, `cursor: not-allowed`.
- **Motion:** 150 ms ease-out; dropdowns 200 ms (fade plus a 4 px slide). Lift and slide are off under `prefers-reduced-motion`.

---

## 3. Layout

### 3.1 Grid *(read)*

- **Content width:** 1200 px, centred; that's 120 px margins at 1440.
- **Wider frames:** the resource library and the lesson, test and glossary pages use 1312 px (64 px margins). Their layout is a **180 px filter column**, a ~40 px gap, and a ~1080 px main column.
- **Grids:**
  - 4 columns: 276 px cards, 32 px gap;
  - 3 columns: 379 px cards, 32 px gap;
  - two-column sections: about 560 + 613 px.
- **Section padding:** 96 px top and bottom (`--space-9`); 64 px in the theme hero.

### 3.2 Page shells

- **Header:** sky bar, 81 px high, on every page (§4.1).
- **Hero types:**
  - **Full hero** (home, theme pages, Our mission): 720 px. Two columns: text (656 px) on the left and an **arch photo** (480 × 560 at most) on the right. Background: page (home) or the theme accent.
  - **Page hero** (resources, personal page, glossary): sky, about 294 px. Contains the H1 and a lead line.
  - **Detail hero** (lesson plan, test): the theme accent, about 288 px. Contains a breadcrumb ("Resources / lesson plan"), the H1, and a meta line (author, or "Theme · n questions").
- **Sections** alternate backgrounds: page, sky, and theme accents.
- **Footer:** sky band, then the blue bottom bar (§4.2).

### 3.3 Responsive *(the old §8.2 breakpoints, kept by decision; the gutter and hero values are a proposal pending approval)*

- **Breakpoints:** base < 768, `md` ≥ 768, `lg` ≥ 1024, `xl` ≥ 1440.
- **Page gutter:** 16 px (base), 24 px (`md`), 64 px (`lg`); content max-width 1200 px.
- **Grids:**
  - 4-column grids: 1 column on base, 2 on `md`, 4 on `lg`;
  - 3-column grids: 1 / 2 / 3;
  - two-column sections stack below `lg`.
- **Heroes:** below `lg`, the arch photo moves under the text at most 400 px wide.
- **Filter column:** below `lg` it becomes a collapsible "Filters" disclosure above the content.
- **Navigation:** below `lg`, a menu button opens a full-height panel (§4.1).
- **Section padding:** 96 / 64 / 48 px (`lg` / `md` / base).

---

## 4. Shared components

Specs marked *(Figma)* come from the component sheet `192:2`, including the usage notes written there.

### 4.1 Header *(read)*

- **Bar:** `--surface-sky`, 81 px, padding 12 px 64 px (the 1312 px wide frame).
- **Content:**
  - logo (138 × 57) on the left;
  - 48 px after the logo, the nav items Themes / Materials / Our mission, 32 px apart: Text/body-strong (Atkinson Bold 19/30) brand blue, a 16 px chevron 4 px after the label, 48 px tall;
  - on the right: the **language switch** and a Secondary "Log in" button.
- **Signed in:** "Log in" becomes an avatar circle linking to `/profile`.
- **Dropdowns** *(decision, unchanged)*: they open on hover (closing 200 ms after the mouse leaves) and on click or tap, with full keyboard support. Panels are white, `--radius-md`, `shadow-lift`, with items in Text/small brand blue.
  - **Themes:** the four themes.
  - **Materials:** All resources · Lesson plans · Tests · For teachers · Extra resources · Glossary.
  - **Our mission:** Our product · The team · Our impact · Collaboration IBF · Future plans · Contact.
- **Language switch** *(decision, unchanged)*:
  - a segmented **ID | EN** pill, Indonesian first, linking to the same page in the other language;
  - border 2 px brand blue, `--radius-full`, label style;
  - the current language is filled brand blue;
  - each option is at least 40 × 32 px.
- **Below 1024 px:** logo, language switch and menu button.

### 4.2 Footer *(read)*

- **Sky band**, 1200 px content:
  - logo and tagline (Text/small, ink);
  - three columns with label-style headings and Text/small brand-blue links.
- **Columns:**
  - **Themes:** 1. Climate · 2. Climate change · 3. Human and nature · 4. Solutions.
  - **Materials:** Lesson examples (`/resources?type=lesson-plan`) · Download the module (`/resources?type=for-teachers`) · Test your knowledge (`/resources?type=test`) · Extra Resources (`/resources?type=extra`) · Glossary.
    - "The community" is left out until that page exists *(decision)*.
  - **Our mission:** About us · Contact · Partners, as anchors on `/mission`.
- **Bottom bar:** brand blue, 48 px. "© 2026 Human nature. All rights reserved." on the left; Privacy · Terms of use · Contact on the right; white Text/small.
- The same footer is used on every page *(decision)*.

### 4.3 Button *(Figma `192:21`)*

> Figma's usage note: a pill-shaped button for the one action a section wants the teacher to take.
> - **Primary** at most once per section.
> - **Secondary** for a second route.
> - **Quiet** for links that act like buttons.
> - Labels are verbs, in sentence case.

| Style | Look |
|---|---|
| Primary | `--brand-blue` fill, `--on-brand` label |
| Secondary | 2 px `--brand-blue` border, brand-blue label, no fill |
| Quiet | no fill or border, brand-blue label, 12 px side padding |

- **Size:** height 48 px, side padding 32 px, `--radius-full`.
- **Label:** Display/button (Space Grotesk Medium 20/24).
- **States:** as §2.6.
- **Small variant** *(read, the tag-sized buttons on the profile card)*: 32 px high. It uses the same styles.

### 4.4 LessonTag *(Figma `192:26`)*

> Figma's usage note: a small pill that labels a lesson plan with its type, theme, grade and time.
> - Show the type first as Filled; then theme, grade and duration as Plain.
> - Three words or fewer.
> - No theme fills on tags.

- **Look:** 32 px high, 12 px side padding, `--radius-full`, Text/label (uppercase).
- **Filled:** brand blue with white text. **Plain:** sky with brand-blue text.
- **"Go deeper"** (`242:3251`): `--ink` fill with white text. It's used as the label of a Go-deeper callout.
- **Section chips** ("On this page") use the Plain style as links, with hover as §2.6.

### 4.5 Callout *(Figma `193:42`)*

> Figma's usage note: a coloured box that pulls one tip, fact or question out of the running text.
> - Under 30 words.
> - At most two per screen.
> - No left border, no lists or buttons inside.

- **Look:** padding 24 px, gap 8 px, `--radius-md`.
- **Label row:** a 12 px dot marker and a Text/label heading.
- **Body:** Text/body in `--ink`.

| Kind | Background | Label |
|---|---|---|
| Teacher tip | `--surface-sky` (white when the section itself is sky) | TEACHER TIP |
| Did you know? | `--sun` | DID YOU KNOW? |
| Talk about it | `--leaf-bright` | TALK ABOUT IT |
| Ask your class *(read, Theme 1)* | `--surface-sky` | ASK YOUR CLASS |
| Go deeper *(read, Themes 1–4)* | `--surface-card` | "Go deeper" tag, plus an h3 title in brand blue, then body |

**Key message** and **Teacher tip** cards on lesson plans are callouts at a larger size: sky and sun respectively.

### 4.6 BigNumber *(Figma `193:52`)*

> Figma's usage note: one key fact, big and short: a number, its unit, and at most 12 words of context. Quiet by default; Ember for a warning, Lagoon for a solution. At most four in a row, no sentences inside.

- **Look:** a circle, 220 px (150 px on the home page and personal page, *read*), padding 16 px, gap 4 px.
- **Content:** a Display/big-number value and a Text/small caption, centred.
- **Styles:**
  - Quiet: sky fill, brand-blue number;
  - Ember, Lagoon, Sun, Leaf: accent fill with `--ink` number and caption;
  - Blue *(read, mission)*: brand-blue fill with white text.

**Numbered step circles** ("How it works", "Why it happens") use the same circle: white or accent, with brand-blue digits.

### 4.7 ThemeCard *(Figma `193:26`)*

> Figma's usage note: links to one of the four themes. All text in on-accent, never ink.

- **Look:** an accent-coloured card, 276 px wide, `--radius-lg`, padding 24 px, gap 16 px.
- **Content:**
  - a round photo, 180 px;
  - "THEME n" (label);
  - the title (h3, ink);
  - one line (Text/small, ink).
- The whole card is a link to the theme; hover as §2.6.

### 4.8 LessonCard *(Figma `193:73`, `260:1692`)*

- **Look:** a white card, 1 px `--border`, `--radius-lg`, padding 25 px.
- **Content:**
  - an optional image, 136 px high, `--radius-md`;
  - LessonTags (type, grade, duration);
  - the title (h3, ink);
  - one line (Text/small, ink-muted);
  - a footer row with a 10 px theme dot and the theme name (Text/small, ink) and the 28 px **save star** on the right.
- **Save star:** a toggle button with `aria-pressed`. Outline means not saved; filled brand blue means saved.
- The card is a link; hover as §2.6.

### 4.9 Info card *(read; the "Theme card / Climate" instances on the pages)*

The general card used for glossary terms, materials, action cards, team members, future plans and the climate zones.

- **Look:** `--radius-md`, padding 16–24 px.
- **Content:**
  - an optional number circle (40 px), dot or round photo;
  - an h3 title (brand blue on white; ink on colour);
  - Text/small body.
- **Background:** white (on colour or sky sections), sky (lesson materials), or an accent. Editors set it per card (`background`); coloured cards have no border and ink text.
- **Climate-zone dots** *(read, Theme 1)*: red `#FF383C` (raw value), ember, sun, leaf, lagoon, brand blue, ink-muted.

### 4.10 Question *(read, `269:3256` / `270:3735`)*

- **Look:** a white card, 1 px `--border`, `--radius-lg`, padding 24 px.
- **Heading:** h3: the number in brand blue, then (52 px further) the question in ink.
- **Options:** 28 px radio circles (single answer) or squares ("check all that apply") with a 1 px `--border-strong` outline; Text/body labels 30 px from the box; options 24 px apart, with 24 px above and below the list.
- Options are real `<input>`s inside a `<fieldset>`/`<legend>`.

### 4.11 Filter column *(read)*

- **Width:** 180 px.
- **Content:**
  - "FILTERS" (label);
  - group headings Theme and Type (Text/small);
  - checkbox rows: a 15 px white square and a Text/small ink-muted label. The square's outline is `--border-strong`, not Figma's `--border`: `--border` measures 1.5 : 1 on white and fails WCAG's 3 : 1 for controls *(decision, accessibility)*;
  - a Secondary "Clear filters" button.
- **Behaviour:** multi-select, with state in the URL (`?theme=climate&type=lesson-plan`).
- **On detail pages** (lesson plan, test), choosing a filter opens `/resources` with that filter *(decision)*.

### 4.12 Arch photo *(read)*

- **Shape:** a photo with a semicircular top (radius = half the width) and `--radius-lg` bottom corners.
- **Used in:** heroes and lesson plans.
- **Variants:** circle (home, Lombok block, quote) and oval (Ring of Fire map).

### 4.13 Feedback and comments *(read; decision on comments)*

- **Feedback:** "What did you think of this resource?" (h3), then two Secondary buttons, **Helpful** and **Not yet**. The selected one is filled.
- **Comment box:** a white box with `--border` and `--radius-md`, labelled "Comments / Questions?", with a Primary "Send" button.
  - It sends the message **privately to the team** and is stored in Supabase next to the feedback votes. It's readable on the admin page.
  - Only logged-in teachers can send. Visitors see the box with a "Log in to send" button.
  - Nothing is shown publicly.

### 4.14 Level track *(read, `274:1546`)*

- **Look:** a white card with the current-level badge (large circle) and name on the left.
- **Steps:** six steps, each a circle plus name plus a 11 px bar.
  - Reached levels: sun circle and leaf bar.
  - Unreached levels: sky circle and grey bar.
- **Levels:** Climate Beginner · Curious · Enthusiast · Scholar · Visionary · Expert.
- It replaces the old level image.

### 4.15 Other parts

- **Breadcrumb:** Text/small, link plus "/" plus the current page, in ink on accent heroes (§2.3).
- **Score circle** (test result): a white 380 px circle with "YOUR SCORE" (label), the score in display-xl brand blue, and "% correct".
- **Result pills:**
  - "✓ Correct": `--success` with white text (Figma uses `#1B7A52` here, so `--success` is `#1B7A52`);
  - "✗ Not quite": `--ember` with ink text;
  - Text/label.
- **Theme navigation buttons** *(decision)*:
  - "Go to lesson examples" (Primary);
  - **"Next: theme n+1"**: a card button in the next theme's accent, with a label, a title and an arrow;
  - "Back to theme n−1" (Secondary).
  - Theme 1 has no back button. Theme 4's next button goes to "All resources".
- **Image with source:** the image in `--radius-md`, then "Source: …" in Text/caption, ink-muted.

---

## 5. Pages

Routes are shown without the language prefix (§7). A section list gives the order on the page; details are in the frames.

### 5.1 Home (`196:6`) · `/`

1. Full hero: H1 "Climate change education", lead, Primary "Go to lesson examples", arch photo.
2. Themes: h2, lead, 4 ThemeCards.
3. Sky: "Climate Change in Numbers": 3 BigNumbers (sun, lagoon, ember), the "Small actions add up" text with a Secondary button, and a teacher tip.
4. "From Lombok to the world": a circle photo, label, h2, text, a did-you-know callout, and a Secondary "Our mission".
5. Sky: "How it works": 3 numbered circles and a teacher tip.
6. "Lesson plans": 6 LessonCards (featured) and a Secondary "See all lesson plans".
7. Sky: quote with attribution and a circle photo.
8. "Ready to teach?": text, a Primary and a Secondary button, and the shapes illustration (`213:2199`).
9. Collaboration: text and the IBF logo.

### 5.2 Theme pages (Thema 1–4) · `/themes/:slug`

1. Full hero in the theme accent: "THEME n OF 4", H1, lead plus a paragraph, Primary "Test your knowledge" (the label is unified, *decision*), arch photo.
2. "On this page" chips, generated from the section titles.
3. Three intro cards:
   - Explanation (image, title);
   - Lesson module (circle photo, title, link);
   - News article (image, headline link).
4. **Content sections:** free per theme, built from the blocks in §6.2, each with its own background.
5. "Hard words, simple meanings": the theme's glossary terms as info cards on sky.
6. "Check what you learned": h2, lead, Primary "Test your knowledge".
7. Download this theme as a PDF (thumbnail plus Secondary button), feedback and comments; on the right, the theme navigation buttons (§4.15).

### 5.3 Resource library (Thema 5) · `/resources`

- Page hero.
- Filter column.
- Main column: "Resources (n)" (h2), then a 3-column grid of LessonCards.
- Feedback at the bottom.

**Types** *(decision)*: lesson plan · test · for teachers (theme modules, teacher guides) · extra resource. There's no random-resource button.

### 5.4 Lesson plan (Thema 6 / 19) · `/resources/:slug`

1. Detail hero in the theme accent, with breadcrumb, H1, "Author: …".
2. Filter column, then the main column:
   1. arch image with a Primary "Download" and the save star underneath;
   2. LessonTags;
   3. "About this lesson" (h2) and a lead;
   4. "STUDENTS LEARN TO" and a list;
   5. "Lesson context" (h2) and body;
   6. materials as sky info cards (4 per row);
   7. "The lesson in n steps" (h2) with numbered steps (a 40 px brand-blue circle, a title in body-strong, body);
   8. Key message and Teacher tip cards;
   9. a row of 3 photos;
   10. the teacher-only file block (when there is one, §5.10).
3. Feedback and comments.

### 5.5 Test (Thema 7 / 10 / 11 / 12) · `/resources/:slug/test`

- Detail hero: "Test your knowledge", plus "Theme · n questions".
- Filter column.
- Main column:
  - an intro card (theme name in h3 brand blue, plus one line);
  - the Questions;
  - a Primary "Check my answers" button.
- **After submitting**, the result replaces the questions **on the same page** *(decision)*. "Try again" resets the page.

### 5.6 Test result (`312:1947`)

1. Hero in the theme accent:
   - "TEST: THEME";
   - H1 "Your result";
   - a message and a hint;
   - Primary "Try again";
   - the score circle.
2. Sky: "Your level", with a level card (badge, "You are …", what's left to the next level, progress bar).
3. "Your answers":
   - a summary line and result pills;
   - a 2-column grid of answer cards. Each card has: QUESTION n, a result pill, the question (h3), "You answered" (when wrong), "Correct answer", and the explanation (ink-muted).
4. Sky: "What next?", with three cards:
   - Read again (this theme);
   - Teach it (lesson plans);
   - Next theme, in its accent.

   Then a Primary "Try the test again" and a Secondary "Back to resources".

### 5.7 Our mission (Thema 8) · `/mission`

1. Full hero on `--leaf-bright`.
2. Chips.
3. Sky: "Our product", with 3 offers (label plus text) and an image.
4. "The team": a group photo, then 6 person cards (circle photo, role label, name in h3, study).
5. Sun: "Our impact": 3 BigNumbers and 2 info cards.
6. Sky: "Collaboration with IBF": text, a Secondary "More on IBF", and the IBF logo in a circle.
7. Lagoon: "Future plans": 4 info cards.
8. "Next workshop": h2, text, a Primary button; contact card (`id="contact"`).

### 5.8 Personal page (Thema 9) · `/profile`

1. Page hero: "Hello, *name*".
2. Profile card:
   - avatar;
   - fields **Name, E-mail, School, School number (NPSN), Phone** *(decision: the account fields, not Figma's age and class)*;
   - the "Verified teacher" badge;
   - small Secondary buttons: Log out · Change password · Delete account (danger style, §2.3). The last two jump to the Account section.
3. "Your progress": 4 BigNumbers:
   - themes finished (sun);
   - tests finished (leaf);
   - tests attempted (lagoon);
   - lesson modules seen (ember).
4. Sky: "Your level", with the level track (§4.14).
5. "Resources you might like": 4 LessonCards. Then "Saved resources".
6. **Kept from the account screens** (§5.10), restyled: the invite-code box and the Account section.

When logged out, the page shows progress kept in the browser and a "Log in" button.

### 5.9 Glossary (`299:1502`) · `/glossary`

- Page hero: "Glossary", "Hard words, simple meanings.", plus a line.
- One section per theme in its accent: "Theme n: Name" (h3 ink), then white info cards (term in h3 brand blue, meaning).
- The terms come from the themes (§6).

### 5.10 Pages kept from the current site

These aren't redesigned on Page 2. They keep their structure and get the new tokens, header and footer:

- **Log in and the account screens:** log in, register, check your e-mail, e-mail confirmed, forgot password, new password.
  - They keep the shell of `274:2118`: a full-bleed Bromo photo with a sky card at `--radius-lg`.
  - The account rules stay as accepted on 2026-10-22:
    - fields with visible labels;
    - a show/hide password toggle;
    - message boxes (white, `--radius-md`, a 4 px left edge in the tone colour, an icon, and `role="alert"` or `"status"`);
    - the busy state "Please wait…".
  - The three grey squares (social log-in) stay out.
- **Personal page extras:**
  - the **invite-code box** (outlined, `--radius-md`; "Unlock teacher materials"; code field plus "Verify");
  - the **Account section** (My details, E-mail address, Password, My data, Delete account).
- **Teacher-only file block:**
  - sky, `--radius-md`, a white 64 px icon circle;
  - Locked: "For verified teachers only", with "Log in to download" or "Enter your invite code";
  - Verified: "Download".
- **Admin page** (`/profile/admin`): invite codes, feedback totals, and the comments (§4.13).
- **Privacy, Terms, 404:** page hero plus text.

---

## 6. Content (CMS)

All page text and images are edited in Decap CMS. Each content file holds `{ en, id }`.

### 6.1 Collections

| Collection | Contents |
|---|---|
| **Site settings** | Tagline, partner logos |
| **Home** | Everything in §5.1. Featured lesson plans are picked from the resources. |
| **Themes** (4) | Number, title, accent, hero texts and image, card text and image, three intro cards, **sections** (§6.2), **glossary terms** (term plus meaning), test resource, PDF |
| **Resources** | Common fields: title, type, theme, image, grade, duration, short line, order.<br>**Lesson plan:** author, about, learning goals, context, materials, steps, key message, teacher tip, photos, file, teacher-only file.<br>**Test:** intro, questions (text, single or multiple, options, correct answers, **explanation**).<br>**For teachers / extra:** description, file or link. |
| **Mission** | Everything in §5.7 |
| **Glossary page** | Hero texts. The terms come from the themes. |
| **Simple pages** | Privacy, Terms |
| **Levels** | The six names and their point thresholds |

### 6.2 Section blocks (theme pages)

**Layout options** *(added in C5 to match the frames)*:
- `layout`: stack · split (two columns, about 560 + 613) · split-title (title and intro in the left column) · split-wide (left column twice as wide, e.g. a map and its legend).
- `joinPrevious`: continue the section above (same background, no title, no gap), e.g. two columns under a full-width map.
- Image `size`: its own size at most the column (default) · small 220 px (default for circles) · medium 307 px · full column width.
- Info cards: `columns` 1–5 (in a narrow column at most 2), and a colour per card.

**Every section has:**
- a title;
- a chip label;
- a **background**: page / sky / sun / ember / leaf / lagoon;
- a **layout**: stack, or two columns;
- **blocks**, in any order.

**Block types:**

| Block | Contents |
|---|---|
| text | Rich text |
| image | Image, alt text, shape (rounded / arch / circle / oval), source line |
| callout | Kind (§4.5), optional title, text |
| big numbers | 2–4 × value, caption, style |
| numbered cards | 3–5 × title, text |
| info cards | n × title, text, optional dot colour or image, columns (3 / 4 / 5) |
| quote | Quote, attribution, optional image |
| link buttons | n × label, link, style |
| video | YouTube/Vimeo URL, title, caption |

---

## 7. Languages and routes

- **Indonesian** (default) at `/…`; **English** at `/en/…`. Old `/id/…` links redirect.
- Indonesian pages without a translation show the English content with a notice (Text/small on sky, `--radius-md`).
- **Routes:**
  - `/`
  - `/themes/climate` · `/themes/climate-change` · `/themes/human-and-nature` · `/themes/solutions`
  - `/resources` (filters in the query)
  - `/resources/:slug`
  - `/resources/:slug/test`
  - `/glossary`
  - `/mission`
  - `/profile` · `/profile/admin`
  - `/login` · `/register` · `/forgot-password` · `/reset-password` · `/auth/callback`
  - `/privacy` · `/terms`
  - 404

---

## 8. Assets

- **Logo:** `src/assets/svg/logo.svg`, unchanged. Page 2 uses the same file, with "human" in `#0009BC` and "nature" in `#198F51`.
- **Photos and illustrations from Page 2** (hero photos, theme card photos, maps, El Niño diagrams, the Ring of Fire map, the island-map illustration, the shapes illustration, the IBF logo, team photos) are downloaded from Figma per page during the build. They're optimised with `npm run images` into WebP, with set width and height, and lazy-loaded below the fold.
- **Placeholders in the design** (grey boxes, the yellow circle, "Badge"): neutral `--surface-sky` blocks with a label, until the team supplies the real image.
- **Photo rights** must be confirmed by the team before going live.

---

## 9. Accessibility

- WCAG 2.2 AA. Contrast follows §2.3.
- Every interactive element has the §2.6 focus ring and a hit area of at least 24 × 24 px.
- Tags and chips used as links count as interactive.
- **Forms** have visible labels; quiz options are real inputs grouped in fieldsets.
- **Colour is never the only signal:** result pills carry ✓ or ✗; the theme dot is next to the theme name.
- **Images** have alt text. Decorative shapes have an empty alt.
- The page language is set per locale.
