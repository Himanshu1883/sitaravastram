import { downloadBlob } from './download';
import { fetchOrderInvoicePdf } from '../api';

export async function downloadInvoicePdfFromApi(orderId: string) {
  const blob = await fetchOrderInvoicePdf(orderId);
  downloadBlob(blob, `invoice-${orderId}.pdf`, 'application/pdf');
}
