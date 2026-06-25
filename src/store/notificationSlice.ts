import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { UserNotification } from '../types';

interface NotificationsState {
  items: UserNotification[];
  unreadCount: number;
  loaded: boolean;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  loaded: false,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<UserNotification[]>) {
      state.items = action.payload;
      state.unreadCount = action.payload.filter(n => !n.read).length;
      state.loaded = true;
    },
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },
    markRead(state, action: PayloadAction<string>) {
      const note = state.items.find(n => n.id === action.payload);
      if (note && !note.read) {
        note.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead(state) {
      state.items.forEach(n => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    clearNotifications(state) {
      state.items = [];
      state.unreadCount = 0;
      state.loaded = false;
    },
  },
});

export const {
  setNotifications,
  setUnreadCount,
  markRead,
  markAllRead,
  clearNotifications,
} = notificationsSlice.actions;

export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount;
export const selectNotifications = (state: RootState) => state.notifications.items;

export default notificationsSlice.reducer;
