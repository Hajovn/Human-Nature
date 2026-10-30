# Figma changes of 2026-10-29 (final design)

The designer's final changes, and the leftovers of [FIGMA-CHANGES.md](FIGMA-CHANGES.md) (2026-10-26) that were never built.

- **Final design:** file `eK4SrAUxIup1f2HYEEBHF0`, Page 2 (`188:394`).
- **Compared with:** `lXItjSXBE6mZz9d3x9uBWq` (the 2026-10-26 copy the site was built from). Same node IDs.
- **How:** every node of every Page 2 frame was fingerprinted in both files (type, visibility, position relative to its section, size, text, fills, image hash) and compared.
- **Unchanged frames:** components `192:2`, Themes 2 and 3, Glossary, the four tests and four test results, log in, Nature as Sacred (`278:3847`).
- **New images:** `design-assets/figma-2026-10-29/` (sources), already copied to `design-assets/raw/` and converted to `public/uploads/*.webp` (level badges to `src/assets/img/`). The images listed in FIGMA-CHANGES.md §5 were converted at the same time; the names are in the tables below.

## Decisions (owner, 2026-10-29)

1. **CMS edits win.** The team has edited content in the CMS since the design. A Figma change is applied only where the site still has the **old design text** (the "old" value in these tables or in FIGMA-CHANGES.md), a `TODO` placeholder, or nothing. Where the site has different text that the team wrote, keep it and list it under "Kept CMS edits" in §5.
2. **The 2026-10-26 backlog is included.** Groups A, B and C of FIGMA-CHANGES.md, with the open questions settled in §4.
3. **All five new lesson plans go live as in Figma**, including the two that still carry text copied from other lessons (marked "copied in Figma" below).
4. **"Choosing with Care"** (the former "Lesson plan: Climate Change") moves to the **Human and Nature** theme. Slugs of existing resources stay the same.

Indonesian: every new or changed English text needs Indonesian. Write it as a **draft for native review** and list it in the PR. Keep the existing (native-corrected) Indonesian where the English did not change.

---

## 1. New changes on existing pages

| # | Page / Figma node | Old → new | Where |
|---|---|---|---|
| N1 | Home "Start with the place children know" body `200:1976` | "Every theme begins in Lombok: …" → "Every theme incorporates Lombok: …" | `home.json › lombok.body` — the CMS already has a team edit ("incorporates **in** Lombok"): **keep** (rule 1), list in §5. |
| N2 | Home callout `200:2029` | "Keep your tone calm and steady." → "The same warming that dries fields in Lombok also melts ice at the poles and raises the sea everywhere." | `home.json › lombok.callout` — **already done** in the CMS. |
| N3 | Theme 4 Mitigation image `260:531` | new photo: wind farm on dry hills | `solutions.json` Mitigation item `image` (now `/uploads/solutions-mitigation-wind-turbines.webp`, two places) → `/uploads/solutions-mitigation-wind-farm.webp`. Alt EN "Wind turbines on dry hills under a cloudy sky" / ID "Turbin angin di perbukitan kering di bawah langit berawan" (draft). |
| N4 | Theme 4 Adaptation image `260:543` | new photo: aerial view of the Meninting dam and reservoir | Adaptation item `image` (now `solutions-adaptation-dam.webp`) → `/uploads/solutions-adaptation-dam-aerial.webp`. Alt EN "Aerial view of a dam and its reservoir between green hills" / ID "Pemandangan udara bendungan dan waduknya di antara perbukitan hijau" (draft). |
| N5 | Theme 4 "Recycle" card `242:4903` | internal note removed: "…selling it to a collector." | `solutions.json` Recycle text: drop the trailing `TODO: add a hint about Tom's company…` in both languages. |
| N6 | Our mission, team portraits (6) | grey placeholder circles → real portraits | `mission.json › team.people[i].photo` = `/uploads/mission-team-{hajo,willemijn,anna,jules,jannus,emilie}.webp` (order Hajo, Willemijn, Anna, Jules, Jannus, Emilie). |
| N7 | Our mission, new section "Lesson plans" `359:1624` between "Next workshop"/plans and the contact card | a full-width row of 4 photos, 352×328 each, 8 px radius, no gaps, 16 px side padding, 36 px top and bottom | New field `mission.json › gallery.photos[]` (already in types and CMS): `mission-gallery-1…4.webp`. Alts EN (draft): 1 "Pupils in a classroom during a Human Nature lesson", 2 "Children working together on a lesson activity", 3 "A teacher with pupils during the lesson", 4 "Pupils showing their work" — **check the photos and correct the alts**. Render on the page in that position. |
| N8 | Our mission "Our product" image `269:3616` | grey → photo (`mission-gallery-1`) | The image sits at x = 1320 of a clipped 1440 frame, so almost none of it is visible in the design. **Not applied**; note it. |
| N9 | Personal page level circles `274:1614…1627` | flat colour circles → round badge illustrations (sprout icon on sun for the current level, etc.) | UI images `src/assets/img/level-{beginner,curious,enthusiast,scholar,visionary}.webp`. Figma has 5 levels (Beginner, Curious, Enthusiast, Scholar, Visionary); the big circle shows the current level's badge. Use them in the level track on `/profile`. Check `LEVELS` in `src/lib/storage.ts` for the number of levels. |
| N10 | Lesson-plan heroes, H1 colour | Ring of Fire and El Niño H1 brand blue → ink `#14142B` (all lesson plans now ink) | Check the detail hero; DESIGN.md says text on accents is ink. |
| N11 | "Lesson plan: Climate Change" `278:3656` | title → "Lesson plan: Choosing with Care"; About `278:3706` "Nature as something to be controlled explores the idea…" → "This lesson explores the idea that humans have the ability to change nature, but that this ability comes with responsibility. The decisions we make now, will impact the future." Theme → Human and Nature (decision 4). | `lesson-plan-climate-change.json` (slug stays): `title`, `about`, `theme`. |
| N12 | "Lesson plan: Solutions for Plastic" `276:3410/3411` | title → "Plastic Waste Solutions" (shown as "Lesson plan: Plastic Waste Solutions", matching the other heroes); author (empty) → "Iza van der Klauw" | `lesson-plan-solutions-for-plastic.json` |
| N13 | LessonCards (resource library, and the home page) | Card titles no longer start with "Lesson plan:" ("El Niño and La Niña", "Ring of Fire", "Choosing with Care"…); the hero on the lesson page keeps it. | LessonCard: drop a leading "Lesson plan: " (EN) / "Rencana pelajaran: " (ID, check the actual prefix used in content) from the title of `lesson-plan` resources. |
| N14 | Resource library order `260:1125` | see §3 | `order` of every resource. |
| N15 | Resource library card text | Nature as Sacred card "Grade 1-2 · 90 min"; Choosing with Care card "Grade 4-6"; Plastic card "All grades · 120 min" | Cards and detail pages share one field. The detail pages win (decision of 2026-10-26 open question 1): **keep** `grade`/`duration` as they are. |

Thema 20 (`429:1887`) is the resource library with "Climate" + "Lesson plans" ticked (3 results). It shows ticked checkboxes in brand blue; nothing new to build if the filter already looks like that.

## 2. Five new lesson plans

All use the lesson-plan template (Thema 19). Author on all five: "Kandi Sekarwulan, Jagabumi Project". No download file is in Figma: leave `file` empty (hide the Download button when there is no file, if it doesn't already). `featured: false`. Photos are listed in Figma order.

### 2.1 Simulation of the Atmosphere — Thema 21 `433:2454` — climate

- File `content/resources/lesson-plan-simulation-of-the-atmosphere.json`, theme `climate`, grade "Grade 4–6", duration "45 min" (card says "Grade 1-2"; the page wins).
- Title "Lesson plan: Simulation of the Atmosphere".
- Card line (`description`): Figma "An outdoor game in which children act out how greenhouse gases." (cut off) → use "An outdoor game in which children act out how greenhouse gases trap the sun’s heat."
- Image `/uploads/resource-simulation-atmosphere-cover.webp`.
- About: "An outdoor game in which children act out how greenhouse gases trap the sun’s heat in the atmosphere, and how human activity adds to global warming."
- Goals:
  - "Children understand how global warming happens."
  - "Children understand that human activity can contribute to global warming."
- Context: "Humans can live on this earth due to greenhouse gases. They trap heat so it is not -18 °C on our planet. In this lesson, the class will act out the natural process of these greenhouse gases by each taking a role of a gas or of the sun. The children will be physically taught how the gases and heat interact and how humans also influence this natural process. It is a place for learning, playing, and reflection." (Figma typos "rol", "gasses" fixed.)
- Materials:
  - Earth Structure / "Picture of the Earth’s layers."
  - Discs / "One piece for all children. There is the sun, CO2, CH4 and CFC discs. See document."
  - Tape / "To attach the discs to the children."
  - Chalk / "To make a big circle outside as playing field."
- Steps:
  1. Introduction / "Explore the different layers of the Earth together. Ask the children what they see and what they mean. You can ask them where we currently live."
  2. Insight / "Ask them to imagine if these different layers did not exist, what the world would look like without."
  3. Metaphor / "Explain the different meanings and functions behind every layer through the blanket metaphor."
  4. Simulation (Figma: "Simulasi") / "Gather the teacher and children on the field and play." + list: "The chalk circle is the “Earth’s atmosphere”. Children without a role stand outside it." · "Hand out the discs at random. Children attach them to the front of their shirt." · "Explain the roles and the rules. Then start." · "Read the story in parts. The children act as the story says."
  5. Reflection and sharing / "Reflect together with the children on what happened. Before the game there were greenhouse gases, what happened? When there were greenhouse gases, what happened in the Earth’s atmosphere?"
- Key message: "The atmosphere makes life possible, but our way of living affects the atmosphere."
- Teacher tip: "Keep your tone calm and steady, and avoid dramatic or frightening language. Encourage the children to explain their thinking. There are no right or wrong answers, so emphasise staying together and listening."
- Photos: `resource-simulation-atmosphere-photo-1/2/3.webp`.

### 2.2 Is Climate Change real? — Thema 22 `439:1933` — climate-change

- File `lesson-plan-is-climate-change-real.json`, grade "Grade 5–6", duration "120 min".
- Title "Lesson plan: Is Climate Change real?".
- Card line: "A lesson where children go interview someone who is 50+, and decide: is climate change really happening?"
- Image `/uploads/resource-is-climate-change-real-cover.webp`.
- About: "A lesson where children go on an adventure to get to know climate change. They look up what it means, interview someone who is 50 or older, and decide together: is climate change really happening in our surroundings?"
- Goals:
  - "Children know the definition of climate change."
  - "Children recognize that climate change is happening in their surroundings."
- Context: "This lesson asks children to interview someone aged 50 or older. The lesson needs at least two days, so the children have the time before the lesson to talk to a grandparent or village elder first. Print the interview sheets (document) and the comparison tables (document). Children will compare the image of more than 20 years ago to that of their own to learn about the influences that climate change has around them."
- Materials:
  - Interview sheet / "Interview plan for each child with structured questions to ask their interviewee."
  - Comparison table / "One piece for all children. There is the sun, CO2, CH4 and CFC discs. See document." (**copied in Figma** from 2.1)
  - LED Screen / "To show a concluding video about climate change by UNICEF Indonesia."
- Steps:
  1. Introduction / "Start the lesson at least a day before. Tell them they will go on an adventure interviewing elders. However the class has to establish first what climate change is and how they feel about it."
  2. Insight / "Give them a moment to share their ideas about climate change and try to establish the different tangible nature aspects it influences. Like seasons, weather, the vegetation, the wildlife, natural disaster possibly and so on."
  3. Interview / "Invite the children to investigate whether climate change is really happening, by interviewing someone aged 50 or older (a grandparent, a village elder, and so on)." + list: "Was our town or village different in the past?" · "What were the differences?" · "What were the seasons, air and weather like when the grandparent was young?" · "How is that different from the seasons, air and weather now?"
  4. Compare / "The next day the children will sit together in small groups and bring together their findings in the comparison table."
  5. Share and conclude / "Each group tells its comparison table to the class. The teacher writes a summary of the findings as bullet points. Using the summary on the board, the children conclude together:" + list: "Is climate change really happening?" · "If yes, what changes can be seen?"
- Key message: "Through the experiences of an elder, children gain a different perspective on climate change, making the change more tangible."
- Teacher tip: "Keep your tone calm and steady, and avoid dramatic or frightening language. Encourage the children to explain their thinking. There are no right or wrong answers, so emphasize listening."
- Photos: the same three as 2.1 (**copied in Figma**).

### 2.3 Journey of Climate Change — Thema 23 `440:1526` — climate-change

- File `lesson-plan-journey-of-climate-change.json`, grade "Grade 3–6" (card "Grade 4-6"), duration "45 min".
- Title "Lesson plan: Journey of Climate Change".
- Card line: "A sorting game and a quiz in which children get to know the terms around climate change."
- Image `/uploads/resource-journey-of-climate-change-cover.webp`.
- About: "A sorting game and a quiz in which children get to know the terms around climate change, how they connect, and clear up common mix-ups between them."
- Goals:
  - "Children recognize the terms related to climate change and how the terms relate to each other."
  - "Clear up misconceptions about how the terms in climate change are used."
- Context: identical to 2.2 (**copied in Figma**).
- Materials:
  - 5 event cards / "Global warming, climate change, human activities that release greenhouse gases, climate disaster, greenhouse effect."
  - Definitions / "Of all of the terms and climate change itself. Can be in books or on the internet. If neither is available, use print-outs."
  - Quiz statements / "See the document."
- Steps (4):
  1. Sort the events / "Start with a game: “Try to put these five events in order, from the earliest to the latest!” Note: this step only aims to get the children’s attention, so the order does not need to be correct. Let the children answer with the knowledge they already have."
  2. Look up the terms / "Invite the children to find out what each term means. Use learning sources such as books or the internet to help the search."
  3. Check and correct / "After looking things up, invite the children to check the order from step 1 again." + list: "Discuss: “Is the order correct, or does something need to be corrected? What is your reason?”" · "Then fix the order of the papers until it is correct (answer key on page 3)." · "At the end, explain the correct order of events and clear up misconceptions (if any)." · "Do not forget to appreciate the children’s effort in finding out and discussing."
  4. Sit-stand quiz / "To test the children’s understanding, use the “sit-stand” quiz." + list: "Read some true or false statements aloud (page 3)." · "Children answer by sitting (if they think it is false) or standing (if they think it is true)."
- Key message: "Children get to know the terms around climate change, how they connect, and clear up common mix-ups between them."
- Teacher tip: as 2.2.
- Photos: `resource-journey-of-climate-change-photo-1.webp`, `-photo-2.webp`, `-cover.webp`.

### 2.4 Adaptation and Mitigation — Thema 24 `446:2111` — solutions

- File `lesson-plan-adaptation-and-mitigation.json`, grade "Grade 4–6" (card "All grades"), duration "90 min" (card "120 min").
- Title EN "Lesson plan: Adaptation and Mitigation" (Figma hero is in Indonesian: "Adaptasi dan Mitigasi"; the card says "Adaptation and Mitigation"). ID "… Adaptasi dan Mitigasi".
- Card line, about, goals, context, materials, steps, key message, teacher tip: **all copied in Figma** from Solutions for Plastic. Copy them from `lesson-plan-solutions-for-plastic.json` (both languages).
- Image `/uploads/resource-adaptation-mitigation-cover.webp`.
- Photos: `resource-adaptation-mitigation-photo-1.webp`, then Solutions for Plastic's cover photo and its third photo (the existing uploads).

### 2.5 Nature Bingo — Thema 25 `446:2332` — human-and-nature

- File `lesson-plan-nature-bingo.json`, grade "Grade 1–3" (card "Grade 5-6"), duration "90 min" (card "120 min").
- Title "Lesson plan: Nature Bingo" (card "Bingo").
- Card line: Figma copies 2.2's line ("A lesson where children go interview someone who is 50+…"). Use it as in Figma (**copied in Figma**).
- About, goals, context, materials, steps (4), key message, teacher tips, cover and photos: **all copied in Figma** from Nature as Sacred. Copy them from `lesson-plan-nature-as-sacred.json` (both languages), including the images.

## 3. Resource library order (Figma `260:1125`)

1 El Niño and La Niña · 2 Ring of Fire · 3 Simulation of the Atmosphere · 4 Is Climate Change real? · 5 Journey of Climate Change · 6 Nature as Sacred · 7 Choosing with Care · 8 Nature Bingo · 9 Plastic Waste Solutions · 10 Adaptation and Mitigation · 11–14 lesson modules (themes 1–4) · 15 Glossary (extra resource, link `/glossary`) · 16–19 tests (Climate, Climate Change, Human and Nature, Solutions) · 20 ClimateScience.org · 21 If we do nothing · 22 Climate change: we are the problem and the solution · 23 Materi Sumber Belajar Jenjang Sekolah Dasar · 24 Jaga Bumi · 25 Indonesian Biru Foundation – Permaculture · 26 Coral Reef Care – Plastic Waste.

Extra resources (FIGMA-CHANGES.md B6), images already converted: `resource-extra-climatescience-org`, `-ted-ed-if-we-do-nothing`, `-we-are-the-problem`, `-ruang-murid`, `-jaga-bumi`, `-coral-reef-care-plastic-waste`; the IBF Permaculture card uses `/uploads/mission-ibf-logo-round.webp` (round logo); the Glossary card keeps its existing image if one exists (else none). Links: ClimateScience.org `https://climatescience.org/`, Glossary `/glossary`; the others are not in Figma — leave empty and list them as missing. Tags in Figma: kind (website / video / document / download) and language (Bahasa ID / English).

## 4. Settled open questions of FIGMA-CHANGES.md §8

1. Grade/duration conflicts: the lesson page wins; keep the repo values.
2. Author of Solutions for Plastic: "Iza van der Klauw" (now in Figma).
3. Missing links: keep what the CMS has; otherwise leave empty and list.
4. Theme 2 "who is responsible": use the suggested wording ("On the map, the darker a country, the more CO₂ its citizens produce."); the explanation card keeps its link.
5. "UNIPBES" → "IPBES".
6. H&N test Q7: use the explanation without the designer's note; keep the option text. Climate test Q7 explanation: still a placeholder in Figma; keep what the repo has.
7. Contact: name "Elmania" (only if the CMS field is empty), no phone, avatar alt "Elmania".
8. "Favorites" filter: shown only to signed-in teachers; spelling "Favorites" (as in Figma).
9. Theme 4 PDF thumbnail: its own photo (`pdfImage` field, `/uploads/solutions-pdf-rice-terraces.webp`); Themes 1–3 use the hero.
10. "Coming soon" extra resources: show them, with "Coming soon" as their card line.
11–12. No change.

Image names for the backlog items (FIGMA-CHANGES.md §5 → `/uploads/…webp`): A11 `climate-change-module-choosing-with-care`, A12 `climate-change-news-lombok-resilience`, A18 `human-nature-module-mandalika`, A19 `human-nature-news-aqi-ranking`, A28 `solutions-intro-beach-class`, A29 `solutions-module-children-drawing`, A30 `solutions-news-membangun-lombok`, A38 `solutions-pdf-rice-terraces`, A10 reuse `climate-change-source-farming`, B4 `resource-module-{climate,climate-change,human-and-nature,solutions}`, B8 `mission-hero-schoolgirls`, B9 `mission-tu-delft-logo`, B16 reuse `home-ibf-logo`, B19 `mission-contact-elmania`, C4 `resource-el-nino-photo-1-neutral`, `-2-el-nino`, `-3-trade-winds`, `-4-la-nina`. B21 (home photo): the CMS already has a newer photo; keep it.

## 5. Kept CMS edits and open points

**Kept CMS edits** (the site differs from Figma on purpose, rule 1):
- `home.json › lombok.body`: "Every theme incorporates **in** Lombok…" (Figma: "incorporates Lombok").
- `mission.json › impact.numbers[0].value`: EN "100+" (Figma "90+"). The Indonesian still says the old "150+": **the team should set it**, probably to "100+".
- `human-and-nature.json › introCards[2].image`: the team's `newsarticle-forest-fire.webp` (Figma: AQI map). Its alt is empty.
- `solutions.json › introCards[2]`: the team's title capitalisation and `rectangle-162.webp` image (Figma: dam photo). Its alt is empty.
- Grade/duration of Ring of Fire, El Niño, Nature as Sacred, Choosing with Care and Plastic Waste Solutions (detail page wins, §4.1).
- Module titles "Lesson module: X" (Figma cards: "Theme N: X").

**Missing content:**
- Links of the extra resources If we do nothing, We are the problem and the solution, Materi Sumber Belajar, Jaga Bumi, IBF Permaculture, Coral Reef Care.
- Download files of the five new lesson plans (they show no Download button until one is added).
- Card lines of the four lesson modules are still `TODO` and show on the cards.
- Native review of all Indonesian drafts (new lesson plans, test intros and explanations, theme texts, alts).

**Copied in Figma, published as is (decision 3):** Adaptation and Mitigation (all text from Plastic Waste Solutions), Nature Bingo (all text and photos from Nature as Sacred; its card line comes from Is Climate Change real?), the "Comparison table" material of Is Climate Change real?, the context of Journey of Climate Change, and the photos of Is Climate Change real?.

**Not built (needs a decision):**
- Extra-resource cards: Figma shows kind and language tags (website / video / document, Bahasa ID / English) and fades the "Coming soon" cards. There's no field for the tags yet.
- The sixth level, Climate Expert, has no badge in Figma (Figma has five levels).
- Mission "Our product": its photo sits outside the frame (N8), and the small "Lesson plan" button there isn't on the site.
- Older differences, not part of this update: team portraits are 107 px on the site and 180 px in Figma; the theme PDF thumbnail is 64 × 90 px with no border, while Figma has 106 × 151 with a coloured border.

**Not tested:** the Favorites filter while logged in. Logged out, the option is hidden as intended.
