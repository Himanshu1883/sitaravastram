import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Order } from '../../types';
import { CANCEL_REASONS, canInstantCancel } from '../../lib/account/orderPolicy';
import { cancelOrder } from '../../lib/api';

export default function CancelOrderModal({
  order,
  onClose,
  onSuccess,
}: {
  order: Order;
  onClose: () => void;
  onSuccess: (updated: Order) => void;
}) {
  const { t } = useTranslation();
  const instant = canInstantCancel(order);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const finalReason = reason === 'Other' ? customReason.trim() : reason;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalReason) {
      setError(t('account.cancelReasonRequired'));
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const updated = await cancelOrder(order.id, finalReason);
      onSuccess(updated);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('account.cancelFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <form
        className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-luxury-lg sm:rounded-2xl"
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg font-semibold text-navy-700">
              {t('account.cancelOrderTitle', { id: order.id })}
            </h3>
            <p className="mt-1 font-body text-sm text-gray-500">
              {instant ? t('account.cancelInstantHint') : t('account.cancelRequestHint')}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-cream-100">
            <X size={18} />
          </button>
        </div>

        {!instant && (
          <div className="mb-4 flex gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3 text-amber-800">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            <p className="font-body text-xs leading-relaxed">{t('account.cancelAfter30Min')}</p>
          </div>
        )}

        <fieldset className="space-y-2">
          <legend className="mb-2 font-body text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t('account.cancelReason')}
          </legend>
          {CANCEL_REASONS.map(option => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-rosegold-100 px-3 py-2.5 hover:border-rosegold-300"
            >
              <input
                type="radio"
                name="cancel-reason"
                value={option}
                checked={reason === option}
                onChange={() => setReason(option)}
                className="text-rosegold-500"
              />
              <span className="font-body text-sm text-navy-700">{option}</span>
            </label>
          ))}
        </fieldset>

        {reason === 'Other' && (
          <textarea
            className="mt-3 w-full rounded-xl border border-rosegold-100 px-3 py-2 font-body text-sm"
            rows={3}
            placeholder={t('account.cancelReasonPlaceholder')}
            value={customReason}
            onChange={e => setCustomReason(e.target.value)}
          />
        )}

        {error && <p className="mt-3 font-body text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="btn-outline-navy flex-1 text-sm">
            {t('account.keepOrder')}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-sm bg-red-600 px-4 py-2.5 font-body text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {submitting
              ? t('account.cancelling')
              : instant
                ? t('account.cancelNow')
                : t('account.requestCancel')}
          </button>
        </div>
      </form>
    </div>
  );
}
