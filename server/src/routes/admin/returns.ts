import { Router } from 'express';
import { ReturnRequest, toReturnDto } from '../../models/Return.js';
import { requireAdmin } from '../../middleware/auth.js';
import { ApiError } from '../../middleware/errorHandler.js';
import { notifyUser } from '../../lib/notifyUser.js';
import { Order } from '../../models/Order.js';
import { appendStatusEvent } from '../../lib/orderTimeline.js';

const router = Router();
router.use(requireAdmin);

router.get('/', async (_req, res, next) => {
  try {
    const returns = await ReturnRequest.find().sort({ createdAt: -1 }).lean();
    res.json(returns.map(r => toReturnDto(r as never)));
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const ret = await ReturnRequest.findOne({ legacyId: req.params.id });
    if (!ret) return next(new ApiError(404, 'Return request not found'));

    const prevStatus = ret.status;
    const { status, adminNote } = req.body as { status?: string; adminNote?: string };
    if (status) ret.status = status as typeof ret.status;
    if (adminNote !== undefined) ret.adminNote = adminNote?.trim();

    await ret.save();

    if (ret.userId && status && status !== prevStatus) {
      const typeMap: Record<string, 'return_approved' | 'return_rejected' | 'return_refunded'> = {
        approved: 'return_approved',
        pickup_scheduled: 'return_approved',
        rejected: 'return_rejected',
        refunded: 'return_refunded',
      };
      const notifType = typeMap[status];
      if (notifType) {
        const titles: Record<string, string> = {
          return_approved: 'Return approved',
          return_rejected: 'Return declined',
          return_refunded: 'Refund processed',
        };
        const messages: Record<string, string> = {
          return_approved: `Your return for order #${ret.orderId} has been approved.`,
          return_rejected: `Your return request for order #${ret.orderId} was declined.`,
          return_refunded: `Refund for order #${ret.orderId} has been processed.`,
        };
        await notifyUser({
          userId: ret.userId,
          phone: ret.phone,
          type: notifType,
          title: titles[notifType],
          message: messages[notifType],
          orderId: ret.orderId,
          returnId: ret.legacyId,
        });
      }

      if (status === 'refunded') {
        const order = await Order.findOne({ orderId: ret.orderId });
        if (order && order.status === 'delivered') {
          appendStatusEvent(order, 'returned', { note: 'Return refunded', updatedBy: 'admin' });
          order.refundStatus = 'processed';
          order.refundAmount = ret.refundAmount ?? order.total;
          await order.save();
        }
      }
    }

    res.json(toReturnDto(ret));
  } catch (err) {
    next(err);
  }
});

export default router;
