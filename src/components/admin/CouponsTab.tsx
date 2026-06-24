import { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Tag,
  Loader2,
  Copy,
  Check,
  Percent,
  IndianRupee,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import type { AdminData, AdminApi } from '../../hooks/useAdminApi';
import type { Coupon } from '../../types';
import { formatINR } from '../../lib/admin/dashboardStats';
import AdminPageHeader from './ui/AdminPageHeader';
import AdminCard from './ui/AdminCard';
import AdminModal from './ui/AdminModal';

type CouponFilter = 'all' | 'active' | 'inactive' | 'expired';

function isExpired(coupon: Coupon): boolean {
  if (!coupon.expiry) return false;
  const today = new Date().toISOString().split('T')[0];
  return coupon.expiry < today;
}

function couponDiscountLabel(coupon: Coupon): string {
  return coupon.type === 'percent' ? `${coupon.value}% off` : `${formatINR(coupon.value)} off`;
}

function usagePercent(coupon: Coupon): number {
  if (!coupon.usageLimit) return 0;
  return Math.min(100, Math.round((coupon.usedCount / coupon.usageLimit) * 100));
}

const emptyForm = (): Partial<Coupon> => ({
  type: 'percent',
  active: true,
  minOrder: 0,
  usageLimit: 100,
  expiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
});

export default function CouponsTab({ data, api }: { data: AdminData; api: AdminApi }) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CouponFilter>('all');
  const [form, setForm] = useState<Partial<Coupon>>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const active = data.coupons.filter(c => c.active && !isExpired(c)).length;
    const expired = data.coupons.filter(isExpired).length;
    const redemptions = data.coupons.reduce((s, c) => s + c.usedCount, 0);
    return { total: data.coupons.length, active, expired, redemptions };
  }, [data.coupons]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.coupons.filter(c => {
      if (filter === 'active' && (!c.active || isExpired(c))) return false;
      if (filter === 'inactive' && c.active) return false;
      if (filter === 'expired' && !isExpired(c)) return false;
      if (q && !c.code.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [data.coupons, search, filter]);

  const addCoupon = async () => {
    if (!form.code?.trim() || !form.value) return;
    setSaving(true);
    try {
      const coupon: Coupon = {
        id: Date.now().toString(),
        code: form.code.trim().toUpperCase(),
        type: form.type || 'percent',
        value: Number(form.value),
        minOrder: Number(form.minOrder) || 0,
        expiry: form.expiry || '2026-12-31',
        usageLimit: Number(form.usageLimit) || 100,
        usedCount: 0,
        active: form.active !== false,
      };
      await api.saveCoupon(coupon);
      setForm(emptyForm());
      setShowAdd(false);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    setTogglingId(coupon.id);
    try {
      await api.toggleCoupon(coupon.id, !coupon.active);
    } finally {
      setTogglingId(null);
    }
  };

  const copyCode = async (coupon: Coupon) => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopiedId(coupon.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const FILTERS: { value: CouponFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'expired', label: 'Expired' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      <AdminPageHeader
        title="Coupons"
        description="Create discount codes and track redemptions across your store."
        actions={
          <button
            type="button"
            onClick={() => {
              setForm(emptyForm());
              setShowAdd(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-navy-700 text-white hover:bg-rosegold-500 transition-colors"
          >
            <Plus size={14} />
            Create coupon
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: 'Total coupons', value: stats.total, icon: Tag },
          { label: 'Active', value: stats.active, icon: ToggleRight },
          { label: 'Expired', value: stats.expired, icon: Tag },
          { label: 'Redemptions', value: stats.redemptions, icon: Percent },
        ].map(stat => (
          <AdminCard key={stat.label} padding="sm" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rosegold-50 text-rosegold-600 flex items-center justify-center">
              <stat.icon size={18} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-lg font-bold text-navy-700 tabular-nums">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </AdminCard>
        ))}
      </div>

      <AdminCard padding="none" className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 space-y-4">
          <div className="relative max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by coupon code…"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-cream-100/30 focus:outline-none focus:ring-2 focus:ring-rosegold-300/50 focus:border-rosegold-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  filter === f.value
                    ? 'bg-navy-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Tag size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="font-heading text-base font-semibold text-navy-700 mb-1">
              {data.coupons.length === 0 ? 'No coupons yet' : 'No matching coupons'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {data.coupons.length === 0
                ? 'Create your first discount code to boost conversions.'
                : 'Try adjusting search or filters.'}
            </p>
            {data.coupons.length === 0 && (
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="btn-primary text-sm inline-flex items-center gap-2"
              >
                <Plus size={14} />
                Create coupon
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table w-full">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th className="hidden sm:table-cell">Min order</th>
                  <th>Usage</th>
                  <th className="hidden md:table-cell">Expires</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const expired = isExpired(c);
                  const pct = usagePercent(c);
                  const isToggling = togglingId === c.id;
                  const effective = c.active && !expired;

                  return (
                    <tr key={c.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-navy-700 tracking-wide">
                            {c.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyCode(c)}
                            className="p-1 rounded-md text-gray-400 hover:text-rosegold-600 hover:bg-rosegold-50 transition-colors"
                            title="Copy code"
                          >
                            {copiedId === c.id ? (
                              <Check size={13} className="text-emerald-600" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-navy-700">
                          {c.type === 'percent' ? (
                            <Percent size={13} className="text-rosegold-500" />
                          ) : (
                            <IndianRupee size={13} className="text-rosegold-500" />
                          )}
                          {couponDiscountLabel(c)}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell text-sm text-gray-600 tabular-nums">
                        {c.minOrder > 0 ? formatINR(c.minOrder) : '—'}
                      </td>
                      <td>
                        <div className="min-w-[100px]">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500 tabular-nums">
                              {c.usedCount}/{c.usageLimit}
                            </span>
                            <span className="text-gray-400 tabular-nums">{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                pct >= 90 ? 'bg-red-400' : pct >= 70 ? 'bg-amber-400' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell text-sm text-gray-500">{c.expiry}</td>
                      <td>
                        {expired ? (
                          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 ring-1 ring-inset ring-gray-200">
                            Expired
                          </span>
                        ) : effective ? (
                          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() => toggleActive(c)}
                          disabled={isToggling || expired}
                          title={expired ? 'Expired' : c.active ? 'Deactivate' : 'Activate'}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                            c.active
                              ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {isToggling ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : c.active ? (
                            <ToggleRight size={14} />
                          ) : (
                            <ToggleLeft size={14} />
                          )}
                          {c.active ? 'On' : 'Off'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {data.coupons.length} coupons
          </div>
        )}
      </AdminCard>

      <AdminModal
        open={showAdd}
        onClose={() => !saving && setShowAdd(false)}
        title="Create coupon"
        subtitle="Customers enter this code at checkout"
        size="md"
        footer={
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-navy-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addCoupon}
              disabled={saving || !form.code?.trim() || !form.value}
              className="btn-primary text-sm inline-flex items-center gap-2 min-w-[120px] justify-center"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Creating…' : 'Create coupon'}
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
              Coupon code
            </label>
            <input
              value={form.code || ''}
              onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="input-field font-mono uppercase tracking-widest"
              placeholder="SITARA20"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
              Type
            </label>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value as Coupon['type'] })}
              className="input-field"
            >
              <option value="percent">Percentage (%)</option>
              <option value="flat">Flat amount (₹)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
              Value
            </label>
            <input
              type="number"
              min={1}
              value={form.value || ''}
              onChange={e => setForm({ ...form, value: Number(e.target.value) })}
              className="input-field"
              placeholder={form.type === 'percent' ? '20' : '500'}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
              Min order (₹)
            </label>
            <input
              type="number"
              min={0}
              value={form.minOrder ?? ''}
              onChange={e => setForm({ ...form, minOrder: Number(e.target.value) })}
              className="input-field"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
              Usage limit
            </label>
            <input
              type="number"
              min={1}
              value={form.usageLimit ?? ''}
              onChange={e => setForm({ ...form, usageLimit: Number(e.target.value) })}
              className="input-field"
              placeholder="100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
              Expiry date
            </label>
            <input
              type="date"
              value={form.expiry || ''}
              onChange={e => setForm({ ...form, expiry: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="sm:col-span-2 flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="coupon-active"
              checked={form.active !== false}
              onChange={e => setForm({ ...form, active: e.target.checked })}
              className="rounded border-gray-300 text-rosegold-500 focus:ring-rosegold-400"
            />
            <label htmlFor="coupon-active" className="text-sm text-navy-700 cursor-pointer">
              Activate immediately after creation
            </label>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
