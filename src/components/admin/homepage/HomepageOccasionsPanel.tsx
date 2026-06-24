import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { useHomepageAdmin } from '../../../hooks/useHomepageAdmin';
import AdminCard from '../ui/AdminCard';
import HomepageImageUpload from '../ui/HomepageImageUpload';

type Api = ReturnType<typeof useHomepageAdmin>;
type Occasion = { name: string; description: string; image: string; slug: string };

export default function HomepageOccasionsPanel({ api }: { api: Api }) {
  const [items, setItems] = useState<Occasion[]>([]);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (api.data?.occasions) {
      setItems(api.data.occasions as Occasion[]);
      setDirty(false);
    }
  }, [api.data?.occasions]);

  const save = async () => {
    await api.saveBlock('occasions', items);
    setDirty(false);
    setToast('Occasions saved');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="space-y-4">
      {toast && <div className="text-sm text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl">{toast}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <AdminCard key={item.slug || i} padding="md" className="space-y-3">
            <input
              value={item.name}
              onChange={e => {
                const next = [...items];
                next[i] = { ...item, name: e.target.value };
                setItems(next);
                setDirty(true);
              }}
              className="input-field font-semibold"
            />
            <input
              value={item.slug}
              onChange={e => {
                const next = [...items];
                next[i] = { ...item, slug: e.target.value };
                setItems(next);
                setDirty(true);
              }}
              className="input-field font-mono text-sm"
              placeholder="slug"
            />
            <textarea
              value={item.description}
              onChange={e => {
                const next = [...items];
                next[i] = { ...item, description: e.target.value };
                setItems(next);
                setDirty(true);
              }}
              className="input-field text-sm min-h-[60px]"
            />
            <HomepageImageUpload
              specKey="occasion"
              value={item.image}
              onChange={url => {
                const next = [...items];
                next[i] = { ...item, image: url };
                setItems(next);
                setDirty(true);
              }}
            />
          </AdminCard>
        ))}
      </div>
      <button type="button" onClick={save} disabled={!dirty || api.saving} className="btn-primary text-sm inline-flex items-center gap-2">
        {api.saving && <Loader2 size={14} className="animate-spin" />}
        Save occasions
      </button>
    </div>
  );
}
