import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  type CurrencyCode,
  defaultMarketId,
  getMarketById,
  markets,
} from '../data/markets';

interface CurrencyState {
  marketId: string;
  code: CurrencyCode;
}

function loadCurrencyState(): CurrencyState {
  try {
    const savedMarket = localStorage.getItem('sitara_market');
    if (savedMarket) {
      const market = markets.find(m => m.id === savedMarket);
      if (market) {
        return { marketId: market.id, code: market.currencyCode };
      }
    }

    const legacy = localStorage.getItem('sitara_currency');
    if (legacy === 'USD') {
      return { marketId: 'us', code: 'USD' };
    }
  } catch {
    /* ignore */
  }

  const fallback = getMarketById(defaultMarketId);
  return { marketId: fallback.id, code: fallback.currencyCode };
}

const initialState: CurrencyState = loadCurrencyState();

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setMarket(state, action: PayloadAction<string>) {
      const market = getMarketById(action.payload);
      state.marketId = market.id;
      state.code = market.currencyCode;
      localStorage.setItem('sitara_market', market.id);
      localStorage.setItem('sitara_currency', market.currencyCode);
    },
    setCurrency(state, action: PayloadAction<CurrencyCode>) {
      const market =
        markets.find(m => m.currencyCode === action.payload && m.id === defaultMarketId) ??
        markets.find(m => m.currencyCode === action.payload);
      if (market) {
        state.marketId = market.id;
        state.code = market.currencyCode;
        localStorage.setItem('sitara_market', market.id);
        localStorage.setItem('sitara_currency', market.currencyCode);
      }
    },
  },
});

export const { setMarket, setCurrency } = currencySlice.actions;
export const selectCurrency = (state: { currency: CurrencyState }) => state.currency.code;
export const selectMarketId = (state: { currency: CurrencyState }) => state.currency.marketId;
export default currencySlice.reducer;
