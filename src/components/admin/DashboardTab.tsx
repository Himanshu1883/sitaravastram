import { IndianRupee, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { AdminData } from '../../hooks/useAdminApi';

export default function DashboardTab({ data }: { data: AdminData }) {
  const totalRevenue = data.orders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = data.orders.filter(o => ['placed', 'confirmed'].includes(o.status)).length;
  const today = new Date().toISOString().split('T')[0];
  const todaysSales = data.orders.filter(o => o.date === today).reduce((s, o) => s + o.total, 0);

  const metrics = [
    { label: 'Total Revenue', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, change: '+23%', up: true, icon: IndianRupee, color: 'text-navy-700' },
    { label: 'Total Orders', value: data.orders.length.toLocaleString('en-IN'), change: '+15%', up: true, icon: ShoppingCart, color: 'text-rosegold-500' },
    { label: 'Pending Orders', value: pendingOrders.toString(), change: `${pendingOrders} active`, up: pendingOrders < 5, icon: Users, color: 'text-amber-600' },
    { label: "Today's Sales", value: `₹${todaysSales.toLocaleString('en-IN')}`, change: today, up: true, icon: TrendingUp, color: 'text-emerald-600' },
  ];

  const statusCounts = {
    delivered: data.orders.filter(o => o.status === 'delivered').length,
    shipped: data.orders.filter(o => o.status === 'shipped').length,
    processing: data.orders.filter(o => ['placed', 'confirmed'].includes(o.status)).length,
    cancelled: data.orders.filter(o => o.status === 'cancelled').length,
  };
  const total = data.orders.length || 1;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(metric => (
          <div key={metric.label} className="bg-white rounded-sm shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-sm bg-cream-100 flex items-center justify-center"><metric.icon size={18} className={metric.color} /></div>
              <span className={`flex items-center gap-1 text-xs font-semibold ${metric.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {metric.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{metric.change}
              </span>
            </div>
            <p className="font-heading text-2xl font-bold text-navy-700">{metric.value}</p>
            <p className="font-body text-xs text-gray-500 mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-sm shadow-card p-5">
          <h3 className="font-heading text-base font-semibold text-navy-700 mb-5">Revenue Overview</h3>
          <div className="flex items-end gap-3 h-32">
            {[65, 80, 55, 95, 75, 88, 70, 92, 60, 85, 78, 96].map((h, i) => (
              <div key={i} className="flex-1"><div className="w-full rounded-sm bg-navy-700 hover:bg-rosegold-500 transition-colors" style={{ height: `${h}%` }} /></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-sm shadow-card p-5">
          <h3 className="font-heading text-base font-semibold text-navy-700 mb-5">Order Status</h3>
          {[
            { label: 'Delivered', count: statusCounts.delivered, color: 'bg-emerald-400' },
            { label: 'Shipped', count: statusCounts.shipped, color: 'bg-orange-400' },
            { label: 'Processing', count: statusCounts.processing, color: 'bg-blue-400' },
            { label: 'Cancelled', count: statusCounts.cancelled, color: 'bg-red-400' },
          ].map(s => (
            <div key={s.label} className="mb-3">
              <div className="flex justify-between text-xs mb-1"><span>{s.label}</span><span className="font-medium">{s.count}</span></div>
              <div className="h-2 bg-gray-100 rounded-full"><div className={`h-full ${s.color} rounded-full`} style={{ width: `${(s.count / total) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-card p-5">
        <h3 className="font-heading text-base font-semibold text-navy-700 mb-5">Recent Orders</h3>
        <div className="space-y-3">
          {data.orders.slice(0, 5).map(order => (
            <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-xs font-semibold text-navy-700">{order.customer}</p>
                <p className="text-xs text-gray-500">#{order.id} · {order.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 capitalize">{order.status}</span>
                <span className="text-xs font-semibold">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
