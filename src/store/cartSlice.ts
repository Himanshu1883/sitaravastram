import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product; size: string; color: string; quantity?: number }>) {
      const { product, size, color, quantity = 1 } = action.payload;
      const existing = state.items.find(
        i => i.product.id === product.id && i.size === size && i.color === color
      );
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, size, color, quantity });
      }
    },
    removeFromCart(state, action: PayloadAction<{ productId: string; size: string; color: string }>) {
      state.items = state.items.filter(
        i => !(i.product.id === action.payload.productId && i.size === action.payload.size && i.color === action.payload.color)
      );
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; size: string; color: string; quantity: number }>) {
      const item = state.items.find(
        i => i.product.id === action.payload.productId && i.size === action.payload.size && i.color === action.payload.color
      );
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },
    clearCart(state) {
      state.items = [];
    },
    toggleCart(state) {
      state.isOpen = !state.isOpen;
    },
    closeCart(state) {
      state.isOpen = false;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, closeCart } = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartOpen = (state: { cart: CartState }) => state.cart.isOpen;

export default cartSlice.reducer;
