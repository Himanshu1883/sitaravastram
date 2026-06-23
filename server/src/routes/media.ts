import { Router } from 'express';
import { ApiError } from '../middleware/errorHandler.js';
import { streamFile } from '../services/gridfs.js';

const router = Router();

router.get('/:fileId', async (req, res, next) => {
  try {
    const { stream, contentType } = await streamFile(req.params.fileId);
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    stream.pipe(res);
  } catch {
    next(new ApiError(404, 'Media not found'));
  }
});

export default router;
