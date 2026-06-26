import { useMemo, useState, type ReactNode } from 'react';
import {
  Plus,
  Pencil,
  Upload,
  ImagePlus,
  Search,
  Trash2,
  Package,
  Loader2,
  X,
  Sparkles,
  Star,
} from 'lucide-react';
import type { AdminData, AdminApi } from '../../hooks/useAdminApi';
import type { Product } from '../../types';
import { uploadMedia, mediaUrl } from '../../lib/api';
import { formatINR } from '../../lib/admin/dashboardStats';
import {
  emptyProduct,
  productStats,
  slugify,
  stockLevel,
} from '../../lib/admin/productUtils';
import AdminPageHeader from './ui/AdminPageHeader';
import AdminCard from './ui/AdminCard';
import AdminModal from './ui/AdminModal';
import ProductCustomFieldsEditor from './ProductCustomFieldsEditor';
import { StockBadge } from './ui/StockBadge';
import { validateMediaFile } from '../../lib/admin/mediaValidation';

type StockFilter = 'all' | 'in' | 'low' | 'out';

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
      {children}
    </label>
  );
}

function ProductForm({
  product,
  categories,
  onChange,
  onImageUpload,
  onVideoUpload,
  onRemoveImage,
  uploading,
  savingMedia,
}: {
  product: Product;
  categories: AdminData['categories'];
  onChange: (p: Product) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  uploading: boolean;
  savingMedia: boolean;
}) {
  const set = (patch: Partial<Product>) => onChange({ ...product, ...patch });

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-bold uppercase tracking-wider text-rosegold-600 mb-3">
          Basic info
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Name</FieldLabel>
            <input
              value={product.name}
              onChange={e => {
                const name = e.target.value;
                set({
                  name,
                  slug: product.slug || slugify(name),
                });
              }}
              className="input-field"
              placeholder="Royal Cotton Suit Set"
            />
          </div>
          <div>
            <FieldLabel>Slug</FieldLabel>
            <input
              value={product.slug}
              onChange={e => set({ slug: e.target.value })}
              className="input-field font-mono text-sm"
              placeholder="royal-cotton-suit-set"
            />
          </div>
          <div>
            <FieldLabel>SKU</FieldLabel>
            <input
              value={product.sku}
              onChange={e => set({ sku: e.target.value })}
              className="input-field font-mono text-sm"
            />
          </div>
          <div>
            <FieldLabel>Price (₹)</FieldLabel>
            <input
              type="number"
              min={0}
              value={product.price || ''}
              onChange={e => set({ price: Number(e.target.value) })}
              className="input-field"
            />
          </div>
          <div>
            <FieldLabel>Category</FieldLabel>
            <select
              value={product.category}
              onChange={e => set({ category: e.target.value })}
              className="input-field"
            >
              {categories.length > 0 ? (
                categories.map(c => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))
              ) : (
                <option value={product.category}>{product.category}</option>
              )}
            </select>
          </div>
          <div>
            <FieldLabel>Fabric</FieldLabel>
            <input
              value={product.fabric}
              onChange={e => set({ fabric: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <FieldLabel>Stock qty</FieldLabel>
            <input
              type="number"
              min={0}
              value={product.stock ?? 0}
              onChange={e => {
                const stock = Number(e.target.value);
                set({ stock, inStock: stock > 0 });
              }}
              className="input-field"
            />
          </div>
          <div className="flex flex-wrap items-end gap-4 pb-1">
            <label className="flex items-center gap-2 text-sm text-navy-700 cursor-pointer">
              <input
                type="checkbox"
                checked={product.inStock}
                onChange={e => set({ inStock: e.target.checked })}
                className="rounded border-gray-300 text-rosegold-500 focus:ring-rosegold-400"
              />
              In stock
            </label>
            <label className="flex items-center gap-2 text-sm text-navy-700 cursor-pointer">
              <input
                type="checkbox"
                checked={!!product.isNew}
                onChange={e => set({ isNew: e.target.checked })}
                className="rounded border-gray-300 text-rosegold-500 focus:ring-rosegold-400"
              />
              <Sparkles size={14} className="text-rosegold-500" />
              New arrival
            </label>
            <label className="flex items-center gap-2 text-sm text-navy-700 cursor-pointer">
              <input
                type="checkbox"
                checked={!!product.isBestSeller}
                onChange={e => set({ isBestSeller: e.target.checked })}
                className="rounded border-gray-300 text-rosegold-500 focus:ring-rosegold-400"
              />
              <Star size={14} className="text-amber-500" />
              Best seller
            </label>
          </div>
        </div>
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-wider text-rosegold-600 mb-3">
          Description
        </p>
        <textarea
          value={product.description}
          onChange={e => set({ description: e.target.value })}
          className="input-field min-h-[100px]"
          placeholder="Product description for the storefront…"
        />
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-wider text-rosegold-600 mb-3">
          Media
        </p>
        {(uploading || savingMedia) && (
          <p className="mb-2 flex items-center gap-2 text-xs font-medium text-rosegold-600">
            <Loader2 size={14} className="animate-spin" />
            {uploading ? 'Uploading…' : 'Removing image…'}
          </p>
        )}
        <div className={`flex flex-wrap gap-2 mb-3 ${savingMedia ? 'pointer-events-none opacity-60' : ''}`}>
          {product.images.map((img, i) => (
            <div
              key={img}
              className="relative group w-20 h-24 rounded-xl overflow-hidden border border-gray-100"
            >
              <img src={mediaUrl(img)} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemoveImage(i)}
                disabled={uploading || savingMedia}
                className="absolute top-1 right-1 rounded-md bg-black/50 p-1 text-white opacity-100 transition-opacity disabled:cursor-not-allowed sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <label
            className={`inline-flex items-center gap-2 rounded-xl border border-dashed border-rosegold-300 px-4 py-2 text-sm font-medium text-rosegold-600 transition-colors ${
              uploading || savingMedia
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer hover:bg-rosegold-50'
            }`}
          >
            <ImagePlus size={16} />
            {uploading ? 'Uploading…' : 'Add images'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              disabled={uploading || savingMedia}
              onChange={onImageUpload}
            />
          </label>
          <label
            className={`inline-flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors ${
              uploading || savingMedia
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer hover:bg-gray-50'
            }`}
          >
            <ImagePlus size={16} />
            {uploading ? 'Uploading…' : product.video ? 'Replace video' : 'Add video'}
            <input
              type="file"
              accept="video/mp4,video/webm"
              className="hidden"
              disabled={uploading || savingMedia}
              onChange={onVideoUpload}
            />
          </label>
        </div>
        {product.video && (
          <p className="text-xs text-gray-400 mt-2 truncate">Video: {product.video}</p>
        )}
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-wider text-rosegold-600 mb-3">
          Variants
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Colors (comma-separated)</FieldLabel>
            <input
              value={product.colors.join(', ')}
              onChange={e =>
                set({
                  colors: e.target.value
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean),
                })
              }
              className="input-field"
              placeholder="Red, Blue, Green"
            />
          </div>
          <div>
            <FieldLabel>Sizes (comma-separated)</FieldLabel>
            <input
              value={product.sizes.join(', ')}
              onChange={e =>
                set({
                  sizes: e.target.value
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean),
                })
              }
              className="input-field"
              placeholder="S, M, L, XL, XXL"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-6 mt-4">
          <label className="flex items-center gap-2 text-sm text-navy-700 cursor-pointer">
            <input
              type="checkbox"
              checked={!!product.showColorSelector}
              onChange={e => set({ showColorSelector: e.target.checked })}
              className="rounded border-gray-300 text-rosegold-500 focus:ring-rosegold-400"
            />
            Show color selector on storefront
          </label>
          <label className="flex items-center gap-2 text-sm text-navy-700 cursor-pointer">
            <input
              type="checkbox"
              checked={!!product.showSizeSelector}
              onChange={e => set({ showSizeSelector: e.target.checked })}
              className="rounded border-gray-300 text-rosegold-500 focus:ring-rosegold-400"
            />
            Show size selector on storefront
          </label>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Colors and sizes are saved either way. Toggles control whether shoppers see them on the product page.
        </p>
      </section>

      <ProductCustomFieldsEditor
        fields={product.customFields ?? []}
        onChange={customFields => set({ customFields })}
        disabled={uploading || savingMedia}
      />
    </div>
  );
}

export default function ProductsTab({ data, api }: { data: AdminData; api: AdminApi }) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [bulkPreview, setBulkPreview] = useState<Product[]>([]);
  const [showBulk, setShowBulk] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingMedia, setSavingMedia] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');

  const stats = useMemo(() => productStats(data.products), [data.products]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.products.filter(p => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      const level = stockLevel(p.stock, p.inStock);
      if (stockFilter === 'in' && level !== 'ok') return false;
      if (stockFilter === 'low' && level !== 'low') return false;
      if (stockFilter === 'out' && level !== 'out') return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q)
      );
    });
  }, [data.products, search, categoryFilter, stockFilter]);

  const isNewProduct = editing && !data.products.find(p => p.id === editing.id);

  const saveProduct = async () => {
    if (!editing || !editing.name.trim()) return;

    const invalidField = (editing.customFields ?? []).find(f => {
      if (!f.label.trim()) return true;
      if (f.type === 'boolean') return false;
      if (f.type === 'list') return !Array.isArray(f.value) || f.value.length === 0;
      if (f.type === 'number') return typeof f.value !== 'number' || !Number.isFinite(f.value);
      return !String(f.value ?? '').trim();
    });
    if (invalidField) {
      window.alert('Each custom field needs a label and a value.');
      return;
    }

    setSaving(true);
    try {
      const payload: Product = {
        ...editing,
        customFields: (editing.customFields ?? []).map((f, i) => ({
          ...f,
          key: f.key || slugify(f.label),
          order: i,
        })),
      };
      const exists = data.products.find(p => p.id === editing.id);
      await api.saveProduct(payload, !exists);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    if (editing?.id === product.id) setEditing(null);
    setDeletingId(product.id);
    try {
      await api.deleteProduct(product.id);
    } catch {
      window.alert('Could not delete product. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkCsv = (text: string) => {
    const lines = text.trim().split('\n').slice(1);
    const parsed = lines.map((line, i) => {
      const [name, price, sku, category, fabric] = line.split(',').map(s => s.trim());
      const productName = name || 'New Product';
      return {
        ...emptyProduct(),
        id: `bulk-${Date.now()}-${i}`,
        name: productName,
        price: Number(price) || 999,
        sku: sku || `SKU-${i}`,
        category: category || 'cotton-suits',
        fabric: fabric || 'Cotton',
        slug: slugify(productName),
      };
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
        const check = validateMediaFile(file, 'image');
        if (!check.ok) {
          window.alert(check.error);
          continue;
        }
        const { url } = await uploadMedia(file);
        urls.push(url);
      }
      if (urls.length) {
        setEditing({ ...editing, images: [...editing.images, ...urls] });
      }
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const check = validateMediaFile(file, 'video');
    if (!check.ok) {
      window.alert(check.error);
      e.target.value = '';
      return;
    }
    setUploading(true);
    try {
      const { url } = await uploadMedia(file);
      setEditing({ ...editing, video: url });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = async (index: number) => {
    if (!editing || uploading || savingMedia) return;

    const previous = editing;
    const updated: Product = {
      ...editing,
      images: editing.images.filter((_, idx) => idx !== index),
    };

    setEditing(updated);

    const isPersisted = data.products.some(p => p.id === editing.id);
    if (!isPersisted) return;

    setSavingMedia(true);
    try {
      const saved = await api.saveProduct(updated, false);
      setEditing(saved);
    } catch {
      setEditing(previous);
      window.alert('Could not remove image. Please try again.');
    } finally {
      setSavingMedia(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      <AdminPageHeader
        title="Products"
        description="Manage your catalog, pricing, media, and availability."
        actions={
          <>
            <button
              type="button"
              onClick={() => setShowBulk(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-navy-200 text-navy-700 bg-white hover:border-rosegold-400 transition-colors"
            >
              <Upload size={14} />
              Bulk upload
            </button>
            <button
              type="button"
              onClick={() => setEditing(emptyProduct())}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-navy-700 text-white hover:bg-rosegold-500 transition-colors"
            >
              <Plus size={14} />
              Add product
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: 'Total products', value: stats.total },
          { label: 'In stock', value: stats.inStock },
          { label: 'Low stock', value: stats.lowStock },
          { label: 'Out of stock', value: stats.outOfStock },
        ].map(stat => (
          <AdminCard key={stat.label} padding="sm" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center">
              <Package size={18} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-lg font-bold text-navy-700 tabular-nums">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </AdminCard>
        ))}
      </div>

      <AdminCard padding="none" className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 space-y-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, SKU, slug, or fabric…"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-cream-100/30 focus:outline-none focus:ring-2 focus:ring-rosegold-300/50 focus:border-rosegold-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-navy-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80'
              }`}
            >
              All categories
            </button>
            {data.categories.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoryFilter(c.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  categoryFilter === c.slug
                    ? 'bg-navy-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Stock:</span>
            {(
              [
                { value: 'all', label: 'All' },
                { value: 'in', label: 'In stock' },
                { value: 'low', label: 'Low' },
                { value: 'out', label: 'Out' },
              ] as const
            ).map(f => (
              <button
                key={f.value}
                type="button"
                onClick={() => setStockFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  stockFilter === f.value
                    ? 'bg-rosegold-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Package size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="font-heading text-base font-semibold text-navy-700 mb-1">
              {data.products.length === 0 ? 'No products yet' : 'No matching products'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {data.products.length === 0
                ? 'Add your first product to start selling.'
                : 'Try adjusting your search or filters.'}
            </p>
            {data.products.length === 0 && (
              <button
                type="button"
                onClick={() => setEditing(emptyProduct())}
                className="btn-primary text-sm inline-flex items-center gap-2"
              >
                <Plus size={14} />
                Add product
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="hidden md:table-cell">SKU</th>
                  <th className="hidden lg:table-cell">Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => {
                  const level = stockLevel(p.stock, p.inStock);
                  const isDeleting = deletingId === p.id;
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="flex items-center gap-3 min-w-[180px]">
                          {p.images[0] ? (
                            <img
                              src={mediaUrl(p.images[0])}
                              alt=""
                              className="w-11 h-14 object-cover rounded-lg flex-shrink-0 border border-gray-100"
                            />
                          ) : (
                            <div className="w-11 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Package size={16} className="text-gray-300" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-navy-700 truncate max-w-[200px]">
                              {p.name}
                            </p>
                            <div className="flex gap-1 mt-0.5">
                              {p.isNew && (
                                <span className="text-[10px] text-rosegold-600 font-semibold">NEW</span>
                              )}
                              {p.isBestSeller && (
                                <span className="text-[10px] text-amber-600 font-semibold">BEST</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell font-mono text-xs text-gray-500">
                        {p.sku || '—'}
                      </td>
                      <td className="hidden lg:table-cell text-sm text-gray-500 capitalize">
                        {p.category.replace(/-/g, ' ')}
                      </td>
                      <td className="text-sm font-semibold text-navy-700 tabular-nums">
                        {formatINR(p.price)}
                      </td>
                      <td className="text-sm text-gray-600 tabular-nums">{p.stock ?? '—'}</td>
                      <td>
                        <StockBadge level={level} />
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setEditing({ ...p })}
                            className="p-2 rounded-lg text-gray-500 hover:text-navy-700 hover:bg-cream-100 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(p)}
                            disabled={isDeleting}
                            className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {isDeleting ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filteredProducts.length} of {data.products.length} products
          </div>
        )}
      </AdminCard>

      <AdminModal
        open={!!editing}
        onClose={() => !saving && !savingMedia && !uploading && setEditing(null)}
        title={isNewProduct ? 'Add product' : 'Edit product'}
        subtitle={editing?.name || 'New catalog item'}
        size="lg"
        footer={
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => setEditing(null)}
              disabled={saving || savingMedia || uploading}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-navy-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveProduct}
              disabled={saving || savingMedia || uploading || !editing?.name.trim()}
              className="btn-primary text-sm inline-flex items-center justify-center gap-2 min-w-[120px]"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving…' : 'Save product'}
            </button>
          </div>
        }
      >
        {editing && (
          <ProductForm
            product={editing}
            categories={data.categories}
            onChange={setEditing}
            onImageUpload={handleImageUpload}
            onVideoUpload={handleVideoUpload}
            onRemoveImage={handleRemoveImage}
            uploading={uploading}
            savingMedia={savingMedia}
          />
        )}
      </AdminModal>

      <AdminModal
        open={showBulk}
        onClose={() => !saving && setShowBulk(false)}
        title="Bulk upload"
        subtitle="Import products from CSV"
        size="lg"
        footer={
          bulkPreview.length > 0 ? (
            <button
              type="button"
              onClick={importBulk}
              disabled={saving}
              className="btn-primary text-sm w-full sm:w-auto inline-flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              Import {bulkPreview.length} products
            </button>
          ) : undefined
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Paste CSV with header row:{' '}
            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono">
              name, price, sku, category, fabric
            </code>
          </p>
          <textarea
            className="input-field min-h-[160px] font-mono text-xs"
            placeholder={'name,price,sku,category,fabric\nRoyal Suit,1999,SKU-01,cotton-suits,Cotton'}
            onChange={e => handleBulkCsv(e.target.value)}
          />
          {bulkPreview.length > 0 && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3">
              <p className="text-sm font-semibold text-emerald-800">
                {bulkPreview.length} products ready to import
              </p>
              <ul className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                {bulkPreview.slice(0, 8).map(p => (
                  <li key={p.id} className="text-xs text-emerald-700 truncate">
                    {p.name} · {formatINR(p.price)} · {p.sku}
                  </li>
                ))}
                {bulkPreview.length > 8 && (
                  <li className="text-xs text-emerald-600">
                    +{bulkPreview.length - 8} more…
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </AdminModal>
    </div>
  );
}
