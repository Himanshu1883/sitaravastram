/** Default English homepage section copy (mirrors src/locales/en.json home.*). */
export const defaultSectionCopy = {
  newArrivals: {
    overline: 'Fresh This Week',
    title: 'New Arrivals',
    subtitle:
      'Designs crafted for the modern Indian woman — contemporary silhouettes rooted in timeless craft.',
    cta: 'View All New',
  },
  bestSellers: {
    overline: 'Most Loved',
    title: 'Best Sellers',
    subtitle:
      'The pieces our women come back for again and again — worn at home, at work, and everywhere in between.',
    cta: 'All Bestsellers',
  },
  fabric: {
    overline: 'Material Stories',
    title: 'Shop by Fabric',
    subtitle:
      'Every fabric is chosen for how it makes you feel — the weight, the drape, the whisper of cloth against skin.',
  },
  occasion: {
    overline: 'Every Moment, Every Woman',
    title: 'Shop by Occasion',
    subtitle:
      "From the quiet grace of a workday to the dazzling joy of a wedding — Sitara Vastram has a look that's yours.",
  },
  featured: {
    overline: 'Stories of Craft',
    title: 'Featured Collections',
    subtitle:
      "Every collection at Sitara Vastram tells a story rooted in India's rich textile heritage — worn by women who carry grace in every step.",
  },
  reviews: {
    overline: 'Real Stories',
    title: 'Customer Reviews',
    subtitle:
      "Thousands of women across India trust Sitara Vastram for their everyday elegance and life's biggest moments.",
    heading1: 'Get To Know',
    heading2: 'Our Customers',
  },
  instagram: {
    overline: 'Real Women · Real Style',
    handle: '@sitaravastram',
    tagline: 'Tag us in your looks using #SitaraVastram and get featured on our feed.',
    cta: 'Follow @sitaravastram',
  },
  newsletter: {
    overline: 'Join the Sitara Family',
    title1: 'Get 10% Off Your',
    title2: 'First Order',
    subtitle:
      'Subscribe for early access to new collections, exclusive festive lookbooks, styling tips, and special offers curated for the modern Indian woman.',
  },
};

export const defaultInstagramMeta = {
  handle: '@sitaravastram',
  profileUrl: 'https://www.instagram.com/sitaravastram/',
};

export const ALLOWED_HOMEPAGE_BLOCK_KEYS = [
  'fabrics',
  'occasions',
  'featuredCollections',
  'instagramPosts',
  'sectionCopy',
  'instagramMeta',
] as const;

export type HomepageBlockKey = (typeof ALLOWED_HOMEPAGE_BLOCK_KEYS)[number];
