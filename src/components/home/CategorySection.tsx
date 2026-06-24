import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useContentTranslation } from '../../hooks/useContentTranslation';
import { useCategories, useHomepage } from '../../hooks/useCatalog';
import CatalogImage from '../ui/CatalogImage';
import NewArrivals from './NewArrivals';
import type { Category } from '../../types';

const CATEGORY_EDITORIAL_VIDEO =
  '/assets/images/A_high-end_cinematic_fashion_editorial_202606241407.mp4';

function bySlug(slug: string, categories: Category[], fallback: Category): Category {
  return categories.find(c => c.slug === slug) ?? fallback;
}

function CollagePanel({
  category,
  hero = false,
  className = '',
  categoryName,
  tagLabel,
  stylesLabel,
  exploreLabel,
  shopNowLabel,
}: {
  category: Category;
  hero?: boolean;
  className?: string;
  categoryName: string;
  tagLabel?: string;
  stylesLabel: string;
  exploreLabel: string;
  shopNowLabel: string;
}) {
  return (
    <Link
      to={`/collections/${category.slug}`}
      className={`group relative block h-full min-h-0 overflow-hidden bg-navy-950 ${className}`}
    >
      <CatalogImage
        src={category.image}
        alt={categoryName}
        priority={hero}
        variant={hero ? 'detail' : 'card'}
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/30 to-navy-950/10 transition-opacity duration-500 group-hover:from-navy-950/90" />
      <div
        className={`absolute inset-0 flex flex-col p-5 sm:p-8 lg:p-10 ${
          hero ? 'items-center justify-center text-center' : 'justify-end'
        }`}
      >
        {tagLabel && (
          <span className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 sm:mb-3">
            {tagLabel}
          </span>
        )}
        <h3
          className={`font-heading font-medium leading-[1.05] tracking-tight text-white ${
            hero
              ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'
              : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl'
          }`}
        >
          {categoryName}
        </h3>
        {category.count != null && (
          <p className="mt-1.5 text-[11px] text-white/50 sm:text-xs">{stylesLabel}</p>
        )}
        {hero ? (
          <span className="mt-6 inline-flex items-center gap-2 border border-white/35 px-6 py-2.5 text-[11px] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-white/10">
            {exploreLabel} <ArrowRight size={13} />
          </span>
        ) : (
          <span className="mt-3 inline-flex translate-y-2 items-center gap-1.5 border-b border-rosegold-300/40 pb-0.5 text-[11px] uppercase tracking-[0.16em] text-rosegold-300 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {shopNowLabel} <ArrowRight size={12} />
          </span>
        )}
      </div>
    </Link>
  );
}

function Banner({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative h-svh w-full min-h-[480px] max-h-svh overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function ExploreFooter() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-[#faf8f5] px-6 py-14 text-center sm:flex-row sm:py-16">
      <p className="font-heading text-2xl font-medium text-navy-700 sm:text-3xl">
        {t('home.exploreEveryCategory')}
      </p>
      <Link
        to="/collections"
        className="group inline-flex items-center gap-2 border border-navy-700 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-navy-700 transition-colors duration-300 hover:bg-navy-700 hover:text-white"
      >
        {t('home.viewAllCollections')}
        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function CategoryVideoBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      void video.play().catch(() => {
        /* autoplay may be blocked until user gesture; muted usually works */
      });
    };

    play();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
      },
      { threshold: 0.15 },
    );
    observer.observe(video);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') play();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <Banner>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={CATEGORY_EDITORIAL_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Sitara Vastram fashion editorial"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-navy-950/15" />
    </Banner>
  );
}

function CategoryCollage() {
  const { t } = useTranslation();
  const { category: categoryLabel } = useContentTranslation();
  const { categories } = useCategories();
  const { data: homepage } = useHomepage();
  const h = homepage?.homepageCategories ?? categories.filter(c => c.featured).slice(0, 6);
  const fallback = h[0] ?? categories[0];
  if (!fallback) return null;

  const wedding = bySlug('wedding', categories, fallback);
  const premium = bySlug('premium-collection', categories, fallback);

  const panel = (cat: Category, tagKey?: string, hero = false, className = '') => (
    <CollagePanel
      category={cat}
      hero={hero}
      className={className}
      categoryName={categoryLabel(cat.slug, cat.name)}
      tagLabel={tagKey ? t(`collage.${tagKey}`) : undefined}
      stylesLabel={t('home.styles', { count: cat.count ?? 0 })}
      exploreLabel={t('home.exploreCollection')}
      shopNowLabel={t('home.shopNow')}
    />
  );

  return (
    <>
      <Banner>
        <div className="grid h-full w-full grid-cols-2 gap-1">
          {panel(h[0], 'bestseller')}
          {panel(h[1], 'partyEdit')}
        </div>
      </Banner>
      <Banner>
        <div className="grid h-full w-full grid-cols-1 gap-1 sm:grid-cols-3">
          {panel(h[2], 'prints')}
          {panel(h[3], 'festive')}
          {panel(h[4])}
        </div>
      </Banner>
      <Banner>
        <div className="grid h-full w-full grid-cols-1 gap-1 md:grid-cols-2">
          {panel(h[5], 'accessories', true)}
          <div className="grid min-h-0 grid-rows-2 gap-1">
            {panel(wedding, 'bridal')}
            {panel(premium, 'premium')}
          </div>
        </div>
      </Banner>
    </>
  );
}

/** Category collage split around New Arrivals for better scroll rhythm. */
export default function CategoryShowcase() {
  return (
    <>
      <section className="w-full overflow-hidden bg-navy-950">
        <CategoryCollage />
      </section>

      <NewArrivals embedded />

      <section className="w-full overflow-hidden bg-navy-950">
        <CategoryVideoBanner />
        <ExploreFooter />
      </section>
    </>
  );
}
