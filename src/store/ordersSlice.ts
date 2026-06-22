import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Order } from '../types';
import { loadOrders } from '../lib/storage';

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: loadOrders(),
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.unshift(action.payload);
    },
    updateOrderStatus(state, action: PayloadAction<{ id: string; status: Order['status'] }>) {
      const order = state.orders.find(o => o.id === action.payload.id);
      if (order) order.status = action.payload.status;
    },
    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
    },
  },
});

export const { addOrder, updateOrderStatus, setOrders } = ordersSlice.actions;
export const selectOrders = (state: { orders: OrdersState }) => state.orders.orders;
export default ordersSlice.reducer;
