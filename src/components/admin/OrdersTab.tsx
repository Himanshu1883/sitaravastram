import { useMemo, useState, Fragment } from 'react';
import {
  Search,
  FileText,
  Printer,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  MapPin,
  CreditCard,
  Banknote,
  Package,
  Loader2,
} from 'lucide-react';
import type { AdminData, AdminApi } from '../../hooks/useAdminApi';
import type { AdminOrder } from '../../types';
import { mediaUrl } from '../../lib/api';
import { formatINR } from '../../lib/admin/dashboardStats';
import AdminPageHeader from './ui/AdminPageHeader';
import AdminCard from './ui/AdminCard';
import AdminModal from './ui/AdminModal';
import { OrderStatusBadge } from './ui/StatusBadge';

const ALL_STATUSES = 'all' as const;
type StatusFilter = typeof ALL_STATUSES | AdminOrder['status'];

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: ALL_STATUSES, label: 'All' },
  { value: 'placed', label: 'Placed' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'in_transit', label: 'In transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' },
];

const ORDER_STATUSES: AdminOrder['status'][] = [
  'placed',
  'confirmed',
  'shipped',
  'in_transit',
  'delivered',
  'cancelled',
  'returned',
];

function itemCount(order: AdminOrder): number {
  return order.items.reduce((s, i) => s + i.quantity, 0);
}

function PaymentBadge({ method }: { method: AdminOrder['paymentMethod'] }) {
  const isCod = method === 'cod';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${
        isCod
          ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100'
          : 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-100'
      }`}
    >
      {isCod ? <Banknote size={11} /> : <CreditCard size={11} />}
      {isCod ? 'COD' : 'Prepaid'}
    </span>
  );
}

function InvoiceContent({ order }: { order: AdminOrder }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Customer</p>
          <p className="font-medium text-navy-700">{order.customer}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Date</p>
          <p className="font-medium text-navy-700">{order.date}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Payment</p>
          <PaymentBadge method={order.paymentMethod} />
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Status</p>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream-100/60 text-left text-xs text-gray-500">
              <th className="px-4 py-2.5 font-semibold">Item</th>
              <th className="px-4 py-2.5 font-semibold">Qty</th>
              <th className="px-4 py-2.5 font-semibold text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="border-t border-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-navy-700 line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-gray-400">
                    {item.size} · {item.color}
                  </p>
                </td>
                <td className="px-4 py-3 text-gray-600 tabular-nums">{item.quantity}</td>
                <td className="px-4 py-3 text-right font-medium tabular-nums">
                  {formatINR(item.product.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl bg-cream-100/50 px-4 py-3 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatINR(order.subtotal)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span>
            <span className="tabular-nums">−{formatINR(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="tabular-nums">{formatINR(order.shipping)}</span>
        </div>
        {order.codFee > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>COD fee</span>
            <span className="tabular-nums">{formatINR(order.codFee)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-navy-700 pt-2 border-t border-gray-200/80">
          <span>Total</span>
          <span className="tabular-nums">{formatINR(order.total)}</span>
        </div>
      </div>
    </div>
  );
}

function ShippingLabelContent({ order }: { order: AdminOrder }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-gray-200 p-5 bg-white">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
        Shipping Label
      </p>
      <p className="font-heading text-lg font-semibold text-navy-700">{order.address.name}</p>
      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
        {order.address.line1}
        {order.address.line2 && <>, {order.address.line2}</>}
        <br />
        {order.address.city}, {order.address.state} — {order.address.pincode}
      </p>
      <p className="text-sm text-gray-600 mt-2">+91 {order.address.phone}</p>
      {order.trackingNumber && (
        <p className="text-xs text-rosegold-600 font-medium mt-3">
          Tracking: {order.trackingNumber}
        </p>
      )}
      <div className="mt-5 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-mono tracking-widest">
        ||||| {order.id} |||||
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">
        {itemCount(order)} item{itemCount(order) !== 1 ? 's' : ''} · {formatINR(order.total)}
      </p>
    </div>
  );
}

export default function OrdersTab({ data, api }: { data: AdminData; api: AdminApi }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(ALL_STATUSES);
  const [paymentFilter, setPaymentFilter] = useState<'all' | AdminOrder['paymentMethod']>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<AdminOrder | null>(null);
  const [labelOrder, setLabelOrder] = useState<AdminOrder | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const orders = data.orders;
    const pending = orders.filter(o => ['placed', 'confirmed'].includes(o.status)).length;
    const shipped = orders.filter(o => ['shipped', 'in_transit'].includes(o.status)).length;
    const revenue = orders
      .filter(o => o.status !== 'cancelled' && o.status !== 'returned')
      .reduce((s, o) => s + o.total, 0);
    return { total: orders.length, pending, shipped, revenue };
  }, [data.orders]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...data.orders]
      .filter(order => {
        if (statusFilter !== ALL_STATUSES && order.status !== statusFilter) return false;
        if (paymentFilter !== 'all' && order.paymentMethod !== paymentFilter) return false;
        if (!q) return true;
        return (
          order.id.toLowerCase().includes(q) ||
          order.customer.toLowerCase().includes(q) ||
          order.address.phone.includes(q) ||
          order.address.name.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [data.orders, search, statusFilter, paymentFilter]);

  const updateStatus = async (
    order: AdminOrder,
    status: AdminOrder['status'],
  ) => {
    if (status === order.status) return;
    if (
      (status === 'cancelled' || status === 'returned') &&
      !window.confirm(`Mark order #${order.id} as ${status}?`)
    ) {
      return;
    }
    const note =
      status === 'shipped' || status === 'in_transit' || status === 'delivered'
        ? window.prompt('Optional note for the customer (courier update, etc.):') ?? undefined
        : undefined;
    setUpdatingId(order.id);
    try {
      await api.updateOrderStatus(order.id, { status, note: note || undefined });
    } finally {
      setUpdatingId(null);
    }
  };

  const saveTracking = async (order: AdminOrder, trackingNumber: string) => {
    if (trackingNumber === (order.trackingNumber ?? '')) return;
    setUpdatingId(order.id);
    try {
      await api.updateOrderStatus(order.id, { trackingNumber });
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      <AdminPageHeader
        title="Orders"
        description="Manage fulfillment, payments, and shipping for every order."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: 'Total orders', value: stats.total.toLocaleString('en-IN'), icon: ShoppingBag },
          { label: 'Pending', value: stats.pending.toLocaleString('en-IN'), icon: Package },
          { label: 'In transit', value: stats.shipped.toLocaleString('en-IN'), icon: MapPin },
          { label: 'Revenue', value: formatINR(stats.revenue, true), icon: CreditCard },
        ].map(stat => (
          <AdminCard key={stat.label} padding="sm" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center flex-shrink-0">
              <stat.icon size={18} strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-navy-700 tabular-nums leading-tight">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 truncate">{stat.label}</p>
            </div>
          </AdminCard>
        ))}
      </div>

      <AdminCard padding="none" className="overflow-hidden mb-4">
        <div className="p-4 sm:p-5 border-b border-gray-100 space-y-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by order ID, customer, or phone…"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-cream-100/30 focus:outline-none focus:ring-2 focus:ring-rosegold-300/50 focus:border-rosegold-400 transition-shadow"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                type="button"
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  statusFilter === f.value
                    ? 'bg-navy-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Payment:</span>
            {(['all', 'razorpay', 'cod'] as const).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPaymentFilter(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                  paymentFilter === p
                    ? 'bg-rosegold-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80'
                }`}
              >
                {p === 'all' ? 'All' : p === 'cod' ? 'COD' : 'Prepaid'}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <ShoppingBag size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="font-heading text-base font-semibold text-navy-700 mb-1">
              {data.orders.length === 0 ? 'No orders yet' : 'No matching orders'}
            </p>
            <p className="text-sm text-gray-500">
              {data.orders.length === 0
                ? 'Orders will appear here once customers checkout.'
                : 'Try adjusting your search or filters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table w-full">
              <thead>
                <tr>
                  <th className="w-10" />
                  <th>Order</th>
                  <th>Customer</th>
                  <th className="hidden md:table-cell">Date</th>
                  <th className="hidden lg:table-cell">Items</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th className="text-right">Total</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => {
                  const expanded = expandedId === order.id;
                  const isUpdating = updatingId === order.id;
                  return (
                    <Fragment key={order.id}>
                      <tr className={expanded ? 'bg-cream-100/40' : undefined}>
                        <td>
                          <button
                            type="button"
                            onClick={() => toggleExpand(order.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-navy-700 hover:bg-white transition-colors"
                            aria-label={expanded ? 'Collapse' : 'Expand'}
                          >
                            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>
                        <td>
                          <span className="font-semibold text-sm text-navy-700">#{order.id}</span>
                        </td>
                        <td>
                          <p className="text-sm text-gray-700 max-w-[140px] truncate">
                            {order.customer}
                          </p>
                          <p className="text-xs text-gray-400 md:hidden">{order.date}</p>
                        </td>
                        <td className="hidden md:table-cell text-sm text-gray-500">{order.date}</td>
                        <td className="hidden lg:table-cell text-sm text-gray-600 tabular-nums">
                          {itemCount(order)}
                        </td>
                        <td>
                          <PaymentBadge method={order.paymentMethod} />
                        </td>
                        <td>
                          <div className="relative inline-flex items-center gap-1.5">
                            {isUpdating && (
                              <Loader2 size={14} className="animate-spin text-gray-400" />
                            )}
                            <select
                              value={order.status}
                              disabled={isUpdating}
                              onChange={e =>
                                updateStatus(order, e.target.value as AdminOrder['status'])
                              }
                              className="text-xs font-medium capitalize rounded-lg border border-gray-200 bg-white pl-2 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-rosegold-300/50 disabled:opacity-60 cursor-pointer"
                            >
                              {ORDER_STATUSES.map(s => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="text-right text-sm font-semibold text-navy-700 tabular-nums">
                          {formatINR(order.total)}
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setInvoiceOrder(order)}
                              title="Invoice"
                              className="p-2 rounded-lg text-gray-500 hover:text-navy-700 hover:bg-cream-100 transition-colors"
                            >
                              <FileText size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setLabelOrder(order)}
                              title="Shipping label"
                              className="p-2 rounded-lg text-gray-500 hover:text-navy-700 hover:bg-cream-100 transition-colors"
                            >
                              <Printer size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expanded && (
                        <tr className="bg-cream-100/30">
                          <td colSpan={9} className="!px-5 !py-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                  Line items
                                </p>
                                <ul className="space-y-2">
                                  {order.items.map((item, i) => (
                                    <li
                                      key={i}
                                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-gray-100"
                                    >
                                      {item.product.images?.[0] ? (
                                        <img
                                          src={mediaUrl(item.product.images[0])}
                                          alt=""
                                          className="w-12 h-14 object-cover rounded-lg flex-shrink-0"
                                        />
                                      ) : (
                                        <div className="w-12 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                          <Package size={16} className="text-gray-300" />
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-navy-700 truncate">
                                          {item.product.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          {item.size} · {item.color} · Qty {item.quantity}
                                        </p>
                                      </div>
                                      <p className="text-sm font-semibold text-navy-700 tabular-nums">
                                        {formatINR(item.product.price * item.quantity)}
                                      </p>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                  Shipping address
                                </p>
                                <div className="p-4 rounded-xl bg-white border border-gray-100 text-sm">
                                  <p className="font-semibold text-navy-700">{order.address.name}</p>
                                  <p className="text-gray-600 mt-1 leading-relaxed">
                                    {order.address.line1}
                                    {order.address.line2 && <>, {order.address.line2}</>}
                                    <br />
                                    {order.address.city}, {order.address.state} —{' '}
                                    {order.address.pincode}
                                  </p>
                                  <p className="text-gray-500 mt-2">+91 {order.address.phone}</p>
                                  <div className="flex flex-wrap gap-2 mt-4">
                                    <OrderStatusBadge status={order.status} />
                                    <PaymentBadge method={order.paymentMethod} />
                                  </div>
                                  <form
                                    className="mt-4 pt-4 border-t border-gray-100"
                                    onSubmit={e => {
                                      e.preventDefault();
                                      const fd = new FormData(e.currentTarget);
                                      saveTracking(order, String(fd.get('tracking') ?? ''));
                                    }}
                                  >
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                                      Tracking number
                                    </label>
                                    <div className="flex gap-2">
                                      <input
                                        name="tracking"
                                        defaultValue={order.trackingNumber ?? ''}
                                        className="input-field text-sm flex-1"
                                        placeholder="TRK1234567890"
                                      />
                                      <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="btn-primary text-xs whitespace-nowrap"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </form>
                                  {order.statusHistory && order.statusHistory.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                        Status timeline
                                      </p>
                                      <ul className="space-y-2">
                                        {order.statusHistory.map((entry, idx) => (
                                          <li
                                            key={`${entry.status}-${entry.at}-${idx}`}
                                            className="text-xs text-gray-600"
                                          >
                                            <span className="font-semibold capitalize text-navy-700">
                                              {entry.status.replace('_', ' ')}
                                            </span>
                                            {' · '}
                                            {new Date(entry.at).toLocaleString('en-IN')}
                                            {entry.note && (
                                              <span className="block text-rosegold-600 mt-0.5">
                                                {entry.note}
                                              </span>
                                            )}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredOrders.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filteredOrders.length} of {data.orders.length} orders
          </div>
        )}
      </AdminCard>

      <AdminModal
        open={!!invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
        title={invoiceOrder ? `Invoice #${invoiceOrder.id}` : ''}
        subtitle={invoiceOrder?.customer}
        size="lg"
        footer={
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-primary text-sm w-full sm:w-auto"
          >
            Print Invoice
          </button>
        }
      >
        {invoiceOrder && <InvoiceContent order={invoiceOrder} />}
      </AdminModal>

      <AdminModal
        open={!!labelOrder}
        onClose={() => setLabelOrder(null)}
        title={labelOrder ? `Shipping Label` : ''}
        subtitle={labelOrder ? `Order #${labelOrder.id}` : ''}
        size="sm"
        footer={
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-primary text-sm w-full sm:w-auto"
          >
            Print Label
          </button>
        }
      >
        {labelOrder && <ShippingLabelContent order={labelOrder} />}
      </AdminModal>
    </div>
  );
}
