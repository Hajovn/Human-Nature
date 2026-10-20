import { copyFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import sharp from 'sharp';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const UPLOADS = resolve(__dirname, 'public/uploads');
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);

function listImages(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return listImages(full);
    return IMAGE_EXT.has(extname(name).toLowerCase()) ? [full] : [];
  });
}

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

// `import sizes from 'virtual:image-sizes'` → { "/uploads/x.webp": [width, height] } for
// every image uploaded through the CMS, so pages can reserve space (no layout shift).
function imageSizes(): Plugin {
  const id = 'virtual:image-sizes';
  const resolved = `\0${id}`;
  return {
    name: 'image-sizes',
    resolveId: (source) => (source === id ? resolved : null),
    async load(source) {
      if (source !== resolved) return null;
      const entries = await Promise.all(
        listImages(UPLOADS).map(async (file) => {
          try {
            const { width, height } = await sharp(file).metadata();
            return [`/uploads/${relative(UPLOADS, file).replace(/\\/g, '/')}`, [width, height]];
          } catch {
            return null;
          }
        }),
      );
      return `export default ${JSON.stringify(Object.fromEntries(entries.filter(Boolean) as [string, number[]][]))};`;
    },
    configureServer(server) {
      // New or replaced uploads (e.g. saved from the CMS) refresh the size table.
      server.watcher.add(UPLOADS);
      const refresh = (file: string) => {
        if (!file.startsWith(UPLOADS)) return;
        const mod = server.moduleGraph.getModuleById(resolved);
        if (mod) server.moduleGraph.invalidateModule(mod);
      };
      server.watcher.on('add', refresh);
      server.watcher.on('change', refresh);
    },
  };
}

// Editors may upload very large photos. In the build output only (never the originals in
// public/uploads), shrink images wider than 2400px and re-compress them in their format.
function optimizeUploads(): Plugin {
  let outDir = 'dist';
  return {
    name: 'optimize-uploads',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      for (const file of listImages(resolve(outDir, 'uploads'))) {
        const ext = extname(file).toLowerCase();
        if (ext === '.gif') continue;
        const input = sharp(file);
        const { width = 0 } = await input.metadata();
        if (width <= 2400 && statSync(file).size < 600_000) continue;
        let pipeline = sharp(file).rotate().resize({ width: 2400, withoutEnlargement: true });
        pipeline =
          ext === '.png'
            ? pipeline.png({ compressionLevel: 9, palette: true })
            : ext === '.webp'
              ? pipeline.webp({ quality: 80 })
              : ext === '.avif'
                ? pipeline.avif({ quality: 60 })
                : pipeline.jpeg({ quality: 80, mozjpeg: true });
        const buffer = await pipeline.toBuffer();
        if (buffer.length < statSync(file).size) await sharp(buffer).toFile(file);
      }
    },
  };
}

export default defineConfig({
  // On GitHub Pages the site lives under /<repo-name>/; the deploy workflow sets BASE_PATH.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), imageSizes(), githubPagesFallback(), optimizeUploads()],
  build: {
    rollupOptions: {
      // The website, plus the CMS admin at /admin/ (Decap CMS, see docs/CMS.md).
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
});
