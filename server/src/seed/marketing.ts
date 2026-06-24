/** Local filenames in server/src/seed/images/ for marketing (not product imageN). */

export const HERO_BANNER_FILES = [
  'hero_banner.png',
  'hero_banner (2).png',
  'hero_banner (3).png',
  'hero_banner (4).png',
  'hero_banner.png',
] as const;

/** Category slug → local image file */
export const CATEGORY_IMAGE_FILES: Record<string, string> = {
  'cotton-suits': 'single_main.png',
  'party-wear': 'single_main (1).png',
  'printed-suits': 'single_main (2).png',
  'festive': 'single_main (3).png',
  'kurta-sets': 'single_main (4).png',
  'dupattas': 'hero_banner (2).png',
  'wedding': 'hero_banner (3).png',
  'premium-collection': 'hero_banner (4).png',
  'office-wear': 'single_main (1).png',
  'designer-suits': 'single_main (3).png',
  'everyday-wear': 'single_main.png',
  'accessories': 'hero_banner (4).png',
  'bottoms': 'single_main (2).png',
  'combo-sets': 'single_main (4).png',
};

export type FeaturedHotspotSeed = {
  productSlug: string;
  x: number;
  y: number;
};

export const featuredCollectionsSeed = [
  {
    id: 1,
    imageFile: 'single_main.png',
    href: '/collections/premium-collection',
    imageAlt: 'Sitara Vastram premium silk collection',
    reverse: false,
    hotspots: [
      { productSlug: 'kavya-chanderi-silk-party', x: 58, y: 42 },
      { productSlug: 'isha-festive-silk-suit', x: 32, y: 68 },
    ] satisfies FeaturedHotspotSeed[],
  },
  {
    id: 2,
    imageFile: 'single_main (1).png',
    href: '/collections/wedding',
    imageAlt: 'Sitara Vastram wedding collection',
    reverse: true,
    hotspots: [
      { productSlug: 'radha-banarasi-bridal-lehenga', x: 52, y: 38 },
      { productSlug: 'gulmohar-banarasi-dupatta', x: 28, y: 55 },
    ] satisfies FeaturedHotspotSeed[],
  },
  {
    id: 3,
    imageFile: 'single_main (2).png',
    href: '/collections/cotton-suits',
    imageAlt: 'Sitara Vastram cotton suit collection',
    reverse: false,
    hotspots: [
      { productSlug: 'aanya-cotton-floral-suit', x: 62, y: 36 },
      { productSlug: 'noor-linen-everyday-suit', x: 38, y: 72 },
    ] satisfies FeaturedHotspotSeed[],
  },
] as const;

/** Hero banner id → product hotspots (banners 1 & 2 only) */
export const heroSlideHotspotsSeed: Record<number, FeaturedHotspotSeed[]> = {
  1: [
    { productSlug: 'aanya-cotton-floral-suit', x: 72, y: 42 },
    { productSlug: 'tara-kurta-palazzo-duo', x: 68, y: 68 },
  ],
  2: [
    { productSlug: 'sonal-chiffon-festive-anarkali', x: 70, y: 38 },
    { productSlug: 'isha-festive-silk-suit', x: 62, y: 62 },
  ],
};
