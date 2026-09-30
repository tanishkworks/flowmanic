#!/usr/bin/env node
/**
 * Compresses every raster image in public/images into AVIF + WebP siblings
 * (and a resized fallback), so project screenshots you add later ship small.
 *   public/images/case-study.png → case-study.avif, case-study.webp (max 1920px wide)
 * SVGs in public/art are already vector + gzip/brotli-compressed by the server/CDN.
 */
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dir = path.join(root, 'public', 'images');
const MAX_WIDTH = 1920;

let files = [];
try {
  files = (await readdir(dir)).filter((f) => /\.(png|jpe?g)$/i.test(f));
} catch {
  console.log('No public/images folder yet. Add screenshots there and run again.');
  process.exit(0);
}

for (const file of files) {
  const input = path.join(dir, file);
  const base = input.replace(/\.(png|jpe?g)$/i, '');
  const before = (await stat(input)).size;
  const pipeline = sharp(input).resize({ width: MAX_WIDTH, withoutEnlargement: true });
  await pipeline.clone().avif({ quality: 55, effort: 5 }).toFile(`${base}.avif`);
  await pipeline.clone().webp({ quality: 78 }).toFile(`${base}.webp`);
  const after = (await stat(`${base}.webp`)).size;
  console.log(`${file}: ${(before / 1024).toFixed(0)} KB → webp ${(after / 1024).toFixed(0)} KB (+ avif)`);
}
console.log(files.length ? 'Done.' : 'No PNG/JPG files found in public/images.');
