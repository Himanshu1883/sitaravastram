import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { FABRIC_IMAGE_FILES, OCCASION_IMAGE_FILES } from '../seed/marketing.js';
import { resolveImagePath } from '../seed/localImages.js';
import { uploadLocalFile, uploadUrls } from '../services/gridfs.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = join(__dirname, '../seed/images');
const catalog = JSON.parse(readFileSync(join(__dirname, '../seed/catalog.json'), 'utf-8'));

type FabricSeed = {
  name: string;
  icon: string;
  description: string;
  color: string;
  image: string;
};

type OccasionSeed = {
  name: string;
  description: string;
  image: string;
  slug: string;
};

const fileUrlCache = new Map<string, string>();

async function uploadMarketingFile(filename: string, prefix: string): Promise<string | undefined> {
  const cached = fileUrlCache.get(filename);
  if (cached) return cached;

  const path = resolveImagePath(IMAGES_DIR, filename);
  if (!path) {
    console.warn(`  ⚠ Missing marketing image: ${filename}`);
    return undefined;
  }

  const safeName = filename.replace(/[^a-z0-9.]+/gi, '-');
  const url = await uploadLocalFile(path, `${prefix}-${safeName}`, { kind: 'image' });
  fileUrlCache.set(filename, url);
  return url;
}

async function migrateUrl(url: string | undefined, prefix: string): Promise<string | undefined> {
  if (!url) return undefined;
  if (url.startsWith('/api/media/')) return url;
  const [migrated] = await uploadUrls([url], prefix);
  return migrated;
}

export async function buildFabricsBlock(): Promise<FabricSeed[]> {
  const fabrics = catalog.fabrics as FabricSeed[];
  return Promise.all(
    fabrics.map(async f => {
      const imageFile = FABRIC_IMAGE_FILES[f.name];
      const localImage = imageFile ? await uploadMarketingFile(imageFile, `fabric-${f.name}`) : undefined;
      return {
        ...f,
        image: localImage || (await migrateUrl(f.image, `fabric-${f.name}`)) || f.image,
      };
    }),
  );
}

export async function buildOccasionsBlock(): Promise<OccasionSeed[]> {
  const occasions = catalog.occasions as OccasionSeed[];
  return Promise.all(
    occasions.map(async o => {
      const imageFile = OCCASION_IMAGE_FILES[o.slug];
      const localImage = imageFile ? await uploadMarketingFile(imageFile, `occasion-${o.slug}`) : undefined;
      return {
        ...o,
        image: localImage || (await migrateUrl(o.image, `occasion-${o.slug}`)) || o.image,
      };
    }),
  );
}
