import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectWishlistIds } from '../store/wishlistSlice';
import {
  clearSession,
  openAuthModal,
  selectAuth,
  selectIsAdmin,
  selectIsUser,
} from '../store/authSlice';
import { clearNotifications } from '../store/notificationSlice';
import { fetchOrders } from '../lib/api';
import { useProducts } from '../hooks/useCatalog';
import { useNotifications } from '../hooks/useNotifications';
import { addressesFromOrders } from '../lib/account/addresses';
import AccountShell, { userDisplayName, userInitial } from '../components/account/AccountShell';
import { isAccountTab, type AccountTab } from '../components/account/accountNav';
import AccountDashboard from '../components/account/AccountDashboard';
import AccountOrders from '../components/account/AccountOrders';
import AccountWishlist from '../components/account/AccountWishlist';
import AccountAddresses from '../components/account/AccountAddresses';
import AccountSettings from '../components/account/AccountSettings';
import AccountNotifications from '../components/account/AccountNotifications';
import OrderTrackModal from '../components/account/OrderTrackModal';
import CancelOrderModal from '../components/account/CancelOrderModal';
import ReturnOrderModal from '../components/account/ReturnOrderModal';
import OrderInvoiceModal from '../components/invoice/OrderInvoiceModal';
import type { Order } from '../types';

export default function AccountPage() {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [trackOrder, setTrackOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [cancelOrderTarget, setCancelOrderTarget] = useState<Order | null>(null);
  const [returnOrderTarget, setReturnOrderTarget] = useState<Order | null>(null);
  const [apiOrders, setApiOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const wishlistIds = useSelector(selectWishlistIds);
  const auth = useSelector(selectAuth);
  const isUser = useSelector(selectIsUser);
  const isAdmin = useSelector(selectIsAdmin);
  const { products } = useProducts();
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));
  const { refresh: refreshNotifications } = useNotifications();

  const activeTab: AccountTab = isAccountTab(tab) ? tab : 'dashboard';

  const loadOrders = useCallback(() => {
    if (!isUser) {
      setApiOrders([]);
      return Promise.resolve();
    }
    setOrdersLoading(true);
    return fetchOrders()
      .then(setApiOrders)
      .catch(() => setApiOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [isUser]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const addresses = useMemo(() => addressesFromOrders(apiOrders), [apiOrders]);

  const isSignedIn = auth.user !== null;
  const displayName = userDisplayName(
    auth.user?.name,
    auth.user?.phone,
    t('account.guest'),
  );
  const initial = userInitial(auth.user?.name, auth.user?.phone);
  const subtitle = isUser
    ? t('account.verifiedOtp')
    : t('account.guestSubtitle');

  const handleOrderUpdated = (updated: Order) => {
    setApiOrders(prev => prev.map(o => (o.id === updated.id ? updated : o)));
    setTrackOrder(prev => (prev?.id === updated.id ? updated : prev));
    refreshNotifications();
  };

  const handleReturnSuccess = () => {
    loadOrders();
    refreshNotifications();
  };

  const openCancel = (order: Order) => {
    setCancelOrderTarget(order);
    setTrackOrder(null);
  };

  const openReturn = (order: Order) => {
    setReturnOrderTarget(order);
    setTrackOrder(null);
  };

  const handleLogout = () => {
    dispatch(clearSession());
    dispatch(clearNotifications());
    navigate('/');
  };

  const handleSignIn = () => {
    dispatch(openAuthModal(`/account/${activeTab}`));
  };

  const orderActions = {
    onCancel: openCancel,
    onReturn: openReturn,
  };

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (!tab) {
    return <Navigate to="/account/dashboard" replace />;
  }

  if (!isAccountTab(tab)) {
    return <Navigate to="/account/dashboard" replace />;
  }

  const renderTab = () => {
    if (ordersLoading && activeTab !== 'wishlist' && activeTab !== 'settings' && activeTab !== 'notifications') {
      return (
        <div className="rounded-2xl border border-rosegold-100/70 bg-white p-10 text-center shadow-[0_10px_36px_rgba(27,42,74,0.05)]">
          <p className="font-body text-sm text-gray-500">{t('account.loading')}</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <AccountDashboard
            orders={apiOrders}
            wishlistCount={wishlistIds.length}
            isSignedIn={isSignedIn}
            onSignIn={handleSignIn}
            onTrackOrder={setTrackOrder}
            onViewInvoice={setInvoiceOrder}
            {...orderActions}
          />
        );
      case 'orders':
        return (
          <AccountOrders
            orders={apiOrders}
            isSignedIn={isSignedIn}
            onSignIn={handleSignIn}
            onTrackOrder={setTrackOrder}
            onViewInvoice={setInvoiceOrder}
            {...orderActions}
          />
        );
      case 'wishlist':
        return <AccountWishlist products={wishlistProducts} />;
      case 'addresses':
        return <AccountAddresses addresses={addresses} />;
      case 'notifications':
        return <AccountNotifications />;
      case 'settings':
        return <AccountSettings user={auth.user} isSignedIn={isSignedIn} />;
      default:
        return null;
    }
  };

  return (
    <>
      <AccountShell
        activeTab={activeTab}
        displayName={displayName}
        subtitle={subtitle}
        initial={initial}
        isSignedIn={isSignedIn}
        onSignIn={handleSignIn}
        onLogout={handleLogout}
      >
        {renderTab()}
      </AccountShell>

      {trackOrder && (
        <OrderTrackModal
          order={trackOrder}
          onClose={() => setTrackOrder(null)}
          onViewInvoice={() => {
            setInvoiceOrder(trackOrder);
            setTrackOrder(null);
          }}
          onCancel={() => openCancel(trackOrder)}
          onReturn={() => openReturn(trackOrder)}
        />
      )}

      {cancelOrderTarget && (
        <CancelOrderModal
          order={cancelOrderTarget}
          onClose={() => setCancelOrderTarget(null)}
          onSuccess={handleOrderUpdated}
        />
      )}

      {returnOrderTarget && (
        <ReturnOrderModal
          order={returnOrderTarget}
          onClose={() => setReturnOrderTarget(null)}
          onSuccess={handleReturnSuccess}
        />
      )}

      <OrderInvoiceModal
        order={invoiceOrder}
        customerName={auth.user?.name}
        onClose={() => setInvoiceOrder(null)}
      />
    </>
  );
}
