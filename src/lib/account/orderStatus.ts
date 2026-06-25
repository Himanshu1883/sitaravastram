import {
  ShoppingBag,
  Package,
  Truck,
  Check,
  Clock,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import type { Order, OrderStatusEvent } from '../../types';

export type OrderStatus = Order['status'];

export const CUSTOMER_TRACKING_STEPS = [
  'placed',
  'shipped',
  'in_transit',
  'delivered',
] as const;

export type CustomerTrackingStep = (typeof CUSTOMER_TRACKING_STEPS)[number];

const STEP_HISTORY_KEYS: Record<CustomerTrackingStep, OrderStatusEvent['status'][]> = {
  placed: ['placed', 'confirmed'],
  shipped: ['shipped'],
  in_transit: ['in_transit'],
  delivered: ['delivered'],
};

const STEP_ICONS: Record<CustomerTrackingStep, LucideIcon> = {
  placed: ShoppingBag,
  shipped: Package,
  in_transit: Truck,
  delivered: Check,
};

const STEP_LABEL_KEYS: Record<CustomerTrackingStep, string> = {
  placed: 'account.stepPlaced',
  shipped: 'account.stepShipped',
  in_transit: 'account.stepInTransit',
  delivered: 'account.stepDelivered',
};

function findStepEvent(
  step: CustomerTrackingStep,
  history: OrderStatusEvent[],
): OrderStatusEvent | undefined {
  for (const key of STEP_HISTORY_KEYS[step]) {
    const match = history.find(entry => entry.status === key);
    if (match) return match;
  }
  return undefined;
}

export type TrackingStepState = {
  step: CustomerTrackingStep;
  icon: LucideIcon;
  labelKey: string;
  state: 'completed' | 'current' | 'upcoming';
  at?: string;
  note?: string;
};

type StatusMeta = {
  color: string;
  icon: LucideIcon;
  labelKey: string;
};

export const ORDER_STATUS_META: Record<OrderStatus, StatusMeta> = {
  placed: {
    labelKey: 'account.statusPlaced',
    color: 'text-blue-600 bg-blue-50',
    icon: ShoppingBag,
  },
  confirmed: {
    labelKey: 'account.statusConfirmed',
    color: 'text-amber-600 bg-amber-50',
    icon: Clock,
  },
  shipped: {
    labelKey: 'account.statusShipped',
    color: 'text-orange-600 bg-orange-50',
    icon: Package,
  },
  in_transit: {
    labelKey: 'account.statusInTransit',
    color: 'text-sky-600 bg-sky-50',
    icon: Truck,
  },
  delivered: {
    labelKey: 'account.statusDelivered',
    color: 'text-emerald-600 bg-emerald-50',
    icon: Check,
  },
  cancelled: {
    labelKey: 'account.statusCancelled',
    color: 'text-red-600 bg-red-50',
    icon: XCircle,
  },
  returned: {
    labelKey: 'account.statusReturned',
    color: 'text-gray-600 bg-gray-50',
    icon: Clock,
  },
};

function statusRank(status: OrderStatus): number {
  const ranks: Record<OrderStatus, number> = {
    placed: 0,
    confirmed: 1,
    shipped: 2,
    in_transit: 3,
    delivered: 4,
    cancelled: -1,
    returned: -1,
  };
  return ranks[status];
}

const CUSTOMER_STEP_COMPLETE_AT = [1, 2, 3, 4];

export function getOrderTrackingSteps(order: Order): TrackingStepState[] {
  const history = order.statusHistory ?? [];
  const rank = statusRank(order.status);
  const isTerminal = order.status === 'cancelled' || order.status === 'returned';

  return CUSTOMER_TRACKING_STEPS.map((step, index) => {
    const event = findStepEvent(step, history);
    let state: TrackingStepState['state'] = 'upcoming';

    if (isTerminal) {
      state = event ? 'completed' : 'upcoming';
    } else if (rank >= CUSTOMER_STEP_COMPLETE_AT[index]) {
      state = 'completed';
    } else if (rank === CUSTOMER_STEP_COMPLETE_AT[index] - 1) {
      state = 'current';
    } else {
      state = 'upcoming';
    }

    return {
      step,
      icon: STEP_ICONS[step],
      labelKey: STEP_LABEL_KEYS[step],
      state,
      at: event?.at,
      note: event?.note,
    };
  });
}

export function formatTrackingDate(iso?: string, locale = 'en-IN') {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatAddressLine(address: Order['address']) {
  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean);
  return parts.join(', ');
}

export function trackingProgressPercent(order: Order): number {
  const steps = getOrderTrackingSteps(order);
  const completed = steps.filter(s => s.state === 'completed').length;
  const current = steps.some(s => s.state === 'current') ? 0.5 : 0;
  return Math.min(100, ((completed + current) / steps.length) * 100);
}
