import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Order } from '../../types';
import AccountEmptyState from './AccountEmptyState';
import OrderCard from './OrderCard';

export default function AccountOrders({
  orders,
  isSignedIn,
  onSignIn,
  onTrackOrder,
}: {
  orders: Order[];
  isSignedIn: boolean;
  onSignIn: () => void;
  onTrackOrder: (order: Order) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <h2 className="font-heading text-2xl font-semibold text-navy-700">{t('account.orders')}</h2>

      {orders.length === 0 ? (
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
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} onTrack={() => onTrackOrder(order)} />
          ))}
        </div>
      )}
    </div>
  );
}
