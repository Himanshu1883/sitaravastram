/** Demo admin credentials — replace with real auth in production */
export const ADMIN_EMAIL = 'admin@sitaravastram.com';
export const ADMIN_PASSWORD = 'sitara2026';

export function validateAdminCredentials(email: string, password: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export const ADMIN_SESSION_KEY = 'sitara_admin_session';

export function loadAdminSession(): boolean {
  try {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

export function saveAdminSession(active: boolean) {
  if (active) {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
  } else {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
}
