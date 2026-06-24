import { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import type { useHomepageAdmin } from '../../../hooks/useHomepageAdmin';
import type { Review } from '../../../types';
import AdminCard from '../ui/AdminCard';
import HomepageImageUpload from '../ui/HomepageImageUpload';

type Api = ReturnType<typeof useHomepageAdmin>;

const emptyReview = (): Review => ({
  id: `rev-${Date.now()}`,
  author: '',
  location: '',
  rating: 5,
  comment: '',
  date: new Date().toISOString().split('T')[0],
  verified: true,
});

export default function HomepageReviewsPanel({ api }: { api: Api }) {
  const [items, setItems] = useState<Review[]>([]);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (api.data?.reviews) {
      setItems(api.data.reviews);
      setDirty(false);
    }
  }, [api.data?.reviews]);

  const save = async () => {
    await api.saveReviews(items);
    setDirty(false);
    setToast('Reviews saved');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="space-y-4">
      {toast && <div className="text-sm text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl">{toast}</div>}
      <button
        type="button"
        onClick={() => { setItems([emptyReview(), ...items]); setDirty(true); }}
        className="inline-flex items-center gap-1 text-sm font-semibold text-rosegold-600"
      >
        <Plus size={14} /> Add review
      </button>
      <div className="space-y-4">
        {items.map((r, i) => (
          <AdminCard key={r.id} padding="md" className="space-y-3">
            <div className="flex justify-between">
              <p className="text-sm font-semibold text-navy-700">Review #{i + 1}</p>
              <button type="button" onClick={() => { setItems(items.filter(x => x.id !== r.id)); setDirty(true); }} className="text-red-500 p-1">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={r.author} onChange={e => { const n = [...items]; n[i] = { ...r, author: e.target.value }; setItems(n); setDirty(true); }} className="input-field text-sm" placeholder="Author" />
              <input value={r.location} onChange={e => { const n = [...items]; n[i] = { ...r, location: e.target.value }; setItems(n); setDirty(true); }} className="input-field text-sm" placeholder="Location" />
              <input type="number" min={1} max={5} value={r.rating} onChange={e => { const n = [...items]; n[i] = { ...r, rating: Number(e.target.value) }; setItems(n); setDirty(true); }} className="input-field text-sm" />
              <input value={r.date} onChange={e => { const n = [...items]; n[i] = { ...r, date: e.target.value }; setItems(n); setDirty(true); }} className="input-field text-sm" type="date" />
            </div>
            <textarea value={r.comment} onChange={e => { const n = [...items]; n[i] = { ...r, comment: e.target.value }; setItems(n); setDirty(true); }} className="input-field min-h-[80px] text-sm" />
            <HomepageImageUpload specKey="reviewAvatar" value={r.avatar ?? ''} onChange={url => { const n = [...items]; n[i] = { ...r, avatar: url }; setItems(n); setDirty(true); }} label="Avatar" previewClassName="w-20 h-20 rounded-full" />
          </AdminCard>
        ))}
      </div>
      <button type="button" onClick={save} disabled={!dirty || api.saving} className="btn-primary text-sm inline-flex items-center gap-2">
        {api.saving && <Loader2 size={14} className="animate-spin" />}
        Save reviews
      </button>
    </div>
  );
}
