import type { Product } from '../types';
import type { HomepageData } from './api';
import { mediaUrl, type MediaVariant } from './media';

const preloaded = new Set<string>();
const linkPreloaded = new Set<string>();

export function preloadImageUrl(url: string | undefined) {
  if (!url || preloaded.has(url)) return;
  preloaded.add(url);
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
}

export function preloadImage(path: string | undefined, variant: MediaVariant = 'card') {
  preloadImageUrl(mediaUrl(path, variant));
}

function preloadLinkHint(url: string) {
  if (!url || linkPreloaded.has(url) || preloaded.has(url)) return;
  linkPreloaded.add(url);
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  document.head.appendChild(link);
}

function scheduleIdle(task: () => void) {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(task, { timeout: 2500 });
  } else {
    window.setTimeout(task, 50);
  }
}

/** Stagger background downloads so the main thread stays responsive. */
export function preloadMany(urls: string[], batchSize = 6) {
  const unique = [...new Set(urls.filter(Boolean))].filter(u => !preloaded.has(u));
  if (!unique.length) return;

  let index = 0;
  const pump = () => {
    const batch = unique.slice(index, index + batchSize);
    index += batchSize;
    batch.forEach(preloadImageUrl);
    if (index < unique.length) scheduleIdle(pump);
  };
  scheduleIdle(pump);
}

export function preloadHomepageImages(data: HomepageData) {
  const urls: string[] = [];
  data.heroSlides.forEach((s, i) => urls.push(mediaUrl(s.image, i === 0 ? 'hero' : 'detail')));
  data.homepageCategories.forEach(c => urls.push(mediaUrl(c.image, 'thumb')));
  data.featuredCollections?.forEach(f => urls.push(mediaUrl(f.image, 'detail')));
  data.newArrivals.forEach(p => urls.push(mediaUrl(p.images[0], 'card')));
  data.bestSellers.forEach(p => urls.push(mediaUrl(p.images[0], 'card')));

  urls.slice(0, 3).forEach(preloadLinkHint);
  preloadMany(urls);
}

/** After full catalog JSON loads — warm every product card image in the background. */
export function preloadProductCatalog(products: Product[]) {
  const urls = products.flatMap(p => {
    const first = mediaUrl(p.images[0], 'card');
    const second = p.images[1] ? mediaUrl(p.images[1], 'card') : '';
    return [first, second].filter(Boolean);
  });
  preloadMany(urls, 8);
}

/** PDP — preload detail + zoom variants for gallery switching and hover magnifier. */
export function preloadProductGallery(images: string[]) {
  const detailUrls = images.map(img => mediaUrl(img, 'detail'));
  const zoomUrls = images.map(img => mediaUrl(img, 'zoom'));
  detailUrls.slice(0, 2).forEach(preloadLinkHint);
  [...detailUrls, ...zoomUrls].forEach(preloadImageUrl);
}

export function preloadProductDetail(product: Product) {
  preloadProductGallery(product.images);
  if (product.video) preloadImageUrl(mediaUrl(product.video, 'full'));
}
