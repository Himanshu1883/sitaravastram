/** Stable key from English UI copy (used as i18n lookup suffix). */
export function textKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/₹/g, 'inr')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}
