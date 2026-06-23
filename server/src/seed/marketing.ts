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

export const featuredCollectionsSeed = [
  {
    id: 1,
    imageFile: 'single_main.png',
    href: '/collections/premium-collection',
    imageAlt: 'Sitara Vastram premium silk collection',
    reverse: false,
  },
  {
    id: 2,
    imageFile: 'single_main (1).png',
    href: '/collections/wedding',
    imageAlt: 'Sitara Vastram wedding collection',
    reverse: true,
  },
  {
    id: 3,
    imageFile: 'single_main (2).png',
    href: '/collections/cotton-suits',
    imageAlt: 'Sitara Vastram cotton suit collection',
    reverse: false,
  },
] as const;
