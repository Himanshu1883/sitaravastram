import { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { products, categories } from '../data/products';
import type { Product } from '../types';

const fabricOptions = ['Cotton', 'Silk', 'Chiffon', 'Linen', 'Rayon', 'Georgette', 'Net', 'Chanderi Silk', 'Banarasi Silk'];
const occasionOptions = ['Casual', 'Office', 'Party', 'Festive', 'Wedding'];
const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

function FilterAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-rosegold-100 pb-4 mb-4">
      <button
        className="flex items-center justify-between w-full py-2 text-sm font-inter font-semibold text-navy-700 hover:text-rosegold-500 transition-colors"
        onClick={() => setOpen(!open)}
      >
        {title}
        <ChevronDown size={15} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

export default function CollectionPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const fabricParam = searchParams.get('fabric');

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>(fabricParam ? [fabricParam] : []);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categoryName = categories.find(c => c.slug === slug)?.name || 'All Collections';

  const filtered = useMemo<Product[]>(() => {
    let result = [...products];

    if (slug && slug !== 'all' && slug !== 'new-arrivals' && slug !== 'best-sellers' && slug !== 'featured') {
      if (slug === 'new-arrivals') result = result.filter(p => p.isNew);
      else if (slug === 'best-sellers') result = result.filter(p => p.isBestSeller);
      else result = result.filter(p => p.category === slug || p.tags.includes(slug));
    } else if (slug === 'new-arrivals') {
      result = result.filter(p => p.isNew);
    } else if (slug === 'best-sellers') {
      result = result.filter(p => p.isBestSeller);
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
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (inStockOnly) result = result.filter(p => p.inStock);

    switch (sortBy) {
      case 'newest': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
    }

    return result;
  }, [slug, selectedFabrics, selectedOccasions, selectedSizes, priceRange, inStockOnly, sortBy]);

  const toggleFilter = (list: string[], setList: (v: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter(i => i !== value) : [...list, value]);
  };

  const activeFilterCount = selectedFabrics.length + selectedOccasions.length + selectedSizes.length + (inStockOnly ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedFabrics([]);
    setSelectedOccasions([]);
    setSelectedSizes([]);
    setPriceRange([0, 20000]);
    setInStockOnly(false);
  };

  return (
    <div className="min-h-screen bg-cream-100 pt-24">
      {/* Hero Banner */}
      <div className="bg-navy-700 text-white py-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-inter text-xs tracking-[0.3em] uppercase font-semibold text-rosegold-400 mb-3">
            Collections
          </p>
          <h1 className="font-playfair text-4xl lg:text-5xl font-semibold text-white mb-3">
            {slug === 'new-arrivals' ? 'New Arrivals' : slug === 'best-sellers' ? 'Best Sellers' : categoryName}
          </h1>
          <p className="font-inter text-sm text-white/60">{filtered.length} styles found</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 text-sm font-inter font-medium text-navy-700 border border-rosegold-200 px-4 py-2.5 rounded-sm hover:border-rosegold-500 hover:text-rosegold-500 transition-all duration-200"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-rosegold-500 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button onClick={clearAllFilters} className="flex items-center gap-1 text-xs font-inter text-gray-500 hover:text-red-500 transition-colors">
                <X size={12} />
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex border border-rosegold-200 rounded-sm overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-navy-700 text-white' : 'text-gray-500 hover:text-navy-700'}`}
              >
                <Grid3X3 size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-navy-700 text-white' : 'text-gray-500 hover:text-navy-700'}`}
              >
                <LayoutList size={15} />
              </button>
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-sm font-inter text-navy-700 border border-rosegold-200 rounded-sm px-3 py-2.5 bg-white focus:outline-none focus:border-rosegold-500 cursor-pointer"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          {filtersOpen && (
            <div className="hidden lg:block w-60 flex-shrink-0">
              <div className="bg-white rounded-sm shadow-card p-5 sticky top-28">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-inter text-sm font-bold text-navy-700">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button onClick={clearAllFilters} className="text-xs font-inter text-rosegold-500 hover:text-navy-700 transition-colors">
                      Clear all
                    </button>
                  )}
                </div>

                <FilterAccordion title="Fabric">
                  {fabricOptions.map(fabric => (
                    <label key={fabric} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedFabrics.includes(fabric)}
                        onChange={() => toggleFilter(selectedFabrics, setSelectedFabrics, fabric)}
                        className="w-3.5 h-3.5 accent-rosegold-500 rounded-sm"
                      />
                      <span className="text-xs font-inter text-gray-700 group-hover:text-rosegold-500 transition-colors">{fabric}</span>
                    </label>
                  ))}
                </FilterAccordion>

                <FilterAccordion title="Occasion">
                  {occasionOptions.map(occ => (
                    <label key={occ} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedOccasions.includes(occ)}
                        onChange={() => toggleFilter(selectedOccasions, setSelectedOccasions, occ)}
                        className="w-3.5 h-3.5 accent-rosegold-500"
                      />
                      <span className="text-xs font-inter text-gray-700 group-hover:text-rosegold-500 transition-colors">{occ}</span>
                    </label>
                  ))}
                </FilterAccordion>

                <FilterAccordion title="Size">
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleFilter(selectedSizes, setSelectedSizes, size)}
                        className={`px-3 py-1 text-xs font-inter font-medium rounded-sm border transition-all duration-200 ${selectedSizes.includes(size) ? 'bg-navy-700 text-white border-navy-700' : 'bg-white text-gray-700 border-rosegold-200 hover:border-rosegold-500 hover:text-rosegold-500'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </FilterAccordion>

                <FilterAccordion title="Price">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-inter text-gray-600">
                      <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                      <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={20000}
                      step={500}
                      value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-rosegold-500"
                    />
                  </div>
                </FilterAccordion>

                <label className="flex items-center gap-2.5 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="w-3.5 h-3.5 accent-rosegold-500"
                  />
                  <span className="text-xs font-inter text-gray-700">In Stock Only</span>
                </label>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-playfair text-2xl text-navy-700 mb-3">No products found</p>
                <p className="font-inter text-sm text-gray-500 mb-6">Try adjusting your filters</p>
                <button onClick={clearAllFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <div className={`grid gap-5 ${
                viewMode === 'grid'
                  ? filtersOpen
                    ? 'grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                  : 'grid-cols-1'
              }`}>
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
