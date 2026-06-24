import { Router } from 'express';
import { HeroSlide } from '../models/Homepage.js';
import { HomepageBlock } from '../models/Homepage.js';
import { Category, toCategoryDto } from '../models/Category.js';
import { Review, toReviewDto } from '../models/Review.js';
import { Product, toProductDto } from '../models/Product.js';
import {
  featuredCollectionSlugs,
  resolveFeaturedCollections,
} from '../lib/featuredCollections.js';
import { toHeroSlideDto } from '../lib/heroSlides.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const [heroSlides, homepageCategories, blocks, reviews, newArrivals, bestSellers, featuredCategories] =
      await Promise.all([
      HeroSlide.find().sort({ sortOrder: 1 }).lean(),
      Category.find({ featured: true }).lean(),
      HomepageBlock.find().lean(),
      Review.find().sort({ date: -1 }).limit(6).lean(),
      Product.find({ newArrival: true, inStock: true }).limit(8).lean(),
      Product.find({ isBestSeller: true, inStock: true }).limit(8).lean(),
      Category.find({ slug: { $in: featuredCollectionSlugs } }).lean(),
    ]);

    const blockMap = Object.fromEntries(blocks.map(b => [b.key, b.data]));

    res.json({
      heroSlides: heroSlides.map(s => toHeroSlideDto(s as never)),
      homepageCategories: homepageCategories.map(c => toCategoryDto(c as never)),
      fabrics: blockMap.fabrics || [],
      occasions: blockMap.occasions || [],
      instagramPosts: blockMap.instagramPosts || [],
      reviews: reviews.map(r => toReviewDto(r as never)),
      newArrivals: newArrivals.map(p => toProductDto(p as never)),
      bestSellers: bestSellers.map(p => toProductDto(p as never)),
      occasionSlugMap: blockMap.occasionSlugMap || {},
      allColors: blockMap.allColors || [],
      featuredCollections: resolveFeaturedCollections(
        blockMap.featuredCollections,
        featuredCategories,
      ),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
