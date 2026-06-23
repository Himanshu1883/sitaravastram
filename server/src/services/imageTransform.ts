import sharp from 'sharp';

export interface TransformOptions {
  width?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

const transformCache = new Map<string, { buffer: Buffer; contentType: string }>();
const MAX_CACHE_ENTRIES = 256;

function cacheKey(fileId: string, opts: TransformOptions): string {
  return `${fileId}:${opts.width ?? 0}:${opts.quality ?? 82}:${opts.format ?? 'webp'}`;
}

function trimCache() {
  if (transformCache.size <= MAX_CACHE_ENTRIES) return;
  const drop = transformCache.size - MAX_CACHE_ENTRIES;
  const keys = [...transformCache.keys()].slice(0, drop);
  keys.forEach(k => transformCache.delete(k));
}

export function isTransformableImage(contentType: string): boolean {
  return contentType.startsWith('image/') && !contentType.includes('gif') && !contentType.includes('svg');
}

export async function transformImageBuffer(
  fileId: string,
  input: Buffer,
  contentType: string,
  options: TransformOptions,
): Promise<{ buffer: Buffer; contentType: string } | null> {
  if (!isTransformableImage(contentType)) return null;
  if (!options.width && !options.format) return null;

  const opts: TransformOptions = {
    width: options.width,
    quality: Math.min(95, Math.max(40, options.quality ?? 82)),
    format: options.format ?? 'webp',
  };

  const key = cacheKey(fileId, opts);
  const cached = transformCache.get(key);
  if (cached) return cached;

  let pipeline = sharp(input, { failOn: 'none' }).rotate();
  if (opts.width) {
    pipeline = pipeline.resize({
      width: opts.width,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  if (opts.format === 'webp') {
    pipeline = pipeline.webp({ quality: opts.quality });
  } else if (opts.format === 'jpeg') {
    pipeline = pipeline.jpeg({ quality: opts.quality, mozjpeg: true });
  } else {
    pipeline = pipeline.png({ compressionLevel: 8 });
  }

  const buffer = await pipeline.toBuffer();
  const result = {
    buffer,
    contentType: opts.format === 'jpeg' ? 'image/jpeg' : opts.format === 'png' ? 'image/png' : 'image/webp',
  };
  transformCache.set(key, result);
  trimCache();
  return result;
}
