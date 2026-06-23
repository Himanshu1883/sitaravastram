import { Router } from 'express';
import { Product, toProductDto } from '../models/Product.js';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const {
      q,
      category,
      fabric,
      occasion,
      color,
      size,
      minPrice,
      maxPrice,
      inStock,
      sort,
      isNew,
      isBestSeller,
      limit,
    } = req.query;

    const filter: Record<string, unknown> = {};

    if (category) {
      const cats = String(category).split(',');
      filter.category = cats.length === 1 ? cats[0] : { $in: cats };
    }
    if (fabric) {
      const fabrics = String(fabric).split(',');
      filter.fabric = fabrics.length === 1 ? fabrics[0] : { $in: fabrics };
    }
    if (occasion) {
      filter.occasion = { $in: String(occasion).split(',') };
    }
    if (color) {
      filter.colors = { $in: String(color).split(',') };
    }
    if (size) {
      filter.sizes = { $in: String(size).split(',') };
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }
    if (inStock === 'true') filter.inStock = true;
    if (isNew === 'true') filter.newArrival = true;
    if (isBestSeller === 'true') filter.isBestSeller = true;

    let query = Product.find(filter);

    if (q) {
      const term = String(q).trim();
      query = Product.find({
        ...filter,
        $or: [
          { name: { $regex: term, $options: 'i' } },
          { description: { $regex: term, $options: 'i' } },
          { tags: { $regex: term, $options: 'i' } },
          { fabric: { $regex: term, $options: 'i' } },
        ],
      });
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      featured: { isBestSeller: -1, newArrival: -1, rating: -1 },
      newest: { createdAt: -1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      rating: { rating: -1, reviewCount: -1 },
    };
    query = query.sort(sortMap[String(sort) || 'featured'] || sortMap.featured);

    if (limit) query = query.limit(Number(limit));

    const products = await query.lean();
    res.json(products.map(p => toProductDto(p as never)));
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).lean();
    if (!product) return next(new ApiError(404, 'Product not found'));
    res.json(toProductDto(product as never));
  } catch (err) {
    next(err);
  }
});

export default router;
