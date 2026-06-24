export type HomepageImageSpecKey =
  | 'hero'
  | 'categoryStrip'
  | 'categoryCollageLarge'
  | 'categoryCollageSmall'
  | 'fabric'
  | 'occasion'
  | 'featured'
  | 'instagram'
  | 'reviewAvatar';

export interface HomepageImageSpec {
  label: string;
  aspect: string;
  recommended: string;
  minSize?: string;
  maxFile: string;
  format: string;
  cropTip: string;
  variant: string;
}

export const HOMEPAGE_IMAGE_SPECS: Record<HomepageImageSpecKey, HomepageImageSpec> = {
  hero: {
    label: 'Hero banner',
    aspect: '16:9 fullscreen',
    recommended: '2560×1440',
    minSize: '1920×1080',
    maxFile: '2 MB',
    format: 'WebP or JPG',
    cropTip: 'Keep the subject on the right 60%; text overlays the left third.',
    variant: 'hero (1440w)',
  },
  categoryStrip: {
    label: 'Category strip thumb',
    aspect: '1:1',
    recommended: '800×800',
    maxFile: '500 KB',
    format: 'WebP or JPG',
    cropTip: 'Show garment neckline; image uses object-top crop.',
    variant: 'card (640w)',
  },
  categoryCollageLarge: {
    label: 'Collage hero panel',
    aspect: '3:4 portrait',
    recommended: '1200×1600',
    maxFile: '1 MB',
    format: 'WebP or JPG',
    cropTip: 'Full outfit visible, top-aligned.',
    variant: 'detail (1080w)',
  },
  categoryCollageSmall: {
    label: 'Collage side panel',
    aspect: '4:5',
    recommended: '1000×1250',
    maxFile: '800 KB',
    format: 'WebP or JPG',
    cropTip: 'Same as large panels; works in smaller grid cells.',
    variant: 'card (640w)',
  },
  fabric: {
    label: 'Fabric tile',
    aspect: '1:1 circle crop',
    recommended: '800×800',
    maxFile: '500 KB',
    format: 'WebP or JPG',
    cropTip: 'Center the face or garment; displays as a circle.',
    variant: 'card (640w)',
  },
  occasion: {
    label: 'Occasion card',
    aspect: '3:4',
    recommended: '900×1200',
    maxFile: '800 KB',
    format: 'WebP or JPG',
    cropTip: 'Bottom gradient covers text area — keep faces upper-center.',
    variant: 'card (640w)',
  },
  featured: {
    label: 'Featured collection',
    aspect: '4:5 mobile / 5:6 desktop',
    recommended: '1200×1500',
    maxFile: '1.5 MB',
    format: 'WebP or JPG',
    cropTip: 'Leave hotspot zones clear for shoppable pins.',
    variant: 'detail (1080w)',
  },
  instagram: {
    label: 'Instagram tile',
    aspect: '1:1',
    recommended: '1080×1080',
    maxFile: '600 KB',
    format: 'WebP or JPG',
    cropTip: 'First two tiles span 2×2 in the grid — use strong hero shots.',
    variant: 'card (640w)',
  },
  reviewAvatar: {
    label: 'Review avatar',
    aspect: '1:1',
    recommended: '400×400',
    maxFile: '200 KB',
    format: 'WebP or JPG',
    cropTip: 'Face centered in frame.',
    variant: 'thumb (320w)',
  },
};
