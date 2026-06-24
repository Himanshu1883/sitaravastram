import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import Logo from '../../ui/Logo';
import { clearSession, selectAuthUser } from '../../../store/authSlice';
import {
  sidebarItems,
  ADMIN_TAB_LABELS,
  type AdminTab,
  type SidebarItem,
} from '../adminNav';

export interface AdminBadges {
  orders?: number;
  returns?: number;
  inventory?: number;
}

interface AdminShellProps {
  activeTab: AdminTab;
  badges?: AdminBadges;
  children: ReactNode;
}

function userInitials(name?: string, email?: string, phone?: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  if (phone) return phone.slice(-2);
  return 'AD';
}

function userDisplayName(name?: string, email?: string, phone?: string): string {
  if (name?.trim()) return name;
  if (email) return email.split('@')[0];
  if (phone) return `+91 ${phone}`;
  return 'Admin';
}

export default function AdminShell({ activeTab, badges = {}, children }: AdminShellProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearSession());
    navigate('/admin/login', { replace: true });
  };

  const goToTab = (id: AdminTab) => {
    navigate(`/admin/${id}`);
    setMobileOpen(false);
  };

  const badgeFor = (key?: SidebarItem['badgeKey']) => {
    if (!key) return 0;
    return badges[key] ?? 0;
  };

  const sidebarContent = (
    <>
      <div
        className={`flex items-center gap-3 border-b border-white/[0.08] ${
          collapsed ? 'justify-center px-2 py-5' : 'px-5 py-5'
        }`}
      >
        <Logo size="sm" variant="emblem" />
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-heading text-sm font-semibold text-white truncate">
              Sitara Admin
            </p>
            <p className="text-[10px] uppercase tracking-widest text-rosegold-400/90">
              Control Panel
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 admin-scrollbar">
        {sidebarItems.map(item => {
          const active = activeTab === item.id;
          const count = badgeFor(item.badgeKey);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => goToTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`relative flex items-center w-full rounded-xl text-sm font-medium transition-all duration-200 ${
                collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'
              } ${
                active
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-white/60 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-rosegold-500" />
              )}
              <item.icon size={18} strokeWidth={1.75} className="flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  {count > 0 && (
                    <span className="min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full bg-rosegold-500 text-[10px] font-bold text-white">
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </>
              )}
              {collapsed && count > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rosegold-500" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.08] p-3 space-y-1">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-white/[0.04]">
            <div className="w-9 h-9 rounded-full bg-rosegold-500/20 text-rosegold-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {userInitials(user.name, user.email, user.phone)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {userDisplayName(user.name, user.email, user.phone)}
              </p>
              <p className="text-[11px] text-white/45 truncate capitalize">{user.role}</p>
            </div>
          </div>
        )}

        <Link
          to="/"
          className={`flex items-center rounded-xl text-sm text-white/60 hover:bg-white/[0.06] hover:text-white transition-colors ${
            collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
          }`}
        >
          <ExternalLink size={16} className="flex-shrink-0" />
          {!collapsed && <span>View Store</span>}
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className={`flex items-center w-full rounded-xl text-sm text-white/60 hover:bg-red-500/15 hover:text-red-200 transition-colors ${
            collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
          }`}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>

        <button
          type="button"
          onClick={() => setCollapsed(c => !c)}
          className="hidden lg:flex items-center justify-center w-full py-2 mt-1 text-white/40 hover:text-white/80 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </>
  );

  const todayLabel = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="admin-shell flex min-h-svh bg-[#F0EDE8]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-navy-900/60 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 admin-sidebar transition-[width] duration-300 sticky top-0 h-svh z-30 ${
          collapsed ? 'w-[4.5rem]' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Sidebar — mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col admin-sidebar transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
        {sidebarContent}
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="admin-topbar sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl text-navy-700 hover:bg-white/80 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-0.5">
                <span>Admin</span>
                <span>/</span>
                <span className="text-rosegold-600 font-medium">
                  {ADMIN_TAB_LABELS[activeTab]}
                </span>
              </div>
              <h1 className="font-heading text-lg sm:text-xl font-semibold text-navy-700 capitalize truncate">
                {ADMIN_TAB_LABELS[activeTab]}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <p className="hidden md:block text-xs text-gray-400 max-w-[200px] truncate">
              {todayLabel}
            </p>
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-navy-100 text-navy-700 bg-white hover:border-rosegold-300 hover:text-rosegold-600 transition-colors"
            >
              <ExternalLink size={14} />
              Store
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-gray-200 text-gray-600 bg-white hover:border-red-200 hover:text-red-600 transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
