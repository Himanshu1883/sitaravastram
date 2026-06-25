export interface NormalizedLineItem {
  srNo: number;
  title: string;
  details: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

function to2(value: number) {
  return Number((Number(value) || 0).toFixed(2));
}

function readItemRow(item: unknown): {
  title: string;
  details: string;
  quantity: number;
  unitPrice: number;
} | null {
  if (!item || typeof item !== 'object') return null;

  const row = item as Record<string, unknown>;
  const product =
    row.product && typeof row.product === 'object'
      ? (row.product as Record<string, unknown>)
      : {};

  const quantity = Number(row.quantity) || 0;
  const unitPrice = Number(product.price ?? row.price ?? row.unitPrice) || 0;
  const title = String(product.name ?? row.title ?? row.name ?? '').trim();
  const size = row.size ? String(row.size) : '';
  const color = row.color ? String(row.color) : '';
  const details = [
    size ? `Size: ${size}` : '',
    color ? `Color: ${color}` : '',
  ]
    .filter(Boolean)
    .join(' | ');

  if (!title && quantity <= 0 && unitPrice <= 0) return null;

  return {
    title: title || 'Product',
    details,
    quantity: quantity > 0 ? quantity : 1,
    unitPrice,
  };
}

function fallbackLineItem(order: {
  subtotal?: number;
  discount?: number;
  total?: number;
  customer?: string;
  orderId?: string;
  id?: string;
}): NormalizedLineItem | null {
  const itemsTotal = to2(
    Math.max(0, (Number(order.subtotal) || 0) - (Number(order.discount) || 0)),
  );
  const amount = itemsTotal > 0 ? itemsTotal : to2(Number(order.total) || 0);
  if (amount <= 0) return null;

  const orderRef = order.orderId || order.id;
  return {
    srNo: 1,
    title: order.customer
      ? `${order.customer} — Sitara Vastram order`
      : 'Sitara Vastram order',
    details: orderRef ? `Order ${orderRef}` : '',
    quantity: 1,
    unitPrice: amount,
    lineTotal: amount,
  };
}

/** Normalize cart line items; synthesize one row when legacy orders have totals but empty items[]. */
export function normalizeOrderLineItems(order: {
  items?: unknown[];
  subtotal?: number;
  discount?: number;
  total?: number;
  customer?: string;
  orderId?: string;
  id?: string;
}): NormalizedLineItem[] {
  const raw = Array.isArray(order.items) ? order.items : [];
  const parsed: NormalizedLineItem[] = [];

  raw.forEach((item, index) => {
    const row = readItemRow(item);
    if (!row) return;

    const lineTotal =
      row.unitPrice > 0 ? to2(row.unitPrice * row.quantity) : 0;

    parsed.push({
      srNo: index + 1,
      title: row.title,
      details: row.details,
      quantity: row.quantity,
      unitPrice: row.unitPrice,
      lineTotal,
    });
  });

  const withTotals = parsed.map((line, index) => {
    if (line.lineTotal > 0) return { ...line, srNo: index + 1 };
    const share = to2(
      (Number(order.subtotal) || Number(order.total) || 0) / Math.max(parsed.length, 1),
    );
    return {
      ...line,
      srNo: index + 1,
      unitPrice: share,
      lineTotal: share,
    };
  }).filter(line => line.title);

  if (withTotals.length > 0) {
    return withTotals.map((line, index) => ({ ...line, srNo: index + 1 }));
  }

  const fallback = fallbackLineItem(order);
  return fallback ? [fallback] : [];
}

export function invoiceItemCount(lines: NormalizedLineItem[]) {
  const qty = lines.reduce((sum, line) => sum + line.quantity, 0);
  return qty > 0 ? qty : lines.length;
}
