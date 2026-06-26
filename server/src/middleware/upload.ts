import multer from 'multer';
import { MEDIA_LIMITS } from '../config/mediaLimits.js';

function mimeAllowed(kind: 'image' | 'video', mime: string): boolean {
  return (MEDIA_LIMITS[kind].mimeTypes as readonly string[]).includes(mime);
}

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MEDIA_LIMITS.image.maxBytes },
  fileFilter: (_req, file, cb) => {
    if (mimeAllowed('image', file.mimetype)) cb(null, true);
    else cb(new Error('Only JPG, PNG and WebP images are allowed'));
  },
});

export const videoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MEDIA_LIMITS.video.maxBytes },
  fileFilter: (_req, file, cb) => {
    if (mimeAllowed('video', file.mimetype)) cb(null, true);
    else cb(new Error('Only MP4 and WebM videos are allowed'));
  },
});

export const mediaUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MEDIA_LIMITS.video.maxBytes },
  fileFilter: (_req, file, cb) => {
    if (mimeAllowed('image', file.mimetype) || mimeAllowed('video', file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WebP, MP4 and WebM files are allowed'));
    }
  },
});
