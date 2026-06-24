import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { useHomepageAdmin } from '../../../hooks/useHomepageAdmin';
import AdminCard from '../ui/AdminCard';
import HomepageImageUpload from '../ui/HomepageImageUpload';

type Api = ReturnType<typeof useHomepageAdmin>;

export default function HomepageCategoriesPanel({ api }: { api: Api }) {
  const [toast, setToast] = useState('');
  const categories = api.data?.categories ?? [];

  const update = async (id: string, patch: { name?: string; image?: string; featured?: boolean }) => {
    await api.saveCategory(id, patch);
    setToast('Category updated');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="space-y-4">
      {toast && <div className="text-sm text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl">{toast}</div>}
      <p className="text-sm text-gray-500">
        Toggle <strong>Featured</strong> to show categories in the strip and collage. Upload images per spec below.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {categories.map(cat => (
          <AdminCard key={cat.id} padding="md" className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-navy-700">{cat.name}</p>
                <p className="text-xs text-gray-400 font-mono">/{cat.slug}</p>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!cat.featured}
                  disabled={api.saving}
                  onChange={e => update(cat.id, { featured: e.target.checked })}
                />
                Featured
              </label>
            </div>
            <HomepageImageUpload
              specKey={cat.featured ? 'categoryCollageLarge' : 'categoryStrip'}
              value={cat.image}
              onChange={url => update(cat.id, { image: url })}
            />
            <div>
              <label className="text-xs text-gray-400 block mb-1">Display name</label>
              <input
                defaultValue={cat.name}
                onBlur={e => {
                  if (e.target.value !== cat.name) update(cat.id, { name: e.target.value });
                }}
                className="input-field text-sm"
              />
            </div>
            {api.saving && <Loader2 size={14} className="animate-spin text-gray-400" />}
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
