import type { AdminData, AdminApi } from '../../hooks/useAdminApi';

export default function InventoryTab({ data, api }: { data: AdminData; api: AdminApi }) {
  const updateStock = async (id: string, stock: number) => {
    await api.updateStock(id, stock, stock > 0);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-sm shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-left">
            <tr>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Sizes</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map(p => (
              <tr key={p.id} className="border-t border-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{p.sku}</td>
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{p.sizes.join(', ')}</td>
                <td className="px-4 py-3">
                  <input type="number" min={0} value={p.stock ?? 0} onChange={e => updateStock(p.id, Number(e.target.value))} className="w-20 border border-gray-200 rounded-sm px-2 py-1 text-sm" />
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.inStock ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
