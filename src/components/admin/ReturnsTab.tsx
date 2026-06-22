import type { AdminData } from '../../hooks/useAdminData';
import type { ReturnRequest } from '../../types';

export default function ReturnsTab({ data, update }: { data: AdminData; update: (p: Partial<AdminData>) => void }) {
  const updateReturn = (id: string, status: ReturnRequest['status']) => {
    update({ returns: data.returns.map(r => r.id === id ? { ...r, status } : r) });
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="font-playfair text-xl font-semibold text-navy-700">Returns Management</h2>
      {data.returns.length === 0 ? (
        <p className="text-sm text-gray-500">No return requests.</p>
      ) : (
        data.returns.map(ret => (
          <div key={ret.id} className="bg-white rounded-sm shadow-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-navy-700">{ret.customer} — {ret.product}</p>
                <p className="text-xs text-gray-500">Order #{ret.orderId} 뿯½ {ret.date}</p>
                <p className="text-sm text-gray-600 mt-2">Reason: {ret.reason}</p>
              </div>
              <select value={ret.status} onChange={e => updateReturn(ret.id, e.target.value as ReturnRequest['status'])} className="text-xs border border-gray-200 rounded-sm px-2 py-1.5 capitalize">
                {['pending', 'approved', 'rejected', 'refunded'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
