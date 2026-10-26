// Entry point of the content editor at /admin/ (Decap CMS). See docs/CMS.md.
import CMS from 'decap-cms-app';
import { cmsConfig } from './config';
import { HomePreview, MissionPreview, ResourcePreview, SimplePagePreview, ThemePreview } from './previews';

// The preview pane is an iframe: give it the site's fonts and global styles as text, so
// they don't leak into the editor's own interface.
import fontText400 from '@fontsource/atkinson-hyperlegible/400.css?inline';
import fontText400i from '@fontsource/atkinson-hyperlegible/400-italic.css?inline';
import fontText700 from '@fontsource/atkinson-hyperlegible/700.css?inline';
import fontText700i from '@fontsource/atkinson-hyperlegible/700-italic.css?inline';
import fontDisplay500 from '@fontsource/space-grotesk/500.css?inline';
import fontDisplay700 from '@fontsource/space-grotesk/700.css?inline';
import globalCss from '../styles/global.css?inline';

/** Component styles (CSS Modules) that Vite added to this page for the preview components. */
async function componentCss(): Promise<string> {
  const inline = [...document.querySelectorAll<HTMLStyleElement>('style[data-vite-dev-id]')].map(
    (el) => el.textContent ?? '',
  );
  const linked = await Promise.all(
    [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')]
      .filter((link) => link.href.includes('/assets/'))
      .map((link) => fetch(link.href).then((r) => (r.ok ? r.text() : ''))),
  );
  return [...inline, ...linked].join('\n');
}

async function start() {
  CMS.registerPreviewStyle(
    [
      fontText400,
      fontText400i,
      fontText700,
      fontText700i,
      fontDisplay500,
      fontDisplay700,
      globalCss,
    ].join('\n'),
    { raw: true },
  );
  CMS.registerPreviewStyle(await componentCss(), { raw: true });

  CMS.registerPreviewTemplate('themes', ThemePreview);
  CMS.registerPreviewTemplate('resources', ResourcePreview);
  CMS.registerPreviewTemplate('home', HomePreview);
  CMS.registerPreviewTemplate('mission', MissionPreview);
  CMS.registerPreviewTemplate('privacy', SimplePagePreview);
  CMS.registerPreviewTemplate('terms', SimplePagePreview);

  CMS.init({ config: cmsConfig });
}

void start();
