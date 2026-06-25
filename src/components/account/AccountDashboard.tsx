import { Link } from 'react-router-dom';
import { ArrowRight, Package, Heart, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Order } from '../../types';
import AccountStatCard from './AccountStatCard';
import AccountEmptyState from './AccountEmptyState';
import OrderCard from './OrderCard';

export default function AccountDashboard({
  orders,
  wishlistCount,
  isSignedIn,
  onSignIn,
  onTrackOrder,
}: {
  orders: Order[];
  wishlistCount: number;
  isSignedIn: boolean;
  onSignIn: () => void;
  onTrackOrder: (order: Order) => void;
}) {
  const { t } = useTranslation();
  const delivered = orders.filter(o => o.status === 'delivered').length;
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-6">
      {!isSignedIn && (
        <div className="rounded-2xl border border-rosegold-200/80 bg-gradient-to-br from-cream-50 to-white p-6 shadow-[0_10px_36px_rgba(27,42,74,0.05)]">
          <p className="font-heading text-lg font-semibold text-navy-700">
            {t('account.guestTitle')}
          </p>
          <p className="mt-1 font-body text-sm text-gray-600">{t('account.guestSubtitle')}</p>
          <button type="button" onClick={onSignIn} className="btn-primary mt-4">
            {t('account.signInOtp')}
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <AccountStatCard label={t('account.totalOrders')} value={orders.length} />
        <AccountStatCard label={t('account.delivered')} value={delivered} tone="emerald" />
        <AccountStatCard label={t('account.wishlist')} value={wishlistCount} tone="rosegold" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Link to="/account/orders" className="btn-outline-navy text-xs">
          <Package size={14} />
          {t('account.orders')}
        </Link>
        <Link to="/account/wishlist" className="btn-outline-navy text-xs">
          <Heart size={14} />
          {t('account.wishlist')}
        </Link>
        <Link to="/collections/new-arrivals" className="btn-link text-xs">
          <Sparkles size={14} />
          {t('account.shopNewArrivals')}
          <ArrowRight size={14} />
        </Link>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold text-navy-700">
            {t('account.recentOrders')}
          </h2>
          {orders.length > 0 && (
            <Link to="/account/orders" className="btn-link text-xs">
              {t('account.viewAll')}
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <AccountEmptyState
            icon={<Package size={28} />}
            title={t('account.noOrders')}
            description={isSignedIn ? t('account.noOrdersSubtitle') : t('account.signInForOrders')}
            action={
              isSignedIn ? (
                <Link to="/collections" className="btn-primary">
                  {t('account.startShopping')}
                </Link>
              ) : (
                <button type="button" onClick={onSignIn} className="btn-primary">
                  {t('account.signInOtp')}
                </button>
              )
            }
          />
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                compact
                onTrack={() => onTrackOrder(order)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
