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

export function isAllowedMime(kind: MediaKind, mime: string): boolean {
  return (MEDIA_LIMITS[kind].mimeTypes as readonly string[]).includes(mime);
}
