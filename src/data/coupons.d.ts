import type { Coupon } from '../types';
export declare const defaultCoupons: Coupon[];
export declare function validateCoupon(code: string, subtotal: number, coupons?: Coupon[]): {
    valid: boolean;
    coupon?: Coupon;
    error?: string;
};
export declare function calculateDiscount(coupon: Coupon, subtotal: number): number;
