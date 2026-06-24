import { Router } from 'express';
import { Product, toProductDto } from '../../models/Product.js';
import { requireAdmin } from '../../middleware/auth.js';
import { ApiError } from '../../middleware/errorHandler.js';

const router = Router();
router.use(requireAdmin);

router.get('/', async (_req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.json(products.map(p => toProductDto(p as never)));
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const legacyId = body.id || `p-${Date.now()}`;
    const existing = await Product.findOne({ $or: [{ legacyId }, { slug: body.slug }] });
    if (existing) return next(new ApiError(409, 'Product with this id or slug already exists'));

    const product = await Product.create({
      legacyId,
      name: body.name,
      slug: body.slug,
      price: body.price,
      originalPrice: body.originalPrice,
      discount: body.discount,
      images: body.images || [],
      video: body.video,
      category: body.category,
      fabric: body.fabric,
      occasion: body.occasion || [],
      colors: body.colors || [],
      sizes: body.sizes || [],
      showColorSelector: body.showColorSelector ?? false,
      showSizeSelector: body.showSizeSelector ?? false,
      rating: body.rating ?? 4.5,
      reviewCount: body.reviewCount ?? 0,
      description: body.description || '',
      details: body.details || [],
      includes: body.includes || [],
      washCare: body.washCare,
      deliveryTime: body.deliveryTime,
      returnPolicy: body.returnPolicy,
      sku: body.sku,
      stock: body.stock ?? 0,
      newArrival: body.isNew,
      isBestSeller: body.isBestSeller,
      inStock: body.inStock ?? true,
    });
    res.status(201).json(toProductDto(product));
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const body = { ...req.body, legacyId: req.params.id };
    if ('isNew' in body) {
      body.newArrival = body.isNew;
      delete body.isNew;
    }
    delete body.id;
    const product = await Product.findOneAndUpdate(
      { legacyId: req.params.id },
      { $set: body },
      { new: true, runValidators: true },
    );
    if (!product) return next(new ApiError(404, 'Product not found'));
    res.json(toProductDto(product));
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ legacyId: req.params.id });
    if (!product) return next(new ApiError(404, 'Product not found'));
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/inventory', async (req, res, next) => {
  try {
    const { stock, inStock } = req.body;
    const product = await Product.findOneAndUpdate(
      { legacyId: req.params.id },
      { stock, inStock },
      { new: true },
    );
    if (!product) return next(new ApiError(404, 'Product not found'));
    res.json(toProductDto(product));
  } catch (err) {
    next(err);
  }
});

export default router;
