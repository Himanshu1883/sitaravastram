import type { StockLevel } from '../../../lib/admin/productUtils';
import { stockLevelLabel } from '../../../lib/admin/productUtils';

const styles: Record<StockLevel, string> = {
  out: 'bg-red-50 text-red-600 ring-red-100',
  low: 'bg-amber-50 text-amber-700 ring-amber-100',
  ok: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
};

export function StockBadge({
  level,
  showQty,
  qty,
}: {
  level: StockLevel;
  showQty?: boolean;
  qty?: number;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${styles[level]}`}
    >
      {stockLevelLabel(level)}
      {showQty && qty !== undefined && (
        <span className="ml-1 opacity-75 tabular-nums">({qty})</span>
      )}
    </span>
  );
}
