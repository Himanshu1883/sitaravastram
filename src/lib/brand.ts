export const BRAND_NAME = 'Sitara Vastram';
export const BRAND_LOGO = '/assets/images/logo2.png';
export const BRAND_LOGO_EMBLEM = '/assets/images/sitaravastram_logo.webp';

export const STORE_CONTACT = {
  line1: '123, Textile Hub',
  city: 'Jaipur',
  state: 'Rajasthan',
  pincode: '302001',
  phone: '+91 98765 43210',
  email: 'care@sitaravastram.com',
  contactPerson: 'Customer Care',
} as const;

export function storeAddressLine() {
  const { line1, city, state, pincode } = STORE_CONTACT;
  return `${line1}, ${city}, ${state} — ${pincode}`;
}

export function storeContactLine() {
  const { contactPerson, phone, email } = STORE_CONTACT;
  return `${contactPerson}, ${phone}, ${email}`;
}
