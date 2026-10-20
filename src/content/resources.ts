// The resource library (DESIGN.md §5.7–5.10). Twelve entries, matching "Resources (12)"
// in Figma. Titles beyond the two designed detail pages are placeholders (§8.4 #15).
import { IMAGES } from './images';
import { PH_SHORT } from './placeholders';
import { THEME_TITLES } from './themes';
import type { Resource, ResourceType, ThemeSlug } from './types';

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  'lesson-plan': 'Lesson plan',
  test: 'Test your knowledge',
  extra: 'Extra resource',
  module: 'Module download',
};

export const RESOURCES: Resource[] = [
  {
    slug: 'lesson-plan-climate',
    title: 'Lesson plan: Climate',
    description: 'A ready-to-teach lesson about weather, climate and the climates of the world.',
    type: 'lesson-plan',
    theme: 'climate',
    forTeachers: true,
    image: IMAGES.climateClassChildren,
  },
  {
    slug: 'test-climate-change',
    title: 'Test your knowledge: Climate Change',
    description: 'Check what your class has learned about climate change.',
    type: 'test',
    theme: 'climate-change',
    forTeachers: false,
    image: IMAGES.themeClimateChange,
    quizId: 'climate-change',
  },
  ...(
    [
      ['lesson-plan-climate-change', 'lesson-plan', 'climate-change', true],
      ['lesson-plan-human-and-nature', 'lesson-plan', 'human-and-nature', true],
      ['lesson-plan-solutions', 'lesson-plan', 'solutions', true],
      ['test-climate', 'test', 'climate', false],
      ['test-human-and-nature', 'test', 'human-and-nature', false],
      ['test-solutions', 'test', 'solutions', false],
      ['teacher-guide-climate', 'extra', 'climate', true],
      ['news-climate-change', 'extra', 'climate-change', false],
      ['module-climate', 'module', 'climate', true],
      ['module-solutions', 'module', 'solutions', true],
    ] as [string, ResourceType, ThemeSlug, boolean][]
  ).map(([slug, type, theme, forTeachers]) => ({
    slug,
    title: `${RESOURCE_TYPE_LABELS[type]}: ${THEME_TITLES[theme]}`,
    description: PH_SHORT,
    type,
    theme,
    forTeachers,
    quizId: type === 'test' ? theme : undefined,
  })),
];

export const getResource = (slug: string | undefined): Resource | undefined =>
  RESOURCES.find((r) => r.slug === slug);

export const MODULE_PDF_PATH = 'downloads/module-placeholder.pdf'; // §8.5 #27 placeholder
