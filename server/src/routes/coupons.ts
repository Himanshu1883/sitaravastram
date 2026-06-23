import { Router } from 'express';
import { Coupon } from '../models/Coupon.js';
import { validateCoupon, calculateDiscount } from '../services/coupon.js';
import { toCouponDto } from '../models/Coupon.js';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();

router.post('/validate', async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) return next(new ApiError(400, 'Coupon code is required'));
    const coupon = await Coupon.findOne({ code: String(code).toUpperCase(), active: true });
    const result = validateCoupon(coupon, Number(subtotal) || 0);
    if (!result.valid) return res.json({ valid: false, error: result.error });
    const discount = calculateDiscount(coupon!, Number(subtotal) || 0);
    res.json({ valid: true, coupon: toCouponDto(coupon!), discount });
  } catch (err) {
    next(err);
  }
});

export default router;
