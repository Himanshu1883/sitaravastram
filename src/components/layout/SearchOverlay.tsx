import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useFormatPrice } from '../../hooks/useFormatPrice';
import { searchProducts } from '../../lib/searchProducts';
import { useProducts } from '../../hooks/useCatalog';
import { mediaUrl } from '../../lib/api';
import {
  clearRecentlyViewed,
  loadRecentlyViewedSlugs,
} from '../../lib/storage';
import { trendingSearchKeys, trendingSearchTerms } from '../../data/search';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
}

export default function SearchOverlay({ open, onClose, anchorRef }: SearchOverlayProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const formatPrice = useFormatPrice();
  const inputRef = useRef<HTMLInputElement>(null);
  const [panelTop, setPanelTop] = useState(0);

  const [query, setQuery] = useState('');
  const [recentSlugs, setRecentSlugs] = useState<string[]>(() => loadRecentlyViewedSlugs());
  const { products: catalog } = useProducts();
  const debouncedQuery = useDebouncedValue(query.trim(), 300);
  const isDebouncing = query.trim() !== debouncedQuery;

  const results = useMemo(
    () => (debouncedQuery ? searchProducts(debouncedQuery, catalog).slice(0, 8) : []),
    [debouncedQuery, catalog],
  );

  const recentProducts = useMemo(
    () =>
      recentSlugs
        .map(s => catalog.find(p => p.slug === s))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [recentSlugs, catalog],
  );

  const showSuggestions = !query.trim();
  const showResults = Boolean(debouncedQuery);

  useLayoutEffect(() => {
    if (!open) return;

    const updateTop = () => {
      const anchor = anchorRef?.current;
      if (anchor) {
        setPanelTop(anchor.getBoundingClientRect().bottom);
        return;
      }
      const el = document.querySelector('.site-header');
      setPanelTop(el?.getBoundingClientRect().bottom ?? 0);
    };

    updateTop();
    window.addEventListener('resize', updateTop);
    window.addEventListener('scroll', updateTop, { passive: true });

    return () => {
      window.removeEventListener('resize', updateTop);
      window.removeEventListener('scroll', updateTop);
    };
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    setRecentSlugs(loadRecentlyViewedSlugs());
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  const handleSelectProduct = (slug: string) => {
    handleClose();
    navigate(`/product/${slug}`);
  };

  const handleTrendingClick = (key: (typeof trendingSearchKeys)[number]) => {
    setQuery(trendingSearchTerms[key]);
    inputRef.current?.focus();
  };

  const handleClearRecent = () => {
    clearRecentlyViewed();
    setRecentSlugs([]);
  };

  const handleViewAll = () => {
    if (!debouncedQuery) return;
    handleClose();
    navigate(`/collections?q=${encodeURIComponent(debouncedQuery)}`);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label={t('search.close')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-navy-900/40 backdrop-blur-[2px]"
            style={{ clipPath: `inset(${panelTop}px 0 0 0)` }}
            onClick={handleClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('search.title')}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-x-0 top-0 z-[90] max-h-svh overflow-y-auto bg-white shadow-luxury-lg [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-rosegold-200"
          >
            <div
              className="mx-auto w-full max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-8"
              style={{ paddingTop: panelTop }}
            >
              {/* Search input */}
              <div className="relative border border-navy-900">
                <Search
                  size={18}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-700"
                />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  autoComplete="off"
                  className="w-full bg-white py-4 pl-12 pr-14 font-body text-sm text-navy-900 placeholder:text-gray-400 focus:outline-none sm:text-base"
                />
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label={t('search.close')}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-navy-700 transition-colors hover:bg-cream-100"
                >
                  <X size={18} strokeWidth={1.75} />
                </button>
              </div>

              {/* Results */}
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 }}
                  className="mt-8"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="font-body text-sm font-bold text-navy-900">
                      {isDebouncing ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 size={14} className="animate-spin text-gray-400" />
                          {t('search.searching')}
                        </span>
                      ) : (
                        t('search.results', { count: results.length })
                      )}
                    </h2>
                    {!isDebouncing && results.length > 0 && (
                      <button
                        type="button"
                        onClick={handleViewAll}
                        className="font-body text-xs font-medium text-navy-700 underline-offset-2 hover:underline"
                      >
                        {t('search.viewAll')}
                      </button>
                    )}
                  </div>

                  {!isDebouncing && results.length === 0 && (
                    <p className="font-body text-sm text-gray-500">{t('search.noResults')}</p>
                  )}

                  <ul className="divide-y divide-neutral-100">
                    {results.map(product => (
                      <li key={product.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectProduct(product.slug)}
                          className="flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-cream-50"
                        >
                          <div className="h-16 w-14 flex-shrink-0 overflow-hidden bg-cream-100">
                            <img
                              src={mediaUrl(product.images[0])}
                              alt={product.name}
                              className="h-full w-full object-cover object-top"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 font-body text-sm font-medium text-navy-900">
                              {product.name}
                            </p>
                            <p className="mt-0.5 font-body text-xs text-gray-500">
                              {product.fabric}
                            </p>
                          </div>
                          <p className="flex-shrink-0 font-body text-sm font-semibold text-navy-900">
                            {formatPrice(product.price)}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Trending + recently viewed */}
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.08 }}
                >
                  <section className="mt-8">
                    <h2 className="mb-4 font-body text-sm font-bold text-navy-900">
                      {t('search.trending')}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearchKeys.map(key => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleTrendingClick(key)}
                          className="rounded-full border border-neutral-300 px-4 py-2 font-body text-xs text-navy-900 transition-colors hover:border-navy-900 hover:bg-cream-50"
                        >
                          {t(`search.trendingTerms.${key}`, {
                            defaultValue: trendingSearchTerms[key],
                          })}
                        </button>
                      ))}
                    </div>
                  </section>

                  {recentProducts.length > 0 && (
                    <section className="mt-10">
                      <h2 className="mb-4 font-body text-sm font-bold text-navy-900">
                        {t('search.recentlyViewed')}
                      </h2>
                      <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
                        {recentProducts.map(product => (
                          <Link
                            key={product.id}
                            to={`/product/${product.slug}`}
                            onClick={handleClose}
                            className="group flex-shrink-0"
                          >
                            <div className="h-20 w-20 overflow-hidden bg-cream-100 sm:h-24 sm:w-24">
                              <img
                                src={mediaUrl(product.images[0])}
                                alt={product.name}
                                className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                          </Link>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={handleClearRecent}
                        className="mt-3 font-body text-xs text-gray-500 underline-offset-2 hover:text-navy-900 hover:underline"
                      >
                        {t('search.clearRecent')}
                      </button>
                    </section>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
