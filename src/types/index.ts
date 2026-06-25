export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  video?: string;
  category: string;
  fabric: string;
  occasion: string[];
  colors: string[];
  sizes: string[];
  showColorSelector?: boolean;
  showSizeSelector?: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  details: string[];
  includes: string[];
  washCare: string;
  deliveryTime: string;
  returnPolicy: string;
  sku: string;
  stock?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  count?: number;
  featured?: boolean;
}

export interface Review {
  id: string;
  productId?: string;
  author: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
}

export interface FilterState {
  category: string[];
  priceRange: [number, number];
  fabric: string[];
  occasion: string[];
  size: string[];
  color: string[];
  inStockOnly: boolean;
  sortBy: string;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta1: string;
  cta2: string;
  ctaLink: string;
  badge?: string;
  hotspots?: { productSlug: string; x: number; y: number }[];
}

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; image?: string }[];
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface OrderStatusEvent {
  status:
    | 'placed'
    | 'confirmed'
    | 'shipped'
    | 'in_transit'
    | 'delivered'
    | 'cancelled'
    | 'returned';
  at: string;
  note?: string;
  updatedBy?: 'admin' | 'system';
}

export interface Order {
  id: string;
  date: string;
  status:
    | 'placed'
    | 'confirmed'
    | 'shipped'
    | 'in_transit'
    | 'delivered'
    | 'cancelled'
    | 'returned';
  statusHistory?: OrderStatusEvent[];
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  codFee: number;
  total: number;
  paymentMethod: 'razorpay' | 'cod';
  couponCode?: string;
  address: Address;
  trackingNumber?: string;
  phone?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minOrder: number;
  expiry: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface AdminOrder extends Order {
  customer: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  sentAt: string;
  audience: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  customer: string;
  product: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'refunded';
  date: string;
}

export interface InstagramPost {
  image: string;
  url: string;
}
