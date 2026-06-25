import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  selectCartOpen,
  closeCart,
  removeFromCart,
  updateQuantity,
  addToCart,
} from '../../store/cartSlice';
import { useFormatPrice } from '../../hooks/useFormatPrice';
import { useProducts } from '../../hooks/useCatalog';
import { mediaUrl } from '../../lib/api';
import ShopBagPlusIcon from '../ui/ShopBagPlusIcon';
import type { Product } from '../../types';

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <span className="h-px flex-1 bg-neutral-200" />
      <span className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
        {label}
      </span>
      <span className="h-px flex-1 bg-neutral-200" />
    </div>
  );
}

function DrawerRecommendation({
  product,
  onAdd,
  onNavigate,
}: {
  product: Product;
  onAdd: (product: Product) => void;
  onNavigate: () => void;
}) {
  const formatPrice = useFormatPrice();

  return (
    <article className="flex w-[min(88%,19.5rem)] flex-shrink-0 snap-start gap-3">
      <Link
        to={`/product/${product.slug}`}
        className="h-[5.5rem] w-[5.5rem] flex-shrink-0 overflow-hidden bg-neutral-100"
        onClick={onNavigate}
      >
        <img
          src={mediaUrl(product.images[0])}
          alt={product.name}
          className="h-full w-full object-cover object-top"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <Link
          to={`/product/${product.slug}`}
          className="line-clamp-2 font-body text-[13px] leading-snug text-navy-900 hover:underline"
          onClick={onNavigate}
        >
          {product.name}
        </Link>
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-body text-sm font-semibold tabular-nums text-navy-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-body text-xs tabular-nums text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="flex h-9 w-9 items-center justify-center border border-neutral-300 text-navy-900 transition-colors hover:border-navy-900 hover:bg-neutral-50"
            aria-label="Add to bag"
          >
            <ShopBagPlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function CartDrawer() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const formatPrice = useFormatPrice();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartCount);
  const isOpen = useSelector(selectCartOpen);
  const { products } = useProducts();

  const suggestions = useMemo(() => {
    const inCart = new Set(items.map(i => i.product.id));
    return products.filter(p => !inCart.has(p.id)).slice(0, 8);
  }, [products, items]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch(closeCart());
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, dispatch]);

  const handleAddSuggestion = (product: Product) => {
    dispatch(
      addToCart({
        product,
        size: product.sizes[0] ?? 'Free Size',
        color: product.colors[0] ?? 'Default',
        quantity: 1,
      }),
    );
  };

  if (typeof document === 'undefined') return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          <motion.button
            type="button"
            aria-label={t('auth.close')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-navy-900/50 backdrop-blur-[2px]"
            onClick={() => dispatch(closeCart())}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 sm:px-6">
              <h2
                id="cart-drawer-title"
                className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-navy-900"
              >
                {t('cartDrawer.yourBag')}{' '}
                <span className="text-neutral-500">[{itemCount}]</span>
              </h2>
              <button
                type="button"
                onClick={() => dispatch(closeCart())}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-navy-800 transition-colors hover:bg-neutral-200"
                aria-label={t('auth.close')}
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>

            {/* Main content — cart items or empty state */}
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6">
                {items.length === 0 ? (
                  <div className="flex min-h-full flex-col items-center justify-center px-2 py-10 text-center">
                    <h3 className="font-body text-lg font-bold text-navy-900">
                      {t('cartDrawer.emptyTitle')}
                    </h3>
                    <p className="mt-3 max-w-[260px] font-body text-sm leading-relaxed text-neutral-500">
                      {t('cartDrawer.emptyHint')}
                    </p>
                    <Link
                      to="/collections"
                      onClick={() => dispatch(closeCart())}
                      className="mt-8 inline-flex min-w-[200px] items-center justify-center border border-navy-900 px-8 py-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
                    >
                      {t('cartDrawer.returnToShop')}
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100 py-2">
                    {items.map(item => (
                      <div
                        key={`${item.product.id}-${item.size}-${item.color}`}
                        className="flex gap-4 py-5"
                      >
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={() => dispatch(closeCart())}
                          className="h-[100px] w-[78px] flex-shrink-0 overflow-hidden bg-neutral-100"
                        >
                          <img
                            src={mediaUrl(item.product.images[0])}
                            alt={item.product.name}
                            className="h-full w-full object-cover object-top"
                          />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/product/${item.product.slug}`}
                              onClick={() => dispatch(closeCart())}
                              className="line-clamp-2 font-body text-sm leading-snug text-navy-900 hover:underline"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() =>
                                dispatch(
                                  removeFromCart({
                                    productId: item.product.id,
                                    size: item.size,
                                    color: item.color,
                                  }),
                                )
                              }
                              className="flex-shrink-0 p-1 text-neutral-400 transition-colors hover:text-red-500"
                              aria-label={t('cart.remove')}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <p className="mt-1 font-body text-xs text-neutral-500">
                            {item.color} · {t('cart.size')} {item.size}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="inline-flex items-center border border-neutral-200">
                              <button
                                type="button"
                                onClick={() =>
                                  dispatch(
                                    updateQuantity({
                                      productId: item.product.id,
                                      size: item.size,
                                      color: item.color,
                                      quantity: item.quantity - 1,
                                    }),
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className="flex h-8 w-8 items-center justify-center text-navy-900 transition-colors hover:bg-neutral-50 disabled:opacity-30"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-8 text-center font-body text-sm font-medium tabular-nums text-navy-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  dispatch(
                                    updateQuantity({
                                      productId: item.product.id,
                                      size: item.size,
                                      color: item.color,
                                      quantity: item.quantity + 1,
                                    }),
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center text-navy-900 transition-colors hover:bg-neutral-50"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                            <span className="font-body text-sm font-semibold tabular-nums text-navy-900">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* You may also like — empty bag only */}
              {items.length === 0 && suggestions.length > 0 && (
                <div className="flex-shrink-0 border-t border-neutral-200 bg-white px-5 pb-4 pt-2 sm:px-6">
                  <SectionDivider label={t('cartDrawer.youMayAlsoLike')} />
                  <div
                    className="-mx-5 flex gap-4 overflow-x-auto overscroll-x-contain px-5 pb-1 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
                    aria-label={t('cartDrawer.youMayAlsoLike')}
                  >
                    {suggestions.map(product => (
                      <DrawerRecommendation
                        key={product.id}
                        product={product}
                        onAdd={handleAddSuggestion}
                        onNavigate={() => dispatch(closeCart())}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer — filled cart */}
            {items.length > 0 && (
              <div className="border-t border-neutral-200 bg-white px-5 py-5 sm:px-6">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    {t('cart.subtotal')}
                  </span>
                  <span className="font-body text-base font-bold tabular-nums text-navy-900">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="mb-4 font-body text-xs text-neutral-500">
                  {t('cartDrawer.freeShippingNote')}
                </p>
                <Link
                  to="/checkout"
                  onClick={() => dispatch(closeCart())}
                  className="flex h-12 w-full items-center justify-center bg-navy-900 font-body text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-navy-800"
                >
                  {t('cartDrawer.checkout', { amount: formatPrice(total) })}
                </Link>
                <Link
                  to="/cart"
                  onClick={() => dispatch(closeCart())}
                  className="mt-3 block text-center font-body text-xs font-semibold uppercase tracking-wide text-navy-900 underline-offset-2 hover:underline"
                >
                  {t('cartDrawer.viewFullCart')}
                </Link>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
