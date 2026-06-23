export const defaultCoupons = [
    {
        id: '1',
        code: 'SITARA10',
        type: 'percent',
        value: 10,
        minOrder: 999,
        expiry: '2026-12-31',
        usageLimit: 1000,
        usedCount: 234,
        active: true,
    },
    {
        id: '2',
        code: 'FESTIVE20',
        type: 'percent',
        value: 20,
        minOrder: 2999,
        expiry: '2026-10-31',
        usageLimit: 500,
        usedCount: 89,
        active: true,
    },
    {
        id: '3',
        code: 'FLAT200',
        type: 'flat',
        value: 200,
        minOrder: 1499,
        expiry: '2026-08-31',
        usageLimit: 300,
        usedCount: 45,
        active: true,
    },
    {
        id: '4',
        code: 'WELCOME15',
        type: 'percent',
        value: 15,
        minOrder: 0,
        expiry: '2026-12-31',
        usageLimit: 2000,
        usedCount: 567,
        active: true,
    },
    {
        id: '5',
        code: 'SUMMER500',
        type: 'flat',
        value: 500,
        minOrder: 4999,
        expiry: '2026-06-30',
        usageLimit: 100,
        usedCount: 12,
        active: true,
    },
];
export function validateCoupon(code, subtotal, coupons = defaultCoupons) {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
    if (!coupon)
        return { valid: false, error: 'Invalid coupon code' };
    if (subtotal < coupon.minOrder) {
        return { valid: false, error: `Minimum order ₹${coupon.minOrder.toLocaleString('en-IN')} required` };
    }
    if (coupon.usedCount >= coupon.usageLimit) {
        return { valid: false, error: 'Coupon usage limit reached' };
    }
    if (new Date(coupon.expiry) < new Date()) {
        return { valid: false, error: 'Coupon has expired' };
    }
    return { valid: true, coupon };
}
export function calculateDiscount(coupon, subtotal) {
    if (coupon.type === 'percent')
        return Math.round(subtotal * (coupon.value / 100));
    return Math.min(coupon.value, subtotal);
}
