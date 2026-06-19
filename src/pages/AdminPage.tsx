import { useState } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Archive,
  Star, Tag, BarChart3, Bell, Settings, Menu, X,
  TrendingUp, IndianRupee, ChevronRight,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'inventory', label: 'Inventory', icon: Archive },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'coupons', label: 'Coupons', icon: Tag },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const recentOrders = [
  { id: 'SV001', customer: 'Priya Sharma', product: 'Ananya Cotton Suit', status: 'delivered', amount: 2499, date: 'Dec 15' },
  { id: 'SV002', customer: 'Ananya Krishnan', product: 'Meera Silk Set', status: 'shipped', amount: 5499, date: 'Dec 14' },
  { id: 'SV003', customer: 'Meera Patel', product: 'Kavya Designer Suit', status: 'confirmed', amount: 6999, date: 'Dec 14' },
  { id: 'SV004', customer: 'Sunita Reddy', product: 'Radha Wedding Set', status: 'placed', amount: 14999, date: 'Dec 13' },
  { id: 'SV005', customer: 'Kavita Joshi', product: 'Noor Linen Kurta', status: 'delivered', amount: 1899, date: 'Dec 12' },
];

const statusStyle: Record<string, string> = {
  placed: 'bg-blue-50 text-blue-600',
  confirmed: 'bg-amber-50 text-amber-600',
  shipped: 'bg-orange-50 text-orange-700',
  delivered: 'bg-emerald-50 text-emerald-600',
  cancelled: 'bg-red-50 text-red-600',
};

const topProducts = [
  { name: 'Noor Linen Kurta', sales: 312, revenue: 592488, growth: 12 },
  { name: 'Ananya Cotton Suit', sales: 234, revenue: 584466, growth: 8 },
  { name: 'Kavya Designer Suit', sales: 201, revenue: 1405999, growth: 24 },
  { name: 'Meera Silk Set', sales: 156, revenue: 857844, growth: -3 },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const metrics = [
    { label: 'Total Revenue', value: '₹18.4L', change: '+23%', up: true, icon: IndianRupee, color: 'text-navy-700' },
    { label: 'Total Orders', value: '1,247', change: '+15%', up: true, icon: ShoppingCart, color: 'text-rosegold-500' },
    { label: 'Total Customers', value: '8,392', change: '+31%', up: true, icon: Users, color: 'text-emerald-600' },
    { label: 'Avg Order Value', value: '₹3,472', change: '-4%', up: false, icon: TrendingUp, color: 'text-amber-600' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-inter">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-navy-700 flex-shrink-0 flex flex-col transition-all duration-300 z-20`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <img src="/assets/images/sitaravastram_logo.webp" alt="Sitara" className="w-8 h-8 brightness-0 invert flex-shrink-0" />
          {sidebarOpen && <span className="font-playfair text-sm font-semibold text-white truncate">Admin Panel</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-hide">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-sm mb-1 text-sm transition-all duration-200 ${activeTab === item.id ? 'bg-rosegold-500 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <item.icon size={16} className="flex-shrink-0" />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 border-t border-white/10 text-white/60 hover:text-white transition-colors flex justify-center"
        >
          {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <h1 className="font-playfair text-xl font-semibold text-navy-700 capitalize">{activeTab}</h1>
            <p className="font-inter text-xs text-gray-500 mt-0.5">Sitara Vastram Admin · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-navy-700 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-rosegold-500 flex items-center justify-center">
              <span className="font-playfair text-sm font-bold text-white">A</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="p-6 space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map(metric => (
                <div key={metric.label} className="bg-white rounded-sm shadow-card p-5 hover:shadow-card-hover transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-sm bg-cream-100 flex items-center justify-center`}>
                      <metric.icon size={18} className={metric.color} />
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-semibold ${metric.up ? 'text-emerald-600' : 'text-red-500'}`}>
                      {metric.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {metric.change}
                    </span>
                  </div>
                  <p className="font-playfair text-2xl font-bold text-navy-700">{metric.value}</p>
                  <p className="font-inter text-xs text-gray-500 mt-1">{metric.label}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-white rounded-sm shadow-card p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-playfair text-base font-semibold text-navy-700">Revenue Overview</h3>
                  <select className="text-xs font-inter text-gray-500 border border-gray-200 rounded-sm px-2 py-1">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>This year</option>
                  </select>
                </div>
                {/* Simple bar chart */}
                <div className="flex items-end gap-3 h-32 mt-4">
                  {[65, 80, 55, 95, 75, 88, 70, 92, 60, 85, 78, 96].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-sm bg-navy-700 transition-all duration-500 hover:bg-rosegold-500"
                        style={{ height: `${h}%` }}
                      />
                      {i % 3 === 0 && <span className="text-[10px] text-gray-400">{['Jan','Feb','Mar','Apr'][Math.floor(i/3)]}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-white rounded-sm shadow-card p-5">
                <h3 className="font-playfair text-base font-semibold text-navy-700 mb-5">Order Status</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Delivered', count: 892, pct: 72, color: 'bg-emerald-400' },
                    { label: 'Shipped', count: 156, pct: 13, color: 'bg-orange-400' },
                    { label: 'Processing', count: 124, pct: 10, color: 'bg-blue-400' },
                    { label: 'Cancelled', count: 75, pct: 6, color: 'bg-red-400' },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex justify-between text-xs font-inter mb-1">
                        <span className="text-gray-700">{s.label}</span>
                        <span className="font-medium text-navy-700">{s.count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full transition-all duration-700`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-sm shadow-card p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-playfair text-base font-semibold text-navy-700">Recent Orders</h3>
                  <button className="text-xs font-inter text-rosegold-500 hover:text-navy-700 flex items-center gap-1">View all <ChevronRight size={12} /></button>
                </div>
                <div className="space-y-3">
                  {recentOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-b-0">
                      <div>
                        <p className="font-inter text-xs font-semibold text-navy-700">{order.customer}</p>
                        <p className="font-inter text-xs text-gray-500 mt-0.5">{order.product} · {order.date}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-xs font-inter font-medium px-2 py-0.5 rounded-full ${statusStyle[order.status]}`}>
                          {order.status}
                        </span>
                        <span className="font-inter text-xs font-semibold text-navy-700">₹{order.amount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-sm shadow-card p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-playfair text-base font-semibold text-navy-700">Top Products</h3>
                  <button className="text-xs font-inter text-rosegold-500 hover:text-navy-700 flex items-center gap-1">View all <ChevronRight size={12} /></button>
                </div>
                <div className="space-y-3">
                  {topProducts.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-b-0">
                      <span className="font-inter text-xs font-bold text-gray-400 w-5">#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-inter text-xs font-semibold text-navy-700 truncate">{p.name}</p>
                        <p className="font-inter text-xs text-gray-500">{p.sales} sales · ₹{p.revenue.toLocaleString('en-IN')}</p>
                      </div>
                      <span className={`flex items-center gap-0.5 text-xs font-inter font-semibold ${p.growth > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {p.growth > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(p.growth)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs placeholder */}
        {activeTab !== 'dashboard' && (
          <div className="p-6">
            <div className="bg-white rounded-sm shadow-card p-12 text-center">
              <div className="w-14 h-14 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-4">
                {(() => {
                  const item = sidebarItems.find(i => i.id === activeTab);
                  return item ? <item.icon size={24} className="text-rosegold-500" /> : null;
                })()}
              </div>
              <h3 className="font-playfair text-xl font-semibold text-navy-700 mb-2 capitalize">{activeTab} Management</h3>
              <p className="font-inter text-sm text-gray-500">This section is under development.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
