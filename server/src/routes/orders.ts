import { Router } from 'express';
import { Order, toOrderDto } from '../models/Order.js';
import { requireCustomer, requireAdmin } from '../middleware/auth.js';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', requireCustomer, async (req, res, next) => {
  try {
    const phone = req.user!.phone;
    const orders = await Order.find({ $or: [{ phone }, { userId: req.user!.sub }] }).sort({ createdAt: -1 }).lean();
    res.json(orders.map(o => toOrderDto(o as never)));
  } catch (err) {
    next(err);
  }
});

router.post('/', requireCustomer, async (req, res, next) => {
  try {
    const body = req.body;
    const orderId = body.id || `SV${Date.now().toString().slice(-8)}`;
    const existing = await Order.findOne({ orderId });
    if (existing) return next(new ApiError(409, 'Order already exists'));

    const order = await Order.create({
      orderId,
      date: body.date || new Date().toISOString().split('T')[0],
      status: 'placed',
      items: body.items || [],
      subtotal: body.subtotal,
      discount: body.discount || 0,
      shipping: body.shipping || 0,
      codFee: body.codFee || 0,
      total: body.total,
      paymentMethod: body.paymentMethod,
      couponCode: body.couponCode,
      address: body.address,
      trackingNumber: body.trackingNumber || `TRK${Date.now().toString().slice(-10)}`,
      phone: req.user!.phone,
      userId: req.user!.sub,
      customer: body.address?.name || `+91 ${req.user!.phone}`,
    });
    res.status(201).json(toOrderDto(order));
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', requireAdmin, async (req, res, next) => {
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
