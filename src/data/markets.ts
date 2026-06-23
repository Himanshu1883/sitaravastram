export type CurrencyCode =
  | 'INR'
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'AUD'
  | 'CAD'
  | 'AED'
  | 'SGD'
  | 'NZD'
  | 'CHF'
  | 'JPY'
  | 'SEK'
  | 'NOK'
  | 'DKK'
  | 'HKD'
  | 'MYR'
  | 'SAR'
  | 'QAR'
  | 'ZAR'
  | 'BRL'
  | 'MXN'
  | 'THB'
  | 'KRW'
  | 'PHP';

export interface Market {
  id: string;
  country: string;
  currencyCode: CurrencyCode;
  currencySymbol: string;
}

const marketList: Market[] = [
  { id: 'af', country: 'Afghanistan', currencyCode: 'USD', currencySymbol: '$' },
  { id: 'al', country: 'Albania', currencyCode: 'USD', currencySymbol: '$' },
  { id: 'au', country: 'Australia', currencyCode: 'AUD', currencySymbol: '$' },
  { id: 'at', country: 'Austria', currencyCode: 'EUR', currencySymbol: '€' },
  { id: 'bh', country: 'Bahrain', currencyCode: 'USD', currencySymbol: '$' },
  { id: 'bd', country: 'Bangladesh', currencyCode: 'USD', currencySymbol: '$' },
  { id: 'be', country: 'Belgium', currencyCode: 'EUR', currencySymbol: '€' },
  { id: 'br', country: 'Brazil', currencyCode: 'BRL', currencySymbol: 'R$' },
  { id: 'ca', country: 'Canada', currencyCode: 'CAD', currencySymbol: '$' },
  { id: 'cn', country: 'China', currencyCode: 'USD', currencySymbol: '$' },
  { id: 'dk', country: 'Denmark', currencyCode: 'DKK', currencySymbol: 'kr' },
  { id: 'fi', country: 'Finland', currencyCode: 'EUR', currencySymbol: '€' },
  { id: 'fr', country: 'France', currencyCode: 'EUR', currencySymbol: '€' },
  { id: 'de', country: 'Germany', currencyCode: 'EUR', currencySymbol: '€' },
  { id: 'hk', country: 'Hong Kong SAR', currencyCode: 'HKD', currencySymbol: '$' },
  { id: 'in', country: 'India', currencyCode: 'INR', currencySymbol: '₹' },
  { id: 'id', country: 'Indonesia', currencyCode: 'USD', currencySymbol: '$' },
  { id: 'ie', country: 'Ireland', currencyCode: 'EUR', currencySymbol: '€' },
  { id: 'it', country: 'Italy', currencyCode: 'EUR', currencySymbol: '€' },
  { id: 'jp', country: 'Japan', currencyCode: 'JPY', currencySymbol: '¥' },
  { id: 'kw', country: 'Kuwait', currencyCode: 'USD', currencySymbol: '$' },
  { id: 'my', country: 'Malaysia', currencyCode: 'MYR', currencySymbol: 'RM' },
  { id: 'mx', country: 'Mexico', currencyCode: 'MXN', currencySymbol: '$' },
  { id: 'nl', country: 'Netherlands', currencyCode: 'EUR', currencySymbol: '€' },
  { id: 'nz', country: 'New Zealand', currencyCode: 'NZD', currencySymbol: '$' },
  { id: 'no', country: 'Norway', currencyCode: 'NOK', currencySymbol: 'kr' },
  { id: 'om', country: 'Oman', currencyCode: 'USD', currencySymbol: '$' },
  { id: 'ph', country: 'Philippines', currencyCode: 'PHP', currencySymbol: '₱' },
  { id: 'qa', country: 'Qatar', currencyCode: 'QAR', currencySymbol: 'ر.ق' },
  { id: 'sa', country: 'Saudi Arabia', currencyCode: 'SAR', currencySymbol: 'ر.س' },
  { id: 'sg', country: 'Singapore', currencyCode: 'SGD', currencySymbol: '$' },
  { id: 'za', country: 'South Africa', currencyCode: 'ZAR', currencySymbol: 'R' },
  { id: 'kr', country: 'South Korea', currencyCode: 'KRW', currencySymbol: '₩' },
  { id: 'es', country: 'Spain', currencyCode: 'EUR', currencySymbol: '€' },
  { id: 'se', country: 'Sweden', currencyCode: 'SEK', currencySymbol: 'kr' },
  { id: 'ch', country: 'Switzerland', currencyCode: 'CHF', currencySymbol: 'CHF' },
  { id: 'th', country: 'Thailand', currencyCode: 'THB', currencySymbol: '฿' },
  { id: 'ae', country: 'United Arab Emirates', currencyCode: 'AED', currencySymbol: 'د.إ' },
  { id: 'gb', country: 'United Kingdom', currencyCode: 'GBP', currencySymbol: '£' },
  { id: 'us', country: 'United States', currencyCode: 'USD', currencySymbol: '$' },
];

export const markets = marketList.sort((a, b) => a.country.localeCompare(b.country));

export const defaultMarketId = 'in';

export function getMarketById(id: string): Market {
  return markets.find(m => m.id === id) ?? markets.find(m => m.id === defaultMarketId)!;
}

export function formatMarketLabel(market: Market): string {
  return `${market.country} (${market.currencyCode} ${market.currencySymbol})`;
}
