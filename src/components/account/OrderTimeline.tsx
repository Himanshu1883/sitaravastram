import { useTranslation } from 'react-i18next';
import type { Order } from '../../types';
import {
  CUSTOMER_TRACKING_STEPS,
  ORDER_STATUS_META,
  formatTrackingDate,
  getOrderTrackingSteps,
} from '../../lib/account/orderStatus';

export default function OrderTimeline({
  order,
  variant = 'full',
}: {
  order: Order;
  variant?: 'full' | 'compact';
}) {
  const { t, i18n } = useTranslation();
  const steps = getOrderTrackingSteps(order);
  const locale = i18n.language === 'hi' ? 'hi-IN' : 'en-IN';
  const isTerminal = order.status === 'cancelled' || order.status === 'returned';

  if (isTerminal) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50/60 px-4 py-3 text-center">
        <p className="font-body text-sm font-medium text-red-600">
          {t(ORDER_STATUS_META[order.status].labelKey)}
        </p>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="mt-3">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-sky-100" />
          {CUSTOMER_TRACKING_STEPS.map((stepKey, index) => {
            const step = steps[index];
            const done = step.state === 'completed';
            const current = step.state === 'current';
            return (
              <div
                key={stepKey}
                className={`relative z-[1] h-2.5 w-2.5 rounded-full border-2 ${
                  done || current
                    ? 'border-sky-400 bg-sky-400'
                    : 'border-sky-200 bg-white'
                } ${current ? 'ring-2 ring-sky-200' : ''}`}
              />
            );
          })}
        </div>
        <div className="mt-2 flex justify-between gap-1">
          {steps.map(step => (
            <span
              key={step.step}
              className={`w-1/4 text-center font-body text-[9px] leading-tight sm:text-[10px] ${
                step.state === 'upcoming' ? 'text-gray-300' : 'text-navy-700'
              }`}
            >
              {t(step.labelKey)}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative flex items-start justify-between">
        <div className="absolute left-[12%] right-[12%] top-5 h-0.5 bg-sky-100" />

        {steps.map(step => {
          const Icon = step.icon;
          const done = step.state === 'completed';
          const current = step.state === 'current';
          const time = formatTrackingDate(step.at, locale);

          return (
            <div key={step.step} className="relative z-[1] flex w-1/4 flex-col items-center text-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  done || current
                    ? 'border-sky-400 bg-sky-400 text-navy-800'
                    : 'border-sky-200 bg-white text-gray-400'
                } ${current ? 'ring-4 ring-sky-100' : ''}`}
              >
                <Icon size={18} strokeWidth={1.75} />
              </div>
              <p
                className={`mt-3 font-body text-xs font-semibold sm:text-sm ${
                  step.state === 'upcoming' ? 'text-gray-400' : 'text-navy-800'
                }`}
              >
                {t(step.labelKey)}
              </p>
              <p className="mt-1 min-h-[2rem] font-body text-[10px] leading-snug text-gray-500 sm:text-xs">
                {time ?? (step.state === 'upcoming' ? t('account.noUpdateYet') : t('account.awaitingUpdate'))}
              </p>
              {step.note && (
                <p className="mt-1 line-clamp-2 max-w-[7rem] font-body text-[10px] text-rosegold-600">
                  {step.note}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
