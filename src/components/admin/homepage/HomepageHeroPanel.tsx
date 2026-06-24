import { useState } from 'react';
import { Plus, Pencil, Loader2, GripVertical } from 'lucide-react';
import type { HeroSlide } from '../../../types';
import type { useHomepageAdmin } from '../../../hooks/useHomepageAdmin';
import { mediaUrl } from '../../../lib/api';
import AdminCard from '../ui/AdminCard';
import AdminModal from '../ui/AdminModal';
import HomepageImageUpload from '../ui/HomepageImageUpload';

type Api = ReturnType<typeof useHomepageAdmin>;

const emptySlide = (): HeroSlide => ({
  id: Date.now(),
  title: '',
  subtitle: '',
  description: '',
  image: '',
  cta1: 'Shop Now',
  cta2: 'Explore',
  ctaLink: '/collections',
  badge: '',
});

export default function HomepageHeroPanel({ api }: { api: Api }) {
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [toast, setToast] = useState('');

  const slides = api.data?.heroSlides ?? [];

  const save = async () => {
    if (!editing) return;
    const list = editing.id && slides.find(s => s.id === editing.id)
      ? slides.map(s => (s.id === editing.id ? editing : s))
      : [...slides, { ...editing, id: editing.id || Date.now() }];
    await api.saveHero(list);
    setEditing(null);
    setToast('Hero slides saved');
    setTimeout(() => setToast(''), 3000);
  };

  const remove = (id: number) => {
    if (!window.confirm('Remove this slide?')) return;
    api.saveHero(slides.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-4">
      {toast && (
        <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl">
          {toast}
        </div>
      )}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setEditing(emptySlide())}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-navy-700 text-white"
        >
          <Plus size={14} /> Add slide
        </button>
      </div>
      <div className="space-y-3">
        {slides.map((slide, i) => (
          <AdminCard key={slide.id} padding="sm" className="flex items-center gap-4">
            <GripVertical size={16} className="text-gray-300 flex-shrink-0" />
            <div className="w-20 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {slide.image && <img src={mediaUrl(slide.image, 'thumb')} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-navy-700 truncate">{slide.title}</p>
              <p className="text-xs text-gray-400">Slide {i + 1} · {slide.subtitle}</p>
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => setEditing({ ...slide })} className="p-2 rounded-lg hover:bg-cream-100">
                <Pencil size={15} />
              </button>
              <button type="button" onClick={() => remove(slide.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 text-xs">
                Delete
              </button>
            </div>
          </AdminCard>
        ))}
      </div>

      <AdminModal
        open={!!editing}
        onClose={() => !api.saving && setEditing(null)}
        title={editing && slides.some(s => s.id === editing.id) ? 'Edit hero slide' : 'Add hero slide'}
        size="lg"
        footer={
          <button type="button" onClick={save} disabled={api.saving || !editing?.title || !editing?.image} className="btn-primary text-sm inline-flex items-center gap-2">
            {api.saving && <Loader2 size={14} className="animate-spin" />}
            Save slides
          </button>
        }
      >
        {editing && (
          <div className="space-y-4">
            <HomepageImageUpload specKey="hero" value={editing.image} onChange={url => setEditing({ ...editing, image: url })} />
            {[
              { key: 'badge', label: 'Badge' },
              { key: 'subtitle', label: 'Subtitle' },
              { key: 'title', label: 'Title' },
              { key: 'description', label: 'Description' },
              { key: 'cta1', label: 'Primary CTA' },
              { key: 'cta2', label: 'Secondary CTA' },
              { key: 'ctaLink', label: 'CTA link' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">{f.label}</label>
                {f.key === 'description' ? (
                  <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} className="input-field min-h-[80px]" />
                ) : (
                  <input
                    value={String(editing[f.key as keyof HeroSlide] ?? '')}
                    onChange={e => setEditing({ ...editing, [f.key]: e.target.value })}
                    className="input-field"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </AdminModal>
    </div>
  );
}
