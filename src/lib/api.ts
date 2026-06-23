export const API_BASE = import.meta.env.VITE_API_URL || '';

export { mediaUrl, mediaUrls, MEDIA_BASE, type MediaVariant } from './media';

const TOKEN_KEY = 'sitara_token';
const ADMIN_TOKEN_KEY = 'sitara_admin_token';

export function getToken(role: 'customer' | 'admin' = 'customer'): string | null {
  return localStorage.getItem(role === 'admin' ? ADMIN_TOKEN_KEY : TOKEN_KEY);
}

export function setToken(token: string | null, role: 'customer' | 'admin' = 'customer') {
  const key = role === 'admin' ? ADMIN_TOKEN_KEY : TOKEN_KEY;
  if (token) localStorage.setItem(key, token);
  else localStorage.removeItem(key);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(
  path: string,
  options: RequestInit & { auth?: 'customer' | 'admin' | false } = {},
): Promise<T> {
  const { auth = false, ...init } = options;
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (auth) {
    const token = getToken(auth === 'admin' ? 'admin' : 'customer');
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(res.status, body.error || 'Request failed');
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function uploadMedia(file: File): Promise<{ fileId: string; url: string }> {
  const form = new FormData();
  form.append('file', file);
  return api('/api/admin/media', { method: 'POST', body: form, auth: 'admin' });
}

// Auth
export const sendOtp = (phone: string) =>
  api<{ success: boolean }>('/api/auth/otp/send', { method: 'POST', body: JSON.stringify({ phone }) });

export const verifyOtp = (phone: string, otp: string) =>
  api<{ token: string; user: { phone: string } }>('/api/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ phone, otp }),
  });

export const adminLoginApi = (email: string, password: string) =>
  api<{ token: string; admin: { email: string; name: string } }>('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

// Catalog
export const fetchProducts = (params?: Record<string, string>) => {
  const qs = params ? `?${new URLSearchParams(params)}` : '';
  return api<import('../types').Product[]>(`/api/products${qs}`);
};

export const fetchProduct = (slug: string) =>
  api<import('../types').Product>(`/api/products/${slug}`);

export const fetchCategories = (featured?: boolean) =>
  api<import('../types').Category[]>(`/api/categories${featured ? '?featured=true' : ''}`);

export const fetchHomepage = () => api<HomepageData>('/api/homepage');

export const fetchReviews = (productId?: string) =>
  api<import('../types').Review[]>(`/api/reviews${productId ? `?productId=${productId}` : ''}`);

export interface FeaturedCollectionItem {
  id: number;
  image: string;
  imageAlt: string;
  href: string;
  reverse: boolean;
}

export interface HomepageData {
  heroSlides: import('../types').HeroSlide[];
  homepageCategories: import('../types').Category[];
  fabrics: { name: string; icon: string; description: string; color: string; image: string }[];
  occasions: { name: string; description: string; image: string; slug: string }[];
  instagramPosts: import('../types').InstagramPost[];
  reviews: import('../types').Review[];
  newArrivals: import('../types').Product[];
  bestSellers: import('../types').Product[];
  occasionSlugMap: Record<string, string>;
  allColors: string[];
  featuredCollections: FeaturedCollectionItem[];
}

// Commerce
export const validateCouponApi = (code: string, subtotal: number) =>
  api<{ valid: boolean; error?: string; coupon?: import('../types').Coupon; discount?: number }>(
    '/api/coupons/validate',
    { method: 'POST', body: JSON.stringify({ code, subtotal }) },
  );

export const createOrder = (order: unknown) =>
  api<import('../types').Order>('/api/orders', { method: 'POST', body: JSON.stringify(order), auth: 'customer' });

export const fetchOrders = () =>
  api<import('../types').Order[]>('/api/orders', { auth: 'customer' });

export const submitReview = (data: {
  productId?: string;
  author: string;
  location?: string;
  rating: number;
  comment: string;
}) =>
  api<import('../types').Review>('/api/reviews', { method: 'POST', body: JSON.stringify(data), auth: 'customer' });

// Admin
export const adminFetchProducts = () => api<import('../types').Product[]>('/api/admin/products', { auth: 'admin' });
export const adminCreateProduct = (product: unknown) =>
  api<import('../types').Product>('/api/admin/products', { method: 'POST', body: JSON.stringify(product), auth: 'admin' });
export const adminUpdateProduct = (id: string, product: unknown) =>
  api<import('../types').Product>(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(product), auth: 'admin' });
export const adminDeleteProduct = (id: string) =>
  api<{ success: boolean }>(`/api/admin/products/${id}`, { method: 'DELETE', auth: 'admin' });
export const adminUpdateInventory = (id: string, data: { stock: number; inStock: boolean }) =>
  api<import('../types').Product>(`/api/admin/products/${id}/inventory`, { method: 'PATCH', body: JSON.stringify(data), auth: 'admin' });

export const adminFetchCategories = () => api<import('../types').Category[]>('/api/admin/categories', { auth: 'admin' });
export const adminCreateCategory = (cat: unknown) =>
  api<import('../types').Category>('/api/admin/categories', { method: 'POST', body: JSON.stringify(cat), auth: 'admin' });
export const adminDeleteCategory = (id: string) =>
  api<{ success: boolean }>(`/api/admin/categories/${id}`, { method: 'DELETE', auth: 'admin' });

export const adminFetchCoupons = () => api<import('../types').Coupon[]>('/api/admin/coupons', { auth: 'admin' });
export const adminCreateCoupon = (coupon: unknown) =>
  api<import('../types').Coupon>('/api/admin/coupons', { method: 'POST', body: JSON.stringify(coupon), auth: 'admin' });
export const adminUpdateCoupon = (id: string, data: unknown) =>
  api<import('../types').Coupon>(`/api/admin/coupons/${id}`, { method: 'PATCH', body: JSON.stringify(data), auth: 'admin' });

export const adminFetchOrders = () => api<import('../types').AdminOrder[]>('/api/admin/orders', { auth: 'admin' });
export const adminUpdateOrderStatus = (id: string, status: string) =>
  api<import('../types').Order>(`/api/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }), auth: 'admin' });

export const adminFetchReturns = () => api<import('../types').ReturnRequest[]>('/api/admin/returns', { auth: 'admin' });
export const adminUpdateReturn = (id: string, status: string) =>
  api<import('../types').ReturnRequest>(`/api/admin/returns/${id}`, { method: 'PATCH', body: JSON.stringify({ status }), auth: 'admin' });

export const adminFetchNotifications = () =>
  api<import('../types').Notification[]>('/api/admin/notifications', { auth: 'admin' });
export const adminCreateNotification = (data: unknown) =>
  api<import('../types').Notification>('/api/admin/notifications', { method: 'POST', body: JSON.stringify(data), auth: 'admin' });

export const adminFetchDashboard = () => api<{
  metrics: { products: number; orders: number; lowStock: number; revenue: number; pendingReturns: number };
  recentOrders: { id: string; date: string; status: string; customer: string; total: number }[];
}>('/api/admin/dashboard', { auth: 'admin' });
