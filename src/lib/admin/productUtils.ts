import type { Product } from '../../types';

export const LOW_STOCK_THRESHOLD = 5;

export function emptyProduct(): Product {
  return {
    id: Date.now().toString(),
    name: '',
    slug: '',
    price: 0,
    images: [],
    category: 'cotton-suits',
    fabric: 'Cotton',
    occasion: ['Casual'],
    colors: ['Ivory'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    showColorSelector: false,
    showSizeSelector: false,
    rating: 4.5,
    reviewCount: 0,
    description: '',
    details: [],
    includes: ['Kurta', 'Dupatta', 'Bottom'],
    washCare: 'Machine wash cold.',
    deliveryTime: '4-7 business days.',
    returnPolicy: '7-day returns.',
    sku: '',
    inStock: true,
    tags: [],
    stock: 10,
    customFields: [],
  };
}

export type StockLevel = 'out' | 'low' | 'ok';

export function stockLevel(stock: number | undefined, inStock: boolean): StockLevel {
  const qty = stock ?? 0;
  if (!inStock || qty === 0) return 'out';
  if (qty <= LOW_STOCK_THRESHOLD) return 'low';
  return 'ok';
}

export function stockLevelLabel(level: StockLevel): string {
  if (level === 'out') return 'Out of stock';
  if (level === 'low') return 'Low stock';
  return 'In stock';
}

export function productStats(products: Product[]) {
  const inStock = products.filter(p => p.inStock && (p.stock ?? 0) > 0).length;
  const outOfStock = products.filter(p => !p.inStock || (p.stock ?? 0) === 0).length;
  const lowStock = products.filter(
    p => p.inStock && (p.stock ?? 0) > 0 && (p.stock ?? 0) <= LOW_STOCK_THRESHOLD,
  ).length;
  return { total: products.length, inStock, outOfStock, lowStock };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}
