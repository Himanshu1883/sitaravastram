import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal, removeFromCart, updateQuantity } from '../store/cartSlice';
import ProductCard from '../components/ui/ProductCard';
import { products } from '../data/products';

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const discount = couponApplied ? Math.round(total * 0.1) : 0;
  const shipping = total > 999 ? 0 : 99;
  const finalTotal = total - discount + shipping;

  const suggested = products.slice(0, 4);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'SITARA10') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
      setCouponApplied(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-100 pt-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <ShoppingBag size={72} className="text-rosegold-200 mx-auto mb-6" />
          <h1 className="font-playfair text-4xl font-semibold text-navy-700 mb-4">Your Bag is Empty</h1>
          <p className="font-inter text-base text-gray-500 mb-8 max-w-md mx-auto">
            Looks like you haven't added anything yet. Discover our stunning collections.
          </p>
          <Link to="/collections" className="btn-primary">
            Start Shopping
          </Link>

          <div className="mt-20">
            <h2 className="font-playfair text-2xl font-semibold text-navy-700 mb-8">You Might Love</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {suggested.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-playfair text-3xl lg:text-4xl font-semibold text-navy-700 mb-2">Shopping Bag</h1>
        <p className="font-inter text-sm text-gray-500 mb-8">{items.reduce((s, i) => s + i.quantity, 0)} items</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={`${item.product.id}-${item.size}-${item.color}`} className="bg-white rounded-sm shadow-card p-5 flex gap-5">
                <Link to={`/product/${item.product.slug}`} className="w-24 h-32 flex-shrink-0 overflow-hidden rounded-sm bg-cream-200">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <Link to={`/product/${item.product.slug}`} className="font-inter text-sm font-medium text-navy-700 hover:text-rosegold-500 transition-colors line-clamp-2 leading-snug">
                      {item.product.name}
                    </Link>
                    <button
                      onClick={() => dispatch(removeFromCart({ productId: item.product.id, size: item.size, color: item.color }))}
                      className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs font-inter text-gray-500 mt-1.5">{item.color} · Size {item.size}</p>
                  <p className="text-xs font-inter text-gray-500">{item.product.fabric}</p>

                  <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                    <div className="flex items-center border border-rosegold-200 rounded-sm">
                      <button
                        onClick={() => dispatch(updateQuantity({ productId: item.product.id, size: item.size, color: item.color, quantity: item.quantity - 1 }))}
                        disabled={item.quantity <= 1}
                        className="w-9 h-9 flex items-center justify-center text-navy-700 hover:bg-cream-100 disabled:opacity-40 transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-9 text-center text-sm font-medium text-navy-700">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ productId: item.product.id, size: item.size, color: item.color, quantity: item.quantity + 1 }))}
                        className="w-9 h-9 flex items-center justify-center text-navy-700 hover:bg-cream-100 transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-playfair text-lg font-semibold text-navy-700">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs font-inter text-gray-400">₹{item.product.price.toLocaleString('en-IN')} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm shadow-card p-6 sticky top-28">
              <h2 className="font-playfair text-xl font-semibold text-navy-700 mb-6">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                <p className="font-inter text-sm font-medium text-navy-700 mb-2">Have a coupon?</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={coupon}
                      onChange={e => setCoupon(e.target.value.toUpperCase())}
                      placeholder="SITARA10"
                      className="w-full pl-9 pr-3 py-2.5 border border-rosegold-200 rounded-sm text-sm font-inter focus:outline-none focus:border-rosegold-500"
                    />
                  </div>
                  <button onClick={applyCoupon} className="px-4 py-2.5 bg-navy-700 text-white text-sm font-inter font-medium rounded-sm hover:bg-rosegold-500 transition-colors">
                    Apply
                  </button>
                </div>
                {couponApplied && <p className="text-xs font-inter text-emerald-600 mt-1.5">✓ 10% discount applied!</p>}
                {couponError && <p className="text-xs font-inter text-red-500 mt-1.5">{couponError}</p>}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-rosegold-100 pt-5">
                <div className="flex justify-between text-sm font-inter">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-navy-700">₹{total.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm font-inter">
                    <span className="text-emerald-600">Coupon Discount</span>
                    <span className="font-medium text-emerald-600">−₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-inter">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-emerald-600' : 'text-navy-700'}`}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between font-playfair text-lg font-semibold text-navy-700 border-t border-rosegold-100 pt-3">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full text-center flex items-center justify-center gap-2 mt-6">
                Proceed to Checkout
                <ArrowRight size={16} />
              </Link>

              <p className="text-center text-xs font-inter text-gray-500 mt-3">
                Secure checkout powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
