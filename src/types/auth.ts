export type UserRole = 'user' | 'admin';

export type AuthProvider = 'phone' | 'google' | 'email';

export interface AuthUser {
  id: string;
  role: UserRole;
  phone?: string;
  email?: string;
  name?: string;
  authProviders?: AuthProvider[];
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}
