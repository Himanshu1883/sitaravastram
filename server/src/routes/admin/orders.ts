import { Router } from 'express';
import { Order, toOrderDto } from '../../models/Order.js';
import { requireAdmin } from '../../middleware/auth.js';
import { ApiError } from '../../middleware/errorHandler.js';
import { appendStatusEvent, type OrderStatus } from '../../lib/orderTimeline.js';
import { approveCancelRequest, rejectCancelRequest } from '../../services/orderActions.js';

const router = Router();
router.use(requireAdmin);

const VALID_STATUSES: OrderStatus[] = [
  'placed',
  'confirmed',
  'cancel_requested',
  'shipped',
  'in_transit',
  'delivered',
  'cancelled',
  'returned',
];

router.get('/', async (_req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json(orders.map(o => toOrderDto(o as never)));
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status, note, trackingNumber } = req.body as {
      status?: OrderStatus;
      note?: string;
      trackingNumber?: string;
    };

    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return next(new ApiError(404, 'Order not found'));

    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber.trim() || undefined;
    }

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return next(new ApiError(400, 'Invalid order status'));
      }
      if (status !== order.status) {
        appendStatusEvent(order, status, { note: note?.trim() || undefined, updatedBy: 'admin' });
      }
    }

    await order.save();
    res.json(toOrderDto(order));
  } catch (err) {
    next(err);
  }
});

router.post('/:id/cancel/approve', async (req, res, next) => {
  try {
    const order = await approveCancelRequest(req.params.id);
    res.json(toOrderDto(order));
  } catch (err) {
    next(err);
  }
});

router.post('/:id/cancel/reject', async (req, res, next) => {
  try {
    const { note } = req.body as { note?: string };
    const order = await rejectCancelRequest(req.params.id, note);
    res.json(toOrderDto(order));
  } catch (err) {
    next(err);
  }
});

export default router;
