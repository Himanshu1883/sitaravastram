import { Router } from 'express';
import { Notification, toNotificationDto } from '../../models/Notification.js';
import { requireAdmin } from '../../middleware/auth.js';

const router = Router();
router.use(requireAdmin);

router.get('/', async (_req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).lean();
    res.json(notifications.map(n => toNotificationDto(n as never)));
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, message, audience } = req.body;
    const notification = await Notification.create({
      legacyId: `n-${Date.now()}`,
      title,
      message,
      audience: audience || 'all',
      sentAt: new Date().toISOString(),
    });
    res.status(201).json(toNotificationDto(notification));
  } catch (err) {
    next(err);
  }
});

export default router;
