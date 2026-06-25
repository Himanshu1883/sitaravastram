export type CheckoutAddress = {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
};

export const emptyCheckoutAddress = (): CheckoutAddress => ({
  name: '',
  email: '',
  phone: '',
  countryCode: 'IN',
  line1: '',
  line2: '',
  city: '',
  state: '',
  stateCode: '',
  pincode: '',
});
