import { featuredCollectionsSeed } from '../seed/marketing.js';

export interface FeaturedCollectionDto {
  id: number;
  href: string;
  imageAlt: string;
  reverse: boolean;
  image: string;
}

type CategoryImage = { slug: string; image?: string };

/** Use HomepageBlock data when present; otherwise build from category images already in DB. */
export function resolveFeaturedCollections(
  blockData: unknown,
  categories: CategoryImage[],
): FeaturedCollectionDto[] {
  if (Array.isArray(blockData) && blockData.length > 0) {
    return blockData as FeaturedCollectionDto[];
  }

  const catBySlug = Object.fromEntries(categories.map(c => [c.slug, c]));

  const items: FeaturedCollectionDto[] = [];

  for (const f of featuredCollectionsSeed) {
    const slug = f.href.replace('/collections/', '');
    const image = catBySlug[slug]?.image;
    if (!image) continue;
    items.push({
      id: f.id,
      href: f.href,
      imageAlt: f.imageAlt,
      reverse: f.reverse,
      image,
    });
  }

  return items;
}

export const featuredCollectionSlugs = featuredCollectionsSeed.map(f =>
  f.href.replace('/collections/', ''),
);
