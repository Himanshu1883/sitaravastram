import { useSelector } from 'react-redux';
import { formatPrice } from '../lib/currency';
import { selectCurrency } from '../store/currencySlice';
import type { RootState } from '../store';

export function useFormatPrice() {
  const currency = useSelector((state: RootState) => selectCurrency(state));
  return (amountInr: number) => formatPrice(amountInr, currency);
}
