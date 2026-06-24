import { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAdminApi } from '../hooks/useAdminApi';
import AdminShell from '../components/admin/ui/AdminShell';
import { AdminDashboardSkeleton, AdminErrorState } from '../components/admin/ui/AdminSkeleton';
import DashboardTab from '../components/admin/DashboardTab';
import ProductsTab from '../components/admin/ProductsTab';
import OrdersTab from '../components/admin/OrdersTab';
import InventoryTab from '../components/admin/InventoryTab';
import CategoriesTab from '../components/admin/CategoriesTab';
import CouponsTab from '../components/admin/CouponsTab';
import MarketingTab from '../components/admin/MarketingTab';
import ReturnsTab from '../components/admin/ReturnsTab';
import SettingsTab from '../components/admin/SettingsTab';
import HomepageTab from '../components/admin/HomepageTab';
import { ADMIN_TABS, type AdminTab } from '../components/admin/adminNav';

export { ADMIN_TABS, type AdminTab };

export default function AdminPage() {
  const { tab } = useParams<{ tab: string }>();
  const admin = useAdminApi();

  const activeTab: AdminTab = ADMIN_TABS.includes(tab as AdminTab)
    ? (tab as AdminTab)
    : 'dashboard';

  if (tab && !ADMIN_TABS.includes(tab as AdminTab)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const badges = useMemo(
    () => ({
      orders: admin.data.orders.filter(o => ['placed', 'confirmed'].includes(o.status)).length,
      returns: admin.data.returns.filter(r => r.status === 'pending').length,
      inventory: admin.data.products.filter(p => p.inStock && (p.stock ?? 0) <= 5).length,
    }),
    [admin.data],
  );

  const renderTab = () => {
    if (activeTab === 'settings' || activeTab === 'homepage') {
      if (activeTab === 'settings') return <SettingsTab />;
      return <HomepageTab />;
    }
    if (admin.loading) {
      return activeTab === 'dashboard' ? (
        <AdminDashboardSkeleton />
      ) : (
        <div className="p-8">
          <AdminDashboardSkeleton />
        </div>
      );
    }
    if (admin.error) {
      return <AdminErrorState message={admin.error} />;
    }
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab data={admin.data} />;
      case 'products':
        return <ProductsTab data={admin.data} api={admin} />;
      case 'orders':
        return <OrdersTab data={admin.data} api={admin} />;
      case 'inventory':
        return <InventoryTab data={admin.data} api={admin} />;
      case 'categories':
        return <CategoriesTab data={admin.data} api={admin} />;
      case 'coupons':
        return <CouponsTab data={admin.data} api={admin} />;
      case 'marketing':
        return <MarketingTab data={admin.data} api={admin} />;
      case 'returns':
        return <ReturnsTab data={admin.data} api={admin} />;
      default:
        return <DashboardTab data={admin.data} />;
    }
  };

  return (
    <AdminShell activeTab={activeTab} badges={badges}>
      {renderTab()}
    </AdminShell>
  );
}
