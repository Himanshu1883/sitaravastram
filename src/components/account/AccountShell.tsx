import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import { ACCOUNT_NAV, type AccountTab } from './accountNav';

function userInitial(name?: string, phone?: string) {
  return (name || phone || 'G').charAt(0).toUpperCase();
}

function userDisplayName(name?: string, phone?: string, guestLabel?: string) {
  if (name?.trim()) return name.trim();
  if (phone) return `+91 ${phone}`;
  return guestLabel ?? 'Guest';
}

export default function AccountShell({
  activeTab,
  children,
  displayName,
  subtitle,
  initial,
  isSignedIn,
  onSignIn,
  onLogout,
}: {
  activeTab: AccountTab;
  children: ReactNode;
  displayName: string;
  subtitle: string;
  initial: string;
  isSignedIn: boolean;
  onSignIn: () => void;
  onLogout: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-6 rounded-2xl border border-rosegold-100/70 bg-white p-5 shadow-[0_10px_36px_rgba(27,42,74,0.05)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-rosegold-500 ring-4 ring-rosegold-100 sm:h-16 sm:w-16">
                <span className="font-heading text-xl font-bold text-white sm:text-2xl">
                  {initial}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-body text-xs font-medium uppercase tracking-[0.2em] text-rosegold-500">
                  {t('nav.myAccount')}
                </p>
                <h1 className="truncate font-heading text-xl font-semibold text-navy-700 sm:text-2xl">
                  {isSignedIn ? t('account.welcomeBack', { name: displayName }) : displayName}
                </h1>
                <p className="font-body text-sm text-gray-500">{subtitle}</p>
              </div>
            </div>

            {isSignedIn ? (
              <button
                type="button"
                onClick={onLogout}
                className="btn-outline-navy flex-shrink-0 text-xs"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">{t('account.logout')}</span>
              </button>
            ) : (
              <button type="button" onClick={onSignIn} className="btn-primary flex-shrink-0 text-xs">
                {t('account.signIn')}
              </button>
            )}
          </div>
        </header>

        <nav
          className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden"
          aria-label={t('account.profile')}
        >
          {ACCOUNT_NAV.map(item => (
            <Link
              key={item.id}
              to={`/account/${item.id}`}
              className={`whitespace-nowrap rounded-full px-4 py-2 font-body text-xs font-semibold transition-colors ${
                activeTab === item.id
                  ? 'bg-navy-700 text-white'
                  : 'border border-rosegold-100 bg-white text-navy-700 hover:border-rosegold-300'
              }`}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <nav
              className="sticky top-24 overflow-hidden rounded-2xl border border-rosegold-100/70 bg-white shadow-[0_10px_36px_rgba(27,42,74,0.05)]"
              aria-label={t('account.profile')}
            >
              {ACCOUNT_NAV.map(item => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <Link
                    key={item.id}
                    to={`/account/${item.id}`}
                    className={`flex items-center gap-3 border-b border-rosegold-50 px-5 py-4 font-body text-sm font-medium transition-colors last:border-b-0 ${
                      active
                        ? 'border-l-[3px] border-l-rosegold-500 bg-cream-50 text-navy-700'
                        : 'text-gray-600 hover:bg-cream-50 hover:text-navy-700'
                    }`}
                  >
                    <Icon size={16} className={active ? 'text-rosegold-500' : 'text-gray-400'} />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}

export { userInitial, userDisplayName };
