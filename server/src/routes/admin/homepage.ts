import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import { ApiError } from '../../middleware/errorHandler.js';
import {
  getHomepageAdminData,
  replaceHeroSlides,
  upsertHomepageBlock,
  updateHomepageCategory,
  replaceReviews,
} from '../../services/homepageAdmin.js';

const router = Router();
router.use(requireAdmin);

router.get('/', async (_req, res, next) => {
  try {
    res.json(await getHomepageAdminData());
  } catch (err) {
    next(err instanceof Error ? new ApiError(400, err.message) : err);
  }
});

router.put('/hero', async (req, res, next) => {
  try {
    const slides = await replaceHeroSlides(req.body.slides ?? req.body);
    res.json({ heroSlides: slides });
  } catch (err) {
    next(err instanceof Error ? new ApiError(400, err.message) : err);
  }
});

router.put('/blocks/:key', async (req, res, next) => {
  try {
    const data = await upsertHomepageBlock(req.params.key, req.body.data ?? req.body);
    res.json({ key: req.params.key, data });
  } catch (err) {
    next(err instanceof Error ? new ApiError(400, err.message) : err);
  }
});

router.patch('/categories/:id', async (req, res, next) => {
  try {
    const category = await updateHomepageCategory(req.params.id, req.body);
    res.json({ category });
  } catch (err) {
    next(err instanceof Error ? new ApiError(400, err.message) : err);
  }
});

router.put('/reviews', async (req, res, next) => {
  try {
    const reviews = await replaceReviews(req.body.reviews ?? req.body);
    res.json({ reviews });
  } catch (err) {
    next(err instanceof Error ? new ApiError(400, err.message) : err);
  }
});

export default router;
