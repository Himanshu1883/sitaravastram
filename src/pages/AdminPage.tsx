import { useState } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Archive,
  Tag, Bell, Menu, X, RotateCcw, Layers,
} from 'lucide-react';
import { useAdminData } from '../hooks/useAdminData';
import DashboardTab from '../components/admin/DashboardTab';
import ProductsTab from '../components/admin/ProductsTab';
import OrdersTab from '../components/admin/OrdersTab';
import InventoryTab from '../components/admin/InventoryTab';
import CategoriesTab from '../components/admin/CategoriesTab';
import CouponsTab from '../components/admin/CouponsTab';
import MarketingTab from '../components/admin/MarketingTab';
import ReturnsTab from '../components/admin/ReturnsTab';

const sidebarItems = [
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data, update } = useAdminData();

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab data={data} />;
      case 'products': return <ProductsTab data={data} update={update} />;
      case 'orders': return <OrdersTab data={data} update={update} />;
      case 'inventory': return <InventoryTab data={data} update={update} />;
      case 'categories': return <CategoriesTab data={data} update={update} />;
      case 'coupons': return <CouponsTab data={data} update={update} />;
      case 'marketing': return <MarketingTab data={data} update={update} />;
      case 'returns': return <ReturnsTab data={data} update={update} />;
      default: return <DashboardTab data={data} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-inter">
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-navy-700 flex-shrink-0 flex flex-col transition-all duration-300 z-20`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <img src="/assets/images/sitaravastram_logo.webp" alt="Sitara" className="w-8 h-8 brightness-0 invert flex-shrink-0" />
          {sidebarOpen && <span className="font-playfair text-sm font-semibold text-white truncate">Admin Panel</span>}
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-hide">
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-sm mb-1 text-sm transition-all duration-200 ${activeTab === item.id ? 'bg-rosegold-500 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
              <item.icon size={16} className="flex-shrink-0" />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-4 border-t border-white/10 text-white/60 hover:text-white transition-colors flex justify-center">
          {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </aside>

      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <h1 className="font-playfair text-xl font-semibold text-navy-700 capitalize">{activeTab}</h1>
            <p className="font-inter text-xs text-gray-500 mt-0.5">Sitara Vastram Admin · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </header>
        {renderTab()}
      </div>
    </div>
  );
}
