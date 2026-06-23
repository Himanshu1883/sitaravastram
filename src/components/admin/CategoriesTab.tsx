import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { AdminData, AdminApi } from '../../hooks/useAdminApi';
import type { Category } from '../../types';
import { mediaUrl } from '../../lib/api';

export default function CategoriesTab({ data, api }: { data: AdminData; api: AdminApi }) {
  const [form, setForm] = useState<Partial<Category>>({});

  const addCategory = async () => {
    if (!form.name || !form.slug) return;
    const cat: Category = { id: Date.now().toString(), name: form.name, slug: form.slug, image: form.image || '', count: 0 };
    await api.saveCategory(cat);
    setForm({});
  };

  const removeCategory = async (id: string) => {
    await api.deleteCategory(id);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-sm shadow-card p-5">
        <h3 className="font-heading text-lg font-semibold text-navy-700 mb-4">Add Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input placeholder="Name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" />
          <input placeholder="Slug" value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} className="input-field" />
          <input placeholder="Image URL" value={form.image || ''} onChange={e => setForm({ ...form, image: e.target.value })} className="input-field" />
        </div>
        <button onClick={addCategory} className="btn-primary text-sm mt-4 flex items-center gap-2"><Plus size={14} />Add Category</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-sm shadow-card p-4 flex items-center gap-4">
            {cat.image && <img src={mediaUrl(cat.image)} alt={cat.name} className="w-16 h-16 object-cover rounded-sm" />}
            <div className="flex-1">
              <p className="font-semibold text-navy-700">{cat.name}</p>
              <p className="text-xs text-gray-500">/{cat.slug}</p>
            </div>
            <button onClick={() => removeCategory(cat.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
