import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems, selectCartTotal, selectCartOpen,
  closeCart, removeFromCart, updateQuantity
} from '../../store/cartSlice';

export default function CartDrawer() {
  const dispatch = useDispatch();
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
            <h2 className="font-playfair text-xl font-semibold text-navy-700">Shopping Bag</h2>
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
              <h3 className="font-playfair text-lg text-navy-700 mb-2">Your bag is empty</h3>
              <p className="text-sm font-inter text-gray-500 mb-6">Add your favourite pieces to get started.</p>
              <button
                onClick={() => dispatch(closeCart())}
                className="btn-primary"
              >
                Explore Collections
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4 py-4 border-b border-rosegold-100">
                  <div className="w-20 h-24 flex-shrink-0 overflow-hidden rounded-sm bg-cream-200">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-inter text-sm font-medium text-navy-700 leading-tight line-clamp-2">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => dispatch(removeFromCart({ productId: item.product.id, size: item.size, color: item.color }))}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <p className="text-xs font-inter text-gray-500 mt-1">{item.color} · Size {item.size}</p>
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
                      <p className="font-playfair text-base font-semibold text-navy-700">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
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
              <span className="text-sm font-inter text-gray-600">Subtotal</span>
              <span className="font-playfair text-lg font-semibold text-navy-700">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs font-inter text-rosegold-500 mb-4">Free shipping on this order!</p>
            <Link
              to="/checkout"
              onClick={() => dispatch(closeCart())}
              className="btn-primary w-full text-center block mb-2"
            >
              Checkout — ₹{total.toLocaleString('en-IN')}
            </Link>
            <Link
              to="/cart"
              onClick={() => dispatch(closeCart())}
              className="block text-center text-sm font-inter font-medium text-navy-700 hover:text-rosegold-500 transition-colors"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
