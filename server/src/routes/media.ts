import { Router } from 'express';
import { ApiError } from '../middleware/errorHandler.js';
import { readFileBuffer, streamFile } from '../services/gridfs.js';
import { transformImageBuffer } from '../services/imageTransform.js';

const router = Router();

router.get('/:fileId', async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const hasWidth = req.query.w !== undefined && String(req.query.w).length > 0;
    const hasFmt = req.query.fmt !== undefined;
    const width = hasWidth
      ? Math.min(2400, Math.max(1, parseInt(String(req.query.w), 10) || 640))
      : 0;
    const quality = Math.min(95, Math.max(40, parseInt(String(req.query.q ?? ''), 10) || 82));
    const fmtRaw = String(req.query.fmt ?? 'webp').toLowerCase();
    const format = fmtRaw === 'jpeg' || fmtRaw === 'jpg' ? 'jpeg' : fmtRaw === 'png' ? 'png' : 'webp';

    const needsTransform = hasWidth || hasFmt;

    if (!needsTransform) {
      const { stream, contentType } = await streamFile(fileId);
      res.set('Content-Type', contentType);
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
      stream.pipe(res);
      return;
    }

    const { buffer, contentType } = await readFileBuffer(fileId);
    const transformed = await transformImageBuffer(fileId, buffer, contentType, {
      width: width || undefined,
      quality,
      format,
    });

    if (transformed) {
      res.set('Content-Type', transformed.contentType);
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
      res.set('Vary', 'Accept');
      res.send(transformed.buffer);
      return;
    }

    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(buffer);
  } catch {
    next(new ApiError(404, 'Media not found'));
  }
});

export default router;
