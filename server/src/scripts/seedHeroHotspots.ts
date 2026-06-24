/**
 * Upserts hero hotspot data on slides 1 & 2 — no wipe, no full re-seed.
 *
 *   npm run seed:hero-hotspots
 */
import mongoose from 'mongoose';
import { connectDb, disconnectDb } from '../config/db.js';
import { HeroSlide } from '../models/Homepage.js';
import { heroSlideHotspotsSeed } from '../seed/marketing.js';

async function main() {
  await connectDb();

  let updated = 0;
  for (const [id, hotspots] of Object.entries(heroSlideHotspotsSeed)) {
    const legacyId = Number(id);
    const result = await HeroSlide.findOneAndUpdate(
      { legacyId },
      { $set: { hotspots } },
      { new: true },
    );
    if (result) {
      updated += 1;
      console.log(`Updated hotspots on hero slide ${legacyId} (${hotspots.length} pins).`);
    } else {
      console.warn(`Hero slide ${legacyId} not found — run full seed first.`);
    }
  }

  if (!updated) {
    throw new Error('No hero slides updated. Ensure HeroSlide documents exist in MongoDB.');
  }

  await disconnectDb();
}

main().catch(err => {
  console.error('seed:hero-hotspots failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
