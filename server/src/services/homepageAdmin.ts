import { HeroSlide } from '../models/Homepage.js';
import { HomepageBlock } from '../models/Homepage.js';
import { Category, toCategoryDto } from '../models/Category.js';
import { Review, toReviewDto } from '../models/Review.js';
import { toHeroSlideDto } from '../lib/heroSlides.js';
import {
  ALLOWED_HOMEPAGE_BLOCK_KEYS,
  defaultInstagramMeta,
  defaultSectionCopy,
  type HomepageBlockKey,
} from '../lib/sectionCopySeed.js';

export type HeroSlideInput = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta1: string;
  cta2: string;
  ctaLink: string;
  badge?: string;
  hotspots?: { productSlug: string; x: number; y: number }[];
  sortOrder?: number;
};

export type ReviewInput = {
  id: string;
  author: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
  verified?: boolean;
  productId?: string;
};

function clampHotspot(n: number): number {
  return Math.min(100, Math.max(0, Number(n) || 0));
}

function validateHeroSlide(slide: HeroSlideInput, index: number) {
  if (!slide.title?.trim()) throw new Error(`Hero slide ${index + 1}: title is required`);
  if (!slide.image?.trim()) throw new Error(`Hero slide ${index + 1}: image is required`);
  if (slide.hotspots?.length) {
    for (const h of slide.hotspots) {
      if (!h.productSlug?.trim()) throw new Error(`Hero slide ${index + 1}: hotspot product slug required`);
      h.x = clampHotspot(h.x);
      h.y = clampHotspot(h.y);
    }
  }
}

export async function getHomepageAdminData() {
  const [heroSlides, categories, blocks, reviews] = await Promise.all([
    HeroSlide.find().sort({ sortOrder: 1 }).lean(),
    Category.find().sort({ name: 1 }).lean(),
    HomepageBlock.find().lean(),
    Review.find().sort({ date: -1 }).lean(),
  ]);

  const blockMap = Object.fromEntries(blocks.map(b => [b.key, b.data]));

  return {
    heroSlides: heroSlides.map(s => toHeroSlideDto(s as never)),
    categories: categories.map(c => toCategoryDto(c as never)),
    fabrics: blockMap.fabrics ?? [],
    occasions: blockMap.occasions ?? [],
    featuredCollections: blockMap.featuredCollections ?? [],
    instagramPosts: blockMap.instagramPosts ?? [],
    sectionCopy: blockMap.sectionCopy ?? defaultSectionCopy,
    instagramMeta: blockMap.instagramMeta ?? defaultInstagramMeta,
    reviews: reviews.map(r => toReviewDto(r as never)),
  };
}

export async function replaceHeroSlides(slides: HeroSlideInput[]) {
  if (!Array.isArray(slides) || slides.length === 0) {
    throw new Error('At least one hero slide is required');
  }

  slides.forEach((s, i) => validateHeroSlide(s, i));

  const legacyIds = slides.map(s => s.id);
  await HeroSlide.deleteMany({ legacyId: { $nin: legacyIds } });

  const saved = [];
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const doc = await HeroSlide.findOneAndUpdate(
      { legacyId: slide.id },
      {
        $set: {
          legacyId: slide.id,
          title: slide.title.trim(),
          subtitle: slide.subtitle?.trim() ?? '',
          description: slide.description?.trim() ?? '',
          image: slide.image,
          cta1: slide.cta1?.trim() ?? '',
          cta2: slide.cta2?.trim() ?? '',
          ctaLink: slide.ctaLink?.trim() ?? '/collections',
          badge: slide.badge?.trim() || undefined,
          hotspots: slide.hotspots ?? [],
          sortOrder: slide.sortOrder ?? i,
        },
      },
      { upsert: true, new: true },
    );
    saved.push(toHeroSlideDto(doc as never));
  }

  return saved.sort((a, b) => a.id - b.id);
}

export async function upsertHomepageBlock(key: string, data: unknown) {
  if (!ALLOWED_HOMEPAGE_BLOCK_KEYS.includes(key as HomepageBlockKey)) {
    throw new Error(`Invalid block key: ${key}`);
  }
  if (data === undefined || data === null) {
    throw new Error('Block data is required');
  }

  const block = await HomepageBlock.findOneAndUpdate(
    { key },
    { $set: { key, data } },
    { upsert: true, new: true },
  );
  return block.data;
}

export async function updateHomepageCategory(
  legacyId: string,
  updates: { name?: string; image?: string; featured?: boolean },
) {
  const category = await Category.findOne({ legacyId });
  if (!category) throw new Error('Category not found');

  if (updates.name?.trim()) category.name = updates.name.trim();
  if (updates.image !== undefined) category.image = updates.image;
  if (updates.featured !== undefined) category.featured = updates.featured;

  await category.save();
  return toCategoryDto(category);
}

export async function replaceReviews(reviews: ReviewInput[]) {
  if (!Array.isArray(reviews)) throw new Error('Reviews must be an array');

  for (const r of reviews) {
    if (!r.id?.trim()) throw new Error('Review id is required');
    if (!r.author?.trim()) throw new Error('Review author is required');
    if (!r.comment?.trim()) throw new Error('Review comment is required');
    if (r.rating < 1 || r.rating > 5) throw new Error('Review rating must be 1–5');
  }

  const ids = reviews.map(r => r.id);
  await Review.deleteMany({ legacyId: { $nin: ids } });

  const saved = [];
  for (const r of reviews) {
    const doc = await Review.findOneAndUpdate(
      { legacyId: r.id },
      {
        $set: {
          legacyId: r.id,
          author: r.author.trim(),
          location: r.location?.trim() ?? '',
          rating: r.rating,
          comment: r.comment.trim(),
          date: r.date || new Date().toISOString().split('T')[0],
          avatar: r.avatar || undefined,
          verified: r.verified ?? true,
          productId: r.productId,
        },
      },
      { upsert: true, new: true },
    );
    saved.push(toReviewDto(doc));
  }

  return saved;
}
