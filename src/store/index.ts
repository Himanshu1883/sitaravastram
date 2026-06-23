import { configureStore, type Middleware, type UnknownAction } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import couponReducer from './couponSlice';
import ordersReducer from './ordersSlice';
import authReducer from './authSlice';
import currencyReducer from './currencySlice';

const CART_KEY = 'sitara_cart';
const WISHLIST_KEY = 'sitara_wishlist';

function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const preloadedCart = loadState(CART_KEY, { items: [], isOpen: false });
const preloadedWishlist = loadState(WISHLIST_KEY, { productIds: [] });

const localStorageMiddleware: Middleware = store => next => action => {
  const result = next(action);
  const typed = action as UnknownAction;
  const state = store.getState();
  if (typed.type?.startsWith('cart/')) {
    localStorage.setItem(CART_KEY, JSON.stringify({ items: state.cart.items, isOpen: false }));
  }
  if (typed.type?.startsWith('wishlist/')) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify({ productIds: state.wishlist.productIds }));
  }
  if (typed.type?.startsWith('orders/addOrder')) {
    localStorage.setItem('sitara_orders', JSON.stringify(state.orders.orders));
  }
  return result;
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    coupon: couponReducer,
    orders: ordersReducer,
    auth: authReducer,
    currency: currencyReducer,
  },
  preloadedState: {
    cart: preloadedCart,
    wishlist: preloadedWishlist,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;