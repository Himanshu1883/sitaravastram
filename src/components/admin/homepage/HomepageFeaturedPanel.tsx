import { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import type { useHomepageAdmin } from '../../../hooks/useHomepageAdmin';
import type { FeaturedCollectionItem, ProductHotspotItem } from '../../../lib/api';
import AdminCard from '../ui/AdminCard';
import HomepageImageUpload from '../ui/HomepageImageUpload';

type Api = ReturnType<typeof useHomepageAdmin>;

export default function HomepageFeaturedPanel({ api }: { api: Api }) {
  const [items, setItems] = useState<FeaturedCollectionItem[]>([]);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (api.data?.featuredCollections) {
      setItems(api.data.featuredCollections);
      setDirty(false);
    }
  }, [api.data?.featuredCollections]);

  const save = async () => {
    await api.saveBlock('featuredCollections', items);
    setDirty(false);
    setToast('Featured collections saved');
    setTimeout(() => setToast(''), 3000);
  };

  const updateItem = (index: number, patch: Partial<FeaturedCollectionItem>) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    setItems(next);
    setDirty(true);
  };

  const updateHotspot = (itemIndex: number, hIndex: number, patch: Partial<ProductHotspotItem>) => {
    const next = [...items];
    const hotspots = [...(next[itemIndex].hotspots ?? [])];
    hotspots[hIndex] = { ...hotspots[hIndex], ...patch };
    next[itemIndex] = { ...next[itemIndex], hotspots };
    setItems(next);
    setDirty(true);
  };

  const addHotspot = (itemIndex: number) => {
    const next = [...items];
    const hotspots = [...(next[itemIndex].hotspots ?? []), { productSlug: '', x: 50, y: 50 }];
    next[itemIndex] = { ...next[itemIndex], hotspots };
    setItems(next);
    setDirty(true);
  };

  return (
    <div className="space-y-4">
      {toast && <div className="text-sm text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl">{toast}</div>}
      {items.map((item, i) => (
        <AdminCard key={item.id} padding="md" className="space-y-4">
          <p className="font-semibold text-navy-700">Collection #{item.id}</p>
          <HomepageImageUpload
            specKey="featured"
            value={item.image}
            onChange={url => updateItem(i, { image: url })}
          />
          {[
            { key: 'overline', label: 'Overline' },
            { key: 'title', label: 'Title' },
            { key: 'description', label: 'Description' },
            { key: 'cta', label: 'CTA label' },
            { key: 'imageAlt', label: 'Image alt text' },
            { key: 'href', label: 'Link URL' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-gray-400 block mb-1">{f.label}</label>
              {f.key === 'description' ? (
                <textarea
                  value={item.description ?? ''}
                  onChange={e => updateItem(i, { description: e.target.value })}
                  className="input-field min-h-[72px] text-sm"
                />
              ) : (
                <input
                  value={String(item[f.key as keyof FeaturedCollectionItem] ?? '')}
                  onChange={e => updateItem(i, { [f.key]: e.target.value })}
                  className="input-field text-sm"
                />
              )}
            </div>
          ))}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={item.reverse} onChange={e => updateItem(i, { reverse: e.target.checked })} />
            Reverse layout (image on right)
          </label>
          <div className="border-t border-gray-100 pt-3 space-y-2">
            <p className="text-xs font-semibold uppercase text-gray-400">Hotspots (product slug + % position)</p>
            {(item.hotspots ?? []).map((h, hi) => (
              <div key={hi} className="flex flex-wrap gap-2 items-center">
                <input
                  value={h.productSlug}
                  onChange={e => updateHotspot(i, hi, { productSlug: e.target.value })}
                  placeholder="product-slug"
                  className="input-field text-sm flex-1 min-w-[140px]"
                />
                <input
                  type="number"
                  value={h.x}
                  onChange={e => updateHotspot(i, hi, { x: Number(e.target.value) })}
                  className="input-field text-sm w-16"
                  placeholder="x%"
                />
                <input
                  type="number"
                  value={h.y}
                  onChange={e => updateHotspot(i, hi, { y: Number(e.target.value) })}
                  className="input-field text-sm w-16"
                  placeholder="y%"
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = [...items];
                    next[i] = {
                      ...next[i],
                      hotspots: (next[i].hotspots ?? []).filter((_, idx) => idx !== hi),
                    };
                    setItems(next);
                    setDirty(true);
                  }}
                  className="p-2 text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addHotspot(i)} className="text-xs text-rosegold-600 flex items-center gap-1">
              <Plus size={12} /> Add hotspot
            </button>
          </div>
        </AdminCard>
      ))}
      <button type="button" onClick={save} disabled={!dirty || api.saving} className="btn-primary text-sm inline-flex items-center gap-2">
        {api.saving && <Loader2 size={14} className="animate-spin" />}
        Save featured collections
      </button>
    </div>
  );
}
