/**
 * Upserts only the featuredCollections HomepageBlock — no wipe, no full re-seed.
 * Uses category images already stored in MongoDB (or local seed files as fallback).
 *
 *   npm run seed:featured
 *   MONGODB_URI="mongodb://..." npm run seed:featured
 */
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import { connectDb, disconnectDb } from '../config/db.js';
import { Category } from '../models/Category.js';
import { HomepageBlock } from '../models/Homepage.js';
import { uploadLocalFile } from '../services/gridfs.js';
import { resolveImagePath } from '../seed/localImages.js';
import { featuredCollectionsSeed } from '../seed/marketing.js';
import { featuredCollectionSlugs, resolveFeaturedCollections } from '../lib/featuredCollections.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = join(__dirname, '../seed/images');

async function imageForFeatured(
  slug: string,
  imageFile: string,
  id: number,
  categoryImage?: string,
): Promise<string | undefined> {
  if (categoryImage) return categoryImage;
  const path = resolveImagePath(IMAGES_DIR, imageFile);
  if (!path) return undefined;
  return uploadLocalFile(path, `featured-${id}-${imageFile.replace(/[^a-z0-9.]+/gi, '-')}`, {
    kind: 'image',
  });
}

async function main() {
  await connectDb();

  const categories = await Category.find({ slug: { $in: featuredCollectionSlugs } }).lean();
  const catBySlug = Object.fromEntries(categories.map(c => [c.slug, c]));

  const resolved = await Promise.all(
    featuredCollectionsSeed.map(async f => {
      const slug = f.href.replace('/collections/', '');
      const image = await imageForFeatured(slug, f.imageFile, f.id, catBySlug[slug]?.image);
      if (!image) return null;
      return {
        id: f.id,
        href: f.href,
        imageAlt: f.imageAlt,
        reverse: f.reverse,
        image,
      };
    }),
  );

  const data = resolved.filter(Boolean);
  if (!data.length) {
    const fallback = resolveFeaturedCollections([], categories);
    if (!fallback.length) {
      throw new Error('No featured collection images found in DB or local seed/images/');
    }
    await HomepageBlock.findOneAndUpdate(
      { key: 'featuredCollections' },
      { key: 'featuredCollections', data: fallback },
      { upsert: true },
    );
    console.log(`Upserted ${fallback.length} featured collections from category images.`);
  } else {
    await HomepageBlock.findOneAndUpdate(
      { key: 'featuredCollections' },
      { key: 'featuredCollections', data },
      { upsert: true },
    );
    console.log(`Upserted ${data.length} featured collections.`);
  }

  await disconnectDb();
}

main().catch(err => {
  console.error('seed:featured failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
