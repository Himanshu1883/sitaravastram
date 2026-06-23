import type { ICoupon } from '../models/Coupon.js';

export function validateCoupon(
  coupon: ICoupon | null,
  subtotal: number,
): { valid: boolean; error?: string } {
  if (!coupon || !coupon.active) return { valid: false, error: 'Invalid coupon code' };
  if (subtotal < coupon.minOrder) {
    return { valid: false, error: `Minimum order ₹${coupon.minOrder.toLocaleString('en-IN')} required` };
  }
  if (coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, error: 'Coupon usage limit reached' };
  }
  if (new Date(coupon.expiry) < new Date()) {
    return { valid: false, error: 'Coupon has expired' };
  }
  return { valid: true };
}

export function calculateDiscount(coupon: ICoupon, subtotal: number): number {
  if (coupon.type === 'percent') return Math.round(subtotal * (coupon.value / 100));
  return Math.min(coupon.value, subtotal);
}
