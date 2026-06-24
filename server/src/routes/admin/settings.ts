import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import {
  getAdminSettings,
  updateAdminProfile,
  changeAdminPassword,
} from '../../services/auth.js';
import { ApiError } from '../../middleware/errorHandler.js';

const router = Router();

router.use(requireAdmin);

router.get('/', async (req, res, next) => {
  try {
    const settings = await getAdminSettings(req.user!);
    res.json(settings);
  } catch (err) {
    next(err instanceof Error ? new ApiError(400, err.message) : err);
  }
});

router.patch('/profile', async (req, res, next) => {
  try {
    const { name, email } = req.body as { name?: string; email?: string };
    if (!name?.trim()) return next(new ApiError(400, 'Name is required'));
    const user = await updateAdminProfile(req.user!, { name, email });
    res.json({ user });
  } catch (err) {
    next(err instanceof Error ? new ApiError(400, err.message) : err);
  }
});

router.patch('/password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };
    if (!currentPassword || !newPassword) {
      return next(new ApiError(400, 'Current and new password are required'));
    }
    await changeAdminPassword(req.user!.sub, currentPassword, newPassword);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err instanceof Error ? new ApiError(400, err.message) : err);
  }
});

export default router;
