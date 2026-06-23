import { Router } from 'express';
import { Order, toOrderDto } from '../../models/Order.js';
import { requireAdmin } from '../../middleware/auth.js';
import { ApiError } from '../../middleware/errorHandler.js';

const router = Router();
router.use(requireAdmin);

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
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status: req.body.status },
      { new: true },
    );
    if (!order) return next(new ApiError(404, 'Order not found'));
    res.json(toOrderDto(order));
  } catch (err) {
    next(err);
  }
});

export default router;
