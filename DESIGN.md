# DESIGN.md — Human Nature website

Source of truth for the website's design. Extracted from Figma via the Figma MCP server on 2026-10-20.

- **Figma file:** `eK4SrAUxIup1f2HYEEBHF0` ("Untitled"), page `0:1` ("Page 1")
- **File URL:** https://www.figma.com/design/eK4SrAUxIup1f2HYEEBHF0/Untitled?node-id=0-1
- Frame links below use `https://www.figma.com/design/eK4SrAUxIup1f2HYEEBHF0/Untitled?node-id=<id with - instead of :>`

> **Status of the design:** most frames are mid-fidelity wireframes. Many blocks are grey `#D9D9D9` placeholders and much of the copy is placeholder (e.g. "Explanation iets.", "Title") or internal notes. Where this document says *placeholder*, the final content has not been designed yet. If a value is **not defined in Figma**, this document says so instead of inventing one.

> The file changed while it was being reviewed: frame `114:36` was renamed to "Resources page in depth test" and frame `119:181` to "Test page", and the content of `119:181` was updated. This document reflects the latest reads.

---

## 1. Overview

**What the site is:** *Human Nature* ("human / nature" wordmark) offers free climate-change education resources for primary-school teachers and their students, with an Indonesian focus (Lombok, Mount Bromo, Ring of Fire, El Niño/La Niña, Indonesian-language copy in places). Its tagline (in the footer) is: *"Climate lessons for primary school teachers and their students, about people, nature and what we can do together."*

Main areas:

- **Themes:** four learning themes. Each has a long content page: 1. Climate, 2. Climate Change, 3. Human and Nature, 4. Solutions.
- **Materials / Resources:** a filterable library of lesson plans, tests ("Test your knowledge") and extra resources, with detail pages.
- **Our mission:** about the project (product, team, impact, collaboration with IBF, future plans).
- **Accounts:** log in, plus a personal page showing the user's progress and learner level.

### Frames

All frames are desktop, 1440 px wide. There are **no mobile or tablet frames.**

| # | Frame name (Figma) | Node ID | Size (w × h) | Role | Link |
|---|---|---|---|---|---|
| 1 | Desktop - 1 | `1:2` | 1440 × 1024 | Early hero-only version of the landing page (superseded by #2) | [open](https://www.figma.com/design/eK4SrAUxIup1f2HYEEBHF0/Untitled?node-id=1-2) |
| 2 | Landing page | `3:127` | 1440 × 4000 | Home page | [open](https://www.figma.com/design/eK4SrAUxIup1f2HYEEBHF0/Untitled?node-id=3-127) |
| 3 | Theme 1: Climate | `22:2` | 1440 × 5930 | Theme page (most finished) | [open](https://www.figma.com/design/eK4SrAUxIup1f2HYEEBHF0/Untitled?node-id=22-2) |
| 4 | Theme 2 Climate Change | `26:242` | 1440 × 5930 | Theme page | [open](https://www.figma.com/design/eK4SrAUxIup1f2HYEEBHF0/Untitled?node-id=26-242) |
| 5 | Theme 3 Human and Nature | `43:195` | 1440 × 7260 | Theme page (wireframe) | [open](https://www.figma.com/design/eK4SrAUxIup1f2HYEEBHF0/Untitled?node-id=43-195) |
| 6 | Theme 4: Solutions | `45:2` | 1440 × 7338 | Theme page (wireframe) | [open](https://www.figma.com/design/eK4SrAUxIup1f2HYEEBHF0/Untitled?node-id=45-2) |
| 7 | Resources page | `61:378` | 1440 × 3236 | Resource library (list + filters) | [open](https://www.figma.com/design/eK4SrAUxIup1f2HYEEBHF0/Untitled?node-id=61-378) |
| 8 | Resources page in depth | `61:524` | 1440 × 3236 | Resource detail: lesson plan ("Lesson plan: Climate") | [open](https://www.figma.com/design/eK4SrAUxIup1f2HYEEBHF0/Untitled?node-id=61-524) |
| 9 | Resources page in depth test | `114:36` | 1440 × 2684 | Resource detail: test intro ("Test your knowledge: Climate Change") | [open](https://www.figma.com/design/eK4SrAUxIup1f2HYEEBHF0/Untitled?node-id=114-36) |
| 10 | Test page | `119:181` | 1440 × 2684 | Quiz page (questions with checkboxes) | [open](https://www.figma.com/design/eK4SrAUxIup1f2HYEEBHF0/Untitled?node-id=119-181) |
| 11 | Our mission | `61:693` | 1440 × 3317 | About page (wireframe) | [open](https://www.figma.com/design/eK4SrAUxIup1f2HYEEBHF0/Untitled?node-id=61-693) |
| 12 | Personal page | `61:795` | 1440 × 2546 | User profile / progress | [open](https://www.figma.com/design/eK4SrAUxIup1f2HYEEBHF0/Untitled?node-id=61-795) |
| 13 | Desktop - 2 | `114:4` | 1440 × 1024 | Log-in screen ("Welcome Back!") | [open](https://www.figma.com/design/eK4SrAUxIup1f2HYEEBHF0/Untitled?node-id=114-4) |

There is also one loose image on the canvas outside any frame: `119:280` "image 2" (199 × 208). The same image is used in frame #10.

---

## 2. Design tokens

### 2.1 Figma variables and styles that are actually defined

These are the only named tokens in the file (from `get_variable_defs`):

| Name | Value |
|---|---|
| `Green` | `#198F51` |
| `Header 3` | Inter Bold, 36 px, weight 700, line-height 1.32, letter-spacing −2 *(defined, but no frame was seen using it)* |
| `Subtitle` | Inter Regular, 32 px, weight 400, line-height 1.2, letter-spacing 0 |
| `Subheading` | Inter Regular, 20 px, weight 400, line-height 1.2, letter-spacing 0 |
| `Body Small` | Inter Regular, 14 px, weight 400, line-height 1.4, letter-spacing 0 (strong weight variable = 600) |
| `M3/display/small-emphasized` | Roboto Medium, 36 px, weight 500, line-height 44 px, tracking 0 |
| `M3/label/small-emphasized` | Roboto SemiBold, 11 px, weight 600, line-height 16 px, tracking 0.5 px |
| `sds-typography-*` variables | body font Inter; body-size-small 14; body weight regular 400 / strong 600; subtitle size 32; subheading size 20 |

Every other value below is a raw value read from layers. It is not a named token in Figma.

### 2.2 Colors

| Role | Value | Where |
|---|---|---|
| **Primary blue** (brand) | `#0009BC` | Headings, body text on inner pages, all buttons, tag outlines, filter radios, progress bar, "human" in logo, footer bottom bar |
| **Brand green** | `#198F51` (variable `Green`) | "nature" in logo |
| White | `#FFFFFF` | Page background, nav text over images, button labels, text on image cards |
| Black | `#000000` | Long-form body copy on theme pages, quiz text, outline boxes (comment boxes, checkboxes), annotation labels |
| Placeholder grey | `#D9D9D9` | All image and content placeholders; also the "Progress ?" label text |
| Light-blue band | `rgba(200, 220, 248, 0.44)` | Full-width section backgrounds on Landing page ("How it works", quote, "Collaboration") |
| Login card | `rgba(200, 219, 248, 0.85)` | Log-in panel on Desktop - 2 |
| Muted blue (placeholder text) | `rgba(0, 9, 188, 0.58)` | Input placeholder text ("User name or Email", "Password") |
| Hero image overlay | Image at **44% opacity** (`opacity: 0.44`) on a white frame | Landing hero and the 100 px header strip on inner pages. The resulting light-blue/grey tint is not a defined color. |
| "Climate Class" wordmark letters | `#FFCC00`, `#FF383C`, `#FF8D28`, `#00C3D0`, `#34C759`, `#CB30E0`, `#00C8B3`, `#FF2D55` | Multi-coloured "Climate Class" promo text only |
| Footer background (light blue) | **Not defined.** The footer is a flat raster image. | All pages with a footer |

### 2.3 Typography

Font families used: **Inter** (primary), **Roboto** (navigation, one label), **Just Me Again Down Here** ("Climate Class" wordmark only), **Space Grotesk** (two one-off labels on Theme 1).

| Usage | Family / style | Size | Line-height | Letter-spacing | Color |
|---|---|---|---|---|---|
| Hero H1 ("Climate Change Education") | Inter Medium (500) | 93.951 px | 0.82 | −1.879 px | `#0009BC` |
| Page H1 (e.g. "Resources", "Our Mission", "Hello, User", theme titles, "Welcome Back!", landing "Themes", "Lesson plans") | Inter Medium (500) | 64 px | 0.82 | −1.28 px | `#0009BC` |
| Landing "Collaboration" heading | Inter Italic | 64 px | 0.82 | −1.28 px | `#0009BC` |
| Section H2 (e.g. "Resources (12)", "Related Resources", "Our Product", "Level progress bar", "What did you think of this resource?" on resource pages, "10 Questions") | Inter Medium (500) | 32 px | 0.82 | −0.64 px | `#0009BC` |
| Quote / "How it works" | Inter Italic (bold part: Inter Bold Italic) | 32 px | 1.1 | −0.64 px | `#0009BC` |
| Hero intro paragraph | Inter Regular | 36 px | 1.32 | −0.72 px | `#0009BC` |
| Theme-page section titles; landing theme-card titles (`Subtitle`) | Inter Regular (one instance Inter Bold) | 32 px | 1.2 | 0 | `#0009BC` (white on image cards) |
| Card titles (`Subheading`) | Inter Regular | 20 px | 1.2 | 0 | `#0009BC` (white on image cards) |
| Long-form body copy (theme pages) | Inter Regular | 20 px | normal | 0 | `#000000`, often `text-align: justify` |
| Quiz questions | Inter Italic, numbered list | 20 px | normal | 0 | `#000000` |
| Quiz answer options | Inter Regular | 20 px | normal | 0 | `#000000` |
| Feedback prompt on theme pages ("What did you think of this resource?") | Inter Medium | 20 px | 0.82 | −0.4 px | `#0009BC` |
| Personal stats ("Themes finished: 1", …) | Inter Regular | 36 px | 1.4 | 0 | `#0009BC` |
| Body / captions / filters (`Body Small`) | Inter Regular | 14 px | 1.4 | 0 | `#0009BC` (white on image cards) |
| Button label | Inter SemiBold (600) | 13 px | 1.4 | 0 | `#FFFFFF` |
| Large CTA label ("Button Test Knowledge!") | Inter SemiBold (600) | 36 px | 1.4 | 0 | `#FFFFFF` |
| Annotation / chip labels (wireframe labels such as "explanationimage", "Consequences") | Inter SemiBold (600) | 13 px | 1.4 | 0 | `#000000` |
| "Register" link | Inter Italic, underlined | 14 px | 1.4 | 0 | `#0009BC` |
| Progress label ("Progress ?") | Inter Regular | 11 px | 1.4 | 0 | `#D9D9D9` |
| Main nav items | Roboto Medium (500), `M3/display/small-emphasized` | 36 px | 44 px | 0 | `#FFFFFF` |
| Main nav item, current section | Roboto Bold (700). Theme 1 uses Roboto ExtraBold (800). | 36 px | 44 px | 0 | `#FFFFFF` |
| Nav chevron | Roboto Medium ">" glyph rotated 90° | 36 px | 44 px | 0 | `#FFFFFF` |
| "Forgot password" | Roboto SemiBold, `M3/label/small-emphasized` | 11 px | 16 px | 0.5 px | `#0009BC` |
| "El Niño" / "La Niña" image labels | Space Grotesk Bold | 20 px | normal | 0 | `#0009BC` |
| "Climate Class" wordmark | Just Me Again Down Here Regular | 48 px (128 px on resource detail) | 1 | 0 | Multicolour (see 2.2) |

### 2.4 Spacing scale

**Not defined in Figma.** There are no spacing variables and no auto-layout. All layers are absolutely positioned. Observed recurring values:

- Page side margin: **43–47 px** (mostly 44 px) on a 1440 px frame.
- Gutter between 4-up columns: **~50 px** (columns start at x = 44/45, 395, 745, 1096, so the column step is ~350 px).
- Gutter between 2-up half columns: **~49 px** (651/652 px columns at x = 44 and 745).
- Lesson-plan mini cards: 175 px wide, step 235 px (gutter 60 px).
- Text inset inside cards: ~21–22 px from the card's left edge.
- Vertical rhythm is inconsistent between sections. There is no defined value.

### 2.5 Border radii

There are no radius tokens. These are the observed values:

| Value | Used on |
|---|---|
| 0 | Most grey placeholders, landing theme cards, resource cards |
| 6 px | Tags/chips (outlined) |
| 6.5 px | Progress bar (fill and track) |
| 7 px | Text inputs (log-in) |
| 11 px | All standard buttons |
| 15 px | Sidebar "Comment section ?" box |
| 18 px | Large CTA button (581 × 89), theme sub-cards on Theme 1, "Climate Class" image card |
| 22 px | Comment box on resource pages |
| 40 px | Comment box on theme pages |
| 67 px | Profile card (Personal page) |
| 72 px | Level-progress image (Personal page) |
| 91 px | Log-in card |
| 50% / full | Circular images (307, 300, 256, 140, 524 px circles) |

### 2.6 Shadows

| Name | Value | Used on |
|---|---|---|
| Button shadow | `0 3px 4px 0 rgba(0, 0, 0, 0.25)` | Every filled blue button, including the large CTA |

No other shadows or effects are defined.

### 2.7 Borders and lines

- Tag outline: 1 px solid `#0009BC`.
- Progress track: 1 px solid `#0009BC`.
- Comment boxes and quiz checkboxes: 1 px solid `#000000`.
- Resource-page sidebar divider: vertical line at x = 344, 668.46 px tall (SVG asset, stroke ~2 px, colour from asset).

### 2.8 Breakpoints and frame widths

- All frames are **1440 px** wide (desktop).
- **No breakpoints are defined. No mobile or tablet frames exist.**

### 2.9 Opacity

- Hero and header background images: 0.44.
- Lesson-plan hero image on the resource detail page (`78:83`): 0.38.

---

## 3. Layout

### 3.1 Grid and container

- Frame width 1440 px. The effective content area runs from x ≈ 44 to x ≈ 1396 (**~1352 px wide**, ~44 px side margins).
- **4-column grid**: column width ~300 px (299–302), gutter ~50 px.
- **2-column split**: 651–652 px columns, ~49 px gutter.
- **Sidebar layout** (Resources, resource details, Test page, Our mission): left sidebar x 44 → 344 (filters / section links), with a vertical divider at x = 344 on resource pages. Main content starts at x ≈ 395 (spanning 3 grid columns ≈ 1000 px).
- No auto-layout or constraints were used. Every layout must be rebuilt as flex/grid.

### 3.2 Page shells

- **Full-bleed hero pages** (Landing, Desktop - 1, all Theme pages, Log-in): a full-width background photo ~1017–1033 px tall, with the transparent nav overlaid at the top.
- **Inner pages** (Resources, resource details, Test page, Our mission, Personal): a 100 px-tall header strip that shows the hero photo at 44% opacity, then a page H1 at y = 175 px, then a 14 px intro line at y = 234 px.
- Footer: full-width, 348 px tall, at the bottom of most pages (see 4.2 for where it is missing).

### 3.3 Mobile

**There are no mobile frames.** Mobile layout is undefined (see Open questions).

---

## 4. Shared components

### 4.1 Header / main navigation

- **Logo** ("Group 1"): SVG wordmark, 138.29 × 57.17 px at (43, 24). "human" in `#0009BC` over "nature" in `#198F51`. It is a link on inner pages.
- **Nav items:** "Themes", "Materials", "Our mission", each followed by a chevron (a ">" rotated 90°, so it reads like "v"). This suggests dropdown menus, but **dropdown contents are not designed.**
- **Variant A, landing / Desktop - 1:** items left-aligned after the logo (Themes at x 225, Materials 407, Our mission 614), plus a **Log in** button on the right (86 × 36, at x 1325, y 28).
- **Variant B, all other pages:** items right-aligned (Themes x 750, Materials 932, Our mission 1139). **There is no Log in button and no user/avatar entry.**
- **Active state:** the current section's label is bold (Roboto Bold; Roboto ExtraBold on Theme 1). Examples: "Materials" on resource pages, "Our mission" on Our mission and Personal, "Themes" on theme pages.
- **Text colour:** white in Figma on every page. **Changed:** it is primary blue on the inner-page strip and the landing hero, for contrast (see §8.9).
- **Undefined:** hover state, focus state, dropdown panel, mobile menu, sticky behaviour.

### 4.2 Footer

- Node name "Footer@1x 1". It is a **single raster image** (1440 × 348), not live layers.
- Visible content (read from the render): logo, the tagline above, and three link columns:
  - **Themes:** 1. Climate · 2. Climate change · 3. Human and nature · 4. Solutions
  - **Materials:** Lesson examples · Download the module · Test your knowledge
  - **Our mission:** About us · Contact · Partners
  - A bottom bar in primary blue with "© 2026 Human nature. All rights reserved." and the links Privacy · Terms of use · Contact.
- **Used on:** Landing page, Theme 1–4, Our mission, Personal page, Resources page in depth test, Test page.
- **Missing on:** Resources page (`61:378`), Resources page in depth (`61:524`), Desktop - 1, Desktop - 2.
- Exact colours, fonts and sizes of the footer are **not defined**, because it is a bitmap.

### 4.3 Buttons

**Primary button:** fill `#0009BC`, radius 11 px, button shadow, label Inter SemiBold 13 px white (left-padded, not centred, in the frames). There are no variants or states defined in Figma. Sizes seen:

| Size (w × h) | Label(s) | Where |
|---|---|---|
| 86 × 36 | Log in | Landing nav, Desktop - 1 nav |
| 80 × 30 | Log in | Log-in form |
| 196 × 30 | Button Test Knowledge! | Theme hero (all 4 themes) |
| 125 × 45 | Download; log out; delete account | Resource detail, Personal |
| 139 × 45 | Start the test | Resources page in depth test |
| 150 × 45 | change password | Personal |
| 185 × 45 | Check your answers | Test page |
| 294 × 45 | Go to lesson examples; Go to theme N; < Go to theme N; Go to randomizer; < Go to randomizer; Check progress: climate action tracker … | Theme pages, resource pages |

**Large CTA:** 581 × 89, fill `#0009BC`, radius 18 px, button shadow, label "Button Test Knowledge!" in Inter SemiBold 36 px white. Used on Theme 1, 2, 3.

**Text link:** "Register" (Inter Italic 14, underlined, `#0009BC`) and "Forgot password" (Roboto SemiBold 11, `#0009BC`) on the log-in screen.

**States:** hover, active, focus, and disabled are **not defined** for any button.

### 4.4 Cards

| Card | Spec | Where |
|---|---|---|
| **Theme card (landing)** | 299 × 414 photo, no radius. Title Inter Regular 32 white at the bottom; description 14 px white below it. Whole card is a link. | Landing "Themes" row (4 cards: Climate, Climate Change, Human and Nature, Solutions) |
| **Resource card** | 299 × 414 grey placeholder. Top-left: up to 2 **tags**. Top-right: **star** icon 45 px. Bottom: Title (20 px `#0009BC`) and description (14 px `#0009BC`, box 256 × 72). Optional **progress bar** at the bottom. | Resources page (12 cards, 3 per row); "Related Resources" (4 per row) on resource detail pages; Personal page ("Resources you might be interested in:") |
| **Lesson-plan mini card** | 175 × 247 grey; star icon 45 px top-right; Title 20 px + description 14 px (`#0009BC`). | Landing "Lesson plans" (6 cards); Theme 4 "What are things you can do?" (2 rows × 6, titled e.g. "LED lights", "Scooter share") |
| **Theme sub-card** | 300 × 306 (radius 18 on Theme 1, none on Themes 2–4). Title 20 px + description 14 px. On Theme 1 they are photos with white text. | Theme hero row (3 cards: overview / lesson module / news) |
| **"Climate Class" promo card** | ~301 × 306 photo, radius 18, with the "Climate Class" multicolour wordmark (48 px) | Theme 1, Theme 3, and Theme 1 hero |

### 4.5 Tags / chips

- Outline 1 px `#0009BC`, radius 6 px, height 21 px. Label Inter Regular 14 px `#0009BC`.
- Widths seen: 99, 115, 149 px.
- Labels seen: "Lesson plan", "For Teachers", "Climate change", "Climate", "Test your knowledge", "Climate Change".
- Used on resource cards and resource detail headers.

### 4.6 Star (favourite?) icon

- 45 × 45 star SVG in `#0009BC`. There are two variants, **filled** and **outline**: on the landing page, card 2 has an outline star. Their meaning is **not defined**.
- Used on resource cards, lesson-plan mini cards and the resource detail header.

### 4.7 Progress bar

- Track: 282 × 13, 1 px `#0009BC` outline, radius 6.5.
- Fill: `#0009BC`, radius 6.5 (167 px wide in the example).
- Label "Progress ?" (11 px, `#D9D9D9`).
- Used on the first resource card of the Resources page.

### 4.8 Filter sidebar (forms)

- Heading "Filters (n)" (14 px). Each row is a 20 px circle (radio-like; filled `#0009BC` when selected, outline when not) plus a 14 px label.
- Top-level options: "Themes >" (collapsed) / "Themes v" (expanded), "For teachers", "Lesson plans", "Tests" (also "Test you knowledge" [sic]), "Extra resources".
- Expanded Themes shows 12 px sub-circles: Climate, Climate Change, Human and Nature, Solution.
- Below the filters: a "Comment section ?" box (268 × 82, 1 px black border, radius 15).
- Vertical divider at x = 344.
- Used on Resources page, Resources page in depth, Resources page in depth test, Test page.
- Whether options are single-select or multi-select is **not defined**, and there are no interaction states.

### 4.9 Section navigation (theme pages and Our mission)

- **Theme pages:** "Group 8" (20 × 205) and "Group 9" (205 × 20, rotated) are SVG timeline/indicator graphics. Next to them is a list of section links (14 px `#0009BC`).
  - Theme 1: Introduction · Weather vs. Climate · Different Climates · Ring of Fire · Atmosphere · Test your knowledge!
  - Themes 2–4 reuse: Introduction · Ice age vs warm age · Accelerated global warming · Who is responsible for Climate change? · What are the consequences? · Test your knowledge!
- **Our mission:** 20 px circles plus links: Mission · Our product · The Team · Our Impact · Collaboration IBF · Future plans.
- Active and scroll-spy states are **not defined.**

### 4.10 Forms

- **Log-in form** (Desktop - 2): card 605 × 752, `rgba(200,219,248,0.85)`, radius 91. It contains:
  - H1 "Welcome Back!" (64 px).
  - Two inputs, 494 × 56, white, radius 7, with placeholders "User name or Email" and "Password" (14 px, 58% blue).
  - "Log in" button (80 × 30) and a "Forgot password" link.
  - A "Register" link.
  - A large logo (SVG "human"/"nature" vectors, 445 × 184).
  - Three 64 × 64 grey squares (purpose undefined; possibly social log-in).
- **Quiz** (Test page):
  - Heading "10 Questions" (32 px).
  - Numbered questions (Inter Italic 20, black).
  - Answer options with 20 × 20 square checkboxes (1 px black border, no radius), labels Inter Regular 20 black.
  - "Check your answers" button.
- Error, success, focus and checked states are **not defined.**

### 4.11 Feedback widget

- Prompt "What did you think of this resource?". It is 32 px Medium on resource pages and 20 px Medium on theme pages.
- Below it are thumbs-up / thumbs-down images. They are the same raster image (`image 3`), one rotated 180°. Size is 93 px on resource pages and 66 px on theme pages.
- Used on Resources page in depth, Resources page in depth test, and Themes 1 and 3.

### 4.12 Comment section

- Only placeholders exist: outlined boxes (1 px black) labelled "Comment section ?" / "Commentsection ?".
- Sizes: 268 × 82 (r 15, sidebar), 651 × 97 (r 22 on resource pages, r 40 on theme pages), 651 × 149 (r 40).
- **Behaviour and design are undefined.**

### 4.13 Download-module block

- A PDF icon image (`image 17`, 195 × 240) next to a grey 199 × 238 placeholder, with the label "Download the module".
- Used on Theme 1 and Theme 3. Themes 2 and 4 show only a grey 651 × 238 placeholder with the label.

### 4.14 Theme prev/next + lesson-examples buttons

- At the bottom of each theme page there are three 294 × 45 primary buttons: "Go to lesson examples", "Go to theme N" (right), and "Go to theme N" (left).
- **Inconsistency:** Theme 1's left button says "Go to theme 4" and Theme 3's buttons have no arrows, while Themes 2 and 4 use "< Go to theme N" / "Go to theme N >".

### 4.15 Image placeholders and captions

- Circles 307 px (also 140, 256, 300, 524 px) built from grey ellipse SVGs, with 13 px SemiBold black labels.
- Caption bars: 300 × 19 grey `#D9D9D9` with the label "explanationimage".
- Grey label chips: 300–351 × 57 `#D9D9D9` with 13 px SemiBold black labels.
- These are wireframe devices. Final styling is **undefined.**

---

## 5. Page-by-page breakdown

### 5.1 Desktop - 1 (`1:2`): early landing hero

Same as the Landing hero (5.2), but:
- The background image runs past the frame (−40, −7; 1519 × 954) and the frame has no white fill, so the photo renders dark.
- The intro copy reads "…free educational resources **based on ?**, equipping…".
- The nav is grouped as "Group 12".

This frame appears to be superseded by the Landing page.

### 5.2 Landing page (`3:127`)

1. **Hero** (0–945):
   - Photo `image 1` (children on a beach) at 44% opacity.
   - Logo and Nav variant A with Log in.
   - H1 "Climate Change / Education" (93.95 px, centred, y 244).
   - Intro paragraph, 36 px centred, 922 px wide: *"In the face of climate change, Human Nature supports teachers and educational systems by offering free educational resources, equipping students and encouraging them to take action for a better future."*
2. **Themes** (y 1014):
   - H1 "Themes" (64 px) and the line "Explanation iets." (placeholder).
   - 4 theme cards (299 × 414) at y 1149: **Climate** (`WhatsApp Image … 09.21.35`), **Climate Change** (`foto bromo 1`), **Human and Nature** (`WhatsApp Image … 09.21.36`), **Solutions** (`farming 1`), each with the description placeholder "Explanation iets.".
3. **How it works** band (y 1638, h 371, light-blue band): italic 32 px heading "How it works", plus placeholder attribution "Garry Conille, UNICEF Regional Director for Latin America and the Caribbean." (14 px).
4. **Lesson plans** (y 2064): H1 "Lesson plans" and 6 lesson-plan mini cards (175 × 247, y 2196), each with a star (card 2 has an outline star) and "Title" / "Explanation iets." placeholders.
5. **Quote band** (y 2487, h 371): italic 32 px UNICEF quote (*"Environmental education from the earliest years of life could be the most effective way…"*, with a bold-italic middle sentence), attributed to Garry Conille, UNICEF.
6. **Collaboration band** (y 3260, h 202): italic 64 px "Collaboration" and the text "IBF" (placeholder for partner logos?).
7. **Footer** (y 3652).

### 5.3 Theme 1: Climate (`22:2`)

1. **Hero:**
   - Full-bleed photo (`WhatsApp Image … 09.21.35 2`), Nav variant B with "Themes" active (ExtraBold).
   - Right-aligned H1 "Climate" and subtitle placeholder *"Many different climates, located different places around the world, maybe something with animals for the hype?"*.
   - Primary button "Button Test Knowledge!" (196 × 30).
2. **Section nav + sub-cards** (y 653):
   - Section links on the left (4.9).
   - 3 sub-cards, all radius 18: "Learn about different Climates" (`image 14`); "Climate Lesson module" with the "Climate Class" wordmark and "Click here to navigate to" (`image 12`); "News article" / "Click here:" (`image 15`).
3. **Weather vs. Climate** (y 1087):
   - 32 px heading and Indonesian body copy (*"Cuaca selalu ada di sekitar kita…"*, 20 px black, justified).
   - Infographic `Frame 1 1` (815 × 380) on the right, with a caption bar.
4. **Iklim yang berbeda / Different climates** (y 1483):
   - English body copy listing the 7 climate types (Equatorial, Subequatorial, Tropical, Subtropical, Temperate, Subpolar, Polar) as a bullet list.
   - World climate map `image 8` (676 × 405) with a caption bar.
5. **El Niño dan La Niña** (y 2071, right-aligned heading):
   - Images `image 6` / `image 7` (573 × 199, same source cropped) labelled "La Niña" / "El Niño" (Space Grotesk Bold 20).
   - English explanatory copy (652 px column).
6. **The Ring of Fire** (y 2607, centred heading):
   - Map `image 9` (829 × 426).
   - Body copy about Indonesia's volcanoes and tsunamis.
   - Two 307 px circular images: `image 10` "earthquake" and `image 11` "vulcanos".
7. **Atmosphere** (y 3561): grey placeholders (1002 × 355, 300 × 429, 2 × 651 × 429) and the placeholder text "iets over verschillende klimaten jah".
8. **CTA:** large "Button Test Knowledge!" (581 × 89).
9. **Module and feedback:** PDF icon and "Download the module"; "What did you think of this resource?" with thumbs; comment box; "Climate Class" promo card (`image 16`).
10. **Bottom nav buttons:** "Go to lesson examples", "Go to theme 2", "Go to theme 4".
11. **Footer.**

### 5.4 Theme 2: Climate Change (`26:242`)

1. **Hero:** photo `foto bromo 2` (Mount Bromo), H1 "Climate Change", the same placeholder subtitle, and the 196 × 30 test button.
2. **Section links and 3 grey sub-cards:** "Working of atmosphere" / "click back to other theme"; "of al lesmodule voor kids" (Dutch note); "News".
3. **Ice Age & Warm Age** (y 1087):
   - Placeholder copy.
   - Circular images `image 19` ("Ice age mammoths") and `image 20` ("Warm age, dinosaurs").
   - Temperature graph `image 21` (787 × 264): "Graph of changing temperatures over millions of years!".
4. **Climate Change: What is happening** (y 1748):
   - Notes copy with bullets (CO₂ graph, temperature graph).
   - Graphs `image 22` (693 × 237) and `image 23` (671 × 298), captioned "nasa image".
5. **Who is responsible:**
   - Infographic `image 2` (651 × 385; a pie/icon chart of emission sources).
   - Note text in Dutch/English.
   - 4 circles (Industry, Livestock, Foodproduction, waste) above 4 grey columns (co2/industry, Livestock and poop, Deforestation, Amount produced).
   - "Who is responsible" chip, a "Country vs citizens" bar, and 2 × 651 × 429 placeholders.
6. **Consequences:** chip and bullet notes (ocean acidification, coral dying, sea level rising, extreme weather — "lombok specific").
7. **CTA:** large "Button Test Knowledge!".
8. **Bottom:** grey "Download the module" block; "Go to lesson examples", "< Go to theme 1", "Go to theme 3 >"; comment box; footer.

### 5.5 Theme 3: Human and Nature (`43:195`)

1. **Hero:** photo `WhatsApp Image … 09.21.36 2`, H1 "Human and Nature" (2 lines), placeholder subtitle, and test button.
2. **Section links:** these duplicate Theme 2's labels (wrong for this theme). Sub-cards: "Mangroves", "of al lesmodule voor kids", "News".
3. **Human and nature:**
   - Chip, and Dutch intro copy *"Mensen zijn onderdeel van de natuur…"*.
   - 4-circle cluster (140 px).
   - "We impact nature" box, plus "Ontbossing" and "farming or pollution" image placeholders (301 × 250).
4. **Natures impact on human:**
   - Copy *"Nature provides food sources…"*.
   - A staggered zig-zag of 3 circles (Mangrove, Coral, Ocean forest/co2 capture), each with a 650 × 250 box.
5. **Consequences for nature:** a 4 × circle row (Extinction, Coral dying, Ice melting, Ocean acidification) above 4 text columns.
6. **Consequences for humans:**
   - Notes, then a 4 × circle row (Rising sea level, heat waves, droughts, Flooding) above 4 columns.
   - News examples ("News example of lombok weather", "News example somewhere else").
   - Tipping-point copy (Dutch, *"Soms gaat een ecosysteem…"*) with circles "Amazone" and "Coral reefs".
7. **CTA:** large "Button Test Knowledge!".
8. **Bottom:** download-module block with PDF icon; feedback with thumbs; comment box; Climate Class card (`image 18`); "Go to lesson examples", "Go to theme 2", "Go to theme 4".
9. **Footer.** It sits at y 6552 and the frame continues to 7260, leaving ~360 px of empty space below it.

### 5.6 Theme 4: Solutions (`45:2`)

1. **Hero:** photo `farming 2` (two stacked copies, `70:19` and `73:22`), H1 "Solutions", placeholder subtitle, and test button.
2. **Section links:** "Group 8" exists but the "Group 9" header seems to be missing its label; labels copied from Theme 2. Sub-cards: "What can you do?", "of al lesmodule voor kids", "News".
3. **Mitigation vs Adaptation:**
   - Chip "Human and nature" (copy/paste), and two 524 px circles labelled Mitigation / Adaptation.
   - 4 boxes: renewable energy, stopping deforestation, plant mangroves, drought resistant crops.
4. **Protect first, then restore:** "Ontbossing" image placeholder and the text *"takes a long time for nature to restore, therefore protecting is better"*.
5. **Renewable energy:** 3 circles (Solar, wind, Water) with 3 boxes below.
6. **Food:**
   - Mono culture vs Permaculture (2 × 2 boxes).
   - 4 circles (Diet with meat, Diet without meat, food waste, Preserving food) with explanatory copy.
7. **Reduce reuse and recycle:**
   - Indonesia plastic-waste copy.
   - 3 circles (Reduce, Reuse, Recycle) with boxes.
   - "Current system:" side effects of burning plastic and of throwing plastic on the ground.
   - 3 circles (Reduce plastic by: / Reuse plastic by / Recycle plastic through).
8. **What are things you can do?** 12 mini cards in 2 rows:
   - Row 1: LED lights, Scooter share, Less meat, Eat left overs, Don't use straws, Raise awareness.
   - Row 2: reusable waterbottle, Use Ecosia as engine, Use less napkins, Turn off the lights, Eating-in vs takeaway, Use Bananaleaves as wrap.
9. **What are governments doing?**
   - "Paris COP 21" and "Indonesian targets" boxes (651 × 317).
   - Buttons "Check progress: climate action tracker COP 21" and "Check progress: climate action tracker, Indonesia".
10. **Bottom:**
    - "Test" bar (1352 × 103); this theme has no large CTA.
    - Download-module placeholder and comment box.
    - Buttons "Go to lesson examples", "< Go to theme 3", "Go to theme 1 >".
    - **No footer** in this frame.

### 5.7 Resources page (`61:378`)

1. **Header strip** (100 px), Nav B with "Materials" bold. H1 "Resources" and "Explanation iets.".
2. **Filter sidebar** ("Filters (0)", Themes collapsed) with the "Comment section ?" box.
3. **"Resources (12)"** (y 628) and a 3-column grid of 12 resource cards (4 rows, y 692 / 1177 / 1662 / 2164).
   - Row 1 cards have tags ("Lesson plan" + "Climate change", "For Teachers" + "Climate change") and stars.
   - Card 1 has a progress bar.
   - Row 2 has stars only. Rows 3–4 are plain.
4. **Bottom:** "< Go to randomizer" (left) and "Go to randomizer" (right) buttons; comment box (651 × 97).
5. **No footer.**

### 5.8 Resources page in depth (`61:524`): lesson plan detail

1. **Header strip**, H1 "Resources", sidebar with "Filters (2)": Themes expanded (Climate Change selected) and Lesson plans selected.
2. **"Lesson plan: Climate"** (y 628):
   - Left panel 478 × 661: tags "Lesson plan" / "Climate", star, background photo `image 13` at 38% opacity, the "Climate Class" wordmark at 128 px, and a "Download" button.
   - Right panel 472 × 661: notes "Goal / learning objective / even kijken naar izas uitleg ding" (Dutch note).
3. **Six grey panels** (2 × 3, 478 / 472 × 197) below.
4. **Feedback:** "What did you think of this resource?" with thumbs (93 px).
5. **Related Resources:** 4 resource cards.
6. **Bottom:** randomizer buttons and comment box. **No footer.**

### 5.9 Resources page in depth test (`114:36`): test intro

1. **Header strip** and sidebar, with "Filters (2)": Climate Change and "Test you knowledge" selected.
2. **"Test your knowledge: Climate Change":**
   - Banner 1000 × 175 with photo `foto bromo 2` and tags "Test your knowledge" / "Climate Change".
   - "Start the test" button.
3. **Feedback** with thumbs, then **Related Resources** (4 cards).
4. **Bottom:** randomizer buttons, comment box, footer.

### 5.10 Test page (`119:181`): quiz

1. **Header strip** and sidebar (same filter state as 5.9).
2. **"Test your knowledge: Climate Change"** banner with "10 Questions" (32 px) over it.
3. **Six numbered questions** with checkbox options:
   1. *Which gas(es) is/are the main driver(s) for Climate change?* (CO2; Methane (MH3) and Nitrogen dioxide (NO2); Nitrogen dioxide and CO2; CO2 and Methane)
   2. *Climate change is an….* (a long term shift in temperature, percipitation, wind patterns, and extreme weather; The change of dry and wet season)
   3. *The biggest drivers for climate change are .. (check all that apply)* (Industry, Livestock, Transport, Energy). The `image 2` emissions infographic (199 × 208) sits next to this question.
   4. *What has caused a temperature increase over the past 100 years?* (Animals, Human activity, Changes in the sun, Natural changes that happen every 1000+ years)
   5. *What is a carbon footprint?* (Industry, Livestock): placeholder options
   6. *The biggest drivers for climate change are .. (check all that apply)*: duplicate of Q3
4. **"Check your answers"** button.
5. **Footer.**

### 5.11 Our mission (`61:693`)

1. **Header strip**, Nav B with "Our mission" bold. H1 "Our Mission".
2. **Two grey hero blocks** (652 × 266 each) at y 234. They overlap the "Explanation iets." line.
3. **Sidebar** with circles and section links (4.9).
4. **Sections:** Our Product, The team, The Impact, Collaboration IBF, Future plans. Each has a 32 px heading and grey placeholder blocks, mostly 299 × 168 + 650 × 168 pairs.
5. **Footer.**

### 5.12 Personal page (`61:795`)

1. **Header strip** and Nav B ("Our mission" bold, which is probably a copy/paste error). H1 "Hello, User" and "Explanation iets.".
2. **Profile card:**
   - Grey 652 × 553, radius 67.
   - Avatar image `image 5` (300 px) on a 307 px circle, overlapping the top.
   - Fields: Name, Email, Age, Teacher to kelas, Teacher at Sekola (Indonesian: class, school).
   - Buttons: log out, change password, delete account.
3. **Stats list** (36 px, bullet circles): Themes finished: 1 · Tests finished: 2 · Test attempted: 3 · Lesson modules observed: 1 · Learner Level: (empty).
4. **Level progress bar** (y 1057): a raster image `image 16` (1331 × 346, radius 72). It shows the levels Climate Beginner → Climate Curious → Climate Enthusiast → Climate Scholar → Climate Visionary → Climate Expert, with the current level "Climate Curious".
5. **"Resources you might be interested in:"** with 4 resource cards.
6. **Footer.**

### 5.13 Desktop - 2 (`114:4`): log in

- Full-bleed `foto bromo 2` background.
- The log-in card (4.10) is on the right half.
- No nav or footer.

---

## 6. Assets

Figma asset download URLs are temporary (7 days). Re-fetch assets with the Figma MCP when building. Image fills are cropped and offset in Figma, so check each crop against the frame screenshot.

### 6.1 Logos and vectors

| Asset | Node(s) | Frames | Notes |
|---|---|---|---|
| Logo "human / nature" (small) | "Group 1" `2:7`, `3:129`, `25:135`, `43:337`, `93:174`, `57:188`, `61:380`, `61:526`, `114:39`, `119:184`, `61:696`, `61:797` | All except Desktop - 2 | SVG, 138.29 × 57.17. Desktop-1/Landing use a slightly different SVG export than the inner pages. |
| Logo "human / nature" (large) | "Group 1" `114:16` (vectors `114:17` human, `114:18` nature) | Desktop - 2 | SVG, 445 × 184 |
| Star icon | e.g. `119:360–365`, `61:484–512`, `61:607` | Landing, Resources, Resource detail | SVG 45 px, filled and outline variants |
| Radio / filter circles | `61:465…`, `61:574…`, `114:59…`, `119:198…`, `61:716…`, `61:830…` | Resources pages, Test page, Our mission, Personal | SVG 20 px (filled/outline) and 12 px sub-options |
| Sidebar divider line | `61:522`, `61:601`, `114:81`, `119:220` | Resource pages | SVG |
| Section-nav timeline | "Group 8" (`25:159`, `43:359`, `93:196`, `57:211`) and "Group 9" (`25:166`, `43:366`, `93:203`, `57:201`) | Theme pages | SVG |
| Circle placeholders | Many ellipse nodes (307 / 300 / 256 / 140 / 524 px) | Theme pages, Personal | Grey SVG ellipses (wireframe) |
| Nav chevron | ">" text rotated 90° | All pages with a nav | Text glyph, not an icon |

### 6.2 Photos and raster images

| Asset (layer name) | Node(s) | Frames | Content |
|---|---|---|---|
| `image 1` | `2:5`, `3:128`, `61:442`, `61:525`, `114:38`, `119:183`, `61:695`, `61:796` | Desktop - 1, Landing (hero), all inner-page header strips | Children studying on a beach, used at 44% opacity |
| `WhatsApp Image 2026-10-19 at 09.21.35` | `119:320`, `70:16` | Landing (Climate card), Theme 1 hero | Beach / sea |
| `foto bromo` 1/2 | `119:324`, `70:17`, `114:5`, `114:113`, `119:209` | Landing (Climate Change card), Theme 2 hero, Log-in bg, test banners | Mount Bromo volcano |
| `WhatsApp Image 2026-10-19 at 09.21.36` | `119:326`, `93:173` | Landing (Human and Nature card), Theme 3 hero | Coast with person |
| `farming` 1/2 | `119:325`, `70:19`, `73:22` | Landing (Solutions card), Theme 4 hero | Rice terraces / palms |
| `Footer@1x 1` | `93:161`, `93:159`, `93:160`, `93:320`, `93:171`, `93:167`, `114:112`, `119:247` | All pages with a footer | **The whole footer as a bitmap** |
| `image 12` / `image 16` / `image 18` / `image 13` (same source) | `78:60`, `93:147`, `93:355`, `78:83` | Theme 1, Theme 3, Resource detail | Classroom of children (Climate Class card) |
| `image 14` | `78:91` | Theme 1 | Climates sub-card photo |
| `image 15` | `78:96` | Theme 1 | News-article sub-card (text "BOM Brought Map and Ocean Water Quality…") |
| `Frame 1 1` | `75:25` | Theme 1 | Weather vs. Climate infographic |
| `image 8` | `78:8` | Theme 1 | World climate-zones map |
| `image 6` / `image 7` | `75:27`, `75:29` | Theme 1 | El Niño / La Niña diagrams (one source, two crops) |
| `image 9` | `78:12` | Theme 1 | Ring of Fire map |
| `image 10` / `image 11` | `78:47`, `78:48` | Theme 1 | Earthquake / volcano (circular) |
| `image 17` | `93:151`, `93:357` | Theme 1, Theme 3 | PDF document icon |
| `image 3` / `image 4` | `93:155/156`, `93:358/359`, `61:662/664`, `114:102/103` | Themes 1 and 3, resource detail pages | Thumbs up / thumbs down (one image, rotated 180°) |
| `image 19` / `image 20` | `114:129`, `115:148` | Theme 2 | Ice-age mammoths / warm-age dinosaurs (circular) |
| `image 21` | `115:138` | Theme 2 | Temperature over millions of years graph |
| `image 22` / `image 23` | `115:141`, `115:146` | Theme 2 | CO₂ and temperature graphs (NASA) |
| `image 2` | `43:415`, `119:280` | Theme 2, Test page, loose on canvas | Emissions-sources infographic |
| `image 5` | `61:847` | Personal | Default user avatar icon |
| `image 16` (personal) | `114:2` | Personal | Level-progress graphic (Climate Beginner → Climate Expert) |

### 6.3 Fonts to load

Inter (400, 500, 600, 700, italic 400 / 700), Roboto (500, 600, 700, 800), Just Me Again Down Here (400), Space Grotesk (700).

---

## 7. Open questions

**Responsive and states**
1. **No mobile or tablet frames.** How should the 1440 px layouts collapse (nav, 4-up grids, sidebar layouts, hero type at 94/64 px)? Which breakpoints should we use?
2. **No interaction states** for buttons, links, nav items, cards, tags, filter options or checkboxes (hover / focus / active / disabled / selected / error).
3. **Nav dropdowns:** every nav item has a chevron, but no dropdown contents are designed.
4. **Inner-page nav has no Log in button and no avatar/profile link.** Only the landing nav has "Log in". How does a logged-in user reach the Personal page?

**Structure and consistency**
5. **Landing vs Desktop - 1:** is `1:2` obsolete? It differs in copy ("based on ?") and its nav placement differs from the inner pages.
6. **Nav placement differs:** left-aligned on the landing page, right-aligned elsewhere. Is that intentional?
7. **Footer** is a flat raster image. Should it be rebuilt in HTML with the same content? It is also missing on Resources (`61:378`), Resources page in depth (`61:524`) and Theme 4.
8. **Border radii are inconsistent:**
   - Comment boxes use 15, 22 or 40 px.
   - Theme sub-cards are rounded only on Theme 1.
   - Resource cards are square.
   Which values are canonical?
9. **Body text colour** is `#0009BC` on landing and resource pages but `#000000` on theme pages and the quiz. Which is correct?
10. **No spacing scale or vertical rhythm** is defined. OK to standardise on a scale (e.g. multiples of 4/8 px) close to the observed values?
11. Themes 3 and 4 reuse Theme 2's section-nav labels. Theme 4 has no large "Test Knowledge" CTA and no footer.
12. Prev/next button labels and arrows are inconsistent across themes. Theme 1's left button goes to "theme 4". Should the themes wrap around?
13. Personal page highlights "Our mission" as the active nav item. Is that intended?
14. Frame names: three frames were originally named "Resources page in depth". Two were renamed during this review (`114:36` "… test", `119:181` "Test page"). Please confirm the final names and routes.

**Content**
15. Most copy is placeholder ("Explanation iets.", "Title", "Many different climates … for the hype?" on all 4 theme heroes). Will final copy be provided, or should it stay as placeholder?
16. **Language:** copy mixes English, Indonesian (Theme 1 "Weather vs. Climate", Personal-page fields) and Dutch (internal notes, Theme 3 intro, tipping-point text). What is the site language? Is it bilingual (EN/ID) with a language switch?
17. Many grey boxes and circles have no defined content (Atmosphere section, Our mission page, Theme 3/4 circles). Should they stay as placeholders?
18. Typos and factual issues to confirm:
    - "MH3" should be CH₄ (methane).
    - Misspellings: "percipitation", "Industy", "Risign", "than restore", "Test you knowledge", "Commentsection".
19. **Quiz:**
    - It says "10 Questions" but shows 6.
    - Q6 duplicates Q3, and Q5's options don't fit the question.
    - Correct answers, scoring and the results state are not designed.
20. "How it works" band contains only a UNICEF attribution. What should it explain? The "Collaboration" band only says "IBF". Are partner logos needed?

**Features and behaviour (not designed)**
21. **Comment section:** what is it (per resource? moderated? requires log-in?)? Only a placeholder exists.
22. **"Go to randomizer":** what does the randomizer do?
23. **Star icon** filled vs outline: favourite/bookmark, rating, or recommended?
24. **Progress bar on resource cards** and the "Learner Level" system: where does progress data come from? Is a backend needed?
25. **Accounts:** log in, register, forgot password and change/delete account flows. Register and Forgot-password pages don't exist. What are the three 64 px grey squares on the log-in card (social log-in)?
26. **Filters:** single- or multi-select? Should filter state live in the URL?
27. **"Download the module":** what file, and where is it hosted?
28. **"Materials" nav item** goes to the Resources page, but the footer lists "Lesson examples / Download the module / Test your knowledge". Are those separate pages?
29. "Climate Change Education" hero: on Desktop - 1 the blue text sits on a dark photo (low contrast). The Landing page fixes this with a white background behind the 44% image. Please confirm the Landing version.

**Assets**
30. The level-progress graphic and footer are bitmaps. Are vector/source versions available?
31. Are photo rights and permissions in place (WhatsApp images, NASA graphs, maps, news screenshot)? Alt texts are not defined.
32. Are licences confirmed for the fonts? All four are on Google Fonts.

---

## 8. Resolved decisions (accepted 2026-10-20, not from Figma)

These answer the open questions in §7. **None of these values come from Figma.** They are UX recommendations that fill gaps in the design and were accepted by the owner on 2026-10-20. Status key:

- **Accepted:** approved by the owner on 2026-10-20. Treat as binding alongside §2–§6.
- **Owner:** only the project team can decide. A placeholder is used until they do.

Token values introduced here are marked *(new)* so they can be told apart from Figma values in §2.

### 8.1 Accessibility findings that drive several decisions

WCAG contrast measured against the Figma colors:

| Pair | Ratio | Verdict |
|---|---|---|
| `#0009BC` on white | 11.90 : 1 | Pass (AAA) |
| White on `#0009BC` (buttons) | 11.90 : 1 | Pass (AAA) |
| `#0009BC` on landing band (`#E7F0FC` composite) | 10.35 : 1 | Pass |
| `#0009BC` on login card (`#D0E0F9` composite) | 8.90 : 1 | Pass |
| `#0009BC` on `#D9D9D9` placeholders | 8.43 : 1 | Pass |
| `#198F51` green on white | 4.13 : 1 | **Fails AA for normal text.** Use it only in the logo or text ≥ 24 px. |
| Input placeholder `rgba(0,9,188,0.58)` on white (`#6B70D8`) | 4.26 : 1 | **Fails AA.** Add visible labels; the placeholder is not the label. |
| `#D9D9D9` "Progress" label on white | 1.41 : 1 | **Fails.** Use `#0009BC` text instead. |

Other accessibility requirements:

- Tags and filter rows are 20–21 px tall. Their clickable hit area must be at least 24 × 24 px (WCAG 2.2 target size).
- Body text on mobile is at least 16 px.

### 8.2 Responsive and states

| # | Decision | Status |
|---|---|---|
| 1 | **Breakpoints, mobile-first:** base (< 768), `md` ≥ 768, `lg` ≥ 1024, `xl` ≥ 1440 (the Figma width). See the details below the table. | Accepted |
| 2 | **Interaction states:** defined in 8.6. | Accepted |
| 3 | **Nav dropdowns:** they open on click or tap (not hover-only), with full keyboard support. See the panel contents below the table. | Accepted |
| 4 | **Log in on every page**, at the right end of the nav. When signed in, it is replaced by an avatar circle linking to `/profile`. | Accepted |

**Breakpoint details (1):**

- Page gutter *(new)*: 16 px (base), 24 px (`md`), 44 px (`lg`+). Content max-width is 1352 px.
- Grids:
  - 4-up cards: 1 column on base, 2 on `md`, 4 on `lg`+.
  - Resource grid: 1 / 2 / 3 columns.
  - Half columns stack below `lg`.
- Sidebar layouts: below `lg` the sidebar becomes a collapsible "Filters" / "On this page" disclosure above the content.
- Responsive type *(new)*:

  | Style | base | `md` | `lg`+ |
  |---|---|---|---|
  | Hero H1 | 40 | 56 | 93.951 |
  | Page H1 | 36 | 48 | 64 |
  | Section H2 | 24 | 28 | 32 |
  | Subtitle | 24 | 24 | 32 |
  | Long-form body | 16 | 18 | 20 |
  | Body Small | 16 | 14 | 14 |

- Nav: below `lg`, a menu button opens a full-height panel. Nav item text is 24 px at `lg` and 36 px at `xl`.

**Dropdown panel (3):**

- Style: white, radius 11, button shadow, items Inter Regular 16 `#0009BC`. The ">" glyph is replaced by an SVG caret icon that looks the same.
- Contents:
  - **Themes:** Climate · Climate Change · Human and Nature · Solutions
  - **Materials:** All resources · Lesson plans · Tests · Extra resources · Download the module
  - **Our mission:** Mission · Our product · The team · Our impact · Collaboration IBF · Future plans · Contact

### 8.3 Structure and consistency

| # | Decision | Status |
|---|---|---|
| 5 | **Desktop - 1 (`1:2`) is obsolete.** Build the Landing page (`3:127`). | Accepted |
| 6 | **One nav layout on every page:** logo left; Themes / Materials / Our mission right-aligned; Log in last. Over hero photos the nav is transparent with white text; on inner pages it sits on the 100 px header strip. | Accepted |
| 7 | **Footer rebuilt in HTML on every page.** Content as in §4.2. See the styling below the table. | Accepted |
| 8 | **Canonical radii** *(new set, all taken from values already used in Figma)*: 6 tags · 7 inputs · 11 buttons · 18 cards, image cards and large CTA · 22 comment and outlined boxes · 50% circles. Special radii stay only where they are now: profile card 67, level graphic 72, login card 91. **Resource and theme cards get radius 18** (they are square in Figma). | Accepted |
| 9 | **Text colour:** `#0009BC` for headings, UI text, captions and short copy. `#000000` for long-form reading copy (theme article text, quiz). Both pass AAA. | Accepted |
| 10 | **Spacing scale** *(new)*: 4, 8, 12, 16, 24, 32, 44, 48, 64, 96, 128 px. 44 is the desktop page gutter and 48 is the grid gutter (Figma ~50). Section spacing: 96 px desktop, 64 tablet, 48 mobile. | Accepted |
| 11 | **Every theme page uses the same template**, in this order: hero → section nav + 3 sub-cards → content sections → large "Test your knowledge" CTA → download module + feedback → prev/next + lesson examples → footer. Each theme gets its own section-nav labels, generated from its section headings. | Accepted |
| 12 | **Prev/next buttons:** "< Theme N: Name" on the left and "Theme N: Name >" on the right. No wrap-around. Theme 1 has no previous button; Theme 4's next button goes to "All resources". | Accepted |
| 13 | **Personal page:** no nav item is active; the avatar shows the active state. | Accepted |
| 14 | **Routes:** see the list below the table. | Accepted |

**Footer styling (7):**

- Background: the light-blue band `rgba(200,220,248,0.44)` on white.
- Columns: logo + tagline (Body Small, `#0009BC`); column headings Inter SemiBold 14; links Body Small.
- Bottom bar: `#0009BC` with white 14 px text.

**Routes (14):**

- `/` Landing
- `/themes/climate`, `/themes/climate-change`, `/themes/human-and-nature`, `/themes/solutions`
- `/resources` (with filter query params)
- `/resources/:slug` (lesson plan / resource detail)
- `/resources/:slug/test` (test intro + quiz on one page; the "Start the test" button reveals the questions)
- `/mission`
- `/profile`
- `/login`

### 8.4 Content

| # | Decision | Status |
|---|---|---|
| 15 | Keep the placeholder copy. All copy lives in content data files (one per page/theme) so final text can be dropped in without code changes. | Owner |
| 16 | **Language:** recommend **English first**, with the content structured for a later **Bahasa Indonesia** version (the audience is Indonesian primary-school teachers) and an EN/ID switch in the nav. The Indonesian and Dutch text in the frames is treated as draft and not shipped until translated. | Owner (recommendation given) |
| 17 | Empty grey boxes and circles are rendered as neutral, clearly labelled placeholders (`#D9D9D9`, radius per 8.3 #8), so the layout is reviewable. | Accepted |
| 18 | **Fix the typos and errors in the build:** methane is CH₄ (not "MH3"); "precipitation", "Industry", "Rising", "then restore", "Test your knowledge", "Comment section". | Accepted |
| 19 | **Quiz:** build the 6 questions, remove duplicate Q6, and change the heading to "6 Questions" (generated from the data). Q5's options need replacing. Correct answers and explanations must come from the team. | Owner |
| 20 | "How it works": placeholder text block. "Collaboration": a row of partner logos (IBF first). Logo files are needed. | Owner |

### 8.5 Features and behaviour

Version 1 is a **static React site with no backend.** Everything below works without a server.

| # | Decision | Status |
|---|---|---|
| 21 | **Comment section: left out of v1.** A public comment box on a children's education site needs moderation and accounts. The thumbs up/down feedback widget stays, stored locally. Revisit when a backend exists. | Accepted |
| 22 | **Randomizer:** "Show a random resource" opens a random resource detail page, respecting the current filters. | Accepted |
| 23 | **Star = "Save" (bookmark).** Outline means not saved; filled means saved. It is a toggle button with `aria-pressed` and an accessible label ("Save resource"), stored in `localStorage`. Saved items appear on the Personal page. | Accepted |
| 24 | **Progress and learner level are stored in `localStorage`** in v1: themes visited, tests finished, and lesson modules opened. Levels follow the six in the level graphic (Climate Beginner → Climate Expert); thresholds are set by the team. | Accepted (thresholds: Owner) |
| 25 | **Accounts:** v1 has the log-in UI only (mock, no real authentication), and the whole site works without an account. See the form fixes below the table. | Accepted |
| 26 | **Filters:** multi-select. The circle visual stays but is exposed as checkboxes. State lives in the URL (`?theme=climate&type=lesson-plan`). The count in "Filters (n)" shows active filters. Includes a "Clear filters" link. | Accepted |
| 27 | **"Download the module":** links to a placeholder PDF in `/public/downloads/` until real files are provided. | Owner |
| 28 | **Footer Materials links** open `/resources` with the matching filter applied. "Download the module" opens `/resources?type=module`. | Accepted |
| 29 | **Landing hero:** use the Landing version: photo at 44% opacity over white, giving blue text on a light tint (≥ 4.5 : 1 in practice). | Accepted |

**Log-in form fixes (25):**

- Add visible labels above the inputs and a show/hide password toggle (see 8.1).
- Remove the three grey squares; social log-in is out of scope.
- "Register" and "Forgot password" link to simple placeholder pages.

### 8.6 Interaction states *(new)*

| Element | Hover | Focus-visible | Active / pressed | Disabled | Selected |
|---|---|---|---|---|---|
| Primary button | Background `#00078F` *(new, `#0009BC` darkened ~25%)* | 2 px outline `#0009BC`, offset 2 px (white outline on photos or blue backgrounds) | Shadow removed, translateY(1px) | Opacity 0.4, no shadow, `cursor: not-allowed` | — |
| Text link / nav item | Underline | Same outline as buttons | — | — | Bold (as in Figma) + `aria-current="page"` |
| Card (link) | Image scales 1.03 inside its frame; button shadow appears | Outline around the whole card | — | — | — |
| Tag | — | — | — | — | — (tags are not interactive) |
| Filter option | Label underline | Outline around the row | — | — | Filled circle (as in Figma) |
| Star (save) | Scale 1.1 | Outline | — | — | Filled star |
| Checkbox (quiz) | Border `#0009BC` | Outline | — | — | `#0009BC` fill with white tick |

Motion *(new)*:

- 150 ms ease-out for colour and shadow changes.
- 200 ms for dropdown open (fade + 4 px slide).
- Image-scale and slide effects are disabled under `prefers-reduced-motion`.

### 8.7 Assets

| # | Decision | Status |
|---|---|---|
| 30 | The footer is rebuilt (8.3 #7). The level-progress graphic stays as an image, with descriptive alt text, until a source file exists. The "Climate Class" wordmark is rendered as live text in Just Me Again Down Here, with `aria-label="Climate Class"`. | Accepted |
| 31 | Photo rights (WhatsApp photos, NASA graphs, maps, news screenshot) must be confirmed by the team. I will write alt text for every image. Images are served as WebP with set width/height, and lazy-loaded below the fold. | Owner (rights) |
| 32 | **Fonts:** Inter, Roboto, Space Grotesk and Just Me Again Down Here are all under the SIL Open Font License on Google Fonts. Self-host them via `@fontsource` with `font-display: swap`. | Accepted |

### 8.8 Build-time additions (pending owner review)

The first build (2026-10-20) needed some values that neither Figma nor §8.1–8.7 define. They live in `src/styles/tokens.css` and the component CSS. **Status: pending review.** Change or approve them here.

| Area | Value chosen | Why |
|---|---|---|
| Responsive sizes not in §8.2 | Hero intro 20 / 26 / 30 / 36 px (base / md / lg / xl); personal stats 22 / 28 / 32 / 36; large CTA label 24 / 30 / 36 | The Figma 36 px sizes don't fit phone widths |
| Long-form line-height | 1.5 (Figma: "normal" ≈ 1.2) | Readability of 16–20 px paragraphs |
| Text on photos | Dark gradient under white text on photo cards; 92% white panel behind resource text on photo cards; 85% white panel behind the theme-hero title; light backing behind the save star on photos | Blue or white text on busy photos is otherwise unreadable |
| Nav on full-bleed photos | 45% black gradient at the top of theme and log-in heroes | Keeps the white nav legible |
| Mobile menu icon | Primary blue on the inner-page strip (white over hero photos) | White icon on the light strip is invisible |
| Log-in card | Radius 48 px below 768 px (91 px from 768 up); "Forgot password" at 13 px instead of 11 px | 91 px corners and 11 px text don't work on phones |
| Feedback thumbs | Selected = 2 px primary border + band background | No selected state in Figma |
| Disclosures (Filters, On this page) below 1024 px | 1 px primary border, radius 11 | New mobile pattern from §8.2 #1 |
| Profile avatar | 200 px (Figma 300 px) | Proportion at tablet and phone widths |

### 8.9 Nav text colour on light backgrounds (accepted 2026-10-20)

**Decision:** the main-nav text, chevrons and mobile menu icon use **primary blue `#0009BC`** wherever the background behind the nav is light:
- the 100 px inner-page strip;
- the landing hero, where the photo is shown at 44% on white.

They stay **white** on full-strength photo heroes (theme pages, log-in/register). This replaces the white nav text that Figma uses on the strip and the landing hero (§4.1).

**Why:** the white text measured about 1.2–1.3 : 1 against the composited strip and landing-hero backgrounds, which fails WCAG AA. Blue measures:

| Background | Median | Darkest spot |
|---|---|---|
| Inner-page strip | 9.8 : 1 | 4.4 : 1 |
| Landing hero | 9.1 : 1 | 8.7 : 1 |

All of these pass AA for 24–36 px nav text.

**Tokens:** `--nav-text-on-light` (primary blue) and `--nav-text-on-photo` (white) in `src/styles/tokens.css`. `Layout` picks the tone per route.

### 8.10 Language switch and editable content (accepted 2026-10-20)

**Languages:** English at `/…` and Bahasa Indonesia at `/id/…` (implements §8.4 #16).

**Language switch:** a segmented **ID | EN** pill in the header bar (Indonesian first), always visible on every page and screen size.
- **Desktop:** placed between the main nav and the Log in button.
- **Below 1024 px:** placed next to the menu button.
- **Style:**
  - The outline and text use the header's nav colour (§8.9), with a 1.5 px border and radius 11 (button radius).
  - Each option is at least 40 × 32 px, Inter SemiBold 14.
  - The current language is filled: a white pill on photos, a blue pill on light backgrounds.
- **Behaviour:** links to the same page in the other language, keeping filters and anchors.

**Translations:** all content has an Indonesian version (draft, to be checked by a native speaker). The level-progress graphic, news screenshot and emissions chart contain English/Dutch text inside the image itself.

**Untranslated pages:** Indonesian pages without a translation show the English content with a notice. The notice uses Body Small in primary blue on the light-blue band colour, radius 11.

**Editable content:** all page content is edited in Decap CMS (`/admin/`, docs/CMS.md). New blocks this adds to §4:

| Block | Spec |
|---|---|
| **Video** | YouTube/Vimeo embed, 16 : 9, radius 18 (card radius), black letterbox; caption in Body Small, primary blue |
| **Image + text** | The §3.1 two-column split; image on the left or right |
| **Tile with a link** | Grey tile (§4.15) with an optional primary button |
| **Lesson step** | Rich-text box on the light-blue band colour, radius 18 |

These replace placeholders as content arrives and introduce no new tokens.
