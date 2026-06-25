export interface InvoiceLineItem {
  srNo: number;
  title: string;
  details?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface InvoiceBillTo {
  name: string;
  identity: string;
  address: string;
}

export interface InvoiceTotals {
  itemsTotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  codCharge: number;
  taxableValue: number;
  gstAmount: number;
  gstRate: number;
  grandTotal: number;
  isCOD: boolean;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  orderId: string;
  orderStatus: string;
  paymentMethod: 'razorpay' | 'cod';
  itemCount: number;
  billTo: InvoiceBillTo;
  lineItems: InvoiceLineItem[];
  totals: InvoiceTotals;
  hiddenItemCount?: number;
}

/** @deprecated use InvoiceLineItem */
export interface InvoiceLine {
  description: string;
  amount: number;
}
