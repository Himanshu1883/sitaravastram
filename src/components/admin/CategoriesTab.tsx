import { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Layers,
  Trash2,
  Loader2,
  ImagePlus,
  Package,
  Link2,
} from 'lucide-react';
import type { AdminData, AdminApi } from '../../hooks/useAdminApi';
import type { Category } from '../../types';
import { uploadMedia, mediaUrl } from '../../lib/api';
import { slugify } from '../../lib/admin/productUtils';
import AdminPageHeader from './ui/AdminPageHeader';
import AdminCard from './ui/AdminCard';
import AdminModal from './ui/AdminModal';

function categoryProductCount(products: AdminData['products'], slug: string): number {
  return products.filter(p => p.category === slug).length;
}

export default function CategoriesTab({ data, api }: { data: AdminData; api: AdminApi }) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', image: '' });

  const stats = useMemo(() => {
    const withProducts = data.categories.filter(
      c => categoryProductCount(data.products, c.slug) > 0,
    ).length;
    const totalProducts = data.products.length;
    return {
      total: data.categories.length,
      withProducts,
      empty: data.categories.length - withProducts,
      totalProducts,
    };
  }, [data.categories, data.products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data.categories;
    return data.categories.filter(
      c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q),
    );
  }, [data.categories, search]);

  const resetForm = () => setForm({ name: '', slug: '', image: '' });

  const addCategory = async () => {
    if (!form.name.trim() || !form.slug.trim()) return;
    setSaving(true);
    try {
      const cat: Category = {
        id: Date.now().toString(),
        name: form.name.trim(),
        slug: form.slug.trim(),
        image: form.image,
        count: 0,
      };
      await api.saveCategory(cat);
      resetForm();
      setShowAdd(false);
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async (cat: Category) => {
    const count = categoryProductCount(data.products, cat.slug);
    const msg =
      count > 0
        ? `Delete "${cat.name}"? ${count} product(s) use this category.`
        : `Delete "${cat.name}"?`;
    if (!window.confirm(msg)) return;
    setDeletingId(cat.id);
    try {
      await api.deleteCategory(cat.id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadMedia(file);
      setForm(prev => ({ ...prev, image: url }));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      <AdminPageHeader
        title="Categories"
        description="Organize your catalog into browsable collections on the storefront."
        actions={
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowAdd(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-navy-700 text-white hover:bg-rosegold-500 transition-colors"
          >
            <Plus size={14} />
            Add category
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: 'Categories', value: stats.total, icon: Layers },
          { label: 'With products', value: stats.withProducts, icon: Package },
          { label: 'Empty', value: stats.empty, icon: Link2 },
          { label: 'Total products', value: stats.totalProducts, icon: Package },
        ].map(stat => (
          <AdminCard key={stat.label} padding="sm" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center">
              <stat.icon size={18} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-lg font-bold text-navy-700 tabular-nums">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </AdminCard>
        ))}
      </div>

      <AdminCard padding="none" className="overflow-hidden mb-6">
        <div className="p-4 sm:p-5 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search categories…"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-cream-100/30 focus:outline-none focus:ring-2 focus:ring-rosegold-300/50 focus:border-rosegold-400"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Layers size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="font-heading text-base font-semibold text-navy-700 mb-1">
              {data.categories.length === 0 ? 'No categories yet' : 'No matching categories'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {data.categories.length === 0
                ? 'Create categories to structure your product catalog.'
                : 'Try a different search term.'}
            </p>
            {data.categories.length === 0 && (
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="btn-primary text-sm inline-flex items-center gap-2"
              >
                <Plus size={14} />
                Add category
              </button>
            )}
          </div>
        ) : (
          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(cat => {
              const count = categoryProductCount(data.products, cat.slug);
              const isDeleting = deletingId === cat.id;
              return (
                <div
                  key={cat.id}
                  className="group relative rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-luxury transition-shadow duration-300"
                >
                  <div className="aspect-[16/10] bg-cream-100 relative overflow-hidden">
                    {cat.image ? (
                      <img
                        src={mediaUrl(cat.image)}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Layers size={32} className="text-gray-200" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="font-heading text-lg font-semibold text-white">{cat.name}</p>
                      <p className="text-xs text-white/70 font-mono">/{cat.slug}</p>
                    </div>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500">
                      <span className="font-semibold text-navy-700 tabular-nums">{count}</span>{' '}
                      product{count !== 1 ? 's' : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCategory(cat)}
                      disabled={isDeleting}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {data.categories.length} categories
          </div>
        )}
      </AdminCard>

      <AdminModal
        open={showAdd}
        onClose={() => !saving && setShowAdd(false)}
        title="Add category"
        subtitle="New collection for your storefront"
        size="md"
        footer={
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-navy-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addCategory}
              disabled={saving || !form.name.trim() || !form.slug.trim()}
              className="btn-primary text-sm inline-flex items-center gap-2 min-w-[120px] justify-center"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving…' : 'Create category'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
              Name
            </label>
            <input
              value={form.name}
              onChange={e => {
                const name = e.target.value;
                setForm(prev => ({
                  ...prev,
                  name,
                  slug: prev.slug || slugify(name),
                }));
              }}
              className="input-field"
              placeholder="Cotton Suits"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
              Slug
            </label>
            <input
              value={form.slug}
              onChange={e => setForm(prev => ({ ...prev, slug: slugify(e.target.value) }))}
              className="input-field font-mono text-sm"
              placeholder="cotton-suits"
            />
            <p className="text-xs text-gray-400 mt-1">Used in URLs: /collections/{form.slug || 'slug'}</p>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
              Cover image
            </label>
            {form.image ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-100 mb-3 aspect-video max-h-40">
                <img src={mediaUrl(form.image)} alt="" className="w-full h-full object-cover" />
              </div>
            ) : null}
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-rosegold-300 text-sm font-medium text-rosegold-600 hover:bg-rosegold-50 cursor-pointer transition-colors">
              <ImagePlus size={16} />
              {uploading ? 'Uploading…' : form.image ? 'Replace image' : 'Upload image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
