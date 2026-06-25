import { X, Copy, Check, FileText } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Order } from '../../types';
import { ORDER_STATUS_META, formatAddressLine } from '../../lib/account/orderStatus';
import { canCancelOrder, canReturnOrder } from '../../lib/account/orderPolicy';
import OrderTimeline from './OrderTimeline';

export default function OrderTrackModal({
  order,
  onClose,
  onViewInvoice,
  onCancel,
  onReturn,
}: {
  order: Order;
  onClose: () => void;
  onViewInvoice?: () => void;
  onCancel?: () => void;
  onReturn?: () => void;
}) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const config = ORDER_STATUS_META[order.status];
  const StatusIcon = config.icon;

  const copyTracking = async () => {
    if (!order.trackingNumber) return;
    await navigator.clipboard.writeText(order.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-6 shadow-luxury-lg sm:rounded-2xl sm:p-8"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-labelledby="track-order-title"
      >
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <h3 id="track-order-title" className="font-heading text-xl font-semibold text-navy-700">
              {t('account.trackOrderTitle', { id: order.id })}
            </h3>
            <p className="mt-1 font-body text-sm text-gray-500">
              {t('account.placedOn', { date: order.date })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-cream-100 hover:text-navy-700"
            aria-label={t('account.close')}
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.color}`}
          >
            <StatusIcon size={13} />
            {t(config.labelKey)}
          </span>
          {order.trackingNumber && (
            <button
              type="button"
              onClick={copyTracking}
              className="inline-flex items-center gap-2 rounded-full border border-rosegold-100 bg-cream-50 px-3 py-1.5 font-body text-xs text-navy-700 transition-colors hover:border-rosegold-300"
            >
              {t('account.trackingNumber')}: {order.trackingNumber}
              {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            </button>
          )}
        </div>

        <div className="mb-8 overflow-x-auto pb-2">
          <OrderTimeline order={order} variant="full" />
        </div>

        <div className="grid gap-4 border-t border-rosegold-50 pt-6 sm:grid-cols-2">
          <div>
            <p className="mb-1 font-body text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t('account.deliveryAddress')}
            </p>
            <p className="font-body text-sm font-medium text-navy-700">{order.address.name}</p>
            <p className="mt-1 font-body text-sm leading-relaxed text-gray-600">
              {formatAddressLine(order.address)}
            </p>
            <p className="mt-1 font-body text-xs text-gray-500">+91 {order.address.phone}</p>
          </div>
          <div>
            <p className="mb-1 font-body text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t('account.payment')}
            </p>
            <p className="font-body text-sm text-navy-700 capitalize">
              {order.paymentMethod === 'cod' ? t('checkout.cod') : t('checkout.upi')}
            </p>
            <p className="mt-2 font-body text-xs text-gray-500">
              {t('account.itemCount', { count: order.items.length })}
            </p>
          </div>
        </div>

        {(onViewInvoice || onCancel || onReturn) && (
          <div className="mt-6 flex flex-wrap gap-2 border-t border-rosegold-50 pt-5">
            {onCancel && canCancelOrder(order) && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-sm border border-red-200 px-4 py-2 font-body text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                {t('account.cancelOrder')}
              </button>
            )}
            {onReturn && canReturnOrder(order) && (
              <button type="button" onClick={onReturn} className="btn-outline-navy text-xs">
                {t('account.returnOrder')}
              </button>
            )}
            {onViewInvoice && (
              <button type="button" onClick={onViewInvoice} className="btn-outline-navy text-xs">
                <FileText size={14} />
                {t('account.viewInvoice')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
