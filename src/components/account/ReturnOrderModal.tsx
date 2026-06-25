import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Order } from '../../types';
import { RETURN_REASONS, returnDaysRemaining } from '../../lib/account/orderPolicy';
import { returnOrder } from '../../lib/api';

export default function ReturnOrderModal({
  order,
  onClose,
  onSuccess,
}: {
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { t } = useTranslation();
  const daysLeft = returnDaysRemaining(order);
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const finalReason = reason === 'Other' ? customReason.trim() : reason;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalReason) {
      setError(t('account.returnReasonRequired'));
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await returnOrder(order.id, { reason: finalReason, comment: comment.trim() || undefined });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('account.returnFailed'));
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
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-6 shadow-luxury-lg sm:rounded-2xl"
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg font-semibold text-navy-700">
              {t('account.returnOrderTitle', { id: order.id })}
            </h3>
            <p className="mt-1 font-body text-sm text-gray-500">
              {t('account.returnWindowHint', { days: daysLeft })}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-cream-100">
            <X size={18} />
          </button>
        </div>

        <fieldset className="space-y-2">
          <legend className="mb-2 font-body text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t('account.returnReason')}
          </legend>
          {RETURN_REASONS.map(option => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-rosegold-100 px-3 py-2.5 hover:border-rosegold-300"
            >
              <input
                type="radio"
                name="return-reason"
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
            rows={2}
            placeholder={t('account.returnReasonPlaceholder')}
            value={customReason}
            onChange={e => setCustomReason(e.target.value)}
          />
        )}

        <label className="mt-4 block">
          <span className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t('account.returnComment')}
          </span>
          <textarea
            className="w-full rounded-xl border border-rosegold-100 px-3 py-2 font-body text-sm"
            rows={2}
            placeholder={t('account.returnCommentPlaceholder')}
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </label>

        {error && <p className="mt-3 font-body text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="btn-outline-navy flex-1 text-sm">
            {t('account.close')}
          </button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1 text-sm">
            {submitting ? t('account.submittingReturn') : t('account.submitReturn')}
          </button>
        </div>
      </form>
    </div>
  );
}
