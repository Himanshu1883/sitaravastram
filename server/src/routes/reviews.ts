import { Router } from 'express';
import { Review, toReviewDto } from '../models/Review.js';
import { requireCustomer } from '../middleware/auth.js';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const filter: Record<string, string> = {};
    if (req.query.productId) filter.productId = String(req.query.productId);
    const reviews = await Review.find(filter).sort({ date: -1 }).lean();
    res.json(reviews.map(r => toReviewDto(r as never)));
  } catch (err) {
    next(err);
  }
});

router.post('/', requireCustomer, async (req, res, next) => {
  try {
    const { productId, author, location, rating, comment } = req.body;
    if (!author || !rating || !comment) {
      return next(new ApiError(400, 'author, rating, and comment are required'));
    }
    const review = await Review.create({
      legacyId: `rv-${Date.now()}`,
      productId,
      author,
      location: location || '',
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split('T')[0],
      verified: true,
    });
    res.status(201).json(toReviewDto(review));
  } catch (err) {
    next(err);
  }
});

export default router;
