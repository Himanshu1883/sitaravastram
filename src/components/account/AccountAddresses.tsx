import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Address } from '../../types';
import { formatAddressLine } from '../../lib/account/orderStatus';
import AccountEmptyState from './AccountEmptyState';

export default function AccountAddresses({ addresses }: { addresses: Address[] }) {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="mb-2 font-heading text-2xl font-semibold text-navy-700">
        {t('account.addresses')}
      </h2>
      <p className="mb-6 font-body text-sm text-gray-500">{t('account.addressesSubtitle')}</p>

      {addresses.length === 0 ? (
        <AccountEmptyState
          icon={<MapPin size={28} />}
          title={t('account.noAddresses')}
          description={t('account.noAddressesSubtitle')}
        />
      ) : (
        <div className="space-y-4">
          {addresses.map((address, index) => (
            <div
              key={address.id || `${address.line1}-${address.pincode}`}
              className={`rounded-2xl border bg-white p-5 shadow-[0_10px_36px_rgba(27,42,74,0.05)] ${
                index === 0 ? 'border-rosegold-300' : 'border-rosegold-100/70'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-body text-sm font-semibold text-navy-700">{address.name}</p>
                {index === 0 && (
                  <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    {t('account.default')}
                  </span>
                )}
              </div>
              <p className="mt-1 font-body text-xs text-gray-500">+91 {address.phone}</p>
              <p className="mt-2 font-body text-sm leading-relaxed text-gray-600">
                {formatAddressLine(address)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
