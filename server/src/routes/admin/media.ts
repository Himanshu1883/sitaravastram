import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import { mediaUpload } from '../../middleware/upload.js';
import { uploadBuffer, mediaUrl, deleteFile } from '../../services/gridfs.js';
import { ApiError } from '../../middleware/errorHandler.js';

const router = Router();
router.use(requireAdmin);

router.post('/', mediaUpload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return next(new ApiError(400, 'No file uploaded'));
    const kind = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    const fileId = await uploadBuffer(req.file.buffer, req.file.originalname, req.file.mimetype, {
      kind,
      uploadedBy: 'admin',
    });
    res.status(201).json({ fileId, url: mediaUrl(fileId) });
  } catch (err) {
    next(err);
  }
});

router.delete('/:fileId', async (req, res, next) => {
  try {
    await deleteFile(req.params.fileId);
    res.json({ success: true });
  } catch (err) {
    next(new ApiError(404, 'File not found'));
  }
});

export default router;
