import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Coupon } from '../types';

interface CouponState {
  appliedCode: string | null;
  discount: number;
  coupon: Coupon | null;
}

const initialState: CouponState = {
  appliedCode: null,
  discount: 0,
  coupon: null,
};

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    applyCoupon(state, action: PayloadAction<{ code: string; discount: number; coupon: Coupon }>) {
      state.appliedCode = action.payload.code;
      state.discount = action.payload.discount;
      state.coupon = action.payload.coupon;
    },
    removeCoupon(state) {
      state.appliedCode = null;
      state.discount = 0;
      state.coupon = null;
    },
  },
});

export const { applyCoupon, removeCoupon } = couponSlice.actions;
export const selectAppliedCoupon = (state: { coupon: CouponState }) => state.coupon;
export default couponSlice.reducer;
