import { Order, type IOrder } from '../models/Order.js';
import { ReturnRequest } from '../models/Return.js';
import { appendStatusEvent } from '../lib/orderTimeline.js';
import {
  canInstantCancel,
  canRequestCancel,
  canReturnOrder,
} from '../lib/orderPolicy.js';
import { notifyUser } from '../lib/notifyUser.js';
import { ApiError } from '../middleware/errorHandler.js';

function ownsOrder(order: IOrder, user: { sub: string; phone?: string }) {
  return (
    order.userId === user.sub ||
    (user.phone != null && order.phone === user.phone)
  );
}

function statusBeforeCancelRequest(order: IOrder): 'placed' | 'confirmed' {
  const history = order.statusHistory ?? [];
  for (let i = history.length - 2; i >= 0; i -= 1) {
    const s = history[i]?.status;
    if (s === 'placed' || s === 'confirmed') return s;
  }
  return 'confirmed';
}

export async function cancelOrderForCustomer(
  orderId: string,
  user: { sub: string; phone?: string },
  reason: string,
) {
  const order = await Order.findOne({ orderId });
  if (!order) throw new ApiError(404, 'Order not found');
  if (!ownsOrder(order, user)) throw new ApiError(403, 'Forbidden');

  const trimmedReason = reason.trim();
  if (!trimmedReason) throw new ApiError(400, 'Cancellation reason is required');

  if (order.status === 'cancelled' || order.status === 'returned') {
    throw new ApiError(400, 'This order cannot be cancelled');
  }
  if (order.status === 'cancel_requested') {
    throw new ApiError(400, 'Cancellation already requested');
  }

  if (canInstantCancel(order)) {
    order.cancelReason = trimmedReason;
    order.cancelledAt = new Date();
    order.cancelledBy = 'customer';
    order.refundStatus = order.paymentMethod === 'razorpay' ? 'pending' : 'none';
    order.refundAmount = order.paymentMethod === 'razorpay' ? order.total : undefined;
    appendStatusEvent(order, 'cancelled', {
      note: trimmedReason,
      updatedBy: 'system',
    });
    await order.save();

    await notifyUser({
      userId: user.sub,
      phone: user.phone,
      type: 'cancel_instant',
      title: 'Order cancelled',
      message: `Order #${order.orderId} was cancelled. ${
        order.paymentMethod === 'razorpay'
          ? 'Refund will be processed within 5–7 business days.'
          : ''
      }`.trim(),
      orderId: order.orderId,
    });

    return order;
  }

  if (!canRequestCancel(order)) {
    throw new ApiError(400, 'This order can no longer be cancelled online');
  }

  order.cancelReason = trimmedReason;
  order.cancelRequestedAt = new Date();
  appendStatusEvent(order, 'cancel_requested', {
    note: trimmedReason,
    updatedBy: 'system',
  });
  await order.save();

  await notifyUser({
    userId: user.sub,
    phone: user.phone,
    type: 'cancel_requested',
    title: 'Cancellation requested',
    message: `We received your cancellation request for order #${order.orderId}. Our team will review it shortly.`,
    orderId: order.orderId,
  });

  return order;
}

export async function approveCancelRequest(orderId: string) {
  const order = await Order.findOne({ orderId });
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.status !== 'cancel_requested') {
    throw new ApiError(400, 'No pending cancellation for this order');
  }

  order.cancelledAt = new Date();
  order.cancelledBy = 'admin';
  order.refundStatus = order.paymentMethod === 'razorpay' ? 'pending' : 'none';
  order.refundAmount = order.paymentMethod === 'razorpay' ? order.total : undefined;
  appendStatusEvent(order, 'cancelled', {
    note: order.cancelReason,
    updatedBy: 'admin',
  });
  await order.save();

  if (order.userId) {
    await notifyUser({
      userId: order.userId,
      phone: order.phone,
      type: 'cancel_approved',
      title: 'Cancellation approved',
      message: `Your cancellation for order #${order.orderId} has been approved.${
        order.paymentMethod === 'razorpay' ? ' Refund will be initiated shortly.' : ''
      }`,
      orderId: order.orderId,
    });
  }

  return order;
}

export async function rejectCancelRequest(orderId: string, adminNote?: string) {
  const order = await Order.findOne({ orderId });
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.status !== 'cancel_requested') {
    throw new ApiError(400, 'No pending cancellation for this order');
  }

  const restoreStatus = statusBeforeCancelRequest(order);
  order.cancelRequestedAt = undefined;
  appendStatusEvent(order, restoreStatus, {
    note: adminNote?.trim() || 'Cancellation request declined',
    updatedBy: 'admin',
  });
  await order.save();

  if (order.userId) {
    await notifyUser({
      userId: order.userId,
      phone: order.phone,
      type: 'cancel_rejected',
      title: 'Cancellation declined',
      message: `Your cancellation request for order #${order.orderId} could not be approved. The order will continue processing.`,
      orderId: order.orderId,
    });
  }

  return order;
}

export async function returnOrderForCustomer(
  orderId: string,
  user: { sub: string; phone?: string },
  input: { reason: string; comment?: string },
) {
  const order = await Order.findOne({ orderId });
  if (!order) throw new ApiError(404, 'Order not found');
  if (!ownsOrder(order, user)) throw new ApiError(403, 'Forbidden');

  const trimmedReason = input.reason.trim();
  if (!trimmedReason) throw new ApiError(400, 'Return reason is required');

  if (!canReturnOrder(order)) {
    throw new ApiError(400, 'This order is not eligible for return');
  }

  const existing = await ReturnRequest.findOne({
    orderId,
    status: { $nin: ['rejected', 'refunded'] },
  });
  if (existing) throw new ApiError(409, 'A return request already exists for this order');

  const firstItem = order.items[0] as { product?: { name?: string } } | undefined;
  const productName = firstItem?.product?.name ?? 'Order items';
  const legacyId = `RET${Date.now().toString().slice(-8)}`;

  const ret = await ReturnRequest.create({
    legacyId,
    orderId: order.orderId,
    userId: user.sub,
    phone: user.phone,
    customer: order.customer ?? (order.address as { name?: string })?.name ?? `+91 ${user.phone}`,
    product: productName,
    items: order.items,
    reason: trimmedReason,
    comment: input.comment?.trim(),
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    refundAmount: order.total,
  });

  await notifyUser({
    userId: user.sub,
    phone: user.phone,
    type: 'return_submitted',
    title: 'Return requested',
    message: `We received your return request for order #${order.orderId}. Pickup will be scheduled after review.`,
    orderId: order.orderId,
    returnId: ret.legacyId,
  });

  return ret;
}
