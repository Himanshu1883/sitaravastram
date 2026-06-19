import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Heart, MapPin, Settings, ChevronRight, Star, Truck, Check, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectWishlistIds } from '../store/wishlistSlice';
import { products } from '../data/products';
import ProductCard from '../components/ui/ProductCard';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: User },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const mockOrders = [
  { id: 'SV2025001', date: '15 Nov 2025', status: 'delivered', items: 2, total: 7498, name: 'Ananya Floral Cotton Suit Set' },
  { id: 'SV2025002', date: '28 Nov 2025', status: 'shipped', items: 1, total: 5499, name: 'Meera Chanderi Silk Suit Set' },
  { id: 'SV2025003', date: '05 Dec 2025', status: 'confirmed', items: 3, total: 12297, name: 'Kavya Designer Party Suit' },
];

const statusConfig = {
  placed: { label: 'Order Placed', color: 'text-blue-600 bg-blue-50', icon: Package },
  confirmed: { label: 'Confirmed', color: 'text-amber-600 bg-amber-50', icon: Clock },
  shipped: { label: 'Shipped', color: 'text-orange-600 bg-orange-50', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-emerald-600 bg-emerald-50', icon: Check },
  cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-50', icon: Clock },
};

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const wishlistIds = useSelector(selectWishlistIds);
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-cream-100 pt-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="bg-navy-700 rounded-sm p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-rosegold-500/10 -translate-y-1/2 translate-x-1/4" />
          <div className="relative flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-rosegold-500 flex items-center justify-center flex-shrink-0">
              <span className="font-playfair text-2xl font-bold text-white">P</span>
            </div>
            <div>
              <h1 className="font-playfair text-2xl font-semibold text-white">Priya Sharma</h1>
              <p className="font-inter text-sm text-white/70">priya@example.com · +91 98765 43210</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                <span className="font-inter text-xs text-rosegold-300">Premium Member since 2024</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-sm shadow-card overflow-hidden">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between w-full px-5 py-4 text-sm font-inter font-medium transition-all duration-200 border-b border-rosegold-50 last:border-b-0 ${activeTab === item.id ? 'bg-navy-700 text-white' : 'text-navy-700 hover:bg-cream-100 hover:text-rosegold-500'}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={16} />
                    {item.label}
                  </div>
                  <ChevronRight size={14} className={activeTab === item.id ? 'text-white/60' : 'text-gray-400'} />
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Orders', value: '12', color: 'text-navy-700' },
                    { label: 'Delivered', value: '9', color: 'text-emerald-600' },
                    { label: 'Wishlist', value: wishlistIds.length.toString(), color: 'text-rosegold-500' },
                    { label: 'Points', value: '340', color: 'text-amber-600' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-sm shadow-card p-4 text-center">
                      <p className={`font-playfair text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="font-inter text-xs text-gray-500 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-sm shadow-card p-6">
                  <h2 className="font-playfair text-lg font-semibold text-navy-700 mb-4">Recent Orders</h2>
                  <div className="space-y-3">
                    {mockOrders.slice(0, 3).map(order => {
                      const config = statusConfig[order.status as keyof typeof statusConfig];
                      return (
                        <div key={order.id} className="flex items-center justify-between py-3 border-b border-rosegold-50 last:border-b-0">
                          <div>
                            <p className="font-inter text-sm font-medium text-navy-700">#{order.id}</p>
                            <p className="font-inter text-xs text-gray-500 mt-0.5">{order.date} · {order.items} items</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-1 text-xs font-inter font-medium px-2.5 py-1 rounded-full ${config.color}`}>
                              {config.label}
                            </span>
                            <span className="font-playfair text-sm font-semibold text-navy-700">₹{order.total.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => setActiveTab('orders')} className="text-sm font-inter text-rosegold-500 hover:text-navy-700 transition-colors mt-4">
                    View all orders →
                  </button>
                </div>
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="font-playfair text-2xl font-semibold text-navy-700">My Orders</h2>
                {mockOrders.map(order => {
                  const config = statusConfig[order.status as keyof typeof statusConfig];
                  return (
                    <div key={order.id} className="bg-white rounded-sm shadow-card p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <p className="font-inter text-sm font-semibold text-navy-700">Order #{order.id}</p>
                          <p className="font-inter text-xs text-gray-500 mt-0.5">Placed on {order.date}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-inter font-semibold px-3 py-1.5 rounded-full ${config.color}`}>
                          <config.icon size={12} />
                          {config.label}
                        </span>
                      </div>
                      <p className="font-inter text-sm text-gray-700 mb-3">{order.name}{order.items > 1 ? ` and ${order.items - 1} more` : ''}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-rosegold-50">
                        <span className="font-playfair text-base font-semibold text-navy-700">₹{order.total.toLocaleString('en-IN')}</span>
                        <div className="flex gap-2">
                          <button className="text-xs font-inter text-rosegold-500 hover:text-navy-700 border border-rosegold-200 px-3 py-1.5 rounded-sm transition-colors">Track Order</button>
                          {order.status === 'delivered' && (
                            <button className="text-xs font-inter text-navy-700 hover:text-rosegold-500 border border-navy-200 px-3 py-1.5 rounded-sm transition-colors">Reorder</button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="font-playfair text-2xl font-semibold text-navy-700 mb-6">My Wishlist ({wishlistIds.length})</h2>
                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-sm shadow-card">
                    <Heart size={56} className="text-rosegold-200 mx-auto mb-4" />
                    <p className="font-playfair text-xl text-navy-700 mb-2">Your wishlist is empty</p>
                    <p className="font-inter text-sm text-gray-500 mb-6">Save pieces you love for later.</p>
                    <Link to="/collections" className="btn-primary">Explore Collections</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    {wishlistProducts.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                )}
              </div>
            )}

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-playfair text-2xl font-semibold text-navy-700">My Addresses</h2>
                  <button className="btn-rose text-xs py-2 px-4">Add New</button>
                </div>
                <div className="bg-white rounded-sm shadow-card p-5 border-2 border-rosegold-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-inter text-sm font-semibold text-navy-700">Priya Sharma</p>
                        <span className="text-xs font-inter text-white bg-emerald-500 px-2 py-0.5 rounded-full">Default</span>
                      </div>
                      <p className="font-inter text-sm text-gray-600 leading-relaxed">
                        123, Rose Garden Apartment, Near City Mall<br />
                        Mumbai, Maharashtra — 400001
                      </p>
                      <p className="font-inter text-sm text-gray-600 mt-1">+91 98765 43210</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs font-inter text-rosegold-500 hover:text-navy-700 transition-colors">Edit</button>
                      <button className="text-xs font-inter text-red-400 hover:text-red-600 transition-colors">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="font-playfair text-2xl font-semibold text-navy-700 mb-6">Profile Settings</h2>
                <div className="bg-white rounded-sm shadow-card p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                    {[
                      { label: 'First Name', value: 'Priya' },
                      { label: 'Last Name', value: 'Sharma' },
                      { label: 'Email', value: 'priya@example.com' },
                      { label: 'Phone', value: '+91 98765 43210' },
                    ].map(field => (
                      <div key={field.label}>
                        <label className="font-inter text-xs font-medium text-gray-600 block mb-1.5">{field.label}</label>
                        <input defaultValue={field.value} className="input-field" />
                      </div>
                    ))}
                  </div>
                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
