import type { AdminOrder, ReturnRequest } from '../../../types';

type OrderStatus = AdminOrder['status'];
type ReturnStatus = ReturnRequest['status'];

const orderStyles: Record<OrderStatus, string> = {
  placed: 'bg-blue-50 text-blue-700 ring-blue-100',
  confirmed: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  shipped: 'bg-amber-50 text-amber-700 ring-amber-100',
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
    rejected: 'bg-red-50 text-red-600 ring-red-100',
    refunded: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ring-1 ring-inset ${styles[status]}`}
    >
      {status}
    </span>
  );
}
