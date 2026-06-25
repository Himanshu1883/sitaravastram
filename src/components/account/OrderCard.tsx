import { useTranslation } from 'react-i18next';
import { useFormatPrice } from '../../hooks/useFormatPrice';
import { mediaUrl } from '../../lib/api';
import { ORDER_STATUS_META } from '../../lib/account/orderStatus';
import { canCancelOrder, canReturnOrder } from '../../lib/account/orderPolicy';
import type { Order } from '../../types';
import OrderTimeline from './OrderTimeline';

export default function OrderCard({
  order,
  onTrack,
  onInvoice,
  onCancel,
  onReturn,
  compact = false,
}: {
  order: Order;
  onTrack?: () => void;
  onInvoice?: () => void;
  onCancel?: () => void;
  onReturn?: () => void;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const formatPrice = useFormatPrice();
  const config = ORDER_STATUS_META[order.status];
  const StatusIcon = config.icon;
  const firstItem = order.items[0];
  const image = firstItem?.product.images[0];
  const showTimeline =
    order.status !== 'cancelled' &&
    order.status !== 'returned' &&
    order.status !== 'cancel_requested';
  const showCancel = onCancel && canCancelOrder(order);
  const showReturn = onReturn && canReturnOrder(order);

  return (
    <article
      className={`rounded-2xl border border-rosegold-100/70 bg-white shadow-[0_10px_36px_rgba(27,42,74,0.05)] ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      <div className="flex gap-4">
        {image && (
          <div className="h-16 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-cream-100 sm:h-20 sm:w-16">
            <img
              src={mediaUrl(image)}
              alt={firstItem.product.name}
              className="h-full w-full object-cover object-top"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-body text-sm font-semibold text-navy-700">
                {t('account.orderId', { id: order.id })}
              </p>
              <p className="font-body text-xs text-gray-500">
                {order.date} · {t('account.itemCount', { count: order.items.length })}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${config.color}`}
            >
              <StatusIcon size={12} />
              {t(config.labelKey)}
            </span>
          </div>

          {firstItem && (
            <p className="mt-2 line-clamp-2 font-body text-sm text-gray-600">
              {firstItem.product.name}
              {order.items.length > 1 &&
                ` ${t('account.andMore', { count: order.items.length - 1 })}`}
            </p>
          )}

          {showTimeline && <OrderTimeline order={order} variant="compact" />}

          <div
            className={`flex items-center justify-between gap-3 ${
              compact ? 'mt-3' : 'mt-4 border-t border-rosegold-50 pt-3'
            }`}
          >
            <span className="font-heading text-base font-semibold text-navy-700 tabular-nums">
              {formatPrice(order.total)}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {showCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-sm border border-red-200 px-3 py-1.5 font-body text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  {t('account.cancelOrder')}
                </button>
              )}
              {showReturn && (
                <button type="button" onClick={onReturn} className="btn-outline-navy text-xs">
                  {t('account.returnOrder')}
                </button>
              )}
              {onInvoice && (
                <button type="button" onClick={onInvoice} className="btn-outline-navy text-xs">
                  {t('account.viewInvoice')}
                </button>
              )}
              {onTrack && (
                <button type="button" onClick={onTrack} className="btn-outline-navy text-xs">
                  {t('account.trackOrder')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
