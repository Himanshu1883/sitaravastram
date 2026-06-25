export function formatInvoiceAmount(
  value = 0,
  useRupeeSymbol = true,
): string {
  const amount = Number(value) || 0;
  const formatted = Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const prefix = useRupeeSymbol ? '₹' : 'Rs. ';
  if (amount < 0) return `(${prefix}${formatted})`;
  return `${prefix}${formatted}`;
}
