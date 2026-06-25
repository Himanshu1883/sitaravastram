import type { Order } from '../../types';
import type { InvoiceData } from './types';
import { computeInvoiceTotals } from './computeTotals';
import { BRAND_NAME, STORE_CONTACT } from '../brand';
import { normalizeOrderLineItems, invoiceItemCount } from './normalizeLineItems';

function buildBillTo(order: Order, customerName?: string) {
  const { address } = order;
  const name = address.name || customerName || order.customer || 'Customer';
  const phone = address.phone ? `Phone: +91 ${address.phone}` : order.phone ? `Phone: +91 ${order.phone}` : '';
  const email = order.email ? `Email: ${order.email}` : '';
  const identity = [name, phone, email].filter(Boolean).join(' | ');

  const compactAddress = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.pincode,
    address.country || 'India',
  ]
    .filter(Boolean)
    .join(', ');

  return {
    name,
    identity: identity || 'Customer details not provided',
    address: compactAddress || 'Address not provided',
  };
}

export function buildInvoiceNumber(orderId: string) {
  return `INV-${new Date().getFullYear()}-${orderId.replace(/\D/g, '').slice(-6).toUpperCase()}`;
}

export function buildInvoiceData(order: Order, customerName?: string): InvoiceData {
  const normalized = normalizeOrderLineItems({
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount,
    total: order.total,
    customer: order.customer,
    orderId: order.id,
    id: order.id,
  });

  const lineItems = normalized.map(line => ({
    srNo: line.srNo,
    title: line.title,
    details: line.details || undefined,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
    lineTotal: line.lineTotal,
  }));

  const totals = computeInvoiceTotals(order);

  return {
    invoiceNumber: buildInvoiceNumber(order.id),
    invoiceDate: order.date,
    orderId: order.id,
    orderStatus: order.status.replace(/_/g, ' '),
    paymentMethod: order.paymentMethod,
    itemCount: invoiceItemCount(normalized),
    billTo: buildBillTo(order, customerName),
    lineItems,
    totals,
    hiddenItemCount: 0,
  };
}

export const INVOICE_SELLER = {
  legalName: BRAND_NAME,
  tagline: 'Premium Indian Ethnic Wear',
  address: `${STORE_CONTACT.line1}, ${STORE_CONTACT.city}, ${STORE_CONTACT.state} — ${STORE_CONTACT.pincode}`,
  state: STORE_CONTACT.state,
  gstin: 'Applied for',
  phone: STORE_CONTACT.phone,
  email: STORE_CONTACT.email,
};
