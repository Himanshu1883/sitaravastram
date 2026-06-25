import { useMemo, useState, Fragment } from 'react';
import {
  Search,
  RotateCcw,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Banknote,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { AdminData, AdminApi } from '../../hooks/useAdminApi';
import type { ReturnRequest } from '../../types';
import AdminPageHeader from './ui/AdminPageHeader';
import AdminCard from './ui/AdminCard';
import { ReturnStatusBadge } from './ui/StatusBadge';

const ALL_STATUSES = 'all' as const;
type StatusFilter = typeof ALL_STATUSES | ReturnRequest['status'];

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: ALL_STATUSES, label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'refunded', label: 'Refunded' },
];

const RETURN_STATUSES: ReturnRequest['status'][] = [
  'pending',
  'approved',
  'pickup_scheduled',
  'picked_up',
  'received',
  'refund_initiated',
  'refunded',
  'rejected',
];

export default function ReturnsTab({ data, api }: { data: AdminData; api: AdminApi }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(ALL_STATUSES);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const stats = useMemo(() => ({
    total: data.returns.length,
    pending: data.returns.filter(r => r.status === 'pending').length,
    approved: data.returns.filter(r => r.status === 'approved').length,
    refunded: data.returns.filter(r => r.status === 'refunded').length,
    rejected: data.returns.filter(r => r.status === 'rejected').length,
  }), [data.returns]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...data.returns]
      .filter(ret => {
        if (statusFilter !== ALL_STATUSES && ret.status !== statusFilter) return false;
        if (!q) return true;
        return (
          ret.customer.toLowerCase().includes(q) ||
          ret.product.toLowerCase().includes(q) ||
          ret.orderId.toLowerCase().includes(q) ||
          ret.reason.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [data.returns, search, statusFilter]);

  const updateReturn = async (ret: ReturnRequest, status: ReturnRequest['status']) => {
    if (status === ret.status) return;
    if (
      (status === 'rejected' || status === 'refunded') &&
      !window.confirm(`Mark return for order #${ret.orderId} as ${status}?`)
    ) {
      return;
    }
    setUpdatingId(ret.id);
    try {
      await api.updateReturnStatus(ret.id, status);
    } finally {
      setUpdatingId(null);
    }
  };

  const quickAction = async (ret: ReturnRequest, status: ReturnRequest['status']) => {
    await updateReturn(ret, status);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      <AdminPageHeader
        title="Returns"
        description="Review return requests, approve refunds, and manage customer resolutions."
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: 'Total requests', value: stats.total, icon: RotateCcw, color: 'bg-navy-50 text-navy-600' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-amber-50 text-amber-600' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'bg-blue-50 text-blue-600' },
          { label: 'Refunded', value: stats.refunded, icon: Banknote, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-red-50 text-red-600' },
        ].map(stat => (
          <AdminCard key={stat.label} padding="sm" className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
              <stat.icon size={18} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-lg font-bold text-navy-700 tabular-nums">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </AdminCard>
        ))}
      </div>

      {stats.pending > 0 && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100">
          <Clock size={18} className="text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-900">
            <span className="font-semibold">{stats.pending} return{stats.pending !== 1 ? 's' : ''}</span>{' '}
            awaiting your review
          </p>
        </div>
      )}

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
              placeholder="Search customer, product, order, or reason…"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-cream-100/30 focus:outline-none focus:ring-2 focus:ring-rosegold-300/50 focus:border-rosegold-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                type="button"
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  statusFilter === f.value
                    ? 'bg-navy-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80'
                }`}
              >
                {f.label}
                {f.value === 'pending' && stats.pending > 0 && (
                  <span className="ml-1 opacity-90">({stats.pending})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <RotateCcw size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="font-heading text-base font-semibold text-navy-700 mb-1">
              {data.returns.length === 0 ? 'No return requests' : 'No matching returns'}
            </p>
            <p className="text-sm text-gray-500">
              {data.returns.length === 0
                ? 'Customer return requests will appear here.'
                : 'Try adjusting your search or filters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table w-full">
              <thead>
                <tr>
                  <th className="w-10" />
                  <th>Customer</th>
                  <th className="hidden md:table-cell">Product</th>
                  <th>Order</th>
                  <th className="hidden sm:table-cell">Date</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(ret => {
                  const expanded = expandedId === ret.id;
                  const isUpdating = updatingId === ret.id;

                  return (
                    <Fragment key={ret.id}>
                      <tr className={expanded ? 'bg-cream-100/40' : undefined}>
                        <td>
                          <button
                            type="button"
                            onClick={() => setExpandedId(expanded ? null : ret.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-navy-700 hover:bg-white transition-colors"
                            aria-label={expanded ? 'Collapse' : 'Expand'}
                          >
                            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>
                        <td>
                          <p className="text-sm font-semibold text-navy-700">{ret.customer}</p>
                          <p className="text-xs text-gray-500 md:hidden truncate max-w-[140px]">
                            {ret.product}
                          </p>
                        </td>
                        <td className="hidden md:table-cell text-sm text-gray-600 max-w-[180px] truncate">
                          {ret.product}
                        </td>
                        <td>
                          <span className="text-sm font-mono text-navy-700">#{ret.orderId}</span>
                        </td>
                        <td className="hidden sm:table-cell text-sm text-gray-500">{ret.date}</td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            {isUpdating && <Loader2 size={14} className="animate-spin text-gray-400" />}
                            <ReturnStatusBadge status={ret.status} />
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-1 flex-wrap">
                            {ret.status === 'pending' && (
                              <>
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() => quickAction(ret, 'approved')}
                                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() => quickAction(ret, 'rejected')}
                                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {ret.status === 'approved' && (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => quickAction(ret, 'refunded')}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-navy-700 bg-navy-50 hover:bg-navy-100 disabled:opacity-50"
                              >
                                Mark refunded
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {expanded && (
                        <tr className="bg-cream-100/30">
                          <td colSpan={7} className="!px-5 !py-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div className="p-4 rounded-xl bg-white border border-gray-100">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                  Return reason
                                </p>
                                <p className="text-sm text-gray-700 leading-relaxed">{ret.reason}</p>
                              </div>
                              <div className="p-4 rounded-xl bg-white border border-gray-100">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                  Update status
                                </p>
                                <div className="flex flex-wrap items-center gap-2">
                                  <select
                                    value={ret.status}
                                    disabled={isUpdating}
                                    onChange={e =>
                                      updateReturn(ret, e.target.value as ReturnRequest['status'])
                                    }
                                    className="text-sm capitalize rounded-lg border border-gray-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rosegold-300/50 disabled:opacity-60"
                                  >
                                    {RETURN_STATUSES.map(s => (
                                      <option key={s} value={s}>
                                        {s}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Package size={12} />
                                    Request #{ret.id}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {data.returns.length} return requests
          </div>
        )}
      </AdminCard>
    </div>
  );
}
