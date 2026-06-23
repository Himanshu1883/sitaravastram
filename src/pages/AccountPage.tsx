import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { User, Package, Heart, MapPin, Settings, ChevronRight, Truck, Check, Clock, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlistIds } from '../store/wishlistSlice';
import { logout, adminLogout, openAuthModal, selectAuth } from '../store/authSlice';
import { fetchOrders } from '../lib/api';
import { useProducts } from '../hooks/useCatalog';
import ProductCard from '../components/ui/ProductCard';
import { useFormatPrice } from '../hooks/useFormatPrice';
import type { Order } from '../types';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: User },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const statusConfig = {
  placed: { label: 'Order Placed', color: 'text-blue-600 bg-blue-50', icon: Package, step: 1 },
  confirmed: { label: 'Confirmed', color: 'text-amber-600 bg-amber-50', icon: Clock, step: 2 },
  shipped: { label: 'Shipped', color: 'text-orange-600 bg-orange-50', icon: Truck, step: 3 },
  delivered: { label: 'Delivered', color: 'text-emerald-600 bg-emerald-50', icon: Check, step: 4 },
  cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-50', icon: Clock, step: 0 },
  returned: { label: 'Returned', color: 'text-gray-600 bg-gray-50', icon: Clock, step: 0 },
};

const trackingSteps = ['placed', 'confirmed', 'shipped', 'delivered'] as const;

function TrackOrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const currentStep = statusConfig[order.status]?.step || 1;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-sm shadow-luxury-lg max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl font-semibold text-navy-700">Track Order #{order.id}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-700"><X size={20} /></button>
        </div>
        {order.trackingNumber && <p className="text-xs font-body text-gray-500 mb-4">Tracking: {order.trackingNumber}</p>}
        <div className="space-y-4">
          {trackingSteps.map((step, i) => {
            const config = statusConfig[step];
            const done = currentStep >= i + 1;
            return (
              <div key={step} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <config.icon size={14} />
                </div>
                <div>
                  <p className={`font-body text-sm font-medium ${done ? 'text-navy-700' : 'text-gray-400'}`}>{config.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(tab || 'dashboard');
  const [trackOrder, setTrackOrder] = useState<Order | null>(null);
  const [apiOrders, setApiOrders] = useState<Order[]>([]);
  const wishlistIds = useSelector(selectWishlistIds);
  const auth = useSelector(selectAuth);
  const { products } = useProducts();
  const formatPrice = useFormatPrice();
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  useEffect(() => {
    if (auth.isLoggedIn) {
      fetchOrders().then(setApiOrders).catch(() => setApiOrders([]));
    } else {
      setApiOrders([]);
    }
  }, [auth.isLoggedIn]);

  const allOrders: Order[] = apiOrders;

  useEffect(() => {
    if (tab && navItems.some(n => n.id === tab)) setActiveTab(tab);
  }, [tab]);

  const displayName = auth.phone ? `+91 ${auth.phone}` : 'Priya Sharma';
  const initial = displayName.charAt(displayName.length - 1).toUpperCase();
  const isSignedIn = auth.isLoggedIn || auth.isAdmin;

  const handleLogout = () => {
    if (auth.isAdmin) dispatch(adminLogout());
    if (auth.isLoggedIn) dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-navy-700 rounded-sm p-6 mb-8 relative overflow-hidden">
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-5 min-w-0">
              <div className="w-16 h-16 rounded-full bg-rosegold-500 flex items-center justify-center flex-shrink-0">
                <span className="font-heading text-2xl font-bold text-white">{initial}</span>
              </div>
              <div className="min-w-0">
                <h1 className="font-heading text-2xl font-semibold text-white truncate">{displayName}</h1>
                <p className="font-body text-sm text-white/70">
                  {auth.isLoggedIn
                    ? 'Verified via OTP'
                    : auth.isAdmin
                      ? 'Admin session active'
                      : 'Guest · Sign in to save your orders'}
                </p>
              </div>
            </div>
            {isSignedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 text-xs font-body font-medium border border-white/30 text-white rounded-sm hover:bg-white/10 transition-colors"
              >
                <LogOut size={14} />
                Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={() => dispatch(openAuthModal('/account'))}
                className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 text-xs font-body font-medium bg-rosegold-500 text-white rounded-sm hover:bg-rosegold-600 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-sm shadow-card overflow-hidden">
              {navItems.map(item => (
                <Link key={item.id} to={`/account/${item.id}`} onClick={() => setActiveTab(item.id)} className={`flex items-center justify-between w-full px-5 py-4 text-sm font-body font-medium transition-all duration-200 border-b border-rosegold-50 last:border-b-0 ${activeTab === item.id ? 'bg-navy-700 text-white' : 'text-navy-700 hover:bg-cream-100'}`}>
                  <div className="flex items-center gap-3"><item.icon size={16} />{item.label}</div>
                  <ChevronRight size={14} />
                </Link>
              ))}
              <Link
                to={auth.isAdmin ? '/admin/dashboard' : '/admin/login'}
                className="flex items-center justify-between w-full px-5 py-3.5 text-xs font-body font-medium text-gray-500 hover:text-rosegold-600 hover:bg-cream-50 transition-colors border-t border-rosegold-100"
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard size={14} />
                  {auth.isAdmin ? 'Admin Dashboard' : 'Admin Panel'}
                </div>
                <ChevronRight size={12} />
              </Link>
              {isSignedIn && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-between w-full px-5 py-3.5 text-xs font-body font-medium text-red-500/80 hover:text-red-600 hover:bg-red-50 transition-colors border-t border-rosegold-100"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={14} />
                    Logout
                  </div>
                </button>
              )}
            </nav>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Orders', value: allOrders.length.toString(), color: 'text-navy-700' },
                    { label: 'Delivered', value: allOrders.filter(o => o.status === 'delivered').length.toString(), color: 'text-emerald-600' },
                    { label: 'Wishlist', value: wishlistIds.length.toString(), color: 'text-rosegold-500' },
                    { label: 'Points', value: '340', color: 'text-amber-600' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-sm shadow-card p-4 text-center">
                      <p className={`font-heading text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="font-body text-xs text-gray-500 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-sm shadow-card p-6">
                  <h2 className="font-heading text-lg font-semibold text-navy-700 mb-4">Recent Orders</h2>
                  {allOrders.slice(0, 3).map(order => {
                    const config = statusConfig[order.status];
                    return (
                      <div key={order.id} className="flex items-center justify-between py-3 border-b border-rosegold-50 last:border-b-0">
                        <div>
                          <p className="font-body text-sm font-medium text-navy-700">#{order.id}</p>
                          <p className="font-body text-xs text-gray-500">{order.date} · {order.items.length} items</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-body font-medium px-2.5 py-1 rounded-full ${config.color}`}>{config.label}</span>
                          <span className="font-heading text-sm font-semibold text-navy-700">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="font-heading text-2xl font-semibold text-navy-700">My Orders</h2>
                {allOrders.map(order => {
                  const config = statusConfig[order.status];
                  const firstItem = order.items[0];
                  return (
                    <div key={order.id} className="bg-white rounded-sm shadow-card p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <p className="font-body text-sm font-semibold text-navy-700">Order #{order.id}</p>
                          <p className="font-body text-xs text-gray-500">Placed on {order.date}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-body font-semibold px-3 py-1.5 rounded-full ${config.color}`}>
                          <config.icon size={12} />{config.label}
                        </span>
                      </div>
                      {firstItem && <p className="font-body text-sm text-gray-700 mb-3">{firstItem.product.name}{order.items.length > 1 ? ` and ${order.items.length - 1} more` : ''}</p>}
                      <div className="flex items-center justify-between pt-3 border-t border-rosegold-50">
                        <span className="font-heading text-base font-semibold text-navy-700">{formatPrice(order.total)}</span>
                        <button onClick={() => setTrackOrder(order)} className="text-xs font-body text-rosegold-500 hover:text-navy-700 border border-rosegold-200 px-3 py-1.5 rounded-sm">Track Order</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="font-heading text-2xl font-semibold text-navy-700 mb-6">My Wishlist ({wishlistIds.length})</h2>
                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-sm shadow-card">
                    <Heart size={56} className="text-rosegold-200 mx-auto mb-4" />
                    <p className="font-heading text-xl text-navy-700 mb-2">Your wishlist is empty</p>
                    <Link to="/collections" className="btn-primary">Explore Collections</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    {wishlistProducts.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 className="font-heading text-2xl font-semibold text-navy-700 mb-6">My Addresses</h2>
                <div className="bg-white rounded-sm shadow-card p-5 border-2 border-rosegold-200">
                  <p className="font-body text-sm font-semibold text-navy-700">Priya Sharma <span className="text-xs text-white bg-emerald-500 px-2 py-0.5 rounded-full ml-2">Default</span></p>
                  <p className="font-body text-sm text-gray-600 mt-2">123, Rose Garden Apartment, Mumbai, Maharashtra — 400001</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="font-heading text-2xl font-semibold text-navy-700 mb-6">Profile Settings</h2>
                <div className="bg-white rounded-sm shadow-card p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {['First Name', 'Last Name', 'Email', 'Phone'].map(label => (
                      <div key={label}>
                        <label className="font-body text-xs font-medium text-gray-600 block mb-1.5">{label}</label>
                        <input className="input-field" defaultValue={label === 'Phone' ? '+91 98765 43210' : label === 'First Name' ? 'Priya' : label === 'Last Name' ? 'Sharma' : 'priya@example.com'} />
                      </div>
                    ))}
                  </div>
                  <button type="button" className="btn-primary mt-6">Save Changes</button>

                  <div className="mt-8 pt-6 border-t border-rosegold-100 space-y-4">
                    <div>
                      <p className="font-body text-xs text-gray-400 mb-2">Store management</p>
                      <Link
                        to={auth.isAdmin ? '/admin/dashboard' : '/admin/login'}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-rosegold-600 transition-colors"
                      >
                        <LayoutDashboard size={15} />
                        {auth.isAdmin ? 'Open Admin Dashboard' : 'Go to Admin Panel'}
                      </Link>
                    </div>
                    {isSignedIn ? (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                      >
                        <LogOut size={15} />
                        Log out of your account
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => dispatch(openAuthModal('/account'))}
                        className="inline-flex items-center gap-2 text-sm font-medium text-rosegold-600 hover:text-navy-700 transition-colors"
                      >
                        Sign in with OTP to access your orders
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {trackOrder && <TrackOrderModal order={trackOrder} onClose={() => setTrackOrder(null)} />}
    </div>
  );
}
