import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Archive,
  Tag,
  Bell,
  RotateCcw,
  Layers,
  Settings,
  LayoutTemplate,
  type LucideIcon,
} from 'lucide-react';

export const ADMIN_TABS = [
  'dashboard',
  'homepage',
  'products',
  'orders',
  'inventory',
  'categories',
  'coupons',
  'marketing',
  'returns',
  'settings',
] as const;

export type AdminTab = (typeof ADMIN_TABS)[number];

export const ADMIN_TAB_LABELS: Record<AdminTab, string> = {
  dashboard: 'Dashboard',
  homepage: 'Homepage',
  products: 'Products',
  orders: 'Orders',
  inventory: 'Inventory',
  categories: 'Categories',
  coupons: 'Coupons',
  marketing: 'Marketing',
  returns: 'Returns',
  settings: 'Settings',
};

export interface SidebarItem {
  id: AdminTab;
  label: string;
  icon: LucideIcon;
  badgeKey?: 'orders' | 'returns' | 'inventory';
}

export const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'homepage', label: 'Homepage', icon: LayoutTemplate },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, badgeKey: 'orders' },
  { id: 'inventory', label: 'Inventory', icon: Archive, badgeKey: 'inventory' },
  { id: 'categories', label: 'Categories', icon: Layers },
  { id: 'coupons', label: 'Coupons', icon: Tag },
  { id: 'marketing', label: 'Marketing', icon: Bell },
  { id: 'returns', label: 'Returns', icon: RotateCcw, badgeKey: 'returns' },
  { id: 'settings', label: 'Settings', icon: Settings },
];
