/**
 * Upserts fabrics + occasions HomepageBlocks — no wipe, no full re-seed.
 * Uses local files from server/src/seed/images/ (new_images_singles + single_main).
 *
 *   npm run seed:fabrics-occasions
 *   MONGODB_URI="mongodb://..." npm run seed:fabrics-occasions
 */
import mongoose from 'mongoose';
import { connectDb, disconnectDb } from '../config/db.js';
import { HomepageBlock } from '../models/Homepage.js';
import { buildFabricsBlock, buildOccasionsBlock } from '../lib/homepageMediaSeed.js';

async function main() {
  await connectDb();

  const [fabrics, occasions] = await Promise.all([buildFabricsBlock(), buildOccasionsBlock()]);

  await HomepageBlock.findOneAndUpdate(
    { key: 'fabrics' },
    { key: 'fabrics', data: fabrics },
    { upsert: true },
  );
  await HomepageBlock.findOneAndUpdate(
    { key: 'occasions' },
    { key: 'occasions', data: occasions },
    { upsert: true },
  );

  console.log(`Upserted ${fabrics.length} fabrics and ${occasions.length} occasions.`);
  fabrics.forEach(f => console.log(`  fabric ${f.name} → ${f.image}`));
  occasions.forEach(o => console.log(`  occasion ${o.slug} → ${o.image}`));

  await disconnectDb();
}

main().catch(err => {
  console.error('seed:fabrics-occasions failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
