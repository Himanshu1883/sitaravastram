import type { CurrencyCode } from '../data/markets';

/** INR value of 1 unit of foreign currency (products are stored in INR) */
const INR_PER_UNIT: Record<CurrencyCode, number> = {
  INR: 1,
  USD: 83,
  EUR: 90,
  GBP: 105,
  AUD: 54,
  CAD: 61,
  AED: 22.6,
  SGD: 62,
  NZD: 50,
  CHF: 95,
  JPY: 0.55,
  SEK: 7.8,
  NOK: 7.6,
  DKK: 12,
  HKD: 10.6,
  MYR: 18,
  SAR: 22,
  QAR: 22.8,
  ZAR: 4.5,
  BRL: 16,
  MXN: 4.8,
  THB: 2.3,
  KRW: 0.062,
  PHP: 1.45,
};

const ZERO_DECIMAL: CurrencyCode[] = ['JPY', 'KRW'];

const CURRENCY_LOCALE: Partial<Record<CurrencyCode, string>> = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  AUD: 'en-AU',
  CAD: 'en-CA',
  AED: 'en-AE',
  SGD: 'en-SG',
  JPY: 'ja-JP',
  HKD: 'en-HK',
  MYR: 'ms-MY',
  SAR: 'ar-SA',
  BRL: 'pt-BR',
  MXN: 'es-MX',
  THB: 'th-TH',
  KRW: 'ko-KR',
  PHP: 'en-PH',
};

export function convertFromInr(amountInr: number, currency: CurrencyCode): number {
  const rate = INR_PER_UNIT[currency] ?? INR_PER_UNIT.USD;
  const value = amountInr / rate;
  if (ZERO_DECIMAL.includes(currency)) return Math.round(value);
  return Math.round(value * 100) / 100;
}

export function formatPrice(amountInr: number, currency: CurrencyCode): string {
  const value = convertFromInr(amountInr, currency);

  if (currency === 'INR') {
    return `₹${Math.round(value).toLocaleString('en-IN')}`;
  }

  const locale = CURRENCY_LOCALE[currency] ?? 'en-US';
  const noDecimals = ZERO_DECIMAL.includes(currency);

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: noDecimals ? 0 : 2,
    maximumFractionDigits: noDecimals ? 0 : 2,
  }).format(value);
}

export function currencySymbol(currency: CurrencyCode): string {
  const symbols: Partial<Record<CurrencyCode, string>> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AUD: 'A$',
    CAD: 'C$',
    AED: 'AED',
    SGD: 'S$',
    JPY: '¥',
    KRW: '₩',
    THB: '฿',
    PHP: '₱',
    BRL: 'R$',
    MYR: 'RM',
  };
  return symbols[currency] ?? currency;
}
