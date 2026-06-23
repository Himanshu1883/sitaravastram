import { Router } from 'express';
import { Coupon, toCouponDto } from '../../models/Coupon.js';
import { requireAdmin } from '../../middleware/auth.js';
import { ApiError } from '../../middleware/errorHandler.js';

const router = Router();
router.use(requireAdmin);

router.get('/', async (_req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    res.json(coupons.map(c => toCouponDto(c as never)));
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const coupon = await Coupon.create({
      legacyId: body.id || `cp-${Date.now()}`,
      code: String(body.code).toUpperCase(),
      type: body.type,
      value: body.value,
      minOrder: body.minOrder ?? 0,
      expiry: body.expiry,
      usageLimit: body.usageLimit ?? 1000,
      usedCount: body.usedCount ?? 0,
      active: body.active ?? true,
    });
    res.status(201).json(toCouponDto(coupon));
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const coupon = await Coupon.findOneAndUpdate(
      { legacyId: req.params.id },
      { $set: req.body },
      { new: true },
    );
    if (!coupon) return next(new ApiError(404, 'Coupon not found'));
    res.json(toCouponDto(coupon));
  } catch (err) {
    next(err);
  }
});

export default router;
