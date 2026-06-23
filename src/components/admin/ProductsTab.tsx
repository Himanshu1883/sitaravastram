import { useState } from 'react';
import { Plus, Pencil, Upload, ImagePlus } from 'lucide-react';
import type { AdminData } from '../../hooks/useAdminApi';
import type { AdminApi } from '../../hooks/useAdminApi';
import type { Product } from '../../types';
import { uploadMedia } from '../../lib/api';

const emptyProduct = (): Product => ({
  id: Date.now().toString(),
  name: '', slug: '', price: 0, images: [], category: 'cotton-suits', fabric: 'Cotton',
  occasion: ['Casual'], colors: [''], sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  rating: 4.5, reviewCount: 0, description: '', details: [], includes: ['Kurta', 'Dupatta', 'Bottom'],
  washCare: 'Machine wash cold.', deliveryTime: '4-7 business days.', returnPolicy: '7-day returns.',
  sku: '', inStock: true, tags: [], stock: 10,
});

export default function ProductsTab({ data, api }: { data: AdminData; api: AdminApi }) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [bulkPreview, setBulkPreview] = useState<Product[]>([]);
  const [showBulk, setShowBulk] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const saveProduct = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const exists = data.products.find(p => p.id === editing.id);
      await api.saveProduct(editing, !exists);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const handleBulkCsv = (text: string) => {
    const lines = text.trim().split('\n').slice(1);
    const parsed = lines.map((line, i) => {
      const [name, price, sku, category, fabric] = line.split(',').map(s => s.trim());
      return { ...emptyProduct(), id: `bulk-${Date.now()}-${i}`, name: name || 'New Product', price: Number(price) || 999, sku: sku || `SKU-${i}`, category: category || 'cotton-suits', fabric: fabric || 'Cotton', slug: (name || 'product').toLowerCase().replace(/\s+/g, '-') };
    });
    setBulkPreview(parsed);
  };

  const importBulk = async () => {
    setSaving(true);
    try {
      await api.importProducts(bulkPreview);
      setBulkPreview([]);
      setShowBulk(false);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || !editing) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const { url } = await uploadMedia(file);
        urls.push(url);
      }
      setEditing({ ...editing, images: [...editing.images, ...urls] });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    try {
      const { url } = await uploadMedia(file);
      setEditing({ ...editing, video: url });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap gap-3">
        <button onClick={() => setEditing(emptyProduct())} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} />Add Product</button>
        <button onClick={() => setShowBulk(!showBulk)} className="border border-navy-700 text-navy-700 px-4 py-2 rounded-sm text-sm flex items-center gap-2 hover:bg-navy-700 hover:text-white transition-colors"><Upload size={16} />Bulk Upload</button>
      </div>

      {showBulk && (
        <div className="bg-white rounded-sm shadow-card p-5">
          <p className="text-sm text-gray-600 mb-2">Paste CSV (name, price, sku, category, fabric):</p>
          <textarea className="input-field min-h-[120px] font-mono text-xs mb-3" placeholder="name,price,sku,category,fabric&#10;New Suit,1999,SKU-01,cotton-suits,Cotton" onChange={e => handleBulkCsv(e.target.value)} />
          {bulkPreview.length > 0 && (
            <>
              <p className="text-sm text-emerald-600 mb-2">{bulkPreview.length} products ready to import</p>
              <button onClick={importBulk} disabled={saving} className="btn-primary text-sm">Import {bulkPreview.length} Products</button>
            </>
          )}
        </div>
      )}

      {editing && (
        <div className="bg-white rounded-sm shadow-card p-5">
          <h3 className="font-heading text-lg font-semibold text-navy-700 mb-4">{data.products.find(p => p.id === editing.id) ? 'Edit' : 'Add'} Product</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Name' }, { key: 'slug', label: 'Slug' }, { key: 'sku', label: 'SKU' },
              { key: 'price', label: 'Price', type: 'number' }, { key: 'fabric', label: 'Fabric' }, { key: 'category', label: 'Category' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-gray-600 block mb-1">{f.label}</label>
                <input type={f.type || 'text'} value={String(editing[f.key as keyof Product] ?? '')} onChange={e => setEditing({ ...editing, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })} className="input-field" />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-600 block mb-1">Description</label>
              <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} className="input-field min-h-[80px]" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-600 block mb-1">Images</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editing.images.map((img, i) => (
                  <span key={i} className="text-xs bg-cream-100 px-2 py-1 rounded truncate max-w-[200px]">{img}</span>
                ))}
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-rosegold-600 hover:text-navy-700">
                <ImagePlus size={16} />
                {uploading ? 'Uploading…' : 'Upload images'}
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-600 block mb-1">Video</label>
              {editing.video && <p className="text-xs text-gray-500 mb-2 truncate">{editing.video}</p>}
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-rosegold-600 hover:text-navy-700">
                <ImagePlus size={16} />
                {uploading ? 'Uploading…' : 'Upload video'}
                <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={saveProduct} disabled={saving} className="btn-primary text-sm">{saving ? 'Saving…' : 'Save Product'}</button>
            <button onClick={() => setEditing(null)} className="text-sm text-gray-500 hover:text-navy-700">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-sm shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-navy-700">Product</th>
              <th className="px-4 py-3 font-medium text-navy-700">SKU</th>
              <th className="px-4 py-3 font-medium text-navy-700">Price</th>
              <th className="px-4 py-3 font-medium text-navy-700">Stock</th>
              <th className="px-4 py-3 font-medium text-navy-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map(p => (
              <tr key={p.id} className="border-t border-gray-50 hover:bg-cream-50">
                <td className="px-4 py-3 font-medium text-navy-700">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.sku}</td>
                <td className="px-4 py-3">₹{p.price.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3">{p.stock ?? '—'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setEditing({ ...p })} className="text-rosegold-500 hover:text-navy-700"><Pencil size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
