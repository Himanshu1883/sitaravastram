import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  phone: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  phone: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.isLoggedIn = true;
      state.phone = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.phone = '';
    },
  },
});

export const { login, logout } = authSlice.actions;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export default authSlice.reducer;
