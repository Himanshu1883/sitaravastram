import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { CheckoutAddress } from '../../lib/checkout/types';
import type { AddressFieldErrors } from '../../lib/checkout/validateAddress';
import {
  getCountries,
  getStates,
  getCities,
  hasCityDropdown,
  hasStateDropdown,
} from '../../lib/checkout/locations';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 font-body text-xs text-red-500">{message}</p>;
}

export default function CheckoutAddressForm({
  address,
  errors,
  onChange,
  onSubmit,
}: {
  address: CheckoutAddress;
  errors: AddressFieldErrors;
  onChange: (next: CheckoutAddress) => void;
  onSubmit: () => void;
}) {
  const { t } = useTranslation();
  const countries = useMemo(() => getCountries(), []);
  const states = useMemo(() => getStates(address.countryCode), [address.countryCode]);
  const cities = useMemo(
    () => getCities(address.countryCode, address.stateCode),
    [address.countryCode, address.stateCode],
  );
  const showStateSelect = hasStateDropdown(address.countryCode);
  const showCitySelect = hasCityDropdown(address.countryCode, address.stateCode);

  const set = (patch: Partial<CheckoutAddress>) => onChange({ ...address, ...patch });

  const handleCountryChange = (countryCode: string) => {
    onChange({
      ...address,
      countryCode,
      state: '',
      stateCode: '',
      city: '',
    });
  };

  const handleStateChange = (stateCode: string) => {
    const state = states.find(s => s.isoCode === stateCode);
    onChange({
      ...address,
      stateCode,
      state: state?.name ?? '',
      city: '',
    });
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h2 className="mb-2 font-heading text-xl font-semibold text-navy-700">
        {t('checkout.address')}
      </h2>
      <p className="mb-6 font-body text-sm text-gray-500">{t('checkout.addressSubtitle')}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block font-body text-xs font-medium text-gray-600">
            {t('checkout.fullName')} *
          </label>
          <input
            value={address.name}
            onChange={e => set({ name: e.target.value })}
            className={`input-field ${errors.name ? 'border-red-300' : ''}`}
            placeholder={t('checkout.fullNamePlaceholder')}
          />
          <FieldError message={errors.name} />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block font-body text-xs font-medium text-gray-600">
            {t('checkout.email')} *
          </label>
          <input
            type="email"
            value={address.email}
            onChange={e => set({ email: e.target.value })}
            className={`input-field ${errors.email ? 'border-red-300' : ''}`}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <p className="mt-1 font-body text-[11px] text-gray-400">{t('checkout.emailHint')}</p>
          <FieldError message={errors.email} />
        </div>

        <div>
          <label className="mb-1.5 block font-body text-xs font-medium text-gray-600">
            {t('checkout.phone')} *
          </label>
          <div className="flex gap-2">
            {address.countryCode === 'IN' && (
              <span className="flex items-center rounded-sm border border-rosegold-200 bg-cream-100 px-3 font-body text-sm text-gray-600">
                +91
              </span>
            )}
            <input
              type="tel"
              value={address.phone}
              onChange={e =>
                set({
                  phone: e.target.value.replace(/\D/g, '').slice(0, address.countryCode === 'IN' ? 10 : 15),
                })
              }
              className={`input-field flex-1 ${errors.phone ? 'border-red-300' : ''}`}
              placeholder={address.countryCode === 'IN' ? '9876543210' : t('checkout.phonePlaceholder')}
            />
          </div>
          <FieldError message={errors.phone} />
        </div>

        <div>
          <label className="mb-1.5 block font-body text-xs font-medium text-gray-600">
            {t('checkout.country')} *
          </label>
          <select
            value={address.countryCode}
            onChange={e => handleCountryChange(e.target.value)}
            className={`input-field ${errors.countryCode ? 'border-red-300' : ''}`}
          >
            {countries.map(country => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
          <FieldError message={errors.countryCode} />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block font-body text-xs font-medium text-gray-600">
            {t('checkout.addressLine1')} *
          </label>
          <input
            value={address.line1}
            onChange={e => set({ line1: e.target.value })}
            className={`input-field ${errors.line1 ? 'border-red-300' : ''}`}
            placeholder={t('checkout.addressLine1Placeholder')}
            autoComplete="address-line1"
          />
          <FieldError message={errors.line1} />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block font-body text-xs font-medium text-gray-600">
            {t('checkout.addressLine2')}
          </label>
          <input
            value={address.line2}
            onChange={e => set({ line2: e.target.value })}
            className="input-field"
            placeholder={t('checkout.addressLine2Placeholder')}
            autoComplete="address-line2"
          />
        </div>

        <div>
          <label className="mb-1.5 block font-body text-xs font-medium text-gray-600">
            {t('checkout.state')} *
          </label>
          {showStateSelect ? (
            <select
              value={address.stateCode}
              onChange={e => handleStateChange(e.target.value)}
              className={`input-field ${errors.state ? 'border-red-300' : ''}`}
            >
              <option value="">{t('checkout.selectState')}</option>
              {states.map(state => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={address.state}
              onChange={e => set({ state: e.target.value, stateCode: '' })}
              className={`input-field ${errors.state ? 'border-red-300' : ''}`}
              placeholder={t('checkout.statePlaceholder')}
            />
          )}
          <FieldError message={errors.state} />
        </div>

        <div>
          <label className="mb-1.5 block font-body text-xs font-medium text-gray-600">
            {t('checkout.city')} *
          </label>
          {showCitySelect ? (
            <select
              value={address.city}
              onChange={e => set({ city: e.target.value })}
              className={`input-field ${errors.city ? 'border-red-300' : ''}`}
            >
              <option value="">{t('checkout.selectCity')}</option>
              {cities.map(city => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={address.city}
              onChange={e => set({ city: e.target.value })}
              className={`input-field ${errors.city ? 'border-red-300' : ''}`}
              placeholder={t('checkout.cityPlaceholder')}
            />
          )}
          <FieldError message={errors.city} />
        </div>

        <div>
          <label className="mb-1.5 block font-body text-xs font-medium text-gray-600">
            {address.countryCode === 'US' ? t('checkout.zipCode') : t('checkout.pincode')} *
          </label>
          <input
            value={address.pincode}
            onChange={e => set({ pincode: e.target.value.trim() })}
            className={`input-field ${errors.pincode ? 'border-red-300' : ''}`}
            placeholder={address.countryCode === 'IN' ? '400001' : t('checkout.pincodePlaceholder')}
            autoComplete="postal-code"
          />
          <FieldError message={errors.pincode} />
        </div>
      </div>

      <button type="submit" className="btn-primary mt-6">
        {t('checkout.saveAndContinue')}
      </button>
    </form>
  );
}
