import type { Product } from '../types';

export function searchProducts(query: string, catalog: Product[]): Product[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];

  return catalog.filter(p => {
    const haystack = [
      p.name,
      p.description,
      p.fabric,
      p.category,
      ...p.tags,
      ...p.occasion,
      ...p.colors,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(term);
  });
}
