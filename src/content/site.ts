// Navigation (DESIGN.md §8.2 #3) and footer (§4.2) structure. Labels are interface
// strings (src/i18n/strings.ts); theme titles come from the CMS content.
import type { StringKey } from '../i18n/strings';
import type { Theme } from './types';

type T = (key: StringKey, vars?: Record<string, string | number>) => string;

export interface NavLink {
  label: string;
  to: string;
}

export interface NavGroup {
  label: string;
  /** Path prefix (without language) that marks this group as the current section. */
  match: string;
  links: NavLink[];
}

export function navGroups(t: T, themes: Theme[]): NavGroup[] {
  return [
    {
      label: t('nav.themes'),
      match: '/themes',
      links: themes.map((theme) => ({ label: theme.title ?? theme.slug, to: `/themes/${theme.slug}` })),
    },
    {
      label: t('nav.materials'),
      match: '/resources',
      links: [
        { label: t('nav.allResources'), to: '/resources' },
        { label: t('nav.lessonPlans'), to: '/resources?type=lesson-plan' },
        { label: t('nav.tests'), to: '/resources?type=test' },
        { label: t('nav.extra'), to: '/resources?type=extra' },
        { label: t('nav.download'), to: '/resources?type=module' },
      ],
    },
    {
      label: t('nav.mission'),
      match: '/mission',
      links: [
        { label: t('nav.missionMission'), to: '/mission#mission' },
        { label: t('nav.ourProduct'), to: '/mission#our-product' },
        { label: t('nav.theTeam'), to: '/mission#the-team' },
        { label: t('nav.ourImpact'), to: '/mission#our-impact' },
        { label: t('nav.collaboration'), to: '/mission#collaboration' },
        { label: t('nav.futurePlans'), to: '/mission#future-plans' },
        { label: t('nav.contact'), to: '/mission#contact' },
      ],
    },
  ];
}

export function footerColumns(t: T, themes: Theme[]): { heading: string; links: NavLink[] }[] {
  return [
    {
      heading: t('nav.themes'),
      links: themes.map((theme) => ({ label: `${theme.number}. ${theme.title}`, to: `/themes/${theme.slug}` })),
    },
    {
      heading: t('nav.materials'),
      links: [
        { label: t('footer.lessonExamples'), to: '/resources?type=lesson-plan' },
        { label: t('footer.downloadModule'), to: '/resources?type=module' },
        { label: t('footer.testKnowledge'), to: '/resources?type=test' },
        { label: t('nav.extra'), to: '/resources?type=extra' },
      ],
    },
    {
      heading: t('nav.mission'),
      links: [
        { label: t('footer.aboutUs'), to: '/mission' },
        { label: t('footer.contact'), to: '/mission#contact' },
        { label: t('footer.partners'), to: '/mission#collaboration' },
      ],
    },
  ];
}

export const footerLegal = (t: T): NavLink[] => [
  { label: t('footer.privacy'), to: '/privacy' },
  { label: t('footer.terms'), to: '/terms' },
  { label: t('footer.contact'), to: '/mission#contact' },
];

export const RESOURCE_TYPES = ['lesson-plan', 'test', 'extra', 'module'] as const;
