// Site-wide content: navigation (DESIGN.md §8.2 #3), footer (§4.2), landing (§5.2) and
// mission (§5.11) copy.
import { THEMES } from './themes';

export interface NavLink {
  label: string;
  to: string;
}

export interface NavGroup {
  label: string;
  /** Pathname prefix that marks this group as the current section. */
  match: string;
  links: NavLink[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Themes',
    match: '/themes',
    links: THEMES.map((t) => ({ label: t.title, to: `/themes/${t.slug}` })),
  },
  {
    label: 'Materials',
    match: '/resources',
    links: [
      { label: 'All resources', to: '/resources' },
      { label: 'Lesson plans', to: '/resources?type=lesson-plan' },
      { label: 'Tests', to: '/resources?type=test' },
      { label: 'Extra resources', to: '/resources?type=extra' },
      { label: 'Download the module', to: '/resources?type=module' },
    ],
  },
  {
    label: 'Our mission',
    match: '/mission',
    links: [
      { label: 'Mission', to: '/mission#mission' },
      { label: 'Our product', to: '/mission#our-product' },
      { label: 'The team', to: '/mission#the-team' },
      { label: 'Our impact', to: '/mission#our-impact' },
      { label: 'Collaboration IBF', to: '/mission#collaboration' },
      { label: 'Future plans', to: '/mission#future-plans' },
      { label: 'Contact', to: '/mission#contact' },
    ],
  },
];

export const TAGLINE =
  'Climate lessons for primary school teachers and their students, about people, nature and what we can do together.';

export const FOOTER_COLUMNS: { heading: string; links: NavLink[] }[] = [
  {
    heading: 'Themes',
    links: THEMES.map((t) => ({ label: `${t.number}. ${t.title}`, to: `/themes/${t.slug}` })),
  },
  {
    heading: 'Materials',
    links: [
      { label: 'Lesson examples', to: '/resources?type=lesson-plan' },
      { label: 'Download the module', to: '/resources?type=module' },
      { label: 'Test your knowledge', to: '/resources?type=test' },
    ],
  },
  {
    heading: 'Our mission',
    links: [
      { label: 'About us', to: '/mission' },
      { label: 'Contact', to: '/mission#contact' },
      { label: 'Partners', to: '/mission#collaboration' },
    ],
  },
];

export const FOOTER_LEGAL: NavLink[] = [
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms of use', to: '/terms' },
  { label: 'Contact', to: '/mission#contact' },
];

export const LANDING = {
  title: ['Climate Change', 'Education'],
  intro:
    'In the face of climate change, Human Nature supports teachers and educational systems by offering free educational resources, equipping students and encouraging them to take action for a better future.',
  quote: {
    before:
      '“Environmental education from the earliest years of life could be the most effective way to bring about real change in societies. In the region, ',
    emphasis:
      'we must make pedagogical approaches that address climate education from the early stages of learning in schools a reality',
    after:
      '. Integrating this approach into education policies is the first step, but teachers must be provided with tools and curricular content to enable children to be at the centre of climate action and environmental protection.”',
    attribution: 'Garry Conille, UNICEF Regional Director for Latin America and the Caribbean',
  },
};

export const MISSION_SECTIONS = [
  { id: 'our-product', title: 'Our product', blocks: ['299 / 168', '650 / 168'] },
  { id: 'the-team', title: 'The team', blocks: ['1001 / 372', '299 / 168', '302 / 168', '302 / 168'] },
  { id: 'our-impact', title: 'Our impact', blocks: ['299 / 168', '650 / 168', '299 / 168', '650 / 168'] },
  { id: 'collaboration', title: 'Collaboration IBF', blocks: ['299 / 168', '650 / 168'] },
  { id: 'future-plans', title: 'Future plans', blocks: ['299 / 168', '302 / 168', '302 / 168'] },
  { id: 'contact', title: 'Contact', blocks: [] },
] as const;
