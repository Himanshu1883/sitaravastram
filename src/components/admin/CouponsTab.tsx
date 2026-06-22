import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { AdminData } from '../../hooks/useAdminData';
import type { Coupon } from '../../types';

export default function CouponsTab({ data, update }: { data: AdminData; update: (p: Partial<AdminData>) => void }) {
  const [form, setForm] = useState<Partial<Coupon>>({ type: 'percent', active: true });

  const addCoupon = () => {
    if (!form.code || !form.value) return;
    const coupon: Coupon = {
      id: Date.now().toString(),
      code: form.code.toUpperCase(),
      type: form.type || 'percent',
      value: form.value,
      minOrder: form.minOrder || 0,
      expiry: form.expiry || '2026-12-31',
      usageLimit: form.usageLimit || 100,
      usedCount: 0,
      active: true,
    };
    update({ coupons: [...data.coupons, coupon] });
    setForm({ type: 'percent', active: true });
  };

  const toggleActive = (id: string) => {
    update({ coupons: data.coupons.map(c => c.id === id ? { ...c, active: !c.active } : c) });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-sm shadow-card p-5">
        <h3 className="font-playfair text-lg font-semibold text-navy-700 mb-4">Create Coupon</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <input placeholder="Code" value={form.code || ''} onChange={e => setForm({ ...form, code: e.target.value })} className="input-field" />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Coupon['type'] })} className="input-field">
            <option value="percent">Percent %</option>
            <option value="flat">Flat 뿯₽</option>
          </select>
          <input type="number" placeholder="Value" value={form.value || ''} onChange={e => setForm({ ...form, value: Number(e.target.value) })} className="input-field" />
          <input type="number" placeholder="Min Order" value={form.minOrder || ''} onChange={e => setForm({ ...form, minOrder: Number(e.target.value) })} className="input-field" />
        </div>
        <button onClick={addCoupon} className="btn-primary text-sm mt-4 flex items-center gap-2"><Plus size={14} />Create Coupon</button>
      </div>
      <div className="bg-white rounded-sm shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-left">
            <tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Discount</th><th className="px-4 py-3">Min Order</th><th className="px-4 py-3">Usage</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody>
            {data.coupons.map(c => (
              <tr key={c.id} className="border-t border-gray-50">
                <td className="px-4 py-3 font-mono font-semibold">{c.code}</td>
                <td className="px-4 py-3">{c.type === 'percent' ? `${c.value}%` : `뿯₽${c.value}`}</td>
                <td className="px-4 py-3">뿯₽{c.minOrder.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3">{c.usedCount}/{c.usageLimit}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(c.id)} className={`text-xs px-2 py-0.5 rounded-full ${c.active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>{c.active ? 'Active' : 'Inactive'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
