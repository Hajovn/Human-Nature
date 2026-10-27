// Content model (DESIGN.md §6). Mirrors the CMS fields in src/admin/config.ts; the JSON files
// live in /content and are edited through Decap CMS (/admin). Most fields are optional
// because editors may leave them empty.
import type { Locale } from '../i18n/locale';

/** A content file holds one object per language: { "en": {...}, "id": {...} }. */
export type Localized<T> = Partial<Record<Locale, T>>;

/** Section backgrounds and theme accents (DESIGN.md §2.1–2.2). */
export type Background = 'page' | 'sky' | 'sun' | 'ember' | 'leaf' | 'lagoon';
export type Accent = Exclude<Background, 'page' | 'sky'>;

export interface ImageRef {
  image?: string;
  alt?: string;
}

export interface TitleText {
  title?: string;
  text?: string;
}

/* ── Section blocks (DESIGN.md §6.2) ───────────────────────────────────────── */

export type CalloutKind = 'teacher-tip' | 'did-you-know' | 'talk-about-it' | 'ask-your-class' | 'go-deeper';
export type ImageShape = 'rounded' | 'arch' | 'circle' | 'oval';
/** small = 220px (circles by default), medium = 307px, full = stretched to the column.
 *  Empty: the image's own size, at most the column width. */
export type ImageSize = 'small' | 'medium' | 'full';
export type NumberStyle = 'quiet' | 'blue' | 'white' | Accent;

export interface BigNumberItem {
  value?: string;
  caption?: string;
  style?: NumberStyle;
}

export interface InfoCardItem extends TitleText, ImageRef {
  /** Coloured dot before the title (climate zones). */
  dot?: Accent | 'blue' | 'ink' | 'red' | 'orange';
  /** Card colour; white when empty. */
  background?: Exclude<Background, 'page'> | 'white';
}

export type Block =
  | { type: 'text'; body?: string }
  | ({ type: 'image'; shape?: ImageShape; size?: ImageSize; source?: string } & ImageRef)
  | { type: 'callout'; kind?: CalloutKind; label?: string; title?: string; body?: string }
  | { type: 'bigNumbers'; items?: BigNumberItem[] }
  | { type: 'numberedCards'; items?: TitleText[] }
  | { type: 'infoCards'; columns?: 1 | 2 | 3 | 4 | 5; items?: InfoCardItem[] }
  | ({ type: 'quote'; quote?: string; attribution?: string } & ImageRef)
  | { type: 'links'; items?: { label?: string; url?: string; style?: 'primary' | 'secondary' }[] }
  | { type: 'video'; url?: string; title?: string; caption?: string };

export interface Section {
  id?: string;
  title?: string;
  /** Short name for the "On this page" chips. */
  navLabel?: string;
  intro?: string;
  background?: Background;
  /** split-title: two columns with the title and intro in the left column.
   *  split-wide: two columns, the left one twice as wide (a map and its legend). */
  layout?: 'stack' | 'split' | 'split-title' | 'split-wide';
  /** Continue the section above: same background, no title, no gap. */
  joinPrevious?: boolean;
  blocks?: Block[];
  /** Right-hand column of a "split" section. */
  aside?: Block[];
}

/* ── Themes ───────────────────────────────────────────────────────────────── */

export interface GlossaryTerm {
  term?: string;
  meaning?: string;
}

export interface IntroCard extends ImageRef {
  kind?: 'explanation' | 'module' | 'news';
  title?: string;
  text?: string;
  link?: string;
}

export interface ThemeData {
  number?: number;
  title?: string;
  /** First hero paragraph (Text/lead). */
  lead?: string;
  /** Second hero paragraph. */
  intro?: string;
  heroImage?: string;
  heroAlt?: string;
  /** ThemeCard on the home page. */
  cardText?: string;
  cardImage?: string;
  introCards?: IntroCard[];
  sections?: Section[];
  glossary?: GlossaryTerm[];
  testResource?: string;
  pdf?: string;
}

/* ── Resources ────────────────────────────────────────────────────────────── */

export type ResourceType = 'lesson-plan' | 'test' | 'for-teachers' | 'extra';

export interface QuizQuestion extends ImageRef {
  question?: string;
  multiple?: boolean;
  options?: { text?: string; correct?: boolean }[];
  /** Shown on the result for this question. */
  explanation?: string;
}

export interface ResourceData {
  title?: string;
  type?: ResourceType;
  theme?: string;
  /** One line on the LessonCard. */
  description?: string;
  image?: string;
  alt?: string;
  grade?: string;
  duration?: string;
  order?: number;
  /** Shown in "Lesson plans" on the home page. */
  featured?: boolean;

  // Lesson plan
  author?: string;
  about?: string;
  goals?: string[];
  context?: string;
  materials?: TitleText[];
  steps?: TitleText[];
  keyMessage?: string;
  teacherTip?: string;
  photos?: ImageRef[];

  // Test
  intro?: string;
  questions?: QuizQuestion[];

  // Downloads (lesson plan, for teachers, extra)
  file?: string;
  link?: string;
  /** Path of a teacher-only file in the private Supabase bucket "teacher-files". */
  teacherFile?: string;
}

/* ── Pages ────────────────────────────────────────────────────────────────── */

export interface HomeData {
  hero?: { title?: string; intro?: string; buttonLabel?: string } & ImageRef;
  themes?: { title?: string; intro?: string };
  numbers?: {
    title?: string;
    intro?: string;
    items?: BigNumberItem[];
    asideTitle?: string;
    asideText?: string;
    tip?: string;
  };
  lombok?: { label?: string; title?: string; body?: string; callout?: string } & ImageRef;
  howItWorks?: { title?: string; intro?: string; steps?: string[]; tip?: string };
  lessons?: { title?: string; intro?: string };
  quote?: { quote?: string; attribution?: string } & ImageRef;
  ready?: { title?: string; body?: string };
  collaboration?: { title?: string; body?: string; logo?: string; logoAlt?: string; url?: string };
}

export interface Person {
  name?: string;
  role?: string;
  study?: string;
  photo?: string;
}

export interface MissionData {
  hero?: { label?: string; title?: string; lead?: string; intro?: string } & ImageRef;
  product?: { title?: string; lead?: string; offers?: TitleText[] } & ImageRef;
  /** `image` is the group photo; `logo` sits next to the heading (TU Delft). */
  team?: { title?: string; intro?: string; logo?: string; logoAlt?: string; people?: Person[] } & ImageRef;
  impact?: { title?: string; intro?: string; numbers?: BigNumberItem[]; cards?: TitleText[] };
  ibf?: { title?: string; body?: string; linkLabel?: string; url?: string; logo?: string };
  plans?: { title?: string; items?: TitleText[] };
  workshop?: { title?: string; body?: string; buttonLabel?: string; url?: string };
  /** `image` is the round avatar above the card. */
  contact?: { title?: string; name?: string; phone?: string; email?: string } & ImageRef;
}

export interface GlossaryPageData {
  title?: string;
  lead?: string;
  intro?: string;
}

export interface SimplePageData {
  title?: string;
  body?: string;
}

export interface SiteSettings {
  tagline?: string;
  organisation?: string;
}

/** Content resolved for one language. `fallback` = shown in English because no translation exists. */
export type Resolved<T> = T & { slug: string; fallback: boolean };
export type Theme = Resolved<ThemeData>;
export type Resource = Resolved<ResourceData>;
