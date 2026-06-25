import { useEffect, useMemo, useState } from 'react';
import { X, FileDown, FileSpreadsheet, Printer, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Order } from '../../types';
import { buildInvoiceData } from '../../lib/invoice/buildInvoiceData';
import { downloadInvoiceExcel } from '../../lib/invoice/exportExcel';
import { downloadInvoicePdfFromApi } from '../../lib/invoice/exportPdf';
import { fetchOrderInvoicePdf } from '../../lib/api';
import InvoicePreview from './InvoicePreview';

export default function OrderInvoiceModal({
  order,
  customerName,
  onClose,
}: {
  order: Order | null;
  customerName?: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState<'pdf' | 'excel' | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const invoiceData = useMemo(
    () => (order ? buildInvoiceData(order, customerName) : null),
    [order, customerName],
  );

  useEffect(() => {
    if (!order) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [order, onClose]);

  const handlePrint = async () => {
    if (!order) return;
    setDownloading('pdf');
    setPdfError(null);
    try {
      const blob = await fetchOrderInvoicePdf(order.id);
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) {
        win.addEventListener('load', () => {
          win.focus();
          win.print();
        });
      } else {
        await downloadInvoicePdfFromApi(order.id);
      }
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : t('invoice.downloadFailed'));
    } finally {
      setDownloading(null);
    }
  };

  const handlePdf = async () => {
    if (!order) return;
    setDownloading('pdf');
    setPdfError(null);
    try {
      await downloadInvoicePdfFromApi(order.id);
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : t('invoice.downloadFailed'));
    } finally {
      setDownloading(null);
    }
  };

  const handleExcel = async () => {
    if (!invoiceData) return;
    setDownloading('excel');
    try {
      await downloadInvoiceExcel(invoiceData);
    } finally {
      setDownloading(null);
    }
  };

  if (!order || !invoiceData) return null;

  return (
    <div
      className="invoice-modal-overlay fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="invoice-modal-panel flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-luxury-lg sm:rounded-2xl"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-labelledby="invoice-modal-title"
      >
        <div className="no-print flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
          <div>
            <h3 id="invoice-modal-title" className="font-heading text-xl font-semibold text-navy-700">
              {t('invoice.title', { id: order.id })}
            </h3>
            <p className="mt-0.5 font-body text-sm text-gray-500">{invoiceData.billTo.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-cream-100 hover:text-navy-700"
            aria-label={t('account.close')}
          >
            <X size={20} />
          </button>
        </div>

        <div className="invoice-modal-body flex-1 overflow-y-auto bg-[#f5f5f5] px-4 py-5 sm:px-6">
          <div className="invoice-print-frame rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
            <InvoicePreview data={invoiceData} />
          </div>
        </div>

        <div className="no-print flex flex-wrap gap-2 border-t border-gray-100 bg-cream-50/80 px-5 py-4 sm:px-6">
          {pdfError && (
            <p className="w-full font-body text-sm text-red-500">{pdfError}</p>
          )}
          <button
            type="button"
            onClick={handlePrint}
            disabled={downloading !== null}
            className="btn-outline-navy inline-flex items-center gap-2 text-xs disabled:opacity-50"
          >
            {downloading === 'pdf' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Printer size={14} />
            )}
            {t('invoice.print')}
          </button>
          <button
            type="button"
            onClick={handlePdf}
            disabled={downloading !== null}
            className="btn-outline-navy inline-flex items-center gap-2 text-xs disabled:opacity-50"
          >
            {downloading === 'pdf' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <FileDown size={14} />
            )}
            {t('invoice.downloadPdf')}
          </button>
          <button
            type="button"
            onClick={handleExcel}
            disabled={downloading !== null}
            className="btn-primary inline-flex items-center gap-2 text-xs disabled:opacity-50"
          >
            {downloading === 'excel' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <FileSpreadsheet size={14} />
            )}
            {t('invoice.downloadExcel')}
          </button>
        </div>
      </div>
    </div>
  );
}
