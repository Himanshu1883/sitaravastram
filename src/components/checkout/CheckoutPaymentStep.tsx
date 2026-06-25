import { Banknote, Check, CreditCard, Lock, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UpiIcon, VisaIcon, MastercardIcon } from '../ui/PaymentIcons';

export default function CheckoutPaymentStep({
  paymentMethod,
  codFeeLabel,
  onChange,
  onSubmit,
}: {
  paymentMethod: 'razorpay' | 'cod';
  codFeeLabel: string;
  onChange: (method: 'razorpay' | 'cod') => void;
  onSubmit: () => void;
}) {
  const { t } = useTranslation();

  const methods = [
    {
      value: 'razorpay' as const,
      label: t('checkout.payOnline'),
      desc: t('checkout.payOnlineDesc'),
      icon: CreditCard,
      badge: t('checkout.recommended'),
    },
    {
      value: 'cod' as const,
      label: t('checkout.cod'),
      desc: t('checkout.codDesc', { fee: codFeeLabel }),
      icon: Banknote,
      badge: null,
    },
  ];

  return (
    <div>
      <h2 className="mb-2 font-heading text-xl font-semibold text-navy-700">
        {t('checkout.payment')}
      </h2>
      <p className="mb-6 font-body text-sm text-gray-500">{t('checkout.paymentSubtitle')}</p>

      <div className="space-y-4">
        {methods.map(method => {
          const selected = paymentMethod === method.value;
          const Icon = method.icon;
          return (
            <button
              key={method.value}
              type="button"
              onClick={() => onChange(method.value)}
              className={`relative w-full rounded-2xl border p-5 text-left transition-all ${
                selected
                  ? 'border-navy-700 bg-gradient-to-br from-cream-50 to-white shadow-[0_10px_36px_rgba(27,42,74,0.08)] ring-2 ring-rosegold-100'
                  : 'border-rosegold-100/80 bg-white hover:border-rosegold-300'
              }`}
            >
              {method.badge && !selected && (
                <span className="absolute right-4 top-4 rounded-full bg-rosegold-500 px-2.5 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wide text-white">
                  {method.badge}
                </span>
              )}
              {selected && (
                <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-navy-700 text-white">
                  <Check size={14} />
                </span>
              )}

              <div className="flex items-start gap-4 pr-16">
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
                    selected ? 'bg-navy-700 text-white' : 'bg-cream-100 text-navy-700'
                  }`}
                >
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="font-body text-base font-semibold text-navy-700">{method.label}</p>
                  <p className="mt-1 font-body text-sm text-gray-500">{method.desc}</p>
                  {method.value === 'razorpay' && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <UpiIcon width={34} />
                      <VisaIcon width={34} />
                      <MastercardIcon width={34} />
                      <span className="font-body text-[11px] text-gray-400">
                        {t('checkout.poweredByRazorpay')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
        <Shield size={18} className="flex-shrink-0 text-emerald-600" />
        <p className="font-body text-xs leading-relaxed text-emerald-800">
          {t('checkout.securePayment')}
        </p>
      </div>

      <button type="button" onClick={onSubmit} className="btn-primary mt-6 flex w-full items-center justify-center gap-2">
        <Lock size={16} />
        {paymentMethod === 'cod' ? t('checkout.placeOrderCod') : t('checkout.payNow')}
      </button>
    </div>
  );
}
