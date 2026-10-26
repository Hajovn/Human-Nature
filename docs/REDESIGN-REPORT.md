# Redesign change report: Figma Page 2 vs the current site

Written 2026-10-26 for phase B of [REDESIGN-PLAN.md](REDESIGN-PLAN.md). It compares **Page 2** of the Figma file `eK4SrAUxIup1f2HYEEBHF0` with today's site and DESIGN.md.

**You decide everything in [section 9](#9-open-points-for-you)**; nothing is built until then.

**How this was read**
- The full layer structure of Page 2.
- The variables (tokens).
- Reference screenshots of 12 frames, saved in `design-assets/redesign/`.
- Frames read from the layer structure only, without a screenshot: Themes 2–4, three of the four tests, three of the four test results, and "Thema 17" and "Thema 18".
- 17 Figma reads so far, with no limit reached.

---

## 1. Summary

- **A new visual language, not an update.**
  - Fonts: Space Grotesk headings, Atkinson Hyperlegible body text.
  - Colour: a new brand blue `#1414C8`, and four bright theme colours (sun, ember, leaf, lagoon) used as section backgrounds.
  - Shapes: rounded cards and arch-shaped photos.
  - Nothing from today's styling carries over except the logo.
- **A proper design system this time.**
  - Page 2 defines named tokens: colours, type styles, spacing, radii, one shadow.
  - It defines components: Button with states, LessonTag, ThemeCard, Callout, BigNumber, LessonCard, Question.
  - Today's DESIGN.md had to invent most of these.
- **New and changed pages:**
  - a **Glossary** page;
  - a **test result** page;
  - a **lesson plan** page with a fixed structure;
  - much richer **theme pages**;
  - a larger **Our mission** page with a team section.
- **Unchanged:** the log-in screen on Page 2 is the old design. Per our decision, all account screens stay as they are, restyled with the new tokens.
- **Content model:** almost every content type changes. Theme pages in particular need a richer set of building blocks (section 6).

## 2. Frame map (the new sitemap)

| Figma frame | Node | Becomes | Route (EN; ID without `/en`, see 9.1) | Status |
|---|---|---|---|---|
| Landing page | `196:6` | Home | `/` | Changed |
| Thema 1 | `222:2211` | Theme 1: Climate | `/themes/climate` | Changed |
| Thema 2 | `242:3344` | Theme 2: Climate Change | `/themes/climate-change` | Changed |
| Thema 3 | `242:3975` | Theme 3: Human and Nature | `/themes/human-and-nature` | Changed |
| Thema 4 | `242:4453` | Theme 4: Solutions | `/themes/solutions` | Changed |
| Thema 5 | `260:726` | Resource library | `/resources` | Changed |
| Thema 6 | `263:1878` | Lesson plan: Ring of Fire | `/resources/:slug` | Changed |
| Thema 19 (and 17, 18) | `278:4063` | Lesson plan: El Niño and La Niña | `/resources/:slug` | Same template as Thema 6 |
| Thema 16 | `276:3385` | Lesson plan, an alternative layout | — | Looks unfinished: overlapping cards. **See 9.2** |
| Thema 7 / 12 / 10 / 11 | `267:2843` / `276:2497` / `276:2143` / `276:2320` | Tests: Climate Change (10 questions) / Climate (7) / Human and Nature (7) / Solutions (8) | `/resources/:slug/test` | Changed |
| Test result ×4 | `312:1947`, `312:1714`, `317:1481`, `316:1475` | Result after a test | **new, see 9.3** | New |
| Thema 8 | `269:3257` | Our mission | `/mission` | Changed |
| Thema 9 | `272:868` | Personal page | `/profile` | Changed |
| Glossary | `299:1502` | Glossary | `/glossary` | **New** |
| Desktop - 3 | `274:2118` | Log in | `/login` | Same as today's design. Keep the current account screens |
| Human Nature components | `192:2` | Component sheet | — | Source for section 4 |
| Group 27, image 36, map graphic, Poster A4 | various | Loose assets | — | Hero photo group, map, poster |

**Not designed on Page 2; kept as they are, with the new tokens and header/footer:**
- register, forgot and reset password, the e-mail confirmation screens;
- the admin page;
- privacy and terms;
- the 404 page;
- the nav dropdown panels;
- the language switch;
- phone and tablet layouts.

**Removed:** nothing. Every current page has a counterpart.

**Ignored:** the Figma page "presentatie download" (not part of the website, unless you say otherwise).

## 3. Tokens

The new tokens come from Figma variables, so they're exact. They replace all of DESIGN.md §2 and `src/styles/tokens.css`.

| Group | New | Today |
|---|---|---|
| Brand | `--brand-blue #1414C8`, `--on-brand #FFFFFF`, logo green `#198F51` (unchanged) | Primary `#0009BC` |
| Ink | `--ink #14142B` (text on colour), `--ink-muted #4A4D6B` | Blue text and black long-form text |
| Surfaces | `--surface-page #FAFBFF`, `--surface-card #FFFFFF`, `--surface-sky #D6E5FA` | White, plus the light-blue band `rgba(200,220,248,.44)` |
| Accents | `--sun #FFC93C` (Theme 1), `--ember #F26B3A` (Theme 2), `--leaf-bright #6CC27A` (Theme 3), `--lagoon #1FB5A8` (Theme 4), `--on-accent #14142B` | None |
| Border | `--border #C9D2EA` | Various |
| Spacing | `--space-1…9`: 4, 8, 12, 16, 24, 32, 48, 64, 96 | 4 to 128 (§8.3 #10) |
| Radii | `--radius-md 16`, `--radius-lg 28`, `--radius-full 999` | 6, 7, 11, 18, 22, … (§8.3 #8) |
| Shadow | `shadow-lift`: 0 8 24 `#14142B` at 14% | Button shadow |
| Type | **Space Grotesk:** display-xl 72/76 Bold · h2 40/48 Bold · h3 28/36 Bold · big-number 64/64 Bold · button 20/24 Medium.<br>**Atkinson Hyperlegible:** lead 22/34 · body 19/30 · body-strong 19/30 Bold · small 16/24 · caption 15/22 · label 14/18 Bold, uppercase, letter-spacing "6" | Inter, Roboto, Space Grotesk |
| Layout | Content width 1200 px (120 px side margins at 1440). The resource and lesson pages use a 180 px filter column plus a ~1080 px main column. | 1352 px |

**Font changes:**
- Add `@fontsource/atkinson-hyperlegible` (SIL Open Font License, like the others).
- Space Grotesk is already installed.
- Inter, Roboto and Just Me Again Down Here can be removed once nothing uses them.

**Not defined in Figma** (see 9.6): hover and focus colours outside the Button component; success and error colours; a heading h1 size between 72 and 40; the unit of the label letter-spacing ("6" is probably 6%, i.e. 0.06 em).

## 4. Shared components

| Component | In Figma | Today | Change |
|---|---|---|---|
| **Header** | Sky bar, 81 px high: logo; Themes / Materials / Our mission with chevrons; outlined "Log in" button on the right. The same on every page. | Transparent over photos, or a 100 px photo strip | Rebuilt. No more white-on-photo variant. |
| **Footer** | Sky band: logo plus tagline, then three link columns: Themes; Materials (Lesson examples, Download the module, Test your knowledge, Extra Resources, The community); Our mission (About us, Contact, Partners). Blue bottom bar with © and legal links. | Similar columns | Rebuilt. New links, see 9.7. |
| **Button** | Primary (filled blue), Secondary (blue outline), Quiet (text). Each has Default, Hover and Focus. Pill shape, 48 px high. | Radius 11, one style | Rebuilt from the component. |
| **LessonTag** | Filled (blue), Plain (sky), "Go deeper" (ink). Uppercase label, pill. | Tags radius 6 | New. |
| **ThemeCard** | Coloured card with a round photo, "THEME n", title and one line. | Photo cards | New. |
| **Callout** | Teacher tip (sky), Did you know (sun), Talk about it (leaf). Each has a dot and an uppercase label. The theme pages also use "Ask your class", "Jadi" and "Go deeper" variants. | None | New. |
| **BigNumber** | 220 px circle with a big number and a caption. Quiet, Ember or Lagoon style, plus Sun and Leaf on the pages. | None | New. |
| **LessonCard** | White card, 16 px radius: optional image, tags (type, grade, duration), title, one line, theme dot plus name, save star. | Resource cards | Rebuilt. |
| **Question** | Single choice (radio) and "check all that apply" (checkbox). | Quiz checkboxes | Rebuilt. |
| **Profile card**, **Level track** | Avatar circle, field list, account buttons. Six level circles with progress bars. | Level graphic as an image (§8.7 #30) | Level track becomes a live component, so the image goes. |
| **On this page** chips | A row of sky pills linking to sections. | Section nav | Rebuilt. |
| **Arch photo** | A photo with a round top (heroes, lesson plans). | — | New. |
| **Feedback** | "What did you think of this resource?", Helpful / Not yet, plus a **Comments / Questions** box with "send". | Thumbs only | **See 9.4.** |

## 5. Page by page

### Home (`196:6`)

**Sections, in order:**
1. Hero: H1, intro, "Go to lesson examples", arch photo.
2. Themes: 4 ThemeCards.
3. "Climate Change in Numbers": 3 BigNumbers, a "Small actions add up" block, a teacher tip.
4. "From Lombok to the world": round photo, label, text, a did-you-know callout, an "Our mission" button.
5. "How it works": 3 numbered circles and a tip.
6. Lesson plans: 6 LessonCards and "See all lesson plans".
7. Quote with a round photo.
8. "Ready to teach?": two buttons and an illustration of shapes.
9. Collaboration: text and the IBF logo.

**Compared with today:**
- The numbers block and the Lombok block are new.
- The quote is now the UNICEF quote.
- The lesson cards are new.

### Theme pages (Thema 1–4)

**Every theme page has the same frame:**
- a hero in the theme colour: "THEME n OF 4", title, two paragraphs, "Test Knowledge" button, arch photo;
- "On this page" chips;
- three intro cards: Explanation, Lesson module, News article;
- the content sections;
- "Hard words, simple meanings" (glossary cards);
- "Check what you learned" CTA;
- download PDF, feedback and comments;
- side buttons: "Go to lesson examples", "Next: theme n+1", and a second button ("Go to theme 4" on Theme 1, see 9.8).

**The content sections differ per theme and are much richer than today:**
- section backgrounds in sky or a theme colour;
- two-column text with callouts;
- climate-zone cards with coloured dots;
- a map with a legend;
- image-plus-caption with a source line;
- BigNumbers;
- numbered "why it happens" cards;
- quote blocks (Theme 3);
- tipping-point illustrations;
- a 5×2 grid of action cards ("What can you do?", Theme 4);
- government link buttons.

### Resources (Thema 5)

- Sky hero: "Resources" plus an intro line.
- Left filter column: Theme (4 checkboxes) and Type (For teachers, Lesson plans, Tests, Extra resources), with "Clear filters".
- "Resources (22)", followed by a 3-column grid of LessonCards.
- Feedback and comments at the bottom.
- **Not in Figma:** "Show a random resource" (§8.5 #22).

### Lesson plan (Thema 6 / 19)

**Hero:** in the theme colour, with breadcrumb "Resources / lesson plan", the title, and "Author: …".

**Main column:**
1. Arch image, "Download" button, save star.
2. Tags.
3. "About this lesson".
4. "Students learn to": a list.
5. "Lesson context".
6. Materials cards: 4 sky cards.
7. "The lesson in five steps": numbered steps.
8. Key message card and teacher tip card.
9. A row of 3 photos.

**Bottom:** feedback and comments.

**The filter column is also on this page** (9.5).

This is far more structured than today's lesson plan (goal, objectives, steps), so new CMS fields are needed.

### Test (Thema 7 / 10 / 11 / 12)

- Hero in the theme colour: "Test your knowledge", "Climate Change · 10 questions".
- Filter column.
- An intro card.
- Numbered questions, single or multiple choice.
- A submit button, then the result (next section).

The old "test intro" page (§5.9) is gone; the questions start right away.

### Test result (new)

- **Hero:** theme colour, "TEST: CLIMATE CHANGE", "Your result", a message, "Try again", and a score circle ("7/10", "70% correct").
- **"Your level":** badge, level name, how many tests to the next level, progress bar.
- **"Your answers":** pills ("✓ 7 correct", "✗ 3 to review"), then a card per question: Correct or Not quite; for misses, your answer; the correct answer; **an explanation**.
- **"What next?":**
  - three cards: Read again (this theme), Teach it (lesson plans), Next theme;
  - "Try the test again" and "Back to resources".

**New content needed:** an explanation per question.

### Our mission (Thema 8)

1. Leaf hero with an arch photo.
2. Chips.
3. "Our product": 3 offers and an image placeholder.
4. "The team": a group-photo placeholder, then **6 person cards** with photo, role and study.
5. "Our impact": 3 BigNumbers (150+ teachers, 17 schools, 8 experts) and 2 cards.
6. "Collaboration with IBF".
7. "Future plans": 4 cards.
8. "Check out the next workshop" with a button, plus a contact card (name, phone, e-mail).

### Personal page (Thema 9)

- Sky hero: "Hello, User".
- **Profile card:** name, e-mail, **age, class**, school; Log out, Change password, Delete account.
- **"Your progress":** 4 BigNumbers: themes finished, tests finished, tests attempted, lesson modules seen.
- **"Your level":** the level track.
- **"Resources you might like":** 4 LessonCards.

**Missing from Page 2 but built today (§8.12, Stage 6):**
- the invite-code box and "Verified teacher" badge;
- the Account section (My details, E-mail, Password, My data, Delete);
- the saved-resources list.

See 9.9.

### Glossary (new)

- Sky hero.
- One section per theme, in its theme colour, with white term cards.
- The terms are the same as each theme's "Hard words" section.

### Log in (Desktop - 3)

The same design as today's log-in (Bromo photo, light-blue card, three grey squares). Per our decision, the current log-in and account screens stay, restyled with the new tokens.

## 6. Content model (what becomes a CMS field)

The old content is dropped and new files carry the Figma copy (decided). Proposed model, each object localized `{ en, id }` as today:

| Collection | Fields |
|---|---|
| **Site settings** | Tagline, footer links, partner logos |
| **Home** | Hero (title, intro, image, button); themes intro; numbers (3 × value + caption + colour); Lombok block; how-it-works steps; featured lesson plans (picked from resources); quote + attribution + image; "Ready to teach" text and buttons; collaboration text + logo |
| **Theme** (×4) | Number, title, colour, hero texts, hero image, card text, card image; three intro cards (explanation / lesson module / news article: title, image, link); **sections** (below); **glossary terms** (term + meaning); test resource; PDF file |
| **Theme section** | Title, chip label, background (page / sky / sun / ember / leaf / lagoon), layout (stack / two columns), **blocks** |
| **Blocks** (new set) | text · image (shape: rounded / arch / circle / oval; source line) · callout (kind: teacher tip / did you know / talk about it / ask your class / go deeper; title; text) · big numbers · numbered cards · info cards (title, text, optional dot colour or image) · quote · link buttons · video (kept) |
| **Resource: lesson plan** | Title, theme, author, image, grade, duration, tags; about; learning goals (list); context; materials (title + text); steps (title + text); key message; teacher tip; photos; download file; teacher-only file (kept) |
| **Resource: test** | Title, theme, intro, questions (text, single/multiple, options, correct answer(s), **explanation**) |
| **Resource: other types** | "For teachers" and "Extra resources" (9.10): title, theme, image, description, file or link |
| **Mission** | Hero; product (3 offers + image); team (group photo + people: name, role, study, photo); impact (numbers + 2 cards); IBF block; future plans (4 cards); workshop block + contact card |
| **Glossary page** | Hero texts only. The terms come from the themes, so each term is edited in one place (9.11). |
| **Levels** | The six level names and their thresholds (today in `src/lib/storage.ts`) |

This is a bigger CMS than today's. The theme sections give editors a block builder; the alternative is fixed per-theme templates. See 9.12.

## 7. DESIGN.md §8 decisions, re-checked

| § | Old decision | New design | Proposal |
|---|---|---|---|
| 8.1 | Contrast fixes (green text, placeholder labels, grey progress label) | New colours, new pairs. See the contrast table below. | Re-check with the new pairs |
| 8.2 #1 | Breakpoints and responsive type | Desktop only | **Keep:** same breakpoints, new sizes derived from the new type scale |
| 8.2 #3 | Nav dropdowns on hover/click, with contents | Chevrons shown, panels not designed | **Keep** the behaviour and contents; restyle |
| 8.2 #4 | Log in in the nav; avatar when signed in | "Log in" outline button | **Keep** the avatar when signed in |
| 8.3 #6, 8.9 | Transparent nav over photos; blue/white nav text | Solid sky header everywhere | **Covered:** drop both |
| 8.3 #7 | Footer rebuilt | Designed | **Covered** |
| 8.3 #8 | Canonical radii | Radius tokens | **Covered** |
| 8.3 #9 | Blue headings, black long text | Blue headings; ink on colour | **Covered** |
| 8.3 #10 | Spacing scale | Spacing tokens | **Covered** |
| 8.3 #11 | One theme template | Same frame, freer sections | **Covered** (section 5) |
| 8.3 #12 | Prev/next without wrap-around; Theme 4 next goes to "All resources" | Theme 1 shows "Go to theme 4"; Theme 4 shows "Next: theme 4" | **See 9.8** |
| 8.3 #14 | Routes | Plus `/glossary` and the test result | See 9.3 |
| 8.5 #21 | No comment box in v1 | Comments box on almost every page | **See 9.4** |
| 8.5 #22 | Random resource button | Not shown | **See 9.13** |
| 8.5 #23 | Star = save | Star on cards and lesson plans | **Covered** |
| 8.5 #24 | Progress and levels | 4 counters and the level track | **Covered.** Add "tests attempted". |
| 8.5 #26 | Multi-select filters, state in the URL | Checkbox filters | **Covered** |
| 8.6 | Interaction states | Button states only | **Keep** for the rest, restyled with the new tokens |
| 8.7 #30 | Level graphic as an image | Live component | **Covered** |
| 8.10 | ID/EN switch, untranslated notice, video block | Not designed | **Keep:** place the switch before "Log in" |
| 8.11 | IBF subdomain, Indonesian default, accounts | — | **Keep** |
| 8.12 | Account screens, messages, profile additions | Profile differs | **See 9.9** |
| 8.8 | Build-time choices | Mostly obsolete | Drop; new choices go in 9.6 |

**Contrast of the new pairs** (WCAG AA: 4.5 : 1 for normal text, 3 : 1 for text from 24 px, or 18.7 px bold):

| Text \ background | page | sky | sun | ember | leaf | lagoon |
|---|---|---|---|---|---|---|
| Brand blue `#1414C8` | 10.3 ✓ | 8.4 ✓ | 7.0 ✓ | **3.5**, large text only | 4.9 ✓ | **4.2**, large text only |
| Ink `#14142B` | 17.4 ✓ | 14.1 ✓ | 11.7 ✓ | 6.0 ✓ | 8.3 ✓ | 7.1 ✓ |
| Ink muted `#4A4D6B` | 7.9 ✓ | 6.4 ✓ | 5.3 ✓ | **2.7 ✗** | **3.8 ✗** | **3.2 ✗** |
| White | — | — | — | **3.0 ✗** | **2.2 ✗** | **2.6 ✗** |
| Logo green `#198F51` | **4.0**, large text only | — | — | — | — | — |

**What the table means for the pages:**
- **Blue small text fails on the ember (Theme 2) and lagoon (Theme 4) heroes.** That affects the breadcrumb on lesson plans and tests, and the "Climate Change · 10 questions" line. The large blue H1s pass.
- The **orange "Delete account"** outline on white measures 3.0 : 1 and fails for its 20 px label.
- Muted ink and white fail on every colour except sun.

My proposals for these are in 9.6.

## 8. Errors and placeholders in the design

**Placeholder content:**
- the grey image boxes (resource cards, PDF thumbnail, mission product and team photo, badge, avatar);
- the yellow circle on the theme and mission side columns;
- "Hello, User";
- "Badge".

**Copy-paste text that doesn't fit its place:**
- All seven climate-zone cards share the Equatorial text.
- Theme 4's glossary meanings are copied from Theme 3 ("Mitigation: When corals lose their algae…").
- The Personal page "Your progress" intro is the food text from Theme 4.
- Mission "Our impact" cards ("Animals and plants", "Ice melting") come from Theme 3.
- Three of the four test-result frames reuse explanations from the Climate Change test.
- Thema 12's result is titled "Test: Climate change".
- Test intro cards all read "The typical weather of a place over many years."

**Typos to fix in the build:** Equtor, Soluitons, "tha thappen", atsmosphere (×2), reapeats, "BF is our partner" (IBF), "Human Nature is build", "next workshop data", "Plastic iss", "double the CO2 tan", "tsunami's".

**Internal notes in the copy:**
- "(Add a hint about Tom's company here.)" on Theme 4.
- The theme pages mix Indonesian and English headings ("Iklim yang berbeda", "El Niño dan La Niña", "Cuaca", "Jadi").
- My proposal: write each page fully in English and Indonesian, as decided.

**Inconsistencies:**
- The footer on the test-result frames is a different, older variant: "Human Nature" as text, fewer links.
- Hero buttons say "Test Knowledge" on some pages and "Test your knowledge" on others.

I'll use the standard version everywhere, unless you say otherwise in 9.14.

## 9. Open points for you

Each point has my proposal first. Answer with "agree", or choose another option.

**9.1 Language routes (a mismatch between CLAUDE.md and the code).**
- CLAUDE.md says English is at `/…` and Indonesian at `/id/…`.
- The code (since 2026-10-22, DESIGN.md §8.10–8.11) has **Indonesian at `/…` and English at `/en/…`**.
- *Proposal:* keep the code as it is (Indonesian default for IBF), and correct CLAUDE.md.

**9.2 Thema 16.** It looks like an unfinished alternative of the lesson-plan page. Thema 17 and 18 are copies of Thema 19.
- *Proposal:* use Thema 6/19 as the lesson-plan template and ignore 16–18.

**9.3 Test result address.**
- *Proposal:* show the result on the same page after "Submit", with no new address. "Try again" resets the page.
- *Alternative:* a separate `/resources/:slug/result` page. That one would need the answers kept in the browser.

**9.4 Comments box.** It's on every theme, resource, lesson and test page. DESIGN.md §8.5 #21 and §8.11 left comments out of v1, because they need moderation.
- *Proposal:* the box sends the message **privately to the team**, not public. It would be stored in Supabase next to the feedback votes and readable on the admin page. Only logged-in teachers can send, and nothing is shown publicly.
- *Alternatives:* leave the box out for now; or build public comments (moderation needed).

**9.5 Filters on lesson-plan and test pages.** The filter column also appears on detail pages, where there's nothing to filter.
- *Proposal:* clicking a filter there opens `/resources` with that filter.
- *Alternative:* drop the column on detail pages and give the content the full width.

**9.6 Gaps in the tokens and contrast fixes.**
- *Proposals:*
  - Hover and focus outside buttons: as §8.6, restyled with the new tokens.
  - Success `#1B6B3A` and error `#B00020`: the "Correct" pill green, and the existing error colour.
  - H1 on inner pages: display-xl 72/76 as in Figma.
  - Label letter-spacing: 0.06 em.
  - Small text on the ember and lagoon heroes: use **ink**, not blue. This affects the breadcrumb, author line and question count. Keep the large title blue.
  - "Delete account": ink text with the ember outline.
  - Never use muted ink or white on the colour backgrounds; use ink.

**9.7 New footer links.**
- "Extra Resources" → `/resources?type=extra`.
- "The community" → **there's no page for it.** *Proposal:* leave it out until there is one.
- "About us", "Contact" and "Partners" → anchors on `/mission`. Contact would point to the contact card.

**9.8 Theme navigation buttons.**
- *Proposal:* three buttons: "Go to lesson examples"; "Next: theme n+1" in the next theme's colour; "Back to theme n−1" as an outline button.
- Theme 1 has no back button, and Theme 4's next card goes to "All resources", as §8.3 #12.

**9.9 Personal page vs the accounts.** Figma shows Age and Class; the accounts store name, e-mail, school, NPSN and phone (§8.12).
- *Proposal:* use the Figma card layout with the account fields: name, e-mail, school, NPSN, phone.
- Keep the built parts that Figma doesn't show, restyled: the verified badge, the invite-code box, the Account section and saved resources.
- The three buttons (Log out, Change password, Delete account) jump to those parts.

**9.10 Resource types.** Figma's filters are For teachers / Lesson plans / Tests / Extra resources. Today's are lesson-plan, test, extra and module, plus a "for teachers" flag.
- *Proposal:* four types: lesson plan, test, for teachers (the theme modules and teacher guides), extra resource.
- "Download the module" (footer and home) links to `/resources?type=for-teachers`.

**9.11 Glossary terms.**
- *Proposal:* edit them once, in each theme. The theme's "Hard words" section and the Glossary page both read from there.

**9.12 How free should the theme pages be in the CMS?**
- *Proposal:* the block builder from section 6, plus a background colour per section, so editors can rebuild these pages and add new ones.
- *Alternative:* fixed templates per theme. Simpler for editors, but every layout change then needs a developer.

**9.13 "Show a random resource"** (§8.5 #22) isn't in Figma.
- *Proposal:* drop it.

**9.14 Inconsistencies in section 8.**
- *Proposal:* one footer everywhere; the button label "Test your knowledge" everywhere.
- Fix the typos.
- Replace the copy-paste texts with placeholders marked "TODO" in the content files, so they're easy to find.
- Leave the real texts to the team.

**9.15 Content the team must supply before going live.** No decision needed now; this is a to-do list:
- the climate-zone texts;
- the Theme 4 glossary meanings;
- the test explanations for Climate, Human and Nature, and Solutions;
- the mission product and team photos;
- the badge artwork;
- the level thresholds;
- the workshop link and contact details;
- the news-article links;
- photo rights (as §8.7 #31).
