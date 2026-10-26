// Live previews for the CMS editor. They render the site's real page components with the
// editor's unsaved content, so what editors see is what the page will look like.
import { useCallback, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { PreviewTemplateComponentProps } from 'decap-cms-core';
import { AssetContext, resolveAsset } from '../content/assets';
import { getResources, getThemes } from '../content/load';
import type { HomeData, MissionData, Resource, ResourceData, SimplePageData, Theme, ThemeData } from '../content/types';
import { HomeView } from '../pages/LandingPage';
import { MissionView } from '../pages/MissionPage';
import { ResourceView } from '../pages/ResourceDetailPage';
import { SimpleView } from '../pages/SimplePage';
import { ThemeView } from '../pages/ThemePage';

type Props = PreviewTemplateComponentProps;

const dataOf = <T,>(props: Props) => (props.entry.get('data')?.toJS() ?? {}) as T;
const slugOf = (props: Props, fallback: string) => (props.entry.get('slug') as string | undefined) || fallback;

/** Router + image resolver around every preview. Freshly uploaded images come from Decap. */
function PreviewShell({ getAsset, children }: { getAsset: Props['getAsset']; children: ReactNode }) {
  const resolver = useCallback(
    (path: string | undefined) => {
      if (!path) return '';
      const url = String(getAsset(path) ?? '');
      return /^(blob:|data:|https?:)/.test(url) ? url : resolveAsset(path);
    },
    [getAsset],
  );
  return (
    <MemoryRouter>
      <AssetContext.Provider value={resolver}>
        <div className="cms-preview">{children}</div>
      </AssetContext.Provider>
    </MemoryRouter>
  );
}

export function ThemePreview(props: Props) {
  const data = dataOf<ThemeData>(props);
  const slug = slugOf(props, 'new-theme');
  const theme: Theme = { ...data, slug, fallback: false };
  // Other themes come from the saved content, so the prev/next buttons work too.
  const themes = [...getThemes('en').filter((t) => t.slug !== slug), theme].sort(
    (a, b) => (a.number ?? 99) - (b.number ?? 99),
  );
  return (
    <PreviewShell getAsset={props.getAsset}>
      <ThemeView theme={theme} themes={themes} />
    </PreviewShell>
  );
}

export function ResourcePreview(props: Props) {
  const data = dataOf<ResourceData>(props);
  const slug = slugOf(props, 'new-resource');
  const resource: Resource = { ...data, slug, fallback: false };
  return (
    <PreviewShell getAsset={props.getAsset}>
      <ResourceView resource={resource} themes={getThemes('en')} />
    </PreviewShell>
  );
}

export function HomePreview(props: Props) {
  return (
    <PreviewShell getAsset={props.getAsset}>
      <HomeView home={dataOf<HomeData>(props)} themes={getThemes('en')} resources={getResources('en')} />
    </PreviewShell>
  );
}

export function MissionPreview(props: Props) {
  return (
    <PreviewShell getAsset={props.getAsset}>
      <MissionView mission={dataOf<MissionData>(props)} />
    </PreviewShell>
  );
}

export function SimplePagePreview(props: Props) {
  return (
    <PreviewShell getAsset={props.getAsset}>
      <SimpleView page={dataOf<SimplePageData>(props)} />
    </PreviewShell>
  );
}
