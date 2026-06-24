import { combineReducers, configureStore, type Middleware, type UnknownAction } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import couponReducer from './couponSlice';
import ordersReducer from './ordersSlice';
import authReducer from './authSlice';
import currencyReducer from './currencySlice';
import { catalogApi } from './catalogApi';
import { preloadHomepageImages } from '../lib/preloadImages';

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

const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
  coupon: couponReducer,
  orders: ordersReducer,
  auth: authReducer,
  currency: currencyReducer,
  [catalogApi.reducerPath]: catalogApi.reducer,
});

const persistConfig = {
  key: 'sitara-catalog',
  storage,
  whitelist: [catalogApi.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // Partial cart/wishlist hydration from legacy localStorage keys
  // @ts-expect-error redux-persist PersistPartial vs partial preloadedState
  preloadedState: {
    cart: preloadedCart,
    wishlist: preloadedWishlist,
  },
  // @ts-expect-error RTK middleware tuple with persistReducer + catalogApi
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(catalogApi.middleware, localStorageMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/** Warm catalog cache + preload above-the-fold images (deduped by RTK Query). */
export function prefetchCatalog() {
  store.dispatch(catalogApi.endpoints.getHomepage.initiate(undefined, { forceRefetch: false }))
    .unwrap()
    .then(preloadHomepageImages)
    .catch(() => undefined);
  store.dispatch(catalogApi.endpoints.getProducts.initiate(undefined, { forceRefetch: false }));
  store.dispatch(catalogApi.endpoints.getCategories.initiate(undefined, { forceRefetch: false }));
}
