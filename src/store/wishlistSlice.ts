import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  productIds: string[];
}

const initialState: WishlistState = {
  productIds: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<string>) {
      const idx = state.productIds.indexOf(action.payload);
      if (idx >= 0) {
        state.productIds.splice(idx, 1);
      } else {
        state.productIds.push(action.payload);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.productIds = state.productIds.filter(id => id !== action.payload);
    },
  },
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;

export const selectWishlistIds = (state: { wishlist: WishlistState }) => state.wishlist.productIds;
export const selectIsWishlisted = (productId: string) => (state: { wishlist: WishlistState }) =>
  state.wishlist.productIds.includes(productId);

export default wishlistSlice.reducer;
