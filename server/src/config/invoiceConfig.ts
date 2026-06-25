export const GST_RATE = Number(process.env.INVOICE_GST_RATE || '0.05') || 0.05;
export const COD_CHARGE_DEFAULT = Number(process.env.INVOICE_COD_CHARGE || '49') || 49;

export function getSellerDetails() {
  return {
    legalName: process.env.SELLER_LEGAL_NAME || 'Sitara Vastram',
    tagline: process.env.SELLER_TAGLINE || 'Premium Indian Ethnic Wear',
    address:
      process.env.SELLER_ADDRESS ||
      '123, Textile Hub, Jaipur, Rajasthan — 302001',
    state: process.env.SELLER_STATE || 'Rajasthan',
    gstin: process.env.SELLER_GSTIN || 'Applied for',
    phone: process.env.SELLER_PHONE || '+91 98765 43210',
    email: process.env.SELLER_EMAIL || 'care@sitaravastram.com',
  };
}
