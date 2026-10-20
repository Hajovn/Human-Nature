// Converts the full-size Figma exports in design-assets/raw into WebP files
// (DESIGN.md §8.7: WebP, sized for their largest on-screen use).
//   UI images (icons, avatar, level graphic) → src/assets/img (bundled by Vite)
//   content images                           → public/uploads (managed in the CMS)
import { mkdirSync, readdirSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';

const RAW_DIR = 'design-assets/raw';
const UI_IMAGES = new Set(['avatar', 'thumb', 'pdf-icon', 'level-progress']);
const outDirFor = (name) => (UI_IMAGES.has(name) ? 'src/assets/img' : 'public/uploads');

// Full-bleed hero photos need more pixels than in-content images.
const MAX_WIDTH = {
  'hero-beach-class': 2400,
  'theme-climate': 2400,
  'theme-climate-change-bromo': 2400,
  'theme-human-nature': 2400,
  'theme-solutions-farming': 2400,
  'farming-2': 2400,
  avatar: 600,
  thumb: 200,
  'pdf-icon': 400,
};
const DEFAULT_MAX_WIDTH = 1600;

for (const file of readdirSync(RAW_DIR)) {
  const ext = extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;
  const name = basename(file, ext);
  const width = MAX_WIDTH[name] ?? DEFAULT_MAX_WIDTH;
  const outDir = outDirFor(name);
  mkdirSync(outDir, { recursive: true });
  const info = await sharp(join(RAW_DIR, file))
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(join(outDir, `${name}.webp`));
  console.log(`${name}.webp  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}
