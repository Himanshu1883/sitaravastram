const ADMIN_KEY = 'sitara_admin_data';
const ORDERS_KEY = 'sitara_orders';
const REVIEWS_KEY = 'sitara_reviews';
const ABANDONED_KEY = 'sitara_abandoned_carts';

export interface AdminData {
  products: import('../types').Product[];
  categories: import('../types').Category[];
  coupons: import('../types').Coupon[];
  orders: import('../types').AdminOrder[];
  returns: import('../types').ReturnRequest[];
  notifications: import('../types').Notification[];
}

export function loadAdminData(defaults: AdminData): AdminData {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

export function saveAdminData(data: Partial<AdminData>) {
  const current = loadAdminData(data as AdminData);
  localStorage.setItem(ADMIN_KEY, JSON.stringify({ ...current, ...data }));
}

export function loadOrders(): import('../types').Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: import('../types').Order) {
  const orders = loadOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function loadReviews(): import('../types').Review[] {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReview(review: import('../types').Review) {
  const reviews = loadReviews();
  reviews.unshift(review);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

export function saveAbandonedCart(items: import('../types').CartItem[]) {
  if (items.length === 0) return;
  const carts = loadAbandonedCarts();
  carts.unshift({ id: Date.now().toString(), items, savedAt: new Date().toISOString() });
  localStorage.setItem(ABANDONED_KEY, JSON.stringify(carts.slice(0, 20)));
}

export function loadAbandonedCarts(): { id: string; items: import('../types').CartItem[]; savedAt: string }[] {
  try {
    const raw = localStorage.getItem(ABANDONED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
