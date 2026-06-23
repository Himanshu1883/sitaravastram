import { useState } from 'react';
import { FileText, Printer } from 'lucide-react';
import type { AdminData, AdminApi } from '../../hooks/useAdminApi';
import type { AdminOrder } from '../../types';

export default function OrdersTab({ data, api }: { data: AdminData; api: AdminApi }) {
  const [invoiceOrder, setInvoiceOrder] = useState<AdminOrder | null>(null);
  const [labelOrder, setLabelOrder] = useState<AdminOrder | null>(null);

  const updateStatus = async (id: string, status: AdminOrder['status']) => {
    await api.updateOrderStatus(id, status);
  };

  return (
    <div className="p-6 space-y-4">
      {data.orders.map(order => (
        <div key={order.id} className="bg-white rounded-sm shadow-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <p className="font-semibold text-navy-700">#{order.id} — {order.customer}</p>
              <p className="text-xs text-gray-500">{order.date} · ₹{order.total.toLocaleString('en-IN')} · {order.paymentMethod.toUpperCase()}</p>
            </div>
            <select value={order.status} onChange={e => updateStatus(order.id, e.target.value as AdminOrder['status'])} className="text-xs border border-gray-200 rounded-sm px-2 py-1.5 capitalize">
              {['placed', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setInvoiceOrder(order)} className="text-xs flex items-center gap-1 border border-rosegold-200 px-3 py-1.5 rounded-sm hover:bg-cream-100"><FileText size={12} />Invoice</button>
            <button onClick={() => setLabelOrder(order)} className="text-xs flex items-center gap-1 border border-rosegold-200 px-3 py-1.5 rounded-sm hover:bg-cream-100"><Printer size={12} />Shipping Label</button>
          </div>
        </div>
      ))}

      {invoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setInvoiceOrder(null)}>
          <div className="bg-white max-w-md w-full p-8 rounded-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-heading text-xl font-semibold text-navy-700 mb-4">Invoice #{invoiceOrder.id}</h3>
            <p className="text-sm text-gray-600 mb-1">Customer: {invoiceOrder.customer}</p>
            <p className="text-sm text-gray-600 mb-1">Date: {invoiceOrder.date}</p>
            <p className="text-sm text-gray-600 mb-4">Payment: {invoiceOrder.paymentMethod}</p>
            <div className="border-t border-b border-gray-100 py-3 mb-4">
              <div className="flex justify-between font-semibold"><span>Total</span><span>₹{invoiceOrder.total.toLocaleString('en-IN')}</span></div>
            </div>
            <button onClick={() => window.print()} className="btn-primary text-sm w-full">Print Invoice</button>
          </div>
        </div>
      )}

      {labelOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setLabelOrder(null)}>
          <div className="bg-white max-w-sm w-full p-6 rounded-sm border-2 border-dashed border-gray-300" onClick={e => e.stopPropagation()}>
            <p className="text-xs text-gray-400 mb-2">SHIPPING LABEL</p>
            <p className="font-semibold text-navy-700">{labelOrder.address.name}</p>
            <p className="text-sm text-gray-600">{labelOrder.address.line1}</p>
            <p className="text-sm text-gray-600">{labelOrder.address.city}, {labelOrder.address.state} — {labelOrder.address.pincode}</p>
            <p className="text-sm text-gray-600 mt-1">+91 {labelOrder.address.phone}</p>
            <div className="mt-4 h-12 bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-mono tracking-widest">||||| {labelOrder.id} |||||</div>
            <button onClick={() => window.print()} className="btn-primary text-sm w-full mt-4">Print Label</button>
          </div>
        </div>
      )}
    </div>
  );
}
