import { Router } from 'express';
import { requireCustomer } from '../middleware/auth.js';
import {
  UserNotification,
  toUserNotificationDto,
} from '../models/UserNotification.js';

const router = Router();

router.get('/', requireCustomer, async (req, res, next) => {
  try {
    const userId = req.user!.sub;
    const notifications = await UserNotification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json(notifications.map(n => toUserNotificationDto(n as never)));
  } catch (err) {
    next(err);
  }
});

router.get('/unread-count', requireCustomer, async (req, res, next) => {
  try {
    const count = await UserNotification.countDocuments({
      userId: req.user!.sub,
      read: false,
    });
    res.json({ count });
  } catch (err) {
    next(err);
  }
});

router.patch('/read-all', requireCustomer, async (req, res, next) => {
  try {
    await UserNotification.updateMany(
      { userId: req.user!.sub, read: false },
      { read: true },
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/read', requireCustomer, async (req, res, next) => {
  try {
    const note = await UserNotification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.sub },
      { read: true },
      { new: true },
    );
    if (!note) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }
    res.json(toUserNotificationDto(note));
  } catch (err) {
    next(err);
  }
});

export default router;
