import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages has no SPA rewrites: serving index.html as 404.html lets deep links
// like /resources/lesson-plan-climate load the app, which then routes client-side.
function githubPagesFallback(): Plugin {
  let outDir = 'dist';
  return {
    name: 'github-pages-404-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'));
    },
  };
}

export default defineConfig({
  // On GitHub Pages the site lives under /<repo-name>/; the deploy workflow sets BASE_PATH.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), githubPagesFallback()],
});
