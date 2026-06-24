import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IndianRupee,
  ShoppingCart,
  Package,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import type { AdminData } from '../../hooks/useAdminApi';
import AdminPageHeader from './ui/AdminPageHeader';
import StatCard from './ui/StatCard';
import AdminCard from './ui/AdminCard';
import { OrderStatusBadge } from './ui/StatusBadge';
import {
  getLast7DaysRevenue,
  formatINR,
  percentChange,
  getWeekRevenue,
  countLowStock,
  orderStatusBreakdown,
} from '../../lib/admin/dashboardStats';

export default function DashboardTab({ data }: { data: AdminData }) {
  const navigate = useNavigate();

  const validOrders = useMemo(
    () => data.orders.filter(o => o.status !== 'cancelled' && o.status !== 'returned'),
    [data.orders],
  );

  const totalRevenue = useMemo(
    () => validOrders.reduce((s, o) => s + o.total, 0),
    [validOrders],
  );

  const pendingOrders = useMemo(
    () => data.orders.filter(o => ['placed', 'confirmed'].includes(o.status)).length,
    [data.orders],
  );

  const today = new Date().toISOString().split('T')[0];
  const todaysSales = useMemo(
    () =>
      data.orders
        .filter(o => o.date === today && o.status !== 'cancelled')
        .reduce((s, o) => s + o.total, 0),
    [data.orders, today],
  );

  const weekRevenue = getWeekRevenue(data.orders, 0);
  const lastWeekRevenue = getWeekRevenue(data.orders, 1);
  const revenueChange = percentChange(weekRevenue, lastWeekRevenue);

  const thisWeekOrders = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return data.orders.filter(o => new Date(o.date) > start).length;
  }, [data.orders]);

  const lastWeekOrders = useMemo(() => {
    const end = new Date();
    end.setDate(end.getDate() - 7);
    const start = new Date();
    start.setDate(start.getDate() - 14);
    return data.orders.filter(o => {
      const d = new Date(o.date);
      return d > start && d <= end;
    }).length;
  }, [data.orders]);

  const ordersChange = percentChange(thisWeekOrders, lastWeekOrders);

  const chartData = useMemo(() => getLast7DaysRevenue(data.orders), [data.orders]);
  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);

  const statusCounts = orderStatusBreakdown(data.orders);
  const totalOrders = data.orders.length || 1;
  const lowStock = countLowStock(data.products);

  const statusRows = [
    { label: 'Delivered', count: statusCounts.delivered, color: 'bg-emerald-500', pct: 0 },
    { label: 'Shipped', count: statusCounts.shipped, color: 'bg-amber-400', pct: 0 },
    { label: 'Processing', count: statusCounts.processing, color: 'bg-blue-500', pct: 0 },
    { label: 'Cancelled', count: statusCounts.cancelled, color: 'bg-red-400', pct: 0 },
  ].map(s => ({ ...s, pct: (s.count / totalOrders) * 100 }));

  const recentOrders = data.orders.slice(0, 8);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      <AdminPageHeader
        title="Overview"
        description="Welcome back — here's what's happening with your store today."
        actions={
          <>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-navy-700 text-white hover:bg-rosegold-500 transition-colors"
            >
              <Plus size={14} />
              Add Product
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/orders')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-navy-200 text-navy-700 bg-white hover:border-rosegold-400 transition-colors"
            >
              View Orders
              <ArrowRight size={14} />
            </button>
          </>
        }
      />

      {lowStock > 0 && (
        <button
          type="button"
          onClick={() => navigate('/admin/inventory')}
          className="w-full mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100 text-left hover:bg-amber-100/80 transition-colors"
        >
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-900">
              {lowStock} product{lowStock !== 1 ? 's' : ''} running low on stock
            </p>
            <p className="text-xs text-amber-700/80">Review inventory before items go out of stock</p>
          </div>
          <ArrowRight size={16} className="text-amber-600 flex-shrink-0" />
        </button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 sm:mb-8">
        <StatCard
          label="Total Revenue"
          value={formatINR(totalRevenue, true)}
          hint={`${validOrders.length} completed orders`}
          change={revenueChange}
          icon={IndianRupee}
          accent="navy"
        />
        <StatCard
          label="Total Orders"
          value={data.orders.length.toLocaleString('en-IN')}
          hint={`${pendingOrders} awaiting fulfillment`}
          change={ordersChange}
          icon={ShoppingCart}
          accent="rose"
        />
        <StatCard
          label="Products"
          value={data.products.length.toLocaleString('en-IN')}
          changeLabel={`${data.categories.length} categories`}
          icon={Package}
          accent="amber"
        />
        <StatCard
          label="Today's Sales"
          value={formatINR(todaysSales)}
          changeLabel={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          icon={TrendingUp}
          accent="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 sm:mb-8">
        <AdminCard className="lg:col-span-2" padding="md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading text-base font-semibold text-navy-700">
                Revenue — Last 7 Days
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Week total: {formatINR(weekRevenue)}
              </p>
            </div>
          </div>
          <div className="flex items-end gap-2 sm:gap-3 h-36 sm:h-44">
            {chartData.map(day => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full flex items-end justify-center h-full">
                  <div
                    className="w-full max-w-[3rem] rounded-t-lg bg-gradient-to-t from-navy-700 to-navy-500 group-hover:from-rosegold-600 group-hover:to-rosegold-400 transition-all duration-300 min-h-[4px]"
                    style={{ height: `${Math.max((day.revenue / maxRevenue) * 100, day.revenue > 0 ? 8 : 2)}%` }}
                    title={`${formatINR(day.revenue)} · ${day.orders} orders`}
                  />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-400 font-medium">{day.label}</span>
              </div>
            ))}
          </div>
          {chartData.every(d => d.revenue === 0) && (
            <p className="text-center text-xs text-gray-400 mt-4">No sales recorded in the last 7 days</p>
          )}
        </AdminCard>

        <AdminCard padding="md">
          <h3 className="font-heading text-base font-semibold text-navy-700 mb-1">Order Status</h3>
          <p className="text-xs text-gray-400 mb-6">{data.orders.length} total orders</p>
          <div className="space-y-4">
            {statusRows.map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">{s.label}</span>
                  <span className="font-semibold text-navy-700 tabular-nums">
                    {s.count}
                    <span className="text-gray-400 font-normal ml-1">
                      ({s.pct.toFixed(0)}%)
                    </span>
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.color} rounded-full transition-all duration-500`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      <AdminCard padding="none" className="overflow-hidden">
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-semibold text-navy-700">Recent Orders</h3>
            <p className="text-xs text-gray-400 mt-0.5">Latest activity across your store</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-rosegold-600 hover:text-rosegold-700 flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <ShoppingCart size={32} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table w-full">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th className="hidden sm:table-cell">Date</th>
                  <th>Status</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>
                      <span className="font-semibold text-navy-700 text-sm">#{order.id}</span>
                    </td>
                    <td className="text-sm text-gray-600 max-w-[140px] truncate">
                      {order.customer}
                    </td>
                    <td className="hidden sm:table-cell text-sm text-gray-400">{order.date}</td>
                    <td>
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="text-right text-sm font-semibold text-navy-700 tabular-nums">
                      {formatINR(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
