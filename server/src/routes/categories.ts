import { Router } from 'express';
import { Category, toCategoryDto } from '../models/Category.js';
import { Product } from '../models/Product.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const featured = req.query.featured === 'true';
    const filter = featured ? { featured: true } : {};
    const categories = await Category.find(filter).sort({ name: 1 }).lean();

    const counts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(counts.map(c => [c._id, c.count]));

    res.json(
      categories.map(c => ({
        ...toCategoryDto(c as never),
        count: countMap[c.slug] ?? c.count ?? 0,
      })),
    );
  } catch (err) {
    next(err);
  }
});

export default router;
