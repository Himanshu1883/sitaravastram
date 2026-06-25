/** Plain amount for invoice tables — negatives in parentheses like (50.00). */
export function formatInvoiceAmount(amount: number): string {
  const formatted = Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return amount < 0 ? `(${formatted})` : formatted;
}

export function formatInvoiceCurrency(amount: number): string {
  if (amount < 0) return `(₹${formatInvoiceAmount(amount).slice(1, -1)})`;
  return `₹${formatInvoiceAmount(amount)}`;
}

export function formatInvoiceDate(dateStr: string): string {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
}

export function paymentMethodLabel(method: 'razorpay' | 'cod'): string {
  return method === 'cod' ? 'Cash on Delivery' : 'Online (Prepaid)';
}
