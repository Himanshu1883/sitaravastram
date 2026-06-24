import { useState } from 'react';
import { Loader2, LayoutTemplate } from 'lucide-react';
import { useHomepageAdmin } from '../../hooks/useHomepageAdmin';
import AdminPageHeader from './ui/AdminPageHeader';
import { AdminErrorState } from './ui/AdminSkeleton';
import HomepageHeroPanel from './homepage/HomepageHeroPanel';
import HomepageCategoriesPanel from './homepage/HomepageCategoriesPanel';
import HomepageFabricsPanel from './homepage/HomepageFabricsPanel';
import HomepageOccasionsPanel from './homepage/HomepageOccasionsPanel';
import HomepageFeaturedPanel from './homepage/HomepageFeaturedPanel';
import HomepageInstagramPanel from './homepage/HomepageInstagramPanel';
import HomepageSectionCopyPanel from './homepage/HomepageSectionCopyPanel';
import HomepageReviewsPanel from './homepage/HomepageReviewsPanel';

const PANELS = [
  { id: 'copy', label: 'Section copy' },
  { id: 'hero', label: 'Hero' },
  { id: 'categories', label: 'Categories' },
  { id: 'fabrics', label: 'Fabrics' },
  { id: 'occasions', label: 'Occasions' },
  { id: 'featured', label: 'Featured' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'reviews', label: 'Reviews' },
] as const;

type PanelId = (typeof PANELS)[number]['id'];

export default function HomepageTab() {
  const api = useHomepageAdmin();
  const [panel, setPanel] = useState<PanelId>('copy');

  if (api.loading) {
    return (
      <div className="p-8 flex justify-center min-h-[40vh]">
        <Loader2 size={28} className="animate-spin text-rosegold-500" />
      </div>
    );
  }

  if (api.error || !api.data) {
    return <AdminErrorState message={api.error ?? 'Failed to load homepage CMS'} />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px]">
      <AdminPageHeader
        title="Homepage"
        description="Edit storefront images, English headings, and section content. Each upload shows recommended resolution and crop tips."
      />

      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-100">
        {PANELS.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPanel(p.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              panel === p.id
                ? 'bg-navy-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
        <LayoutTemplate size={14} />
        Editing: <span className="font-semibold text-navy-700">{PANELS.find(p => p.id === panel)?.label}</span>
      </div>

      {panel === 'copy' && <HomepageSectionCopyPanel api={api} />}
      {panel === 'hero' && <HomepageHeroPanel api={api} />}
      {panel === 'categories' && <HomepageCategoriesPanel api={api} />}
      {panel === 'fabrics' && <HomepageFabricsPanel api={api} />}
      {panel === 'occasions' && <HomepageOccasionsPanel api={api} />}
      {panel === 'featured' && <HomepageFeaturedPanel api={api} />}
      {panel === 'instagram' && <HomepageInstagramPanel api={api} />}
      {panel === 'reviews' && <HomepageReviewsPanel api={api} />}
    </div>
  );
}
