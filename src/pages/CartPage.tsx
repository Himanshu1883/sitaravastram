import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal, removeFromCart, updateQuantity } from '../store/cartSlice';
import { applyCoupon, removeCoupon, selectAppliedCoupon } from '../store/couponSlice';
import { validateCouponApi } from '../lib/api';
import ProductCard from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useCatalog';
import { useFormatPrice } from '../hooks/useFormatPrice';
import { mediaUrl } from '../lib/api';

export default function CartPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formatPrice = useFormatPrice();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const applied = useSelector(selectAppliedCoupon);
  const [coupon, setCoupon] = useState(applied.appliedCode || '');
  const [couponError, setCouponError] = useState('');

  const discount = applied.discount;
  const shipping = total > 999 ? 0 : 99;
  const finalTotal = total - discount + shipping;

  const { products } = useProducts();
  const suggested = products.slice(0, 4);

  const applyCouponHandler = async () => {
    try {
      const result = await validateCouponApi(coupon, total);
      if (!result.valid || !result.coupon) {
        setCouponError(result.error || t('cart.invalidCoupon'));
        dispatch(removeCoupon());
        return;
      }
      dispatch(applyCoupon({ code: result.coupon.code, discount: result.discount ?? 0, coupon: result.coupon }));
      setCouponError('');
    } catch {
      setCouponError(t('cart.invalidCoupon'));
      dispatch(removeCoupon());
    }
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { subtotal: total, discount, shipping, finalTotal } });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <ShoppingBag size={72} className="text-rosegold-200 mx-auto mb-6" />
          <h1 className="font-heading text-4xl font-semibold text-navy-700 mb-4">{t('cart.empty')}</h1>
          <p className="font-body text-base text-gray-500 mb-8 max-w-md mx-auto">{t('cart.emptySubtitle')}</p>
          <Link to="/collections" className="btn-primary">{t('cart.startShopping')}</Link>
          <div className="mt-20">
            <h2 className="font-heading text-2xl font-semibold text-navy-700 mb-8">{t('cart.youMightLove')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {suggested.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-navy-700 mb-2">{t('cart.title')}</h1>
        <p className="font-body text-sm text-gray-500 mb-8">{items.reduce((s, i) => s + i.quantity, 0)} items</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={`${item.product.id}-${item.size}-${item.color}`} className="bg-white rounded-sm shadow-card p-5 flex gap-5">
                <Link to={`/product/${item.product.slug}`} className="w-24 h-32 flex-shrink-0 overflow-hidden rounded-sm bg-cream-200">
                  <img src={mediaUrl(item.product.images[0])} alt={item.product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <Link to={`/product/${item.product.slug}`} className="font-body text-sm font-medium text-navy-700 hover:text-rosegold-500 transition-colors line-clamp-2 leading-snug">{item.product.name}</Link>
                    <button onClick={() => dispatch(removeFromCart({ productId: item.product.id, size: item.size, color: item.color }))} className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
                  </div>
                  <p className="text-xs font-body text-gray-500 mt-1.5">{item.color} · {t('cart.size')} {item.size}</p>
                  <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                    <div className="flex items-center border border-rosegold-200 rounded-sm">
                      <button onClick={() => dispatch(updateQuantity({ productId: item.product.id, size: item.size, color: item.color, quantity: item.quantity - 1 }))} disabled={item.quantity <= 1} className="w-9 h-9 flex items-center justify-center text-navy-700 hover:bg-cream-100 disabled:opacity-40"><Minus size={13} /></button>
                      <span className="w-9 text-center text-sm font-medium text-navy-700">{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ productId: item.product.id, size: item.size, color: item.color, quantity: item.quantity + 1 }))} className="w-9 h-9 flex items-center justify-center text-navy-700 hover:bg-cream-100"><Plus size={13} /></button>
                    </div>
                    <p className="font-heading text-lg font-semibold text-navy-700">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm shadow-card p-6 sticky top-28">
              <h2 className="font-heading text-xl font-semibold text-navy-700 mb-6">{t('cart.orderSummary')}</h2>
              <div className="mb-6">
                <p className="font-body text-sm font-medium text-navy-700 mb-2">{t('cart.coupon')}</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="SITARA10" className="w-full pl-9 pr-3 py-2.5 border border-rosegold-200 rounded-sm text-sm font-body focus:outline-none focus:border-rosegold-500" />
                  </div>
                  <button onClick={applyCouponHandler} className="px-4 py-2.5 bg-navy-700 text-white text-sm font-body font-medium rounded-sm hover:bg-rosegold-500 transition-colors">{t('cart.apply')}</button>
                </div>
                {applied.appliedCode && <p className="text-xs font-body text-emerald-600 mt-1.5">✓ {applied.appliedCode} applied — {formatPrice(discount)} off</p>}
                {couponError && <p className="text-xs font-body text-red-500 mt-1.5">{couponError}</p>}
                <p className="text-xs text-gray-400 mt-2">Try: SITARA10, FESTIVE20, FLAT200, WELCOME15</p>
              </div>
              <div className="space-y-3 border-t border-rosegold-100 pt-5">
                <div className="flex justify-between text-sm font-body"><span className="text-gray-600">{t('cart.subtotal')}</span><span className="font-medium text-navy-700">{formatPrice(total)}</span></div>
                {discount > 0 && <div className="flex justify-between text-sm font-body"><span className="text-emerald-600">{t('cart.discount')}</span><span className="font-medium text-emerald-600">−{formatPrice(discount)}</span></div>}
                <div className="flex justify-between text-sm font-body"><span className="text-gray-600">{t('cart.shipping')}</span><span className={`font-medium ${shipping === 0 ? 'text-emerald-600' : 'text-navy-700'}`}>{shipping === 0 ? t('cart.free') : formatPrice(shipping)}</span></div>
                <div className="flex justify-between font-heading text-lg font-semibold text-navy-700 border-t border-rosegold-100 pt-3"><span>{t('cart.total')}</span><span>{formatPrice(finalTotal)}</span></div>
              </div>
              <button onClick={handleCheckout} className="btn-primary w-full flex items-center justify-center gap-2 mt-6">{t('cart.checkout')} <ArrowRight size={16} /></button>
              <p className="text-center text-xs font-body text-gray-500 mt-3">Secure checkout powered by Razorpay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
