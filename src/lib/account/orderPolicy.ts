import type { Order } from '../../types';

export const INSTANT_CANCEL_MS = 30 * 60 * 1000;
export const RETURN_WINDOW_DAYS = 7;

const CANCELLABLE_BEFORE_SHIP: Order['status'][] = ['placed', 'confirmed', 'cancel_requested'];

export function getPlacedAt(order: Order): Date {
  const placed = order.statusHistory?.find(e => e.status === 'placed');
  if (placed?.at) return new Date(placed.at);
  return new Date(order.date);
}

export function getDeliveredAt(order: Order): Date | null {
  const delivered = order.statusHistory?.find(e => e.status === 'delivered');
  if (!delivered?.at) return null;
  return new Date(delivered.at);
}

export function minutesSincePlaced(order: Order): number {
  return (Date.now() - getPlacedAt(order).getTime()) / (60 * 1000);
}

export function canInstantCancel(order: Order): boolean {
  if (!['placed', 'confirmed'].includes(order.status)) return false;
  return Date.now() - getPlacedAt(order).getTime() <= INSTANT_CANCEL_MS;
}

export function canRequestCancel(order: Order): boolean {
  if (order.status === 'cancel_requested') return false;
  if (!CANCELLABLE_BEFORE_SHIP.includes(order.status)) return false;
  if (['shipped', 'in_transit', 'delivered', 'cancelled', 'returned'].includes(order.status)) {
    return false;
  }
  return !canInstantCancel(order);
}

export function canCancelOrder(order: Order): boolean {
  return canInstantCancel(order) || canRequestCancel(order);
}

export function daysSinceDelivered(order: Order): number | null {
  const deliveredAt = getDeliveredAt(order);
  if (!deliveredAt) return null;
  return (Date.now() - deliveredAt.getTime()) / (24 * 60 * 60 * 1000);
}

export function canReturnOrder(order: Order): boolean {
  if (order.status !== 'delivered') return false;
  const days = daysSinceDelivered(order);
  if (days === null) return true;
  return days <= RETURN_WINDOW_DAYS;
}

export function returnDaysRemaining(order: Order): number {
  const days = daysSinceDelivered(order);
  if (days === null) return RETURN_WINDOW_DAYS;
  return Math.max(0, Math.ceil(RETURN_WINDOW_DAYS - days));
}

export const CANCEL_REASONS = [
  'Ordered by mistake',
  'Found better price elsewhere',
  'Delivery taking too long',
  'Changed my mind',
  'Other',
] as const;

export const RETURN_REASONS = [
  'Wrong size',
  'Quality not as expected',
  'Received wrong item',
  'Damaged or defective',
  'Does not match description',
  'Other',
] as const;
