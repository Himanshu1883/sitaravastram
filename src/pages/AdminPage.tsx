import { useState } from 'react';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  LayoutDashboard, Package, ShoppingCart, Archive,
  Tag, Bell, Menu, X, RotateCcw, Layers, Store, LogOut,
} from 'lucide-react';
import { useAdminApi } from '../hooks/useAdminApi';
import { clearSession } from '../store/authSlice';
import DashboardTab from '../components/admin/DashboardTab';
import ProductsTab from '../components/admin/ProductsTab';
import OrdersTab from '../components/admin/OrdersTab';
import InventoryTab from '../components/admin/InventoryTab';
import CategoriesTab from '../components/admin/CategoriesTab';
import CouponsTab from '../components/admin/CouponsTab';
import MarketingTab from '../components/admin/MarketingTab';
import ReturnsTab from '../components/admin/ReturnsTab';
import Logo from '../components/ui/Logo';

export const ADMIN_TABS = [
  'dashboard',
  'products',
  'orders',
  'inventory',
  'categories',
  'coupons',
  'marketing',
  'returns',
] as const;

export type AdminTab = (typeof ADMIN_TABS)[number];

const sidebarItems: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'inventory', label: 'Inventory', icon: Archive },
  { id: 'categories', label: 'Categories', icon: Layers },
  { id: 'coupons', label: 'Coupons', icon: Tag },
  { id: 'marketing', label: 'Marketing', icon: Bell },
  { id: 'returns', label: 'Returns', icon: RotateCcw },
];

export default function AdminPage() {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const admin = useAdminApi();

  const activeTab: AdminTab = ADMIN_TABS.includes(tab as AdminTab) ? (tab as AdminTab) : 'dashboard';

  if (tab && !ADMIN_TABS.includes(tab as AdminTab)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const renderTab = () => {
    if (admin.loading) {
      return <div className="p-8 text-sm text-gray-500">Loading admin data…</div>;
    }
    if (admin.error) {
      return <div className="p-8 text-sm text-red-600">{admin.error}</div>;
    }
    switch (activeTab) {
      case 'dashboard': return <DashboardTab data={admin.data} />;
      case 'products': return <ProductsTab data={admin.data} api={admin} />;
      case 'orders': return <OrdersTab data={admin.data} api={admin} />;
      case 'inventory': return <InventoryTab data={admin.data} api={admin} />;
      case 'categories': return <CategoriesTab data={admin.data} api={admin} />;
      case 'coupons': return <CouponsTab data={admin.data} api={admin} />;
      case 'marketing': return <MarketingTab data={admin.data} api={admin} />;
      case 'returns': return <ReturnsTab data={admin.data} api={admin} />;
      default: return <DashboardTab data={admin.data} />;
    }
  };

  const handleLogout = () => {
    dispatch(clearSession());
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-[calc(100svh-var(--navbar-h))] bg-gray-50 font-body">
      <aside
        className={`${
          sidebarOpen ? 'w-60' : 'w-16'
        } bg-navy-700 flex-shrink-0 flex flex-col transition-all duration-300 z-20 sticky top-[var(--navbar-h)] h-[calc(100svh-var(--navbar-h))]`}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <Logo size="sm" variant="emblem" />
          {sidebarOpen && (
            <span className="font-heading text-sm font-semibold text-white truncate">Admin Panel</span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-hide">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(`/admin/${item.id}`)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-sm mb-1 text-sm transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-rosegold-500 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon size={16} className="flex-shrink-0" />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-2 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-sm text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Store size={16} className="flex-shrink-0" />
            {sidebarOpen && <span>View Store</span>}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-sm text-sm text-white/70 hover:bg-red-500/20 hover:text-red-200 transition-colors"
          >
            <LogOut size={16} className="flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-center w-full py-2 text-white/50 hover:text-white transition-colors"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-[var(--navbar-h)] z-10 shadow-sm">
          <div>
            <h1 className="font-heading text-xl font-semibold text-navy-700 capitalize">{activeTab}</h1>
            <p className="font-body text-xs text-gray-500 mt-0.5">
              Sitara Vastram Admin ·{' '}
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-rosegold-200 rounded-sm text-navy-700 hover:border-rosegold-500 transition-colors"
            >
              <Store size={14} />
              Store
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-gray-200 rounded-sm text-gray-600 hover:border-red-200 hover:text-red-600 transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{renderTab()}</main>
      </div>
    </div>
  );
}
