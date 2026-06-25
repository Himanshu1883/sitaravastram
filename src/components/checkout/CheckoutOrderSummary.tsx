import { useTranslation } from 'react-i18next';
import type { CartItem } from '../../types';
import { useFormatPrice } from '../../hooks/useFormatPrice';
import { mediaUrl } from '../../lib/api';

export default function CheckoutOrderSummary({
  items,
  subtotal,
  discount,
  appliedCode,
  shipping,
  codFee,
  total,
}: {
  items: CartItem[];
  subtotal: number;
  discount: number;
  appliedCode: string | null;
  shipping: number;
  codFee: number;
  total: number;
}) {
  const { t } = useTranslation();
  const formatPrice = useFormatPrice();

  return (
    <div className="sticky top-28 rounded-2xl border border-rosegold-100/70 bg-white p-5 shadow-[0_10px_36px_rgba(27,42,74,0.05)]">
      <h3 className="mb-4 font-heading text-lg font-semibold text-navy-700">
        {t('cart.orderSummary')}
      </h3>

      {items.length > 0 && (
        <div className="mb-4 max-h-48 space-y-3 overflow-y-auto border-b border-rosegold-50 pb-4">
          {items.map(item => (
            <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3">
              <div className="h-14 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-cream-100">
                <img
                  src={mediaUrl(item.product.images[0])}
                  alt={item.product.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-body text-xs font-medium text-navy-700">
                  {item.product.name}
                </p>
                <p className="font-body text-[11px] text-gray-500">
                  {item.color} · {item.size} · ×{item.quantity}
                </p>
              </div>
              <p className="font-body text-xs font-semibold text-navy-700 tabular-nums">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2 pt-1 font-body text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">{t('cart.subtotal')}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-emerald-600">
              {t('cart.discount')} ({appliedCode})
            </span>
            <span className="text-emerald-600">−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">{t('cart.shipping')}</span>
          <span className={shipping === 0 ? 'text-emerald-600' : ''}>
            {shipping === 0 ? t('cart.free') : formatPrice(shipping)}
          </span>
        </div>
        {codFee > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">{t('checkout.codFee')}</span>
            <span>{formatPrice(codFee)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-rosegold-100 pt-2 font-heading text-base font-semibold text-navy-700">
          <span>{t('cart.total')}</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
