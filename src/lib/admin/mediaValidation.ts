import type { ProductCustomFieldType } from '../../types';

export const MEDIA_LIMITS = {
  image: {
    maxBytes: 5 * 1024 * 1024,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
    accept: 'image/jpeg,image/png,image/webp',
    label: 'JPG, PNG or WebP · max 5MB',
  },
  video: {
    maxBytes: 30 * 1024 * 1024,
    mimeTypes: ['video/mp4', 'video/webm'] as const,
    accept: 'video/mp4,video/webm',
    label: 'MP4 or WebM · max 30MB',
  },
} as const;

export type MediaKind = keyof typeof MEDIA_LIMITS;

export function validateMediaFile(
  file: File,
  kind: MediaKind,
): { ok: true } | { ok: false; error: string } {
  const limits = MEDIA_LIMITS[kind];
  const allowed = limits.mimeTypes as readonly string[];
  if (!allowed.includes(file.type)) {
    return { ok: false, error: `Invalid format. Use ${limits.label}.` };
  }
  if (file.size > limits.maxBytes) {
    const mb = Math.round(limits.maxBytes / (1024 * 1024));
    return { ok: false, error: `File too large. Maximum size is ${mb}MB.` };
  }
  return { ok: true };
}

export function defaultValueForFieldType(
  type: ProductCustomFieldType,
): string | number | boolean | string[] {
  switch (type) {
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'list':
      return [];
    default:
      return '';
  }
}
