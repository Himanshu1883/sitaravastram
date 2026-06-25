import { validateIndianMobile } from '../otpAuth';
import type { CheckoutAddress } from './types';

export type AddressFieldErrors = Partial<Record<keyof CheckoutAddress, string>>;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateCheckoutAddress(
  address: CheckoutAddress,
  messages: {
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    phoneRequired: string;
    phoneInvalid: string;
    line1Required: string;
    stateRequired: string;
    cityRequired: string;
    pincodeRequired: string;
    pincodeInvalid: string;
    countryRequired: string;
  },
): AddressFieldErrors {
  const errors: AddressFieldErrors = {};

  if (!address.name.trim()) errors.name = messages.nameRequired;
  if (!address.email.trim()) errors.email = messages.emailRequired;
  else if (!isValidEmail(address.email)) errors.email = messages.emailInvalid;
  if (!address.countryCode) errors.countryCode = messages.countryRequired;

  if (address.countryCode === 'IN') {
    if (!validateIndianMobile(address.phone)) errors.phone = messages.phoneInvalid;
  } else if (!address.phone.trim() || address.phone.trim().length < 6) {
    errors.phone = messages.phoneRequired;
  }

  if (!address.line1.trim()) errors.line1 = messages.line1Required;
  if (!address.state.trim()) errors.state = messages.stateRequired;
  if (!address.city.trim()) errors.city = messages.cityRequired;

  if (!address.pincode.trim()) {
    errors.pincode = messages.pincodeRequired;
  } else if (address.countryCode === 'IN' && !/^\d{6}$/.test(address.pincode.trim())) {
    errors.pincode = messages.pincodeInvalid;
  } else if (address.countryCode === 'US' && !/^\d{5}(-\d{4})?$/.test(address.pincode.trim())) {
    errors.pincode = messages.pincodeInvalid;
  }

  return errors;
}
