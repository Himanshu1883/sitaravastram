/** CDN / API base for media. Set VITE_CDN_URL to a Cloudflare-proxied domain for edge caching. */
export const MEDIA_BASE =
  import.meta.env.VITE_CDN_URL || import.meta.env.VITE_API_URL || '';

export type MediaVariant = 'thumb' | 'card' | 'detail' | 'hero' | 'zoom' | 'full';

const VARIANT_WIDTH: Record<MediaVariant, number | undefined> = {
  thumb: 320,
  card: 640,
  detail: 1080,
  hero: 1440,
  zoom: 1920,
  full: undefined,
};

const MEDIA_ID_RE = /\/api\/media\/([a-f0-9]{24})/i;

function buildOptimizedUrl(mediaPath: string, variant: MediaVariant): string {
  const base = MEDIA_BASE;
  const full = `${base}${mediaPath}`;

  if (variant === 'full') return full;

  const match = mediaPath.match(MEDIA_ID_RE);
  if (!match) return full;

  const width = VARIANT_WIDTH[variant];
  if (!width) return full;

  const joiner = mediaPath.includes('?') ? '&' : '?';
  return `${base}${mediaPath}${joiner}w=${width}&fmt=webp&q=82`;
}

/** Resolve catalog media path with optional WebP resize (CDN-cacheable query string). */
export function mediaUrl(path: string | undefined, variant: MediaVariant = 'card'): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (!path.startsWith('/api/')) return path;

  return buildOptimizedUrl(path, variant);
}

export function mediaUrls(paths: string[] | undefined, variant: MediaVariant = 'card'): string[] {
  return (paths ?? []).map(p => mediaUrl(p, variant)).filter(Boolean);
}
