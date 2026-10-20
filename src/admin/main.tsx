// Entry point of the content editor at /admin/ (Decap CMS). See docs/CMS.md.
import CMS from 'decap-cms-app';
import { cmsConfig } from './config';
import { HomePreview, MissionPreview, ResourcePreview, SimplePagePreview, ThemePreview } from './previews';

// The preview pane is an iframe: give it the site's fonts and global styles as text, so
// they don't leak into the editor's own interface.
import fontInter400 from '@fontsource/inter/400.css?inline';
import fontInter400i from '@fontsource/inter/400-italic.css?inline';
import fontInter500 from '@fontsource/inter/500.css?inline';
import fontInter600 from '@fontsource/inter/600.css?inline';
import fontInter700 from '@fontsource/inter/700.css?inline';
import fontInter700i from '@fontsource/inter/700-italic.css?inline';
import fontRoboto500 from '@fontsource/roboto/500.css?inline';
import fontRoboto700 from '@fontsource/roboto/700.css?inline';
import fontSpaceGrotesk from '@fontsource/space-grotesk/700.css?inline';
import fontHand from '@fontsource/just-me-again-down-here/400.css?inline';
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
      fontInter400,
      fontInter400i,
      fontInter500,
      fontInter600,
      fontInter700,
      fontInter700i,
      fontRoboto500,
      fontRoboto700,
      fontSpaceGrotesk,
      fontHand,
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
