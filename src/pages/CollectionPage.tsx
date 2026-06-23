import { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { useFormatPrice } from '../hooks/useFormatPrice';
import { useContentTranslation } from '../hooks/useContentTranslation';
import { searchProducts } from '../lib/searchProducts';
import { useProducts, useCategories, useHomepage } from '../hooks/useCatalog';
import type { Product } from '../types';

const fabricOptions = ['Cotton', 'Silk', 'Chiffon', 'Linen', 'Rayon', 'Georgette', 'Net', 'Chanderi Silk', 'Banarasi Silk', 'Cotton Blend', 'Mixed'];
const occasionOptions = ['Casual', 'Office', 'Party', 'Festive', 'Wedding'];
const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'];
const priceRangeOptions = [
  { id: '0-2000', min: 0, max: 2000 },
  { id: '2000-5000', min: 2000, max: 5000 },
  { id: '5000-10000', min: 5000, max: 10000 },
  { id: '10000+', min: 10000, max: 20000 },
];
const sortOptionKeys: Record<string, string> = {
  featured: 'sort.featured',
  newest: 'sort.newest',
  'price-asc': 'sort.priceAsc',
  'price-desc': 'sort.priceDesc',
  rating: 'sort.rating',
};

function FilterAccordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-navy-900">
          {title}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          className={`flex-shrink-0 text-navy-900 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="space-y-3 pb-5">{children}</div>}
    </div>
  );
}

function FilterCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-sm border-neutral-300 text-navy-900 accent-navy-900 focus:ring-navy-900"
      />
      <span className="font-body text-sm leading-snug text-gray-700 group-hover:text-navy-900">
        {label}
      </span>
    </label>
  );
}

interface FilterPanelProps {
  categories: { id: string; name: string; slug: string }[];
  allColors: string[];
  selectedFabrics: string[];
  setSelectedFabrics: (v: string[]) => void;
  selectedOccasions: string[];
  setSelectedOccasions: (v: string[]) => void;
  selectedSizes: string[];
  setSelectedSizes: (v: string[]) => void;
  selectedColors: string[];
  setSelectedColors: (v: string[]) => void;
  selectedPriceRanges: string[];
  setSelectedPriceRanges: (v: string[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (v: string[]) => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  clearAllFilters: () => void;
  activeFilterCount: number;
  toggleFilter: (list: string[], setList: (v: string[]) => void, value: string) => void;
}

function FilterPanel({
  categories,
  allColors,
  selectedFabrics,
  setSelectedFabrics,
  selectedOccasions,
  setSelectedOccasions,
  selectedSizes,
  setSelectedSizes,
  selectedColors,
  setSelectedColors,
  selectedPriceRanges,
  setSelectedPriceRanges,
  selectedCategories,
  setSelectedCategories,
  inStockOnly,
  setInStockOnly,
  clearAllFilters,
  activeFilterCount,
  toggleFilter,
}: FilterPanelProps) {
  const { t } = useTranslation();
  const { category, fabric, occasion } = useContentTranslation();
  const formatPrice = useFormatPrice();

  return (
    <div>
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="mb-4 font-body text-xs font-medium text-gray-500 underline-offset-2 hover:text-navy-900 hover:underline"
        >
          {t('collection.clearAll')}
        </button>
      )}

      <FilterAccordion title={t('collection.price')}>
        {priceRangeOptions.map(range => (
          <FilterCheckbox
            key={range.id}
            checked={selectedPriceRanges.includes(range.id)}
            onChange={() => toggleFilter(selectedPriceRanges, setSelectedPriceRanges, range.id)}
            label={`${formatPrice(range.min)} – ${formatPrice(range.max)}`}
          />
        ))}
      </FilterAccordion>

      <FilterAccordion title={t('collection.fabric')}>
        {fabricOptions.map(item => (
          <FilterCheckbox
            key={item}
            checked={selectedFabrics.includes(item)}
            onChange={() => toggleFilter(selectedFabrics, setSelectedFabrics, item)}
            label={fabric(item)}
          />
        ))}
      </FilterAccordion>

      <FilterAccordion title={t('collection.occasion')}>
        {occasionOptions.map(occ => (
          <FilterCheckbox
            key={occ}
            checked={selectedOccasions.includes(occ)}
            onChange={() => toggleFilter(selectedOccasions, setSelectedOccasions, occ)}
            label={occasion(occ)}
          />
        ))}
      </FilterAccordion>

      <FilterAccordion title={t('collection.category')}>
        {categories.map(cat => (
          <FilterCheckbox
            key={cat.id}
            checked={selectedCategories.includes(cat.slug)}
            onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat.slug)}
            label={category(cat.slug, cat.name)}
          />
        ))}
      </FilterAccordion>

      <FilterAccordion title={t('collection.size')}>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map(size => (
            <button
              key={size}
              type="button"
              onClick={() => toggleFilter(selectedSizes, setSelectedSizes, size)}
              className={`min-h-[36px] min-w-[36px] border px-2.5 font-body text-xs font-medium transition-colors ${
                selectedSizes.includes(size)
                  ? 'border-navy-900 bg-navy-900 text-white'
                  : 'border-neutral-200 text-gray-700 hover:border-navy-900'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterAccordion>

      <FilterAccordion title={t('collection.color')}>
        <div className="flex flex-wrap gap-2">
          {allColors.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => toggleFilter(selectedColors, setSelectedColors, color)}
              className={`border px-2.5 py-1 font-body text-xs transition-colors ${
                selectedColors.includes(color)
                  ? 'border-navy-900 bg-navy-900 text-white'
                  : 'border-neutral-200 text-gray-700 hover:border-navy-900'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </FilterAccordion>

      <FilterAccordion title={t('collection.availability')}>
        <FilterCheckbox
          checked={inStockOnly}
          onChange={() => setInStockOnly(!inStockOnly)}
          label={t('collection.inStockOnly')}
        />
      </FilterAccordion>
    </div>
  );
}

export default function CollectionPage() {
  const { t } = useTranslation();
  const { category } = useContentTranslation();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const fabricParam = searchParams.get('fabric');
  const searchQuery = searchParams.get('q')?.trim() ?? '';

  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { data: homepage } = useHomepage();
  const occasionSlugMap = homepage?.occasionSlugMap ?? {};
  const allColors = homepage?.allColors ?? [];

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>(fabricParam ? [fabricParam] : []);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  const pageTitle =
    searchQuery
      ? t('search.resultsFor', { query: searchQuery })
      : slug === 'new-arrivals'
      ? t('categories.new-arrivals')
      : slug === 'best-sellers'
        ? t('categories.best-sellers')
        : slug
          ? category(slug, categories.find(c => c.slug === slug)?.name ?? t('collection.allCollections'))
          : t('collection.allCollections');

  const filtered = useMemo<Product[]>(() => {
    let result = [...products];

    if (slug === 'new-arrivals') {
      result = result.filter(p => p.isNew);
    } else if (slug === 'best-sellers') {
      result = result.filter(p => p.isBestSeller);
    } else if (slug && slug !== 'all' && slug !== 'featured') {
      const occasionName = occasionSlugMap[slug];
      if (occasionName) {
        result = result.filter(p => p.occasion.includes(occasionName));
      } else {
        result = result.filter(p => p.category === slug || p.tags.includes(slug));
      }
    }

    if (selectedFabrics.length > 0) {
      result = result.filter(p => selectedFabrics.some(f => p.fabric.toLowerCase().includes(f.toLowerCase())));
    }
    if (selectedOccasions.length > 0) {
      result = result.filter(p => p.occasion.some(o => selectedOccasions.includes(o)));
    }
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    }
    if (selectedColors.length > 0) {
      result = result.filter(p => p.colors.some(c => selectedColors.includes(c)));
    }
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }
    if (selectedPriceRanges.length > 0) {
      result = result.filter(p =>
        selectedPriceRanges.some(id => {
          const range = priceRangeOptions.find(r => r.id === id);
          return range ? p.price >= range.min && p.price <= range.max : false;
        }),
      );
    }
    if (inStockOnly) result = result.filter(p => p.inStock);

    if (searchQuery) {
      const matchedIds = new Set(searchProducts(searchQuery, products).map(p => p.id));
      result = result.filter(p => matchedIds.has(p.id));
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [
    slug,
    selectedFabrics,
    selectedOccasions,
    selectedSizes,
    selectedColors,
    selectedCategories,
    selectedPriceRanges,
    inStockOnly,
    sortBy,
    searchQuery,
    products,
    occasionSlugMap,
  ]);

  const toggleFilter = (list: string[], setList: (v: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter(i => i !== value) : [...list, value]);
  };

  const activeFilterCount =
    selectedFabrics.length +
    selectedOccasions.length +
    selectedSizes.length +
    selectedColors.length +
    selectedCategories.length +
    selectedPriceRanges.length +
    (inStockOnly ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedFabrics([]);
    setSelectedOccasions([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setInStockOnly(false);
  };

  const filterProps: FilterPanelProps = {
    categories,
    allColors,
    selectedFabrics,
    setSelectedFabrics,
    selectedOccasions,
    setSelectedOccasions,
    selectedSizes,
    setSelectedSizes,
    selectedColors,
    setSelectedColors,
    selectedPriceRanges,
    setSelectedPriceRanges,
    selectedCategories,
    setSelectedCategories,
    inStockOnly,
    setInStockOnly,
    clearAllFilters,
    activeFilterCount,
    toggleFilter,
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header — full width */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-end gap-4">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 border border-neutral-200 px-3 py-2 font-body text-xs font-semibold uppercase tracking-wide text-navy-900 lg:hidden"
          >
            <SlidersHorizontal size={14} />
            {t('collection.filters')}
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-navy-900 px-1 text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-navy-900 lg:text-[1.75rem]">
              {pageTitle}
            </h1>
            <p className="mt-1 font-body text-sm text-gray-500">
              {t(filtered.length === 1 ? 'collection.product' : 'collection.products', { count: filtered.length })}
            </p>
          </div>
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="appearance-none border-0 bg-transparent py-1 pr-8 font-body text-sm font-medium text-navy-900 focus:outline-none focus:ring-0 cursor-pointer"
          >
            {Object.entries(sortOptionKeys).map(([value, key]) => (
              <option key={value} value={value}>
                {t(key)}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-navy-900" />
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <h2 className="font-heading text-lg font-bold text-navy-900">{t('collection.filters')}</h2>
              <button type="button" onClick={() => setFiltersOpen(false)} className="p-2 text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <FilterPanel {...filterProps} />
            </div>
            <div className="border-t border-neutral-200 p-4">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="flex h-12 w-full items-center justify-center rounded-full bg-navy-900 font-body text-xs font-semibold uppercase tracking-wide text-white"
              >
                {t('collection.showProducts', { count: filtered.length })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main — sidebar + grid full width */}
      <div className="w-full lg:grid lg:grid-cols-[minmax(220px,260px)_minmax(0,1fr)]">
        <aside className="hidden border-r border-neutral-200 lg:block">
          <div className="sticky top-24 max-h-[calc(100svh-6rem)] overflow-y-auto px-6 py-6 xl:px-8 [scrollbar-width:thin]">
            <FilterPanel {...filterProps} />
          </div>
        </aside>

        <div className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {activeFilterCount > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={clearAllFilters}
                className="font-body text-xs text-gray-500 underline-offset-2 hover:underline"
              >
                {t('collection.clearAll')}
              </button>
            </div>
          )}

          {productsLoading || categoriesLoading ? (
            <div className="py-20 text-center font-body text-sm text-gray-500">{t('search.searching')}</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="mb-3 font-heading text-2xl font-semibold text-navy-900">{t('collection.noProducts')}</p>
              <p className="mb-6 font-body text-sm text-gray-500">{t('collection.noProductsSubtitle')}</p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex h-11 items-center justify-center rounded-full bg-navy-900 px-8 font-body text-xs font-semibold uppercase tracking-wide text-white"
              >
                {t('collection.clearFilters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-10">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
