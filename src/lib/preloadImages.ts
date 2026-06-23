import { mediaUrl } from './api';
import type { HomepageData } from './api';

const preloaded = new Set<string>();

export function preloadImage(path: string | undefined) {
  const url = mediaUrl(path);
  if (!url || preloaded.has(url)) return;
  preloaded.add(url);
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
}

export function preloadHomepageImages(data: HomepageData) {
  data.heroSlides.slice(0, 2).forEach(s => preloadImage(s.image));
  data.homepageCategories.slice(0, 6).forEach(c => preloadImage(c.image));
  data.featuredCollections?.slice(0, 2).forEach(f => preloadImage(f.image));
  data.newArrivals.slice(0, 4).forEach(p => preloadImage(p.images[0]));
  data.bestSellers.slice(0, 4).forEach(p => preloadImage(p.images[0]));
}
