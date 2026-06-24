import type { AuthUser } from '../../types/auth';

/** Post-login navigation — shared by OTP, profile completion, and future Google auth. */
export function authRedirectPath(user: AuthUser, fallback = '/account'): string {
  if (user.role === 'admin') return '/admin/dashboard';
  return fallback;
}
