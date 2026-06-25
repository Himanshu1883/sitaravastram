export const INVOICE_GST_RATE = 0.05;

export function to2(value: number) {
  return Number((Number(value) || 0).toFixed(2));
}

export function computeInvoiceTotals(order: {
  subtotal: number;
  discount: number;
  shipping: number;
  codFee: number;
  total: number;
  paymentMethod: 'razorpay' | 'cod';
  couponCode?: string;
  items: { product: { price: number }; quantity: number }[];
}) {
  const isCOD = order.paymentMethod === 'cod';
  const lineSum = to2(
    order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );
  const itemsTotal = to2(Math.max(0, (order.subtotal || lineSum) - (order.discount || 0)));
  const codCharge = to2(order.codFee || 0);
  const shipping = to2(order.shipping || 0);
  const gstRate = INVOICE_GST_RATE;
  const taxableValue = to2(itemsTotal / (1 + gstRate));
  const gstAmount = to2(itemsTotal - taxableValue);
  const computedGrandTotal = to2(itemsTotal + shipping + codCharge);
  const orderAmount = to2(order.total);
  const grandTotal =
    orderAmount > 0 && Math.abs(orderAmount - computedGrandTotal) <= 1
      ? orderAmount
      : computedGrandTotal;

  return {
    isCOD,
    itemsTotal: itemsTotal > 0 ? itemsTotal : lineSum,
    discount: to2(order.discount || 0),
    couponCode: order.couponCode,
    shipping,
    codCharge,
    taxableValue,
    gstAmount,
    gstRate,
    grandTotal,
  };
}
