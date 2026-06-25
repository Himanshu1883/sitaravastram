import { INVOICE_SELLER } from '../../lib/invoice/buildInvoiceData';
import type { InvoiceData } from '../../lib/invoice/types';
import {
  formatInvoiceAmount,
  formatInvoiceCurrency,
  formatInvoiceDate,
  paymentMethodLabel,
} from '../../lib/invoice/format';

export default function InvoicePreview({
  data,
  printId = 'invoice-print-root',
}: {
  data: InvoiceData;
  printId?: string;
}) {
  const seller = INVOICE_SELLER;
  const { totals } = data;
  const displayItems = data.lineItems;

  return (
    <div
      id={printId}
      className="invoice-preview relative mx-auto w-full max-w-[820px] bg-white font-sans text-gray-900"
    >
      <div
        className="invoice-watermark pointer-events-none absolute inset-x-8 top-48 flex justify-center opacity-[0.06]"
        aria-hidden
      >
        <img
          src="/assets/images/sitaravastram_logo.png"
          alt=""
          className="max-h-64 w-auto object-contain"
        />
      </div>

      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex gap-3">
          <img
            src="/assets/images/sitaravastram_logo.png"
            alt=""
            className="h-12 w-12 flex-shrink-0 object-contain"
          />
          <div>
            <p className="text-lg font-bold text-gray-900">{seller.legalName}</p>
            <p className="text-sm text-gray-500">{seller.tagline}</p>
            <p className="mt-1 text-sm text-gray-600">{seller.address}</p>
            <p className="text-xs text-gray-500">
              GSTIN: {seller.gstin} | {seller.state}
            </p>
            <p className="text-xs text-gray-500">
              {seller.phone} | {seller.email}
            </p>
          </div>
        </div>

        <div className="sm:text-right">
          <p className="text-3xl font-bold tracking-wide text-gray-400 sm:text-4xl">INVOICE</p>
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-800">Invoice No:</span> {data.invoiceNumber}
            </p>
            <p>
              <span className="font-medium text-gray-800">Date:</span>{' '}
              {formatInvoiceDate(data.invoiceDate)}
            </p>
            <p>
              <span className="font-medium text-gray-800">Status:</span>{' '}
              <span className="capitalize">{data.orderStatus}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[1.6fr_1fr]">
        <div className="border border-gray-300">
          <div className="bg-[#eef2f7] px-3 py-2 text-xs font-bold uppercase tracking-wide text-gray-800">
            Bill To
          </div>
          <div className="space-y-1 px-3 py-2 text-sm text-gray-800">
            <p>{data.billTo.identity}</p>
            <p className="text-gray-600">{data.billTo.address}</p>
          </div>
        </div>
        <div className="border border-gray-300">
          <div className="bg-[#eef2f7] px-3 py-2 text-xs font-bold uppercase tracking-wide text-gray-800">
            Order Details
          </div>
          <div className="space-y-1 px-3 py-2 text-sm text-gray-800">
            <p>Order ID: {data.orderId}</p>
            <p>Items: {data.itemCount}</p>
            <p>Payment: {totals.isCOD ? 'COD' : 'PREPAID'}</p>
          </div>
        </div>
      </div>

      <div className="relative mt-6 overflow-x-auto border border-gray-300">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#eef2f7] text-left text-xs font-bold uppercase text-gray-800">
              <th className="border border-gray-300 px-2 py-2 text-center w-10">#</th>
              <th className="border border-gray-300 px-3 py-2">Description</th>
              <th className="border border-gray-300 px-2 py-2 text-right w-14">Qty</th>
              <th className="border border-gray-300 px-3 py-2 text-right w-28">Unit Price</th>
              <th className="border border-gray-300 px-3 py-2 text-right w-28">Amount</th>
            </tr>
          </thead>
          <tbody>
            {displayItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="border border-gray-300 px-3 py-4 text-center text-sm text-gray-500">
                  No line items recorded for this order.
                </td>
              </tr>
            ) : (
              displayItems.map((item, index) => (
                <tr key={item.srNo} className={index % 2 === 0 ? 'bg-[#fafafa]' : ''}>
                  <td className="border border-gray-300 px-2 py-2 text-center tabular-nums">
                    {item.srNo}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {item.details ? `${item.title} (${item.details})` : item.title}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-right tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right tabular-nums">
                    {formatInvoiceCurrency(item.unitPrice)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right tabular-nums">
                    {formatInvoiceCurrency(item.lineTotal)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="relative mt-4 flex justify-end">
        <div className="w-full max-w-xs border border-gray-300 p-3 text-sm">
          <div className="flex justify-between gap-4 py-1">
            <span className="text-gray-600">Items total (incl. GST)</span>
            <span className="tabular-nums">{formatInvoiceCurrency(totals.itemsTotal)}</span>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between gap-4 py-1 text-emerald-700">
              <span>
                Discount{totals.couponCode ? ` (${totals.couponCode})` : ''}
              </span>
              <span className="tabular-nums">{formatInvoiceAmount(-totals.discount)}</span>
            </div>
          )}
          <div className="flex justify-between gap-4 py-1">
            <span className="text-gray-600">
              GST ({(totals.gstRate * 100).toFixed(0)}%) included
            </span>
            <span className="tabular-nums">{formatInvoiceCurrency(totals.gstAmount)}</span>
          </div>
          <div className="flex justify-between gap-4 py-1">
            <span className="text-gray-600">Taxable value</span>
            <span className="tabular-nums">{formatInvoiceCurrency(totals.taxableValue)}</span>
          </div>
          <div className="flex justify-between gap-4 py-1">
            <span className="text-gray-600">Shipping</span>
            <span className="tabular-nums">
              {totals.shipping === 0 ? 'Free' : formatInvoiceCurrency(totals.shipping)}
            </span>
          </div>
          {totals.isCOD && totals.codCharge > 0 && (
            <div className="flex justify-between gap-4 py-1">
              <span className="text-gray-600">COD Charges</span>
              <span className="tabular-nums">{formatInvoiceCurrency(totals.codCharge)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between gap-4 border-t border-gray-300 pt-2 font-bold text-gray-900">
            <span>Total</span>
            <span className="tabular-nums">{formatInvoiceCurrency(totals.grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="relative mt-6 space-y-2 text-xs text-gray-500">
        <p>Order ID: {data.orderId}</p>
        <p>Payment Terms: {paymentMethodLabel(data.paymentMethod)}</p>
        <p>All product prices are inclusive of GST.</p>
        <p>This is a computer-generated invoice and does not require a signature.</p>
        <div className="border-t border-gray-200 pt-3">
          <p className="font-semibold text-gray-700">Returns &amp; Cancellation Policy</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            <li>Returns accepted within 7 days of delivery for unused items with original tags.</li>
            <li>Refunds processed within 5–7 business days after quality inspection.</li>
            <li>COD orders: refund via UPI or bank transfer after pickup confirmation.</li>
          </ul>
        </div>
        <p className="pt-2 text-center text-sm font-semibold text-gray-800">
          Thank you for choosing Sitara Vastram
        </p>
      </div>
    </div>
  );
}
