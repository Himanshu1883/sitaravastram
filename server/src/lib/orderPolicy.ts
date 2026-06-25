import type { IOrder } from '../models/Order.js';
import type { OrderStatus } from './orderTimeline.js';

export const INSTANT_CANCEL_MS = 30 * 60 * 1000;
export const RETURN_WINDOW_DAYS = 7;

const CANCELLABLE_BEFORE_SHIP: OrderStatus[] = ['placed', 'confirmed', 'cancel_requested'];

export function getPlacedAt(order: IOrder & { createdAt?: Date }): Date {
  const placed = order.statusHistory?.find(e => e.status === 'placed');
  if (placed?.at) return placed.at instanceof Date ? placed.at : new Date(placed.at);
  if (order.createdAt) return order.createdAt;
  return new Date(order.date);
}

export function getDeliveredAt(order: IOrder): Date | null {
  const delivered = order.statusHistory?.find(e => e.status === 'delivered');
  if (!delivered?.at) return null;
  return delivered.at instanceof Date ? delivered.at : new Date(delivered.at);
}

export function minutesSincePlaced(order: IOrder & { createdAt?: Date }): number {
  return (Date.now() - getPlacedAt(order).getTime()) / (60 * 1000);
}

export function canInstantCancel(order: IOrder & { createdAt?: Date }): boolean {
  if (!['placed', 'confirmed'].includes(order.status)) return false;
  return Date.now() - getPlacedAt(order).getTime() <= INSTANT_CANCEL_MS;
}

export function canRequestCancel(order: IOrder & { createdAt?: Date }): boolean {
  if (order.status === 'cancel_requested') return false;
  if (!CANCELLABLE_BEFORE_SHIP.includes(order.status)) return false;
  if (['shipped', 'in_transit', 'delivered', 'cancelled', 'returned'].includes(order.status)) {
    return false;
  }
  return !canInstantCancel(order);
}

export function canCancelOrder(order: IOrder & { createdAt?: Date }): boolean {
  return canInstantCancel(order) || canRequestCancel(order);
}

export function daysSinceDelivered(order: IOrder): number | null {
  const deliveredAt = getDeliveredAt(order);
  if (!deliveredAt) return null;
  return (Date.now() - deliveredAt.getTime()) / (24 * 60 * 60 * 1000);
}

export function canReturnOrder(order: IOrder): boolean {
  if (order.status !== 'delivered') return false;
  const days = daysSinceDelivered(order);
  if (days === null) {
    const fallback = order.createdAt ? (Date.now() - order.createdAt.getTime()) / (24 * 60 * 60 * 1000) : 999;
    return fallback <= RETURN_WINDOW_DAYS;
  }
  return days <= RETURN_WINDOW_DAYS;
}

export function returnDaysRemaining(order: IOrder): number {
  const days = daysSinceDelivered(order);
  if (days === null) return RETURN_WINDOW_DAYS;
  return Math.max(0, Math.ceil(RETURN_WINDOW_DAYS - days));
}
