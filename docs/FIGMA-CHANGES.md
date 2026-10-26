# Figma changes of 2026-10-26

What the designer changed in Figma between the copy the site was built from and the new copy, written so the work can be done **without Figma access**.

- **Old** (what the site and DESIGN.md were built from): file `aqpCKUSoPFvGwAUbcgjF5j`, Page 2 (`188:394`).
- **New** (designer's changes): file `lXItjSXBE6mZz9d3x9uBWq`, Page 2 (`188:394`). Existing nodes keep their IDs.
- **Reference screenshots of the new design** are in `design-assets/redesign/` (the existing PNGs were replaced; new ones added, see §6).
- **Images** from the new design are in `design-assets/figma-2026-10-26/<page>/` (full-resolution source image `name.png|jpg`, plus `name--figma-render.png` = how Figma crops it in its slot; for resource cards `--card-render.png` = the whole card).
- **Full text of the three new lesson plans**: `docs/figma-text/`.

## How the comparison was done

Every TEXT node, every node with an image fill, and every hidden node in the changed frames was fingerprinted in the old file and compared with the new file; added/removed nodes were found per section. The landing page was also compared on position, size, fills and text of every node. Unchanged frames (`192:2` components, `274:2118` log in, `226:3121`) were not re-checked.

## Labels

- **content** — a value in `content/**/*.json` (editable in the CMS). Path is given as `file › field.path` and applies to both the `en` and `id` objects unless stated.
- **interface string** — `src/i18n/strings.ts` (both languages).
- **layout/component** — React/CSS change.
- **already done** — the repo already matches the new design; nothing to do.
- **sample** — the design changed example data that the site generates itself (test scores, saved items…); nothing to do.

## Indonesian text

The Indonesian (`id`) text in `content/` was corrected by a native speaker. Change it **only as much as the English change needs**. Every Indonesian suggestion below is a **DRAFT for native review** — mark it in the commit/PR so the reviewer can check it. Where the old Indonesian was a `TODO:` placeholder, the draft is a full translation and also needs review.

---

## Group A — theme pages 1–4

Independent of the other groups. Files: `content/themes/*.json`, `src/pages/ThemePage.tsx`, `src/components/Feedback.tsx`, `src/i18n/strings.ts`.

### A.1 Theme 1 Climate — Figma "Thema 1" `222:2211` — route `/themes/climate` (`/en/themes/climate`)

| # | What | Old → new (English) | Where | Kind | Indonesian (DRAFT for native review) |
|---|---|---|---|---|---|
| A1 | Hero lead (`222:2511`) | "Climate is the typical weather of a place over many years. Lombok has a tropical climate with a dry and a wet season." → "Climate is the typical weather of a place over many years." | `content/themes/climate.json › lead` | content | Remove the second sentence: "Iklim adalah cuaca khas suatu tempat selama bertahun-tahun." |
| A2 | Hero intro (`222:2509`) | "The weather is what you see today. The climate is the pattern you can expect over time. On this page you will find lessons that help children understand the seasons, the sun, the rain and the greenhouse effect that keeps our planet warm enough for life." → "Lombok has a tropical climate with a dry and a wet season. Weather is what you see today. Climate is the pattern you can expect over time." | `climate.json › intro` | content | "Lombok memiliki iklim tropis dengan musim kemarau dan musim hujan. Cuaca adalah apa yang Anda lihat hari ini. Iklim adalah pola yang dapat Anda harapkan dari waktu ke waktu." (first sentence moved from the old lead; rest = old intro minus the last sentence, "Cuaca"/"Iklim" without "The") |
| A3 | Climate zone "Subequatorial" (`226:2920`) | placeholder (copy of Equatorial) → "Hot, with long rainy seasons and a short dry season." | `climate.json › sections[1].blocks[0].items[1].text` (now `TODO`) | content | "Panas, dengan musim hujan yang panjang dan musim kemarau yang pendek." |
| A4 | "Tropical" (`226:2926`) | → "Hot, with a wet and a dry season. Open grasslands and monsoons." | `… items[2].text` | content | "Panas, dengan musim hujan dan musim kemarau. Padang rumput terbuka dan angin muson." |
| A5 | "Subtropical" (`226:2879`) | → "Long, hot summers and short, mild winters." | `… items[3].text` | content | "Musim panas yang panjang dan terik, serta musim dingin yang singkat dan sejuk." |
| A6 | "Temperate" (`226:2944`) | → "Four seasons: spring, summer, autumn and winter." | `… items[4].text` | content | "Empat musim: musim semi, musim panas, musim gugur, dan musim dingin." |
| A7 | "Subpolar" (`226:2950`) | → "Short, cool summers and long, freezing winters." | `… items[5].text` | content | "Musim panas yang singkat dan sejuk, serta musim dingin yang panjang dan sangat dingin." |
| A8 | "Polar" (`226:2886`) | → "Freezing cold all year, with ice, snow and frozen land." | `… items[6].text` | content | "Sangat dingin sepanjang tahun, dengan es, salju, dan tanah yang membeku." |

(The Equatorial text is unchanged.)

### A.2 Theme 2 Climate Change — "Thema 2" `242:3344` — `/themes/climate-change`

Intro-card row, old vs new: the explanation card and the news card got photos (they were grey placeholders), the module card got another image, and the news card shows the real headline, underlined like a link, under the "News article" label. The same pattern applies to Themes 3 and 4.

| # | What | Old → new | Where | Kind | Indonesian (DRAFT) |
|---|---|---|---|---|---|
| A9 | Explanation intro card title (`242:3389`) | "Learn how the atmosphere works" → "Learn where greenhouse gases come from" | `content/themes/climate-change.json › introCards[0].title` | content | "Pelajari cara kerja atmosfer" → "Pelajari dari mana gas rumah kaca berasal" |
| A10 | Explanation card image (`242:3387`, new) | grey placeholder → photo of a combine harvester on a wheat field | `introCards[0].image` / `.alt` (now empty) | content | alt: "Mesin pemanen di ladang gandum" (draft). Image: same photo as the existing "farming" source card — reuse `/uploads/climate-change-source-farming.webp` (the Figma copy `theme-2-climate-change/intro-explanation-farming.png` is only 307 px, circle-cropped). Its link `#why-it-happens` may now better point to `#where-gases-come-from` — **ask**. |
| A11 | Module card image (`242:3391`) | photo of smiling schoolchildren → start screen of the "Choosing with Care" web tool (the cover of the new Climate Change lesson plan) | `introCards[1].image` (now `/uploads/climate-change-module-children.webp`), `.alt` | content | File: `theme-2-climate-change/intro-module-card-choosing-with-care.png`. alt draft EN "Start screen of the web tool Choosing with Care" / ID "Layar awal alat web Choosing with Care". |
| A12 | News card (`242:3400`, image `242:3398`) | title "News article" (placeholder) → "Lombok Muncul sebagai Model Ketahanan Iklim" (Indonesian headline, also on the English page); photo of two people planting coral on a beach | `introCards[2].title` (now `TODO`), `.image`, `.alt`; `.link` unknown | content | Same Indonesian headline in `id`. File: `theme-2-climate-change/intro-news-lombok-climate-resilience.png`. **Article URL not in Figma — ask.** |
| A13 | Big number caption 1 (`I242:3717;193:45`) | "CO₂ in the air before factories" → "ppm CO₂ in the air before factories" | `climate-change.json › sections[0].blocks[0].items[0].caption` | content | "ppm CO₂ di udara sebelum ada pabrik" |
| A14 | Big number caption 2 (`I242:3718;193:45`) | "CO₂ in the air in September 2026 (NOAA" → "ppm CO₂ in the air in September 2026 (NOAA" (Figma still lacks the closing ")"; the repo has it) | `… items[1].caption` | content | "ppm CO₂ di udara pada September 2026 (NOAA)" |
| A15 | "Who is responsible" intro (`242:3880`) | "…Yet people who release the least are often hit the hardest" → adds "In the image the countries that are a deeper, their citizens are producing more CO2." | `climate-change.json › sections[3].intro` | content | The added English sentence is ungrammatical ("are a deeper"). Suggested EN: "On the map, the darker a country, the more CO₂ its citizens produce." — **confirm with designer.** ID: append "Di peta, semakin gelap warna suatu negara, semakin banyak CO₂ yang dihasilkan warganya." |
| A16 | Map source line (`242:5036`) | "Source: Our World in Data" → "Source: Our World in Data. The darker the red the more emission." | `climate-change.json › sections[3].blocks[1].source` (the per-person emissions map; value "Our World in Data."; the "Source:" prefix comes from the component) | content | "Our World in Data. Semakin gelap warna merahnya, semakin banyak emisinya." |

### A.3 Theme 3 Human and Nature — "Thema 3" `242:3975` — `/themes/human-and-nature`

| # | What | Old → new | Where | Kind | Indonesian (DRAFT) |
|---|---|---|---|---|---|
| A17 | Explanation card title (`242:4021`) | "Mangroves" → "Learn about mangroves" | `content/themes/human-and-nature.json › introCards[0].title` | content | "Mangrove" → "Pelajari tentang mangrove" |
| A18 | Module card image (`242:4023`) | children photo → illustration of Putri Mandalika on a cliff (cover of the new "Nature as Sacred" lesson plan) | `introCards[1].image` / `.alt` | content | File `theme-3-human-and-nature/intro-module-card.png`. alt draft EN "Illustration of Princess Mandalika above the sea" / ID "Ilustrasi Putri Mandalika di atas laut". |
| A19 | News card (`242:4032`, image `242:4030`) | "News article" → "Peringkat kota besar global AQI⁺ langsung" (Indonesian headline); screenshot of an air-quality (AQI) map of Indonesia | `introCards[2].title` (now `TODO`), `.image`, `.alt`, `.link` | content | Same headline in `id`. File `theme-3-human-and-nature/intro-news-aqi-ranking.png`. **URL unknown — ask.** |
| A20 | Section "The big idea" intro (`242:4038`) | "…cannot adjust. Then people suffer too." → "…cannot adjust to changing conditions. Then people suffer too." | `human-and-nature.json › sections[0].intro` | content | "…tidak dapat menyesuaikan diri dengan kondisi yang berubah. Akibatnya, manusia juga menderita." |
| A21 | Numbered card 1 text (`242:4327`) | "Faster than ever before." → "Due to the amount of carbon humans emit, the earth heats faster than ever before." | `sections[0].blocks[1].items[0].text` | content | "Karena banyaknya karbon yang dilepaskan manusia, bumi memanas lebih cepat dari sebelumnya." |
| A22 | Numbered card 3 (`242:4337`) | "Less food, less clean water, less protection." → "Changing habitats means less food, less clean water, less protection." | `… items[2].text` | content | "Habitat yang berubah berarti lebih sedikit makanan, lebih sedikit air bersih, lebih sedikit perlindungan." |
| A23 | Numbered card 4 (`242:4342`) | "On the coast, on farms and in daily life." → "…in daily life. The sea is hotter and water is getting more scarce." | `… items[3].text` | content | "Di pesisir, di ladang, dan dalam kehidupan sehari-hari. Laut makin panas dan air makin langka." |
| A24 | Paragraph removed (`242:4043`) | The paragraph that repeated the ppm explanation from Theme 2 is **deleted** in Figma. | Delete `human-and-nature.json › sections[0].blocks[0]` (the `text` block with `TODO: text for this paragraph…`) in both languages. | content | — |
| A25 | Callout label (`I242:4048;193:30`) | "Ask your teacher" → "Ask your Class" | `sections[0].blocks[2].label` → "Ask your class" | content | "Tanyakan kepada guru Anda" → "Tanyakan kepada kelas Anda" (same as the interface string `callout.ask-your-class`) |
| A26 | Second callout label (`I260:641;193:30`) | "Ask your teacher" → "Ask your class" | `sections[7].blocks[3].label` — EN **already done**; the `id` still says "Tanyakan kepada guru Anda" | content | "Tanyakan kepada kelas Anda" |
| A27 | Big number 3 (`I260:496;193:44/45`) | "45 → 700" / "low-oxygen ocean areas, 1960s to today (IUCN)" → "1 million" / "species on the brink of extinction. (UNIPBES)" | `sections[6].blocks[0].items[2].value` and `.caption` | content | value "1 juta"; caption "spesies di ambang kepunahan (IPBES)". "UNIPBES" is probably IPBES (the UN biodiversity panel) — **confirm**. |

### A.4 Theme 4 Solutions — "Thema 4" `242:4453` — `/themes/solutions`

| # | What | Old → new | Where | Kind | Indonesian (DRAFT) |
|---|---|---|---|---|---|
| A28 | Explanation card image (`242:4497`) | placeholder → photo of a class sitting on the beach with a teacher | `content/themes/solutions.json › introCards[0].image` / `.alt` (now empty) | content | File `theme-4-solutions/intro-explanation.jpg` (2048×1536). alt draft EN "A teacher and pupils sitting on the beach at sunset" / ID "Guru dan murid duduk di pantai saat matahari terbenam". |
| A29 | Module card image (`242:4501`) | children photo → children drawing ideas on paper (cover of the new "Solutions for Plastic" lesson plan) | `introCards[1].image` / `.alt` | content | File `theme-4-solutions/intro-module-card.png`. alt draft EN "Children drawing ideas on paper" / ID "Anak-anak menggambar ide di atas kertas". |
| A30 | News card (`242:4510`, image `242:4508`) | "News" → "Membangun Pulau Lombok dari hulu" (Indonesian headline); photo of the Meninting dam opening | `introCards[2].title` (now `TODO`), `.image`, `.alt`, `.link` | content | Same headline in `id`. File `theme-4-solutions/intro-news-membangun-lombok.png`. **URL unknown — ask.** |
| A31 | Glossary "Mitigation" (`242:4615`) | copied H&N text → "Climate change solutions that focus on reducing the cause for climate change." | `solutions.json › glossary[0].meaning` (now `TODO`) | content | "Solusi perubahan iklim yang berfokus pada mengurangi penyebab perubahan iklim." |
| A32 | "Adaptation" (`242:4619`) | → "Climate change solutions that focus on reducing the effects that climate change has." | `glossary[1].meaning` | content | "Solusi perubahan iklim yang berfokus pada mengurangi dampak perubahan iklim." |
| A33 | "Renewable energy" (`242:4623`) | → "Energy produced from natural resources that are continuously replenished." | `glossary[2].meaning` | content | "Energi yang dihasilkan dari sumber daya alam yang terus-menerus terisi kembali." |
| A34 | "Monoculture" (`242:4628`) | → "Farming with only one crop on your land year after year." | `glossary[3].meaning` | content | "Bertani dengan hanya satu jenis tanaman di lahan Anda dari tahun ke tahun." |
| A35 | "Permaculture" (`242:4879`) | → "Farming with multiple crops that mimics the resilience of natural ecosystems." | `glossary[4].meaning` | content | "Bertani dengan berbagai jenis tanaman yang meniru ketahanan ekosistem alami." |
| A36 | Next-theme card on the last theme (`242:4656`, `242:4657`) | "Next: theme 4 / Solutions" (copy) → "**Back to: theme 1** / **Climate**" | The site now shows "Next / All resources" on theme 4 (`ThemePage.tsx`, `next` is undefined). Change: on the last theme show a `NextCard` to theme 1 with label from a new string, accent = theme 1. | interface string + layout/component | New key, e.g. `theme.backToFirst`: EN "Back to: theme {n}", ID "Kembali ke: tema {n}" (draft). |
| A37 | Back button (`I242:4660;192:12`) | "Go to theme 2" → "Go to theme 3" | Site already shows "Back to theme {n}" with the right number (`theme.back`) | already done | — |

### A.5 All four themes — pager images (layout/component)

In the end section of every theme page (Figma "Collaboration" group, e.g. `242:3569` on Theme 2) two shapes got photos:

| # | Element | Old | New | Implementation (no new content field needed) |
|---|---|---|---|---|
| A38 | PDF thumbnail next to "Download this theme as a PDF" (`Group 25`, 106×151, rounded, coloured border) | plain shape (`.pdfThumb` in `src/components/Feedback.tsx`) | photo = **this** theme's hero photo (Themes 1–3 use exactly the hero image `theme.heroImage`). Theme 4 uses a different rice-terrace photo (`theme-4-solutions/pdf-thumbnail.jpg`). | layout/component: give `DownloadPdf` an `image` prop and pass `theme.heroImage` (or a new `pdfImage` field if Theme 4's own photo is wanted — **ask**). |
| A39 | Circle above "Go to lesson examples" (`Group 18`, 168×168) | sun-coloured circle (`.pagerShape` in `ThemePage.module.css`) | photo = the **next** theme's hero photo (1→2, 2→3, 3→4, 4→1) | layout/component: render `next.heroImage` (theme 1's on theme 4) in the circle, `object-fit: cover`, decorative (`alt=""`). |

Group A total: **39 items** (A1–A39), of which 1 already done.

---

## Group B — Resources, Glossary, Our mission, Personal page, Home

### B.1 Resource library — "Thema 5" `260:726` — `/resources`

| # | What | Old → new | Where | Kind | Indonesian (DRAFT) |
|---|---|---|---|---|---|
| B1 | New filter option "Favorites" (`351:1621`) | — → a 6th checkbox under **Type**, after "Extra resources" | `src/components/FilterSidebar.tsx` + `ResourcesPage.tsx` (filter on resources the signed-in teacher saved; hide or disable when signed out — **ask**) | interface string + layout/component | New key `filters.favorites`: EN "Favorites" (site uses British spelling elsewhere? it uses "colour" in content — pick "Favourites" or "Favorites" consistently, **ask**), ID "Favorit" |
| B2 | Every card now has a photo (`Group 43` image in all 23 cards) | only 3 cards had images | Cards use `resource.image`. Tests and "for teachers" modules have no `image` yet → add (see B3, B4). Extra resources are not in the repo (B6). | content | — |
| B3 | Test cards (`261:1486/1487/1488/1548`) | duration "45 min" → **"10 min"**; theme tags fixed; photo = the theme's hero photo | `content/resources/test-*.json › duration` (add) = "10 min"; `image` = the theme's `heroImage` (`/uploads/climate-hero-beach.webp`, `climate-change-hero-volcano`, `human-nature-hero-arch`, `solutions-hero-rice-terraces`) | content | duration "10 menit" |
| B4 | "For teachers" module cards (`261:1549/1550/1610/1611`) | "45 min" → **"30 min"**; theme tags fixed; photo = screenshot of the theme page hero | `content/resources/module-*.json › duration` = "30 min", `image` = `resources/for-teachers-theme-N-*.png` | content | "30 menit" |
| B5 | Lesson-plan cards | card 2: "Lesson Plan: Human and Nature" → "Lesson Plan: Nature as Sacred"; card 4: "Lesson plan: Climate" → "Lesson plan: Solutions"; card 5: "Lesson Plan: X" → "Lesson Plan: Climate change"; card 6: "Lesson plan: X" → "Coming soon" | These are the three new lesson plans → **Group D**. The "Coming soon" card (theme Climate change, "A simple experiment shows how air can trap heat.") has no lesson behind it — skip, or add a placeholder resource (**ask**). | content | — |
| B6 | Extra-resource cards | renamed / filled in: "What happens if we do nothing?" → "If we do nothing." ("TED-Ed video. English with Bahasa Indonesia subtitles. The consequences of climate change."); "Kandis document apparaat" → "Jaga Bumi" (document, Bahasa ID, "Coming Soon"); "IBF Perma Culture docs" → "Indonesian Biru Foundation - Permaculture" (document, "Coming Soon"); "CRC document over plastic" → "Coral Reef Care - Plastic Waste" (document, "Coming Soon"). Unchanged text, new photo: "ClimateScience.org", "Climate change: we are the problem and the solution", "Materi Sumber Belajar Jenjang Sekolah Dasar", "Glossary". | **No `type: "extra"` resources exist in `content/resources/` yet.** Adding them means new JSON files (`type: "extra"`, `link`, `image`) — URLs are not in Figma. Images: `design-assets/figma-2026-10-26/resources/extra-*.png`. | content | — |

### B.2 Glossary — `299:1502` — `/glossary`

| # | What | Where | Kind |
|---|---|---|---|
| B7 | The five Solutions terms got their real meanings (`299:2180…2197`): identical to A31–A35. | The glossary page reads `theme.glossary`, so A31–A35 cover it. | content (no extra work) |

### B.3 Our mission — "Thema 8" `269:3257` — `/mission`

| # | What | Old → new | Where | Kind | Indonesian (DRAFT) |
|---|---|---|---|---|---|
| B8 | Hero photo (`269:3286`) | reef flat with people gathering shellfish → smiling girls in blue headscarves under a tree (the photo the theme module cards used before) | `content/pages/mission.json › hero.image`, `hero.alt` | content | File `mission/hero.jpg` (2049×1537). alt draft EN "Smiling schoolgirls in blue headscarves under a tree" / ID "Murid-murid perempuan berkerudung biru tersenyum di bawah pohon". |
| B9 | TU Delft logo next to "The team" heading (`349:1530`, 203×100, right of the intro) | — | New field (e.g. `team.logo` + `team.logoAlt`). Note `team.image` already exists and is the big group photo below (still a grey placeholder in Figma). | content + **new field** + layout/component | File `mission/tu-delft-logo.png`. alt "TU Delft" (both). |
| B10 | Willemijn's study (`I270:3632;193:7`) | "Integrated Product Design (IPD)" → "Integrated Product Design (MSc)" | `team.people[1].study` | content | same English name in `id` |
| B11 | Jules's study (`I278:4285;193:7`) | → "Integrated Product Design (MSc)" | `team.people[3].study` (now `TODO`) | content | same in `id` |
| B12 | Jannus's study (`I278:4286;193:7`) | → "Offshore and Dredging Engineering (MSc)" | `team.people[4].study` | content | same in `id` |
| B13 | Emilie's study (`I278:4287;193:7`) | → "Design for Interaction (MSc)" | `team.people[5].study` | content | same in `id` |
| B14 | Impact number 1 (`I269:3384;193:44`) | "150+" → "90+" | `impact.numbers[0].value` | content | "90+" |
| B15 | Impact cards removed (`269:3387`, the two copied "Animals and plants"/"Ice melting" cards) | 2 cards → none | Delete `impact.cards` (both languages). Check that `MissionPage.tsx` renders nothing when `cards` is empty (`<div className={styles.impactCards}>` is always rendered now). | content + layout/component | — |
| B16 | IBF logo (`349:1528`, replaces the round `269:3429`) | round logo (circle crop) → square logo, 289×289, not cropped | `ibf.logo` → `/uploads/home-ibf-logo.webp` (same image as on the home page; Figma copy `mission/ibf-logo.jpg`); CSS `.ibfLogo` no longer round | content + layout/component | — |
| B17 | Contact name (`300:2618`) | "Name:" → "Name: Elmania" | `contact.name` = "Elmania" (the "Name:" prefix is a label in the card — check how `Label` renders it) | content | "Elmania" |
| B18 | Contact details (`300:2619`) | "Phone number\nEmail" → "humannature@indonesiabiru.id" (no phone) | `contact.email` = "humannature@indonesiabiru.id"; `contact.phone` = "" | content | same |
| B19 | Contact avatar (`300:2613`) | plain circle (`.contactShape`) → illustrated avatar of a girl in a red headscarf | New field `contact.image` + `contact.alt`; render in place of `.contactShape` | content + **new field** + layout/component | File `mission/contact-avatar-elmania.jpg`. alt: decorative or "Elmania" — **ask**. |

(Unchanged but noted: Figma still says "BF is our partner…" and "Check out the next workshop data"; the repo already has the corrected "IBF…"/"dates".)

### B.4 Personal page — "Thema 9" `272:868` — `/profile`

| # | What | Kind |
|---|---|---|
| B20 | The four example saved lesson plans were swapped (now El Niño, Ring of Fire, Nature as Sacred, Climate change) and show photos. The site lists the teacher's own saved items. | sample |

### B.5 Home — "Landing page" `196:6` — `/`

| # | What | Where | Kind |
|---|---|---|---|
| B21 | Only one change on the whole page (position, size, fills and text of all 299 nodes compared): the circle photo in "Start with the place children know" (`200:2038`) now uses a larger source file of the **same photo** (girl in a white headscarf writing at a bench; 1842×1225 instead of the 878×878 crop). No layout/size change found. | Optional: replace `design-assets/raw/home-lombok-girl-classroom.png` with `design-assets/figma-2026-10-26/home/home-lombok-girl-classroom.png` and re-run the optimiser (used in `home.json › lombok.image`). | content (image only) |

Group B total: **21 items** (B1–B21), of which 2 need no work (B7 via A31–A35, B20 sample).

---

## Group C — existing lesson plans, tests, test results

### C.1 Ring of Fire — "Thema 6" `263:1878` — `/resources/lesson-plan-ring-of-fire`

| # | What | Old → new | Where | Kind |
|---|---|---|---|---|
| C1 | Author (`263:1903`) | "Iza van der Klaauw" → "Iza van der Klauw" | `lesson-plan-ring-of-fire.json › author` | already done |
| C2 | Hero tags (`I264:2448/2453`) | placeholder "Lesson plan" ×2 → "Grade 1-4", "45 min" | `grade` is "Grade 3–4" in the repo, and the resource-library card in Figma still says "Grade 3-4" | content — **ask** which grade (1–4 or 3–4); duration already 45 min |

### C.2 El Niño and La Niña — "Thema 19" `278:4063` — `/resources/lesson-plan-el-nino-la-nina`

| # | What | Old → new | Where | Kind |
|---|---|---|---|---|
| C3 | Hero tags (`I278:4135/4136`) | placeholders → "All grades", "60 min" | `grade` already "All grades"; `duration` is "45 min" in the repo and on the Figma resource-library card | content — **ask** 45 or 60 min (ID "60 menit") |
| C4 | Photos (`342:1497/1498/1502/1503`, replacing the three "Hair dryer and map" placeholder cards `278:4116…4125`) | 3 placeholder cards → **4 photos of the experiment**, 2 per row, each ≈420×188 (wide), below Key message/Teacher tip. Row 1: "neutral conditions", "El Nino conditions"; row 2: trade winds + upwelling, "La Nina conditions". | `photos` (now `[]`): add 4 items with `image` + `alt`. Files `lesson-plan-el-nino-la-nina/photo-1…4-*.png` — **only 467 px wide** in Figma; ask for originals if possible. | content |
| C5 | Photo grid layout | The site shows photos 3 per row, square (`ResourceDetailPage.module.css .photos`: `repeat(3…)`, `aspect-ratio: 1`). New design: El Niño 2 per row ≈2.25:1; the new lesson plans 3 per row at 318×188 (≈1.7:1) or 318×287 (Solutions). | Let the grid follow the photo count (2 → 2 columns, 3 → 3 columns) and drop the forced square ratio (or use ≈16:9). | layout/component |

alt drafts (EN / ID): "Water tank model in neutral conditions, with the warm pool on the west side" / "Model tangki air dalam kondisi netral, dengan kolam hangat di sisi barat"; "Water tank model in El Niño conditions" / "Model tangki air dalam kondisi El Niño"; "Water tank model with trade winds and upwelling" / "Model tangki air dengan angin pasat dan upwelling"; "Water tank model in La Niña conditions, with exaggerated upwelling" / "Model tangki air dalam kondisi La Niña, dengan upwelling yang diperkuat".

### C.3 Tests — `267:2843` (Climate Change), `276:2497` (Climate), `276:2143` (Human and Nature), `276:2320` (Solutions) — `/resources/test-*`

| # | What | Old → new | Where | Kind | Indonesian (DRAFT) |
|---|---|---|---|---|---|
| C6 | Climate Change test intro (`267:3083`) | copy of the Climate text → "See what you know about why the Earth is warming, who is responsible and what it means for Lombok." | `test-climate-change.json › intro` (now `TODO`) | content | "Lihat seberapa banyak yang Anda ketahui tentang mengapa Bumi memanas, siapa yang bertanggung jawab, dan apa artinya bagi Lombok." |
| C7 | Climate test intro (`276:2551`) | "The typical weather of a place over many years." → "See what you know about weather, climate, El Niño and La Niña, the Ring of Fire and the atmosphere." | `test-climate.json › intro` | content | "Lihat seberapa banyak yang Anda ketahui tentang cuaca, iklim, El Niño dan La Niña, Cincin Api, dan atmosfer." |
| C8 | Human and Nature intro (`276:2197`) | → "See what you know about how nature helps us, and what a warmer world does to it." | `test-human-and-nature.json › intro` (now `TODO`) | content | "Lihat seberapa banyak yang Anda ketahui tentang bagaimana alam membantu kita, dan apa dampak dunia yang lebih hangat terhadapnya." |
| C9 | Solutions intro (`276:2374`) | → "See what you know about the actions that can slow down climate change, from energy to food and plastic." | `test-solutions.json › intro` (now `TODO`) | content | "Lihat seberapa banyak yang Anda ketahui tentang tindakan yang dapat memperlambat perubahan iklim, mulai dari energi hingga makanan dan plastik." |
| C10 | Climate Q2 (`284:4340`) | "The climate in Indonesia is" → "The climate in Lombok is ..." | `test-climate.json › questions[1].question` → "The climate in Lombok is…" | content | "Iklim di Indonesia adalah…" → "Iklim di Lombok adalah…" |
| C11 | Climate Q5 option removed (`I296:1086;270:3734`) | options "…, Is man-made, All of the above" → "All of the above" deleted | `test-climate.json › questions[4].options[3]` — delete in both languages | content | — |
| C12 | H&N Q5 becomes multiple choice (`349:1506` replaces `300:1299`, now the check-box question component) and the result says "Correct answer: Store drinking water, Provide oxygen" | single choice, only "Provide oxygen" correct → multiple choice, "Store drinking water" **and** "Provide oxygen" correct | `test-human-and-nature.json › questions[4].multiple = true`, `options[0].correct = true` (both languages) | content | — |
| C13 | Climate Change Q8/Q9 texts (`I300:2284/2303;270:3721`) | "Which countries release the most CO2 in total?" ×2 → "…CO₂ in total?" / "Which people release the most CO₂ per person?" | `test-climate-change.json › questions[7..8].question` | already done |
| C14 | Climate Q3 "?" and Q5 "atmosphere" spelling (`284:4362`, `I296:1124;270:3721`) | typo fixes in Figma | `test-climate.json` | already done |

(Test durations "10 min" are B3.)

### C.4 Test results — `312:1714` (Climate), `312:1947` (Climate Change), `317:1481` (Human and Nature), `316:1475` (Solutions)

The result page shows each question's `explanation` (`QuizQuestion.explanation`). The old design copied the Climate Change explanations into the other three tests, so the repo has `TODO` there. The new design fills them in.

**Climate** (`test-climate.json › questions[i].explanation`; result "Question n" = `questions[n-1]`):

| # | Q | New English explanation | Indonesian (DRAFT) |
|---|---|---|---|
| C15 | 1 (`312:1759`) | During La Niña the trade winds get stronger and bring heavier rain, floods and landslides. During El Niño they weaken, and Indonesia gets a drier, longer dry season. | Saat La Niña, angin pasat menguat dan membawa hujan yang lebih lebat, banjir, dan tanah longsor. Saat El Niño, angin pasat melemah, dan Indonesia mengalami musim kemarau yang lebih kering dan lebih panjang. |
| C16 | 2 (`312:1767`) | Lombok has a tropical climate with a dry and a wet season. | Lombok memiliki iklim tropis dengan musim kemarau dan musim hujan. |
| C17 | 3 (`312:1777`) | Large underwater earthquakes push huge amounts of water and create tsunamis, like the 2004 Indian Ocean tsunami. Wind storms make waves but not tsunamis. | Gempa bumi besar di bawah laut mendorong air dalam jumlah sangat besar dan menimbulkan tsunami, seperti tsunami Samudra Hindia tahun 2004. Badai angin menimbulkan ombak, tetapi bukan tsunami. |
| C18 | 4 (`312:1785`) | Indonesia sits where several tectonic plates meet. That is why it has more than 120 active volcanoes and frequent earthquakes. | Indonesia terletak di pertemuan beberapa lempeng tektonik. Itulah sebabnya Indonesia memiliki lebih dari 120 gunung berapi aktif dan sering mengalami gempa bumi. |
| C19 | 5 (`312:1795`) | The atmosphere gives us oxygen and protects us from strong sunlight. Its greenhouse gases trap part of the sun’s heat, giving an average of 15 °C *(no final full stop in Figma; add one)* | Atmosfer memberi kita oksigen dan melindungi kita dari sinar matahari yang kuat. Gas rumah kacanya menahan sebagian panas matahari, sehingga suhu rata-rata menjadi 15 °C. |
| C20 | 6 (`312:1803`) | With greenhouse gases the average is 15 °C. Without them it would be about −18 °C, and the oceans would be blocks of ice. | Dengan gas rumah kaca, suhu rata-ratanya 15 °C. Tanpa gas rumah kaca, suhunya sekitar −18 °C, dan lautan akan menjadi bongkahan es. |
| — | 7 (`312:1812`) | **Still the copied placeholder** ("Species that adapt…") — keep the `TODO`, ask the designer. | — |

**Human and Nature** (`test-human-and-nature.json › questions[i].explanation`):

| # | Q | New English explanation | Indonesian (DRAFT) |
|---|---|---|---|
| C21 | 1 (`317:1526`) | Mangrove roots protect coasts from waves and storms. They also shelter young fish and store large amounts of carbon. | Akar mangrove melindungi pantai dari ombak dan badai. Mangrove juga menjadi tempat berlindung ikan-ikan muda dan menyimpan karbon dalam jumlah besar. |
| C22 | 2 (`317:1534`) | The algae give corals food and their bright colours. If the water gets too warm, corals push the algae out and turn white. | Alga memberi karang makanan dan warna-warnanya yang cerah. Jika air menjadi terlalu hangat, karang mengeluarkan alga tersebut dan berubah menjadi putih. |
| C23 | 3 (`317:1544`) | Mangrove roots hide young fish. Reefs cover less than 1% of the sea floor but shelter a quarter of all sea life. Open water has no structures to hide in. | Akar mangrove menyembunyikan ikan-ikan muda. Terumbu karang menutupi kurang dari 1% dasar laut, tetapi menjadi tempat berlindung bagi seperempat dari seluruh kehidupan laut. Perairan terbuka tidak memiliki tempat untuk bersembunyi. |
| C24 | 4 (`317:1552`) | Reefs cover less than 1% of the sea floor, yet a quarter of all sea life depends on them. They also feed fishing communities and break waves before they reach the coast. | Terumbu karang menutupi kurang dari 1% dasar laut, namun seperempat dari seluruh kehidupan laut bergantung padanya. Terumbu karang juga menjadi sumber makanan bagi masyarakat nelayan dan memecah ombak sebelum mencapai pantai. |
| C25 | 5 (`317:1562`) | Forests release oxygen, and forests like those around Mount Rinjani catch rain and keep drinking water clean. Lakes and rivers also supply drinking and farming water. | Hutan melepaskan oksigen, dan hutan seperti di sekitar Gunung Rinjani menangkap air hujan dan menjaga air minum tetap bersih. Danau dan sungai juga menyediakan air minum dan air untuk pertanian. |
| C26 | 6 (`317:1570`) | When the sea stays too warm for too long, corals push out their algae and turn white. Bleached corals starve. At 1.5 °C of warming, 70–90% of reefs would be lost, and at 2 °C more than 99% (IPCC). | Jika laut terlalu hangat dalam waktu terlalu lama, karang mengeluarkan alganya dan berubah menjadi putih. Karang yang memutih akan kelaparan. Pada pemanasan 1,5 °C, 70–90% terumbu karang akan hilang, dan pada 2 °C lebih dari 99% (IPCC). |
| C27 | 7 (`317:1579`) | Figma: "Cutting forests removes the homes of animals. Melting ice raises sea level, and dark water absorbs more heat than ice. It is thawing frozen ground that releases CO₂ and methane, **so I’d reword that option.**" — the last clause is a note to us. Use the text without it, and **ask** whether to reword option "Melting ice caps release CO₂" (now marked correct, but the explanation says it is not accurate). | Penebangan hutan menghilangkan rumah bagi hewan. Es yang mencair menaikkan permukaan laut, dan air yang gelap menyerap lebih banyak panas daripada es. Tanah beku yang mencairlah yang melepaskan CO₂ dan metana. |

**Solutions** (`test-solutions.json › questions[i].explanation`):

| # | Q | New English explanation | Indonesian (DRAFT) |
|---|---|---|---|
| C28 | 1 (`316:1521`) | Replanting a forest works, but it takes years, sometimes decades. The new forest is rarely the same as the original, so protecting existing forest is cheaper and works better. | Menanam kembali hutan memang berhasil, tetapi butuh bertahun-tahun, kadang puluhan tahun. Hutan baru jarang sama dengan hutan aslinya, sehingga melindungi hutan yang ada lebih murah dan lebih efektif. |
| C29 | 2 (`316:1529`) | Mitigation stops or lowers greenhouse gases, or takes carbon out of the air. Solar panels replace fossil fuels, and growing trees absorb CO₂. | Mitigasi menghentikan atau mengurangi gas rumah kaca, atau menyerap karbon dari udara. Panel surya menggantikan bahan bakar fosil, dan pohon yang tumbuh menyerap CO₂. |
| C30 | 3 (`316:1557`) | Burning coal, oil and gas releases CO₂, the gas that is warming the planet. Methane also leaks during oil and gas production, but burning produces CO₂. | Membakar batu bara, minyak, dan gas melepaskan CO₂, gas yang menghangatkan planet ini. Metana juga bocor selama produksi minyak dan gas, tetapi pembakaran menghasilkan CO₂. |
| C31 | 4 (`316:1565`) | One crop takes the same nutrients from the soil every year, so farmers need more fertilizer and pesticides. A single pest or drought can destroy the whole harvest. | Satu jenis tanaman mengambil nutrisi yang sama dari tanah setiap tahun, sehingga petani membutuhkan lebih banyak pupuk dan pestisida. Satu jenis hama atau kekeringan saja dapat menghancurkan seluruh panen. |
| C32 | 5 (`316:1539`) | Growing many plants together takes more planning and knowledge. It is not more vulnerable to pests, because the plants help each other and keep pests away. | Menanam banyak jenis tanaman bersama-sama membutuhkan lebih banyak perencanaan dan pengetahuan. Cara ini tidak lebih rentan terhadap hama, karena tanaman saling membantu dan menjauhkan hama. |
| C33 | 6 (`316:1547`) | A diet with meat and dairy produces about 5.3 kg of CO₂ per day. A diet without produces about 2.6 kg. | Pola makan dengan daging dan produk susu menghasilkan sekitar 5,3 kg CO₂ per hari. Pola makan tanpa keduanya menghasilkan sekitar 2,6 kg. |
| C34 | 7 (`316:1574`) | Livestock release methane, and wasted food releases methane in landfills. The food thrown away in Indonesia each year could feed 61–125 million people. | Ternak melepaskan metana, dan makanan yang terbuang melepaskan metana di tempat pembuangan sampah. Makanan yang dibuang di Indonesia setiap tahun dapat memberi makan 61–125 juta orang. |
| C35 | 8 (`316:1583`) | Plastic does not disappear, and most of it is made from oil and gas, not from nature. Burning it releases black smoke with harmful chemicals, and animals swallow plastic in rivers and the sea. | Plastik tidak hilang, dan sebagian besar terbuat dari minyak dan gas, bukan dari alam. Membakarnya melepaskan asap hitam yang mengandung bahan kimia berbahaya, dan hewan menelan plastik di sungai dan laut. |

**Sample-only result changes (nothing to do):** Climate result title/lead now say "Test: Climate" / "Good work! You know the basics of climate." (site builds these from the test); "Correct answer: …" lines (generated from `options[].correct`; C12 makes the H&N Q5 line match); a "Correct answer: We breathe the atmosphere." line added to Climate Q7 (generated); Solutions score "✓ 7 correct" → "✓ 5 correct" and next-theme button typo "Soluitons" → "Solutions"; Climate Change result "Question 3/4" labels swapped into order.

Group C total: **35 items** (C1–C35), of which 3 already done (C1, C13, C14).

---

## Group D — three new lesson plans

The unused frames Thema 16/17/18 are now three new lesson plans. Full text, in reading order and mapped to the lesson-plan fields: `docs/figma-text/`.

| # | Figma frame | Lesson | Theme | New file (suggested) | Text | Images | Reference |
|---|---|---|---|---|---|---|---|
| D1 | Thema 16 `276:3385` | Lesson plan: Solutions for Plastic | solutions | `content/resources/lesson-plan-solutions-for-plastic.json` | `docs/figma-text/lesson-plan-solutions-for-plastic.md` | `design-assets/figma-2026-10-26/lesson-plan-solutions-for-plastic/` | `design-assets/redesign/lesson-plan-solutions-for-plastic.png` |
| D2 | Thema 17 `278:3631` | Lesson plan: Climate Change | climate-change | `…/lesson-plan-climate-change.json` | `docs/figma-text/lesson-plan-climate-change.md` | `…/lesson-plan-climate-change/` | `…/lesson-plan-climate-change.png` |
| D3 | Thema 18 `278:3847` | Lesson plan: Nature as Sacred | human-and-nature | `…/lesson-plan-nature-as-sacred.json` | `docs/figma-text/lesson-plan-nature-as-sacred.md` | `…/lesson-plan-nature-as-sacred/` | `…/lesson-plan-nature-as-sacred.png` |

For each: create the JSON with `en` and `id` (the `id` text needs a full translation — no Indonesian exists; mark it as a draft for native review), set `type: "lesson-plan"`, `theme`, `order`, `featured` (ask), `file` (no PDF yet → `/downloads/module-placeholder.pdf` like the others), and copy the images into `design-assets/raw/` with `resource-…` names before running the optimiser (§5). The resource-library card text (title, grade, duration, description) is in the md files; grade/duration on the cards conflict with the detail pages (open question 1).

Group D total: **3 items** (each a full page of content).

---

## 4. Needs a new content field (touches `src/content/types.ts`, `src/admin/config.ts` and the JSON)

| Field | Used by | Item |
|---|---|---|
| `MissionData.team.logo` + `logoAlt` (image next to the team heading) | `MissionPage.tsx` | B9 |
| `MissionData.contact.image` + `alt` (avatar) | `MissionPage.tsx` | B19 |
| Optional: `ThemeData.pdfImage` (PDF thumbnail) — only if Theme 4 must use its own photo instead of the hero | `Feedback.tsx` `DownloadPdf` | A38 |

No new field is needed for: test/module `image` and `duration` (exist on `ResourceData`), lesson-plan `photos` (exists), the pager circle (uses the next theme's `heroImage`), extra resources (`type: "extra"` + `link` exist), new lesson plans (all fields exist).

New interface strings (both languages): `theme.backToFirst` (A36), `filters.favorites` (B1).

## 5. Images: how the repo stores them

- `design-assets/raw/*.png|jpg` = full-size source images. `scripts/optimize-images.mjs` (uses `sharp`) converts **every** file in that folder to WebP (quality 80, max width 1600 px, or 2400 px when the name contains `-hero`), writing UI images (`avatar`) to `src/assets/img/` and all content images to `public/uploads/<name>.webp`.
- Content JSON refers to them as `/uploads/<name>.webp`; `src/content/assets.tsx` (`ContentImage`) resolves the path against the base URL and adds width/height from the `virtual:image-sizes` module to avoid layout shift.
- The new images were **not** put in `design-assets/raw/` and the optimiser was **not** run. To use one: copy it into `design-assets/raw/` with the final name (e.g. `resource-climate-change-cover.png`, `mission-hero-children.jpg`; drop the `--figma-render` files), run the optimiser, then set the `/uploads/<name>.webp` path in the JSON. `.jpg` sources are fine (the script accepts `.png/.jpg/.jpeg`).
- Low-resolution sources (ask the designer for originals): El Niño photos (467 px wide), Climate Change photo 2 (153 px), Nature as Sacred photo 1 (357 px — use the home-page file instead).

### Image list (all under `design-assets/figma-2026-10-26/`)

| File | Figma node | Use in | Item |
|---|---|---|---|
| `home/home-lombok-girl-classroom.png` | `200:2038` | `home.json › lombok.image` (replace raw source) | B21 |
| `theme-2-climate-change/intro-explanation-farming.png` | `242:3387` | `climate-change.json › introCards[0].image` (prefer existing `/uploads/climate-change-source-farming.webp`) | A10 |
| `theme-2-climate-change/intro-module-card-choosing-with-care.png` | `242:3391` | `climate-change.json › introCards[1].image`; also D2 hero `image` | A11, D2 |
| `theme-2-climate-change/intro-news-lombok-climate-resilience.png` | `242:3398` | `climate-change.json › introCards[2].image` | A12 |
| `theme-3-human-and-nature/intro-module-card.png` | `242:4023` | `human-and-nature.json › introCards[1].image`; also D3 hero | A18, D3 |
| `theme-3-human-and-nature/intro-news-aqi-ranking.png` | `242:4030` | `human-and-nature.json › introCards[2].image` | A19 |
| `theme-4-solutions/intro-explanation.jpg` | `242:4497` | `solutions.json › introCards[0].image` | A28 |
| `theme-4-solutions/intro-module-card.png` | `242:4501` | `solutions.json › introCards[1].image`; also D1 hero | A29, D1 |
| `theme-4-solutions/intro-news-membangun-lombok.png` | `242:4508` | `solutions.json › introCards[2].image` | A30 |
| `theme-4-solutions/pdf-thumbnail.jpg` | `242:4638` | Theme 4 PDF thumbnail (only if a `pdfImage` field is added) | A38 |
| `mission/hero.jpg` | `269:3286` | `mission.json › hero.image` | B8 |
| `mission/tu-delft-logo.png` | `349:1530` | new `team.logo` | B9 |
| `mission/ibf-logo.jpg` | `349:1528` | `ibf.logo` — same as existing `/uploads/home-ibf-logo.webp` | B16 |
| `mission/contact-avatar-elmania.jpg` | `300:2613` | new `contact.image` | B19 |
| `resources/for-teachers-theme-1-climate.png` … `-theme-4-solutions.png` | `261:1549/1550/1610/1611` | `module-*.json › image` | B4 |
| `resources/extra-*.png` (6 files) | `261:1612/1712/1713/1714`, `262:1817/1819` | new `type: "extra"` resources | B6 |
| `lesson-plan-el-nino-la-nina/photo-1…4-*.png` | `342:1502/1503/1497/1498` | `lesson-plan-el-nino-la-nina.json › photos[0..3]` (in this order) | C4 |
| `lesson-plan-solutions-for-plastic/*` | `276:3440`, `326:1742/1746/1738` | D1 `image`, `photos` | D1 |
| `lesson-plan-climate-change/*` | `278:3699`, `326:1754/1758/1762` | D2 `image`, `photos` | D2 |
| `lesson-plan-nature-as-sacred/*` | `278:3915`, `278:3898/3902/3906` | D3 `image`, `photos` | D3 |

Reused existing images (not downloaded again): test cards and pager use the four theme hero photos; the "IBF Permaculture" extra card uses the old round IBF logo; the "Glossary" extra card and the El Niño / Ring of Fire cards keep their images.

## 6. Reference screenshots (`design-assets/redesign/`)

Replaced with the new design: `landing.png`, `theme-1.png` … `theme-4.png`, `resources.png`, `mission.png`, `profile.png`, `glossary.png`, `lesson-plan-ring-of-fire_thema6.png`, `lesson-plan-elnino_thema19.png`, `test-climate-change.png`, `test-result-climate-change.png`.
New: `lesson-plan-solutions-for-plastic.png`, `lesson-plan-climate-change.png`, `lesson-plan-nature-as-sacred.png`, `test-climate.png`, `test-human-and-nature.png`, `test-solutions.png`, `test-result-climate.png`, `test-result-human-and-nature.png`, `test-result-solutions.png`.
Left as is: `lesson-plan-elnino_thema16.png` (old screenshot of the frame that was then an unused El Niño copy; Thema 16 is now the Solutions lesson plan — delete it if no longer useful), `components.png`, `login.png`.

## 7. DESIGN.md is out of date

DESIGN.md §1 still points to the old file `aqpCKUSoPFvGwAUbcgjF5j` and says Thema 16/17/18 are unused. Per CLAUDE.md this is reported, not changed: update the file key, add the three lesson-plan frames to the frame table, and describe the new elements (pager photos, PDF thumbnail, TU Delft logo, contact avatar, square IBF logo, 2-column photo grid, "Favorites" filter) when they are built.

## 8. Open questions

1. **Grade and duration conflicts** between lesson-plan detail pages and their cards: Ring of Fire "Grade 1-4" (page) vs "Grade 3-4" (card, repo); El Niño "60 min" vs "45 min"; Climate Change "Grade 3-4" vs "Grade 4-6"; Nature as Sacred "Grade 1-3 · 90 min" vs "Grade 1-2 · 45 min"; Solutions for Plastic "Grade 4-6 · 90 min" vs "All grades · 120 min". Also card title "Lesson plan: Solutions" vs page "Lesson plan: Solutions for Plastic".
2. **Author of "Solutions for Plastic"**: Figma says "NASA’s Jet Propulsion Lab" (copied from El Niño).
3. **News article links** (Themes 2, 3, 4) and **extra-resource URLs** are not in Figma.
4. Theme 2: the new "who is responsible" sentence is ungrammatical — use the suggested rewording? Should the explanation card now link to "Where gases come from"?
5. Theme 3: "UNIPBES" → "IPBES"?
6. H&N test Q7: reword the option "Melting ice caps release CO₂" (the new explanation says thawing ground, not ice, releases CO₂)? Climate test Q7 explanation is still a placeholder.
7. Mission: contact avatar alt text; does "Name: Elmania" mean the label "Name" stays visible? Phone number intentionally removed?
8. "Favorites" filter: behaviour when signed out; spelling "Favorites" vs "Favourites" (content uses British spelling, e.g. "colours").
9. Theme 4 PDF thumbnail: use the theme hero (no new field) or the separate rice-terrace photo?
10. The "Coming soon" lesson card (Climate change) and three "Coming Soon" extra resources: show them on the site or wait?
11. Solutions for Plastic: the Plastic-trash material text ends mid-sentence ("Optional is explaining different types of waste,").
12. Low-resolution photos (§5): ask for originals.
