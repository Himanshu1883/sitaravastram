import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems, selectCartTotal, selectCartOpen,
  closeCart, removeFromCart, updateQuantity
} from '../../store/cartSlice';
import { useFormatPrice } from '../../hooks/useFormatPrice';
import { mediaUrl } from '../../lib/api';

export default function CartDrawer() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const formatPrice = useFormatPrice();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const isOpen = useSelector(selectCartOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={() => dispatch(closeCart())} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-luxury-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-rosegold-200/40">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-navy-700" />
            <h2 className="type-heading-lg text-navy-700">{t('cart.title')}</h2>
            {items.length > 0 && (
              <span className="w-5 h-5 bg-rosegold-500 text-white text-xs rounded-full flex items-center justify-center">
                {items.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </div>
          <button onClick={() => dispatch(closeCart())} className="p-2 text-gray-400 hover:text-navy-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={56} className="text-rosegold-200 mb-4" />
              <h3 className="type-heading-md text-navy-700 mb-2">{t('cart.emptyDrawer')}</h3>
              <p className="type-body-sm text-gray-500 mb-6">{t('cart.emptyDrawerSubtitle')}</p>
              <button
                onClick={() => dispatch(closeCart())}
                className="btn-primary"
              >
                {t('cart.exploreCollections')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4 py-4 border-b border-rosegold-100">
                  <div className="w-20 h-24 flex-shrink-0 overflow-hidden rounded-sm bg-cream-200">
                    <img src={mediaUrl(item.product.images[0])} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-body text-sm font-medium text-navy-700 leading-tight line-clamp-2">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => dispatch(removeFromCart({ productId: item.product.id, size: item.size, color: item.color }))}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <p className="text-xs font-body text-gray-500 mt-1">{item.color} · {t('cart.size')} {item.size}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-rosegold-200 rounded-sm">
                        <button
                          onClick={() => dispatch(updateQuantity({ productId: item.product.id, size: item.size, color: item.color, quantity: item.quantity - 1 }))}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-navy-700 hover:bg-cream-100 disabled:opacity-40 transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-navy-700">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({ productId: item.product.id, size: item.size, color: item.color, quantity: item.quantity + 1 }))}
                          className="w-8 h-8 flex items-center justify-center text-navy-700 hover:bg-cream-100 transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <p className="type-price text-navy-700">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-rosegold-200/40 bg-cream-100/50">
            <div className="flex items-center justify-between mb-1">
              <span className="type-body-sm text-gray-600">{t('cart.subtotal')}</span>
              <span className="type-heading-md text-navy-700">{formatPrice(total)}</span>
            </div>
            <p className="text-xs font-body text-rosegold-500 mb-4">{t('cartDrawer.freeShippingNote')}</p>
            <Link
              to="/checkout"
              onClick={() => dispatch(closeCart())}
              className="btn-primary w-full text-center block mb-2"
            >
              {t('cartDrawer.checkout', { amount: formatPrice(total) })}
            </Link>
            <Link
              to="/cart"
              onClick={() => dispatch(closeCart())}
              className="block text-center text-sm font-body font-medium text-navy-700 hover:text-rosegold-500 transition-colors"
            >
              {t('cartDrawer.viewFullCart')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
