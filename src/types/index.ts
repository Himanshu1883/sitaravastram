export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  fabric: string;
  occasion: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  description: string;
  details: string[];
  sku: string;
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
}

export interface Review {
  id: string;
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

export interface Order {
  id: string;
  date: string;
  status: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  total: number;
  address: Address;
  trackingNumber?: string;
}
