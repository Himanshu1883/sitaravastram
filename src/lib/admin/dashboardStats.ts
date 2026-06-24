import type { AdminOrder, Product } from '../../types';

export interface DayRevenue {
  label: string;
  date: string;
  revenue: number;
  orders: number;
}

export function getLast7DaysRevenue(orders: AdminOrder[]): DayRevenue[] {
  const days: DayRevenue[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOrders = orders.filter(
      o => o.date === dateStr && o.status !== 'cancelled' && o.status !== 'returned',
    );
    days.push({
      label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: dateStr,
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      orders: dayOrders.length,
    });
  }
  return days;
}

export function formatINR(amount: number, compact = false): string {
  if (compact && amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (compact && amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export function getWeekRevenue(orders: AdminOrder[], weeksAgo: number): number {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - (weeksAgo + 1) * 7);
  const end = new Date(now);
  end.setDate(now.getDate() - weeksAgo * 7);

  return orders
    .filter(o => {
      if (o.status === 'cancelled' || o.status === 'returned') return false;
      const d = new Date(o.date);
      return d > start && d <= end;
    })
    .reduce((s, o) => s + o.total, 0);
}

export function countLowStock(products: Product[], threshold = 5): number {
  return products.filter(p => p.inStock && (p.stock ?? 0) <= threshold).length;
}

export function orderStatusBreakdown(orders: AdminOrder[]) {
  return {
    delivered: orders.filter(o => o.status === 'delivered').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    processing: orders.filter(o => ['placed', 'confirmed'].includes(o.status)).length,
    cancelled: orders.filter(o => o.status === 'cancelled' || o.status === 'returned').length,
  };
}
