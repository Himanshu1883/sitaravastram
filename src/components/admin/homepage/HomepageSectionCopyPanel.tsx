import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { useHomepageAdmin } from '../../../hooks/useHomepageAdmin';
import type { SectionCopy } from '../../../lib/api';
import SectionCopyFields from '../ui/SectionCopyFields';
import AdminCard from '../ui/AdminCard';

type Api = ReturnType<typeof useHomepageAdmin>;

const defaultCopy: SectionCopy = {
  newArrivals: {},
  bestSellers: {},
  fabric: {},
  occasion: {},
  featured: {},
  reviews: {},
  instagram: {},
  newsletter: {},
};

export default function HomepageSectionCopyPanel({ api }: { api: Api }) {
  const [copy, setCopy] = useState<SectionCopy>(defaultCopy);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (api.data?.sectionCopy) {
      setCopy(api.data.sectionCopy);
      setDirty(false);
    }
  }, [api.data?.sectionCopy]);

  const save = async () => {
    await api.saveBlock('sectionCopy', copy);
    setDirty(false);
    setToast('Section copy saved — visible on English storefront');
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div className="space-y-4">
      {toast && <div className="text-sm text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl">{toast}</div>}
      <p className="text-sm text-gray-500">
        These fields set the English homepage headings. Hindi still uses locale files.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCopyFields title="New Arrivals" values={copy.newArrivals} onChange={v => { setCopy({ ...copy, newArrivals: v }); setDirty(true); }} showCta />
        <SectionCopyFields title="Best Sellers" values={copy.bestSellers} onChange={v => { setCopy({ ...copy, bestSellers: v }); setDirty(true); }} showCta />
        <SectionCopyFields title="Shop by Fabric" values={copy.fabric} onChange={v => { setCopy({ ...copy, fabric: v }); setDirty(true); }} />
        <SectionCopyFields title="Shop by Occasion" values={copy.occasion} onChange={v => { setCopy({ ...copy, occasion: v }); setDirty(true); }} />
        <SectionCopyFields title="Featured Collections" values={copy.featured} onChange={v => { setCopy({ ...copy, featured: v }); setDirty(true); }} />
        <AdminCard padding="md" className="space-y-3">
          <SectionCopyFields title="Customer Reviews" values={copy.reviews} onChange={v => { setCopy({ ...copy, reviews: v }); setDirty(true); }} />
          <div>
            <label className="text-xs text-gray-400 block mb-1">Heading line 1</label>
            <input value={copy.reviews.heading1 ?? ''} onChange={e => { setCopy({ ...copy, reviews: { ...copy.reviews, heading1: e.target.value } }); setDirty(true); }} className="input-field text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Heading line 2</label>
            <input value={copy.reviews.heading2 ?? ''} onChange={e => { setCopy({ ...copy, reviews: { ...copy.reviews, heading2: e.target.value } }); setDirty(true); }} className="input-field text-sm" />
          </div>
        </AdminCard>
        <AdminCard padding="md" className="space-y-3">
          <p className="text-sm font-semibold text-navy-700">Instagram</p>
          <input value={copy.instagram.overline ?? ''} onChange={e => { setCopy({ ...copy, instagram: { ...copy.instagram, overline: e.target.value } }); setDirty(true); }} className="input-field text-sm" placeholder="Overline" />
          <input value={copy.instagram.handle ?? ''} onChange={e => { setCopy({ ...copy, instagram: { ...copy.instagram, handle: e.target.value } }); setDirty(true); }} className="input-field text-sm" placeholder="Handle" />
          <textarea value={copy.instagram.tagline ?? ''} onChange={e => { setCopy({ ...copy, instagram: { ...copy.instagram, tagline: e.target.value } }); setDirty(true); }} className="input-field text-sm min-h-[60px]" placeholder="Tagline" />
        </AdminCard>
        <AdminCard padding="md" className="space-y-3">
          <p className="text-sm font-semibold text-navy-700">Newsletter</p>
          <input value={copy.newsletter.overline ?? ''} onChange={e => { setCopy({ ...copy, newsletter: { ...copy.newsletter, overline: e.target.value } }); setDirty(true); }} className="input-field text-sm" placeholder="Overline" />
          <input value={copy.newsletter.title1 ?? ''} onChange={e => { setCopy({ ...copy, newsletter: { ...copy.newsletter, title1: e.target.value } }); setDirty(true); }} className="input-field text-sm" placeholder="Title line 1" />
          <input value={copy.newsletter.title2 ?? ''} onChange={e => { setCopy({ ...copy, newsletter: { ...copy.newsletter, title2: e.target.value } }); setDirty(true); }} className="input-field text-sm" placeholder="Title line 2" />
          <textarea value={copy.newsletter.subtitle ?? ''} onChange={e => { setCopy({ ...copy, newsletter: { ...copy.newsletter, subtitle: e.target.value } }); setDirty(true); }} className="input-field text-sm min-h-[72px]" />
        </AdminCard>
      </div>
      <button type="button" onClick={save} disabled={!dirty || api.saving} className="btn-primary text-sm inline-flex items-center gap-2">
        {api.saving && <Loader2 size={14} className="animate-spin" />}
        Save section copy
      </button>
    </div>
  );
}
