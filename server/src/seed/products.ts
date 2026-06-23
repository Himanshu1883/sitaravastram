/** 17 catalog products — images loaded from server/src/seed/images/ at seed time. */
export interface SeedProduct {
  id: string;
  imageIndex: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  fabric: string;
  occasion: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  description: string;
  details: string[];
  includes: string[];
  washCare: string;
  deliveryTime: string;
  returnPolicy: string;
  sku: string;
  stock: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  tags: string[];
}

const defaults = {
  washCare: 'Machine wash cold with like colours. Do not bleach. Iron on low heat.',
  deliveryTime: 'Dispatched in 1-2 business days. Standard delivery 4-7 business days.',
  returnPolicy: '7-day hassle-free returns. Product must be unworn with tags intact.',
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  includes: ['Kurta', 'Dupatta', 'Bottom'],
};

function p(
  imageIndex: number,
  name: string,
  slug: string,
  category: string,
  fabric: string,
  price: number,
  extra: Partial<SeedProduct> = {},
): SeedProduct {
  const originalPrice = extra.originalPrice ?? Math.round(price * 1.35);
  const discount =
    extra.discount ?? Math.round(((originalPrice - price) / originalPrice) * 100);
  return {
    id: String(imageIndex),
    imageIndex,
    name,
    slug,
    price,
    originalPrice,
    discount,
    category,
    fabric,
    occasion: extra.occasion ?? ['Casual'],
    colors: extra.colors ?? ['Ivory', 'Sage Green', 'Dusty Rose'],
    sizes: extra.sizes ?? defaults.sizes,
    rating: extra.rating ?? 4.5 + (imageIndex % 5) * 0.1,
    reviewCount: extra.reviewCount ?? 40 + imageIndex * 11,
    description:
      extra.description ??
      `${name} — crafted for comfort and everyday elegance. Premium ${fabric.toLowerCase()} with thoughtful finishing.`,
    details: extra.details ?? [
      `Premium ${fabric}`,
      'Soft, breathable fabric for all-day wear',
      'Easy care — colour-fast prints',
    ],
    includes: extra.includes ?? defaults.includes,
    washCare: extra.washCare ?? defaults.washCare,
    deliveryTime: extra.deliveryTime ?? defaults.deliveryTime,
    returnPolicy: extra.returnPolicy ?? defaults.returnPolicy,
    sku: extra.sku ?? `SV-${String(imageIndex).padStart(3, '0')}`,
    stock: extra.stock ?? 20 + imageIndex * 3,
    isNew: extra.isNew,
    isBestSeller: extra.isBestSeller,
    inStock: extra.inStock ?? true,
    tags: extra.tags ?? [fabric.toLowerCase(), category.split('-')[0], 'sitara'],
  };
}

export const seedProducts: SeedProduct[] = [
  p(1, 'Aanya Cotton Floral Suit Set', 'aanya-cotton-floral-suit', 'cotton-suits', 'Cotton', 1499, {
    isNew: true,
    occasion: ['Casual', 'Office'],
    tags: ['cotton', 'floral', 'new'],
  }),
  p(2, 'Meera Block Print Kurta Set', 'meera-block-print-kurta', 'printed-suits', 'Cotton', 1799, {
    isNew: true,
    occasion: ['Casual'],
    colors: ['Indigo', 'Mustard', 'White'],
  }),
  p(3, 'Kavya Chanderi Silk Party Suit', 'kavya-chanderi-silk-party', 'premium-collection', 'Chanderi Silk', 5499, {
    isBestSeller: true,
    occasion: ['Party', 'Festive'],
    colors: ['Royal Blue', 'Emerald', 'Wine'],
  }),
  p(4, 'Priya Georgette Office Kurta', 'priya-georgette-office-kurta', 'office-wear', 'Georgette', 3299, {
    isNew: true,
    occasion: ['Office', 'Casual'],
    colors: ['Powder Blue', 'Blush Peach', 'Grey'],
  }),
  p(5, 'Riya Designer Anarkali Set', 'riya-designer-anarkali', 'designer-suits', 'Net', 6999, {
    isBestSeller: true,
    occasion: ['Party', 'Wedding'],
    colors: ['Midnight Navy', 'Champagne Gold'],
  }),
  p(6, 'Noor Linen Everyday Suit', 'noor-linen-everyday-suit', 'everyday-wear', 'Linen', 1899, {
    isBestSeller: true,
    occasion: ['Casual', 'Office'],
    colors: ['Natural Ecru', 'Terracotta'],
    includes: ['Straight Kurta', 'Palazzo'],
  }),
  p(7, 'Radha Banarasi Bridal Lehenga', 'radha-banarasi-bridal-lehenga', 'wedding', 'Banarasi Silk', 14999, {
    occasion: ['Wedding', 'Festive'],
    colors: ['Crimson Red', 'Bridal Pink'],
    includes: ['Lehenga', 'Blouse', 'Dupatta'],
    deliveryTime: 'Dispatched in 3-5 business days. Delivery 7-10 business days.',
  }),
  p(8, 'Ishita Rayon Printed Suit', 'ishita-rayon-printed-suit', 'printed-suits', 'Rayon', 1599, {
    isNew: true,
    occasion: ['Casual'],
    colors: ['Coral Pink', 'Teal Blue'],
  }),
  p(9, 'Sonal Chiffon Festive Anarkali', 'sonal-chiffon-festive-anarkali', 'festive', 'Chiffon', 4299, {
    occasion: ['Festive', 'Party'],
    colors: ['Mauve', 'Sky Blue'],
  }),
  p(10, 'Divya Embroidered Party Suit', 'divya-embroidered-party-suit', 'party-wear', 'Georgette', 4999, {
    occasion: ['Party', 'Festive'],
    colors: ['Wine Red', 'Navy Blue'],
  }),
  p(11, 'Gulmohar Banarasi Dupatta', 'gulmohar-banarasi-dupatta', 'dupattas', 'Banarasi Silk', 1299, {
    isBestSeller: true,
    occasion: ['Festive', 'Wedding'],
    colors: ['Gold', 'Maroon'],
    sizes: ['Free Size'],
    includes: ['Dupatta'],
  }),
  p(12, 'Aarohi Cotton Palazzo Set', 'aarohi-cotton-palazzo-set', 'bottoms', 'Cotton', 799, {
    occasion: ['Casual', 'Office'],
    colors: ['White', 'Black', 'Beige'],
    includes: ['Palazzo Bottom'],
  }),
  p(13, 'Sitara Festive Combo Gift Set', 'sitara-festive-combo-gift', 'combo-sets', 'Mixed', 3499, {
    isNew: true,
    occasion: ['Festive', 'Party'],
    includes: ['Kurta', 'Bottom', 'Dupatta', 'Potli Bag'],
  }),
  p(14, 'Zara Pearl Embellished Clutch', 'zara-pearl-embellished-clutch', 'accessories', 'Silk', 899, {
    occasion: ['Party', 'Wedding'],
    colors: ['Gold', 'Silver', 'Rose Gold'],
    sizes: ['Free Size'],
    includes: ['Clutch Bag'],
    washCare: 'Wipe with soft dry cloth. Store in dust bag.',
  }),
  p(15, 'Nisha Office Straight Suit', 'nisha-office-straight-suit', 'office-wear', 'Cotton Blend', 2199, {
    occasion: ['Office', 'Casual'],
    colors: ['Navy', 'Grey', 'Maroon'],
  }),
  p(16, 'Tara Kurta Palazzo Duo', 'tara-kurta-palazzo-duo', 'kurta-sets', 'Cotton', 1999, {
    isNew: true,
    occasion: ['Casual', 'Festive'],
    colors: ['Peach', 'Mint', 'Lavender'],
  }),
  p(17, 'Isha Festive Silk Suit Set', 'isha-festive-silk-suit', 'festive', 'Silk', 5999, {
    occasion: ['Festive', 'Party', 'Wedding'],
    colors: ['Deep Wine', 'Emerald Green'],
    isBestSeller: true,
  }),
];
