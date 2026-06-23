import { Router } from 'express';
import { Category, toCategoryDto } from '../../models/Category.js';
import { requireAdmin } from '../../middleware/auth.js';
import { ApiError } from '../../middleware/errorHandler.js';

const router = Router();
router.use(requireAdmin);

router.get('/', async (_req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.json(categories.map(c => toCategoryDto(c as never)));
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const legacyId = body.id || `c-${Date.now()}`;
    const category = await Category.create({
      legacyId,
      name: body.name,
      slug: body.slug,
      image: body.image,
      count: body.count,
      featured: body.featured ?? false,
    });
    res.status(201).json(toCategoryDto(category));
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const category = await Category.findOneAndDelete({ legacyId: req.params.id });
    if (!category) return next(new ApiError(404, 'Category not found'));
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
