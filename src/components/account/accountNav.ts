import { User, Package, Heart, MapPin, Settings, type LucideIcon } from 'lucide-react';

export type AccountTab = 'dashboard' | 'orders' | 'wishlist' | 'addresses' | 'settings';

export const ACCOUNT_TABS: AccountTab[] = [
  'dashboard',
  'orders',
  'wishlist',
  'addresses',
  'settings',
];

export const ACCOUNT_NAV: { id: AccountTab; labelKey: string; icon: LucideIcon }[] = [
  { id: 'dashboard', labelKey: 'account.dashboard', icon: User },
  { id: 'orders', labelKey: 'account.orders', icon: Package },
  { id: 'wishlist', labelKey: 'account.wishlist', icon: Heart },
  { id: 'addresses', labelKey: 'account.addresses', icon: MapPin },
  { id: 'settings', labelKey: 'account.settings', icon: Settings },
];

export function isAccountTab(value: string | undefined): value is AccountTab {
  return ACCOUNT_TABS.includes(value as AccountTab);
}
