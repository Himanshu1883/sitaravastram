import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const IMAGE_EXT = /\.(png|jpe?g|webp)$/i;

export function resolveImagePath(imagesDir: string, filename: string): string | undefined {
  const path = join(imagesDir, filename);
  return existsSync(path) ? path : undefined;
}

/** Groups seed images by product number (image1_*.png, image2 (1).png, … image17). */
export function groupProductImages(imagesDir: string): Map<number, string[]> {
  const map = new Map<number, string[]>();

  for (const name of readdirSync(imagesDir)) {
    if (!IMAGE_EXT.test(name)) continue;
    const match = name.match(/^image(\d+)/i);
    if (!match) continue;

    const num = parseInt(match[1], 10);
    if (num < 1 || num > 17) continue;

    const list = map.get(num) ?? [];
    list.push(join(imagesDir, name));
    map.set(num, list);
  }

  for (const [num, paths] of map) {
    paths.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    map.set(num, paths);
  }

  return map;
}
