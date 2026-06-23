import { Truck, RefreshCw, Shield, Star, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFormatPrice } from '../../hooks/useFormatPrice';

export default function TrustBar() {
  const { t } = useTranslation();
  const formatPrice = useFormatPrice();

  const trustItems = [
    { icon: Truck, label: t('trust.freeShipping'), sublabel: t('trust.freeShippingSub', { amount: formatPrice(999) }) },
    { icon: RefreshCw, label: t('trust.easyReturns'), sublabel: t('trust.easyReturnsSub') },
    { icon: Shield, label: t('trust.securePayments'), sublabel: t('trust.securePaymentsSub') },
    { icon: Star, label: t('trust.womenTrust'), sublabel: t('trust.womenTrustSub') },
    { icon: CreditCard, label: t('trust.codAvailable'), sublabel: t('trust.codAvailableSub') },
  ];

  return (
    <section className="bg-white border-y border-rosegold-200/40 shadow-sm">
      <div className="section-container">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-rosegold-100">
          {trustItems.map(({ icon: Icon, label, sublabel }) => (
            <div
              key={label}
              className="flex flex-col sm:flex-row items-center gap-3 px-4 py-5 text-center sm:text-left group hover:bg-cream-100 transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center flex-shrink-0 group-hover:bg-rosegold-100 transition-colors">
                <Icon size={18} className="text-rosegold-500" />
              </div>
              <div>
                <p className="font-body text-xs font-semibold text-navy-700 leading-tight">{label}</p>
                <p className="font-body text-xs text-gray-500 mt-0.5">{sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
