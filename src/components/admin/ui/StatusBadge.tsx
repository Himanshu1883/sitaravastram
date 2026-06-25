import type { AdminOrder, ReturnRequest } from '../../../types';

type OrderStatus = AdminOrder['status'];
type ReturnStatus = ReturnRequest['status'];

const orderStyles: Record<OrderStatus, string> = {
  placed: 'bg-blue-50 text-blue-700 ring-blue-100',
  confirmed: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  cancel_requested: 'bg-orange-50 text-orange-700 ring-orange-100',
  shipped: 'bg-amber-50 text-amber-700 ring-amber-100',
  in_transit: 'bg-sky-50 text-sky-700 ring-sky-100',
  delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  cancelled: 'bg-red-50 text-red-600 ring-red-100',
  returned: 'bg-gray-100 text-gray-600 ring-gray-200',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ring-1 ring-inset ${orderStyles[status]}`}
    >
      {status}
    </span>
  );
}

export function ReturnStatusBadge({ status }: { status: ReturnStatus }) {
  const styles: Record<ReturnStatus, string> = {
    pending: 'bg-amber-50 text-amber-700 ring-amber-100',
    approved: 'bg-blue-50 text-blue-700 ring-blue-100',
    pickup_scheduled: 'bg-sky-50 text-sky-700 ring-sky-100',
    picked_up: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
    received: 'bg-violet-50 text-violet-700 ring-violet-100',
    refund_initiated: 'bg-orange-50 text-orange-700 ring-orange-100',
    refunded: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    rejected: 'bg-red-50 text-red-600 ring-red-100',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ring-1 ring-inset ${styles[status]}`}
    >
      {status}
    </span>
  );
}
