import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { setToken } from '../lib/api';

const CUSTOMER_KEY = 'sitara_customer';

interface AuthState {
  isLoggedIn: boolean;
  phone: string;
  isAdmin: boolean;
  authModalOpen: boolean;
  authRedirect: string;
}

function loadCustomerSession(): Pick<AuthState, 'isLoggedIn' | 'phone'> {
  try {
    const raw = localStorage.getItem(CUSTOMER_KEY);
    if (!raw) return { isLoggedIn: false, phone: '' };
    const { phone } = JSON.parse(raw) as { phone: string };
    const hasToken = !!localStorage.getItem('sitara_token');
    return phone && hasToken ? { isLoggedIn: true, phone } : { isLoggedIn: false, phone: '' };
  } catch {
    return { isLoggedIn: false, phone: '' };
  }
}

function saveCustomerSession(phone: string) {
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify({ phone }));
}

function clearCustomerSession() {
  localStorage.removeItem(CUSTOMER_KEY);
  setToken(null, 'customer');
}

function loadAdminSession(): boolean {
  return !!localStorage.getItem('sitara_admin_token');
}

const customer = loadCustomerSession();

const initialState: AuthState = {
  isLoggedIn: customer.isLoggedIn,
  phone: customer.phone,
  isAdmin: loadAdminSession(),
  authModalOpen: false,
  authRedirect: '/account',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ phone: string; token: string }>) {
      state.isLoggedIn = true;
      state.phone = action.payload.phone;
      saveCustomerSession(action.payload.phone);
      setToken(action.payload.token, 'customer');
    },
    logout(state) {
      state.isLoggedIn = false;
      state.phone = '';
      clearCustomerSession();
    },
    adminLogin(state, action: PayloadAction<string>) {
      state.isAdmin = true;
      setToken(action.payload, 'admin');
    },
    adminLogout(state) {
      state.isAdmin = false;
      setToken(null, 'admin');
    },
    openAuthModal(state, action: PayloadAction<string | undefined>) {
      state.authModalOpen = true;
      state.authRedirect = action.payload ?? '/account';
    },
    closeAuthModal(state) {
      state.authModalOpen = false;
    },
  },
});

export const { login, logout, adminLogin, adminLogout, openAuthModal, closeAuthModal } = authSlice.actions;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export default authSlice.reducer;
