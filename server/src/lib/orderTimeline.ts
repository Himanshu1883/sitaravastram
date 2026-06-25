import type { IOrder } from '../models/Order.js';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'cancel_requested'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type StatusHistoryEntry = {
  status: OrderStatus;
  at: Date;
  note?: string;
  updatedBy?: 'admin' | 'system';
};

export function normalizeStatusHistory(
  doc: IOrder & { createdAt?: Date; statusHistory?: StatusHistoryEntry[] },
): StatusHistoryEntry[] {
  if (doc.statusHistory?.length) {
    return doc.statusHistory.map(entry => ({
      status: entry.status,
      at: entry.at instanceof Date ? entry.at : new Date(entry.at),
      note: entry.note,
      updatedBy: entry.updatedBy,
    }));
  }
  return buildLegacyStatusHistory(doc);
}

export function buildLegacyStatusHistory(
  doc: IOrder & { createdAt?: Date },
): StatusHistoryEntry[] {
  const at = doc.createdAt ?? new Date(doc.date);
  const events: StatusHistoryEntry[] = [
    { status: 'placed', at, updatedBy: 'system' },
  ];

  if (doc.status === 'cancelled' || doc.status === 'returned' || doc.status === 'cancel_requested') {
    events.push({ status: doc.status, at, updatedBy: 'system' });
    return events;
  }

  const progression: OrderStatus[] = [
    'placed',
    'confirmed',
    'shipped',
    'in_transit',
    'delivered',
  ];
  const idx = progression.indexOf(doc.status as OrderStatus);
  if (idx <= 0) return events;

  for (let i = 1; i <= idx; i += 1) {
    events.push({ status: progression[i], at, updatedBy: 'system' });
  }
  return events;
}

export function serializeStatusHistory(history: StatusHistoryEntry[]) {
  return history.map(entry => ({
    status: entry.status,
    at: entry.at.toISOString(),
    note: entry.note,
    updatedBy: entry.updatedBy ?? 'system',
  }));
}

export function appendStatusEvent(
  order: IOrder & { statusHistory?: StatusHistoryEntry[] },
  status: OrderStatus,
  options: { note?: string; updatedBy?: 'admin' | 'system' } = {},
) {
  if (!order.statusHistory) order.statusHistory = [];
  const last = order.statusHistory[order.statusHistory.length - 1];
  if (last?.status === status) return;

  order.statusHistory.push({
    status,
    at: new Date(),
    note: options.note,
    updatedBy: options.updatedBy ?? 'admin',
  });
  order.status = status;
}
