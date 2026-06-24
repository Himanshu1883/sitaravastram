import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Gift,
  Gem,
  LayoutGrid,
  Star,
  Sun,
  Wine,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { useContentTranslation } from '../../hooks/useContentTranslation';
import { useHomepage } from '../../hooks/useCatalog';
import { mediaUrl } from '../../lib/api';

import 'swiper/css';

const OCCASION_ORDER = ['festive', 'office', 'party', 'wedding', 'casual'] as const;

const OCCASION_ICONS: Record<string, LucideIcon> = {
  festive: Gift,
  office: Briefcase,
  party: Wine,
  wedding: Gem,
  casual: Sun,
};

function OccasionNavButton({
  direction,
  disabled,
  onClick,
  className = '',
}: {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
  className?: string;
}) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={direction === 'prev' ? 'Previous occasions' : 'Next occasions'}
      disabled={disabled}
      onClick={onClick}
      className={`occasion-nav-btn ${className}`}
    >
      <Icon size={18} strokeWidth={2} />
    </button>
  );
}

function OccasionCard({
  slug,
  name,
  description,
  image,
  showPopular,
  shopNowLabel,
  popularLabel,
}: {
  slug: string;
  name: string;
  description: string;
  image: string;
  showPopular: boolean;
  shopNowLabel: string;
  popularLabel: string;
}) {
  const Icon = OCCASION_ICONS[slug] ?? Sun;

  return (
    <Link
      to={`/collections/${slug}`}
      className="group relative block h-full overflow-hidden rounded-3xl bg-navy-900 shadow-[0_8px_30px_rgba(27,42,74,0.12)]"
    >
      <div className="relative aspect-[3/4] w-full">
        <img
          src={mediaUrl(image)}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/35 to-navy-950/5" />

        {showPopular && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-navy-700 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
            <Star size={10} className="fill-rosegold-400 text-rosegold-400" />
            {popularLabel}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm">
            <Icon size={16} strokeWidth={1.75} />
          </span>
          <h3 className="font-heading text-xl font-semibold leading-tight text-white sm:text-2xl">
            {name}
          </h3>
          <p className="mt-1 font-body text-xs text-white/70 sm:text-sm">{description}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-rosegold-300 transition-colors group-hover:text-rosegold-200">
            {shopNowLabel}
            <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ShopByOccasion() {
  const { t } = useTranslation();
  const { occasion } = useContentTranslation();
  const { data } = useHomepage();
  const copy = data?.sectionCopy?.occasion;
  const swiperRef = useRef<SwiperType | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const occasions = useMemo(() => {
    const list = data?.occasions ?? [];
    const orderIndex = (slug: string) => {
      const idx = OCCASION_ORDER.indexOf(slug as (typeof OCCASION_ORDER)[number]);
      return idx === -1 ? 99 : idx;
    };
    return [...list].sort((a, b) => orderIndex(a.slug) - orderIndex(b.slug));
  }, [data?.occasions]);

  const syncNav = (swiper: SwiperType) => {
    setAtStart(swiper.isBeginning);
    setAtEnd(swiper.isEnd);
  };

  const displayName = (slug: string, name: string) => {
    if (slug === 'casual') {
      return t('home.everydayOccasion', { defaultValue: 'Everyday' });
    }
    return occasion(name);
  };

  return (
    <section className="w-full overflow-hidden bg-cream-100 py-16 lg:py-20">
      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="relative mx-auto mb-10 max-w-3xl text-center lg:mb-12">
          <OccasionNavButton
            direction="prev"
            disabled={atStart}
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 hidden -translate-y-1/2 lg:flex"
          />
          <OccasionNavButton
            direction="next"
            disabled={atEnd}
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 lg:flex"
          />

          <p className="mb-3 font-body text-[11px] font-semibold uppercase tracking-[0.28em] text-rosegold-500">
            {copy?.overline || t('home.findPerfectOutfit', { defaultValue: 'Find the Perfect Outfit' })}
          </p>
          <h2 className="font-heading text-3xl font-semibold leading-tight text-navy-700 sm:text-4xl lg:text-[2.75rem]">
            {copy?.title || t('home.shopByOccasion')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-sm leading-relaxed text-gray-600 sm:text-base">
            {copy?.subtitle || t('home.shopByOccasionSubtitleAlt', {
              defaultValue:
                'Discover outfits designed for every special moment in your life. Celebrate in style with Sitara.',
            })}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <OccasionNavButton
            direction="prev"
            disabled={atStart}
            onClick={() => swiperRef.current?.slidePrev()}
            className="shrink-0 lg:hidden"
          />

          <div className="min-w-0 flex-1">
            <Swiper
              onSwiper={swiper => {
                swiperRef.current = swiper;
                syncNav(swiper);
              }}
              onSlideChange={syncNav}
              onReachBeginning={() => setAtStart(true)}
              onReachEnd={() => setAtEnd(true)}
              onFromEdge={syncNav}
              slidesPerView={1.12}
              spaceBetween={14}
              breakpoints={{
                480: { slidesPerView: 2.15, spaceBetween: 16 },
                768: { slidesPerView: 3.1, spaceBetween: 18 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
                1280: { slidesPerView: 5, spaceBetween: 22 },
              }}
              className="occasion-swiper !overflow-visible"
            >
              {occasions.map(occ => (
                <SwiperSlide key={occ.slug} className="!h-auto">
                  <OccasionCard
                    slug={occ.slug}
                    name={displayName(occ.slug, occ.name)}
                    description={t(`occasionDesc.${occ.slug}`, { defaultValue: occ.description })}
                    image={occ.image}
                    showPopular={occ.slug === 'festive'}
                    shopNowLabel={t('home.shopNow')}
                    popularLabel={t('home.popular', { defaultValue: 'Popular' })}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <OccasionNavButton
            direction="next"
            disabled={atEnd}
            onClick={() => swiperRef.current?.slideNext()}
            className="shrink-0 lg:hidden"
          />
        </div>

        <div className="mt-10 flex justify-center lg:mt-12">
          <Link
            to="/collections"
            className="group inline-flex items-center gap-3 rounded-full border border-gray-300 bg-cream-50 px-6 py-3.5 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-700 transition-all duration-300 hover:border-navy-700 hover:bg-white"
          >
            <LayoutGrid size={15} className="text-rosegold-500" />
            {t('home.viewAllCollections')}
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
