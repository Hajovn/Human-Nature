// Content model. Pages render from these types so copy can change without code changes
// (DESIGN.md §8.4 #15).

export interface ImageAsset {
  src: string;
  alt: string; // "" only for purely decorative images
  width: number;
  height: number;
}

export type ThemeSlug = 'climate' | 'climate-change' | 'human-and-nature' | 'solutions';

export type ListItem = string | { text: string; children: ListItem[] };

/** Building blocks for theme-page sections. */
export type Block =
  | { type: 'text'; paragraphs: string[] }
  | { type: 'list'; intro?: string; items: ListItem[] }
  | { type: 'image'; image: ImageAsset; caption?: string; shape?: 'rect' | 'round' }
  | { type: 'imageLabel'; label: string } // Space Grotesk label above an image (§2.3)
  | { type: 'placeholder'; label: string; ratio?: string; shape?: 'rect' | 'round' }
  | { type: 'chip'; label: string } // grey sub-heading chip from the wireframes (§4.15)
  | { type: 'circles'; items: { label: string; image?: ImageAsset; text?: string }[] }
  | { type: 'tiles'; items: { title: string; text: string }[] }
  | { type: 'links'; items: { label: string; href: string }[] }
  | { type: 'split'; left: Block[]; right: Block[] };

export interface ThemeSection {
  id: string;
  title: string;
  /** Short label for the section nav; defaults to title. */
  navLabel?: string;
  /** 'split' = main content left + aside right on desktop; 'stack' = full width. */
  layout: 'split' | 'stack';
  align?: 'left' | 'center' | 'right';
  main: Block[];
  aside?: Block[];
}

export interface SubCard {
  title: string;
  text: string;
  href: string;
  image?: ImageAsset;
  climateClass?: boolean; // overlay the "Climate Class" wordmark
}

export interface Theme {
  slug: ThemeSlug;
  number: number;
  title: string;
  /** Hero subtitle — placeholder in Figma for all four themes. */
  subtitle: string;
  hero: ImageAsset;
  cardImage: ImageAsset; // landing-page theme card
  cardText: string;
  subCards: [SubCard, SubCard, SubCard];
  sections: ThemeSection[];
  /** Resource slug of this theme's test, if one exists. */
  testSlug?: string;
}

export type ResourceType = 'lesson-plan' | 'test' | 'extra' | 'module';

export interface Resource {
  slug: string;
  title: string;
  description: string;
  type: ResourceType;
  theme: ThemeSlug;
  forTeachers: boolean;
  image?: ImageAsset;
  /** For tests: key into QUIZZES. */
  quizId?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  multiple: boolean; // "check all that apply"
  options: string[];
  /** Indexes of correct options. Owner-supplied (DESIGN.md §8.4 #19); empty = unknown. */
  correct: number[];
  image?: ImageAsset;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}
