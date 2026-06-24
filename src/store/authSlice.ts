import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '../types/auth';
import { setToken, getToken, clearLegacyAdminToken } from '../lib/api';

const SESSION_KEY = 'sitara_session';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  authModalOpen: boolean;
  authRedirect: string;
}

function loadSession(): Pick<AuthState, 'user' | 'token'> {
  try {
    const token = getToken();
    if (!token) return { user: null, token: null };

    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return { user: null, token };
    }

    const user = JSON.parse(raw) as AuthUser;
    return user?.id ? { user, token } : { user: null, token };
  } catch {
    return { user: null, token: getToken() };
  }
}

function saveSession(user: AuthUser | null, token: string | null) {
  if (user && token) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    setToken(token);
  } else {
    localStorage.removeItem(SESSION_KEY);
    setToken(null);
    clearLegacyAdminToken();
  }
}

const session = loadSession();
clearLegacyAdminToken();

const initialState: AuthState = {
  user: session.user,
  token: session.token,
  authModalOpen: false,
  authRedirect: '/account',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      saveSession(action.payload.user, action.payload.token);
    },
    updateUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      if (state.token) saveSession(action.payload, state.token);
    },
    clearSession(state) {
      state.user = null;
      state.token = null;
      saveSession(null, null);
    },
    /** @deprecated use setSession */
    login(state, action: PayloadAction<{ phone: string; token: string; user?: AuthUser }>) {
      const user: AuthUser = action.payload.user ?? {
        id: '',
        role: 'user',
        phone: action.payload.phone,
      };
      state.user = user;
      state.token = action.payload.token;
      saveSession(user, action.payload.token);
    },
    /** @deprecated use clearSession */
    logout(state) {
      state.user = null;
      state.token = null;
      saveSession(null, null);
    },
    /** @deprecated use setSession */
    adminLogin(state, action: PayloadAction<{ token: string; user: AuthUser }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      saveSession(action.payload.user, action.payload.token);
    },
    /** @deprecated use clearSession */
    adminLogout(state) {
      state.user = null;
      state.token = null;
      saveSession(null, null);
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

export const {
  setSession,
  updateUser,
  clearSession,
  login,
  logout,
  adminLogin,
  adminLogout,
  openAuthModal,
  closeAuthModal,
} = authSlice.actions;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsLoggedIn = (state: { auth: AuthState }) => state.auth.user !== null;
export const selectIsAdmin = (state: { auth: AuthState }) => state.auth.user?.role === 'admin';
export const selectIsUser = (state: { auth: AuthState }) => state.auth.user?.role === 'user';

export default authSlice.reducer;
