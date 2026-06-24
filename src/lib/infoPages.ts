export type InfoPageKey =
  | 'sizeGuide'
  | 'shipping'
  | 'returns'
  | 'faqs'
  | 'contact'
  | 'privacyPolicy'
  | 'terms'
  | 'cookies';

export const INFO_PAGE_BY_PATH: Record<string, InfoPageKey> = {
  '/size-guide': 'sizeGuide',
  '/shipping': 'shipping',
  '/returns': 'returns',
  '/faqs': 'faqs',
  '/contact': 'contact',
  '/privacy-policy': 'privacyPolicy',
  '/terms': 'terms',
  '/cookies': 'cookies',
};

export function resolveInfoPageKey(pathname: string): InfoPageKey | null {
  const normalized = pathname.replace(/\/$/, '') || '/';
  return INFO_PAGE_BY_PATH[normalized] ?? null;
}
