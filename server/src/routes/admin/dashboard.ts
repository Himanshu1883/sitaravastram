import { Router } from 'express';
import { Product } from '../../models/Product.js';
import { Order } from '../../models/Order.js';
import { Coupon } from '../../models/Coupon.js';
import { ReturnRequest } from '../../models/Return.js';
import { requireAdmin } from '../../middleware/auth.js';

const router = Router();
router.use(requireAdmin);

router.get('/', async (_req, res, next) => {
  try {
    const [productCount, orderCount, lowStock, revenue, recentOrders, returnsCount] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments({ stock: { $lte: 5 }, inStock: true }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.find().sort({ createdAt: -1 }).limit(5).lean(),
      ReturnRequest.countDocuments({ status: 'pending' }),
    ]);

    res.json({
      metrics: {
        products: productCount,
        orders: orderCount,
        lowStock,
        revenue: revenue[0]?.total ?? 0,
        pendingReturns: returnsCount,
      },
      recentOrders: recentOrders.map(o => ({
        id: o.orderId,
        date: o.date,
        status: o.status,
        customer: o.customer,
        total: o.total,
      })),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
