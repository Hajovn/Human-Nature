// Content model. Mirrors the CMS fields in src/admin/config.ts; the JSON files live in
// /content and are edited through Decap CMS (/admin). Most fields are optional because
// editors may leave them empty.
import type { Locale } from '../i18n/locale';

/** A content file holds one object per language: { "en": {...}, "id": {...} }. */
export type Localized<T> = Partial<Record<Locale, T>>;

/** Section building blocks editors can add, remove and reorder. */
export type Block =
  | { type: 'text'; body?: string }
  | { type: 'image'; image?: string; alt?: string; caption?: string; round?: boolean }
  | { type: 'video'; url?: string; title?: string; caption?: string }
  | {
      type: 'imageText';
      body?: string;
      image?: string;
      alt?: string;
      caption?: string;
      imagePosition?: 'left' | 'right';
    }
  | { type: 'circles'; items?: { label?: string; image?: string; alt?: string; text?: string }[] }
  | { type: 'tiles'; items?: { title?: string; text?: string; linkLabel?: string; linkUrl?: string }[] }
  | { type: 'chip'; label?: string }
  | { type: 'placeholder'; label?: string; ratio?: string };

export interface ThemeSection {
  id?: string;
  title?: string;
  navLabel?: string;
  layout?: 'stack' | 'split';
  align?: 'left' | 'center' | 'right';
  blocks?: Block[];
  aside?: Block[];
}

export interface SubCard {
  title?: string;
  text?: string;
  link?: string;
  image?: string;
  climateClass?: boolean;
}

export interface ThemeData {
  number?: number;
  title?: string;
  subtitle?: string;
  heroImage?: string;
  cardImage?: string;
  cardText?: string;
  testResource?: string;
  subCards?: SubCard[];
  sections?: ThemeSection[];
}

export type ResourceType = 'lesson-plan' | 'test' | 'extra' | 'module';

export interface QuizQuestion {
  question?: string;
  multiple?: boolean;
  image?: string;
  alt?: string;
  options?: { text?: string; correct?: boolean }[];
}

export interface ResourceData {
  title?: string;
  description?: string;
  type?: ResourceType;
  theme?: string;
  forTeachers?: boolean;
  order?: number;
  image?: string;
  goal?: string;
  objectives?: string;
  steps?: { body?: string }[];
  file?: string;
  /** Path of a teacher-only file in the private Supabase bucket "teacher-files". */
  teacherFile?: string;
  questions?: QuizQuestion[];
}

export interface HomeData {
  heroTitleLine1?: string;
  heroTitleLine2?: string;
  heroIntro?: string;
  heroImage?: string;
  themesTitle?: string;
  themesIntro?: string;
  howItWorksTitle?: string;
  howItWorks?: string;
  lessonsTitle?: string;
  quote?: string;
  quoteAttribution?: string;
  collaborationTitle?: string;
  partners?: { name?: string; logo?: string; url?: string }[];
}

export interface MissionData {
  title?: string;
  intro?: string;
  sections?: { id?: string; title?: string; blocks?: Block[] }[];
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
