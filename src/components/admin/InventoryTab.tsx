import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Minus,
  Plus,
  Loader2,
  Save,
} from 'lucide-react';
import type { AdminData, AdminApi } from '../../hooks/useAdminApi';
import { mediaUrl } from '../../lib/api';
import {
  LOW_STOCK_THRESHOLD,
  productStats,
  stockLevel,
  type StockLevel,
} from '../../lib/admin/productUtils';
import AdminPageHeader from './ui/AdminPageHeader';
import AdminCard from './ui/AdminCard';
import { StockBadge } from './ui/StockBadge';

type StockFilter = 'all' | StockLevel;

const STOCK_FILTERS: { value: StockFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'ok', label: 'In stock' },
  { value: 'low', label: 'Low stock' },
  { value: 'out', label: 'Out of stock' },
];

export default function InventoryTab({ data, api }: { data: AdminData; api: AdminApi }) {
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [draftStock, setDraftStock] = useState<Record<string, number>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());
  const debounceRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const stats = useMemo(() => productStats(data.products), [data.products]);

  useEffect(() => {
    setDraftStock(
      Object.fromEntries(data.products.map(p => [p.id, p.stock ?? 0])),
    );
    setDirtyIds(new Set());
  }, [data.products]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.products.filter(p => {
      const level = stockLevel(p.stock, p.inStock);
      if (stockFilter !== 'all' && level !== stockFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [data.products, search, stockFilter]);

  const commitStock = useCallback(
    async (id: string, stock: number) => {
      const product = data.products.find(p => p.id === id);
      if (
        !product ||
        ((product.stock ?? 0) === stock && product.inStock === stock > 0)
      ) {
        setDirtyIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        return;
      }

      setSavingIds(prev => new Set(prev).add(id));
      try {
        await api.updateStock(id, stock, stock > 0);
        setDirtyIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } finally {
        setSavingIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [api, data.products],
  );

  const scheduleSave = useCallback(
    (id: string, stock: number) => {
      if (debounceRefs.current[id]) clearTimeout(debounceRefs.current[id]);
      debounceRefs.current[id] = setTimeout(() => {
        commitStock(id, stock);
        delete debounceRefs.current[id];
      }, 800);
    },
    [commitStock],
  );

  const updateDraft = (id: string, stock: number) => {
    const clamped = Math.max(0, stock);
    setDraftStock(prev => ({ ...prev, [id]: clamped }));
    setDirtyIds(prev => new Set(prev).add(id));
    scheduleSave(id, clamped);
  };

  const saveNow = (id: string) => {
    if (debounceRefs.current[id]) {
      clearTimeout(debounceRefs.current[id]);
      delete debounceRefs.current[id];
    }
    commitStock(id, draftStock[id] ?? 0);
  };

  useEffect(() => {
    const timers = debounceRefs.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      <AdminPageHeader
        title="Inventory"
        description="Track stock levels and update availability across your catalog."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          {
            label: 'Total SKUs',
            value: stats.total,
            icon: Package,
            color: 'bg-navy-50 text-navy-600',
          },
          {
            label: 'In stock',
            value: stats.inStock,
            icon: CheckCircle2,
            color: 'bg-emerald-50 text-emerald-600',
          },
          {
            label: 'Low stock',
            value: stats.lowStock,
            icon: AlertTriangle,
            color: 'bg-amber-50 text-amber-600',
          },
          {
            label: 'Out of stock',
            value: stats.outOfStock,
            icon: XCircle,
            color: 'bg-red-50 text-red-600',
          },
        ].map(stat => (
          <AdminCard key={stat.label} padding="sm" className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}
            >
              <stat.icon size={18} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-lg font-bold text-navy-700 tabular-nums">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </AdminCard>
        ))}
      </div>

      {stats.lowStock > 0 && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100">
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-900">
            <span className="font-semibold">{stats.lowStock} items</span> at or below{' '}
            {LOW_STOCK_THRESHOLD} units — restock soon to avoid lost sales.
          </p>
        </div>
      )}

      <AdminCard padding="none" className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 space-y-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, SKU, or category…"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-cream-100/30 focus:outline-none focus:ring-2 focus:ring-rosegold-300/50 focus:border-rosegold-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {STOCK_FILTERS.map(f => (
              <button
                key={f.value}
                type="button"
                onClick={() => setStockFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  stockFilter === f.value
                    ? 'bg-navy-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Package size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="font-heading text-base font-semibold text-navy-700 mb-1">
              {data.products.length === 0 ? 'No inventory yet' : 'No matching items'}
            </p>
            <p className="text-sm text-gray-500">
              {data.products.length === 0
                ? 'Add products first, then manage stock here.'
                : 'Try adjusting your search or filters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="hidden md:table-cell">SKU</th>
                  <th className="hidden lg:table-cell">Sizes</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th className="text-right">Update</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => {
                  const qty = draftStock[p.id] ?? p.stock ?? 0;
                  const level = stockLevel(qty, qty > 0);
                  const isSaving = savingIds.has(p.id);
                  const isDirty = dirtyIds.has(p.id);

                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="flex items-center gap-3 min-w-[160px]">
                          {p.images[0] ? (
                            <img
                              src={mediaUrl(p.images[0])}
                              alt=""
                              className="w-10 h-12 object-cover rounded-lg flex-shrink-0 border border-gray-100"
                            />
                          ) : (
                            <div className="w-10 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Package size={14} className="text-gray-300" />
                            </div>
                          )}
                          <p className="text-sm font-medium text-navy-700 truncate max-w-[180px]">
                            {p.name}
                          </p>
                        </div>
                      </td>
                      <td className="hidden md:table-cell font-mono text-xs text-gray-500">
                        {p.sku || '—'}
                      </td>
                      <td className="hidden lg:table-cell text-xs text-gray-500 max-w-[140px] truncate">
                        {p.sizes.join(', ')}
                      </td>
                      <td>
                        <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateDraft(p.id, qty - 1)}
                            disabled={isSaving || qty <= 0}
                            className="p-2 text-gray-500 hover:bg-gray-50 hover:text-navy-700 disabled:opacity-40 transition-colors"
                            aria-label="Decrease stock"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="number"
                            min={0}
                            value={qty}
                            disabled={isSaving}
                            onChange={e => updateDraft(p.id, Number(e.target.value))}
                            className="w-14 text-center text-sm font-semibold text-navy-700 border-x border-gray-200 py-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rosegold-300/50 tabular-nums"
                          />
                          <button
                            type="button"
                            onClick={() => updateDraft(p.id, qty + 1)}
                            disabled={isSaving}
                            className="p-2 text-gray-500 hover:bg-gray-50 hover:text-navy-700 transition-colors"
                            aria-label="Increase stock"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <StockBadge level={level} showQty qty={qty} />
                      </td>
                      <td className="text-right">
                        {isSaving ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                            <Loader2 size={14} className="animate-spin" />
                            Saving
                          </span>
                        ) : isDirty ? (
                          <button
                            type="button"
                            onClick={() => saveNow(p.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-navy-700 text-white hover:bg-rosegold-500 transition-colors"
                          >
                            <Save size={12} />
                            Save
                          </button>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
            <span>
              Showing {filteredProducts.length} of {data.products.length} items
            </span>
            <span>Auto-saves after 0.8s · or tap Save</span>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
