import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useMemo, useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHomepage } from '../../hooks/useCatalog';
import { useGetProductsQuery } from '../../store/catalogApi';
import type { FeaturedCollectionItem } from '../../lib/api';
import type { Product } from '../../types';
import ShoppableImage from '../ui/ShoppableImage';

function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, ...options },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

function FeaturedSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 sm:px-6 lg:px-8">
      {[1, 2, 3].map(id => (
        <div
          key={id}
          className="grid animate-pulse grid-cols-1 items-center gap-8 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 lg:grid-cols-12 lg:gap-10"
        >
          <div className="aspect-[3/4] max-h-[340px] rounded-xl bg-[#e8e2d9] lg:col-span-5" />
          <div className="space-y-4 lg:col-span-7">
            <div className="h-2.5 w-20 rounded bg-[#e8e2d9]" />
            <div className="h-10 max-w-xs rounded bg-[#e8e2d9]" />
            <div className="h-16 w-full rounded bg-[#e8e2d9]" />
            <div className="h-9 w-32 rounded bg-[#e8e2d9]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatBadge({ stat, inView }: { stat: string; inView: boolean }) {
  return (
    <span
      className={`inline-flex items-center bg-rosegold-500 px-3 py-1.5 font-body text-[10px] font-semibold uppercase tracking-widest text-white transition-all duration-700 delay-500 ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      {stat}
    </span>
  );
}

interface FeatureBlockProps {
  feature: FeaturedCollectionItem;
  index: number;
  productsBySlug: Record<string, Product>;
}

function FeatureBlock({ feature, index, productsBySlug }: FeatureBlockProps) {
  const { t } = useTranslation();
  const { ref, inView } = useInView();
  const isEven = index % 2 === 0;
  const featureId = String(feature.id);

  const tag = t(`featured.${featureId}.tag`);
  const stat = t(`featured.${featureId}.stat`);

  return (
    <article
      ref={ref}
      className={`mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 ${index > 0 ? 'mt-12 sm:mt-16' : ''}`}
    >
      <div className="grid grid-cols-1 items-center gap-8 rounded-2xl border border-rosegold-100/70 bg-white p-5 shadow-[0_10px_36px_rgba(27,42,74,0.05)] sm:gap-10 sm:p-7 lg:grid-cols-12 lg:p-8">
        <div
          className={`relative lg:col-span-5 ${!isEven ? 'lg:order-2' : ''}`}
        >
          <div className="group relative mx-auto w-full max-w-[280px] overflow-hidden rounded-xl sm:max-w-[320px] lg:mx-0 lg:max-w-none">
            <div className="relative aspect-[3/4] max-h-[300px] w-full overflow-hidden sm:max-h-[340px] lg:max-h-[380px]">
              <div
                className={`h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03] ${
                  inView ? 'scale-100' : 'scale-105'
                }`}
              >
                <ShoppableImage
                  src={feature.image}
                  alt={feature.imageAlt}
                  hotspots={feature.hotspots}
                  productsBySlug={productsBySlug}
                  fill
                  className="h-full w-full"
                  imageClassName="object-cover object-top"
                />
              </div>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/35 via-transparent to-transparent" />

              <div
                className={`absolute left-4 top-4 z-20 transition-all duration-700 delay-200 ${
                  inView ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                }`}
              >
                <span className="inline-block bg-white/95 px-3 py-1.5 font-body text-[9px] font-bold uppercase tracking-[0.18em] text-navy-700 shadow-sm backdrop-blur-sm">
                  {tag}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 z-20">
                <StatBadge stat={stat} inView={inView} />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`relative flex flex-col justify-center lg:col-span-7 lg:py-2 ${
            !isEven ? 'lg:order-1' : ''
          }`}
        >
          <span
            className={`pointer-events-none absolute right-0 top-0 select-none font-heading text-5xl font-bold leading-none text-gray-50 sm:text-6xl ${
              inView ? 'opacity-100' : 'opacity-0'
            } transition-all duration-1000`}
            aria-hidden
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          <p
            className={`mb-3 font-body text-[10px] font-bold uppercase tracking-[0.32em] text-rosegold-500 transition-all duration-700 delay-100 ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            {feature.overline || t(`featured.${featureId}.eyebrow`)}
          </p>

          <h3
            className={`mb-4 max-w-lg font-heading text-2xl font-semibold leading-[1.2] tracking-[-0.02em] text-navy-700 sm:text-3xl lg:text-[2rem] ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            } transition-all duration-700 delay-200`}
          >
            {(feature.title || t(`featured.${featureId}.title`)).replace(/\\n/g, '\n').split('\n').map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h3>

          <div
            className={`mb-5 flex items-center gap-2.5 transition-all duration-700 delay-300 ${
              inView ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'
            }`}
          >
            <div className="h-px w-8 bg-rosegold-400" />
            <div className="h-1.5 w-1.5 rotate-45 bg-rosegold-500" />
          </div>

          <p
            className={`mb-8 max-w-md font-body text-sm leading-[1.8] text-gray-500 sm:text-[15px] ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            } transition-all duration-700 delay-[350ms]`}
          >
            {feature.description || t(`featured.${featureId}.description`)}
          </p>

          <div
            className={`transition-all duration-700 delay-500 ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            <Link to={feature.href} className="group inline-flex items-center gap-0 self-start">
              <span className="relative py-1 pr-4 font-body text-[11px] font-bold uppercase tracking-[0.22em] text-navy-700">
                {feature.cta || t(`featured.${featureId}.cta`)}
                <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-100 bg-navy-700 transition-transform duration-300 group-hover:scale-x-0" />
                <span className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-rosegold-500 transition-transform duration-300 group-hover:scale-x-100" />
              </span>
              <span className="flex h-8 w-8 items-center justify-center border border-navy-700 transition-all duration-300 group-hover:border-rosegold-500 group-hover:bg-rosegold-500">
                <ArrowUpRight
                  size={14}
                  className="text-navy-700 transition-colors duration-300 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-white"
                />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function SectionHeader({
  overline,
  title,
  subtitle,
}: {
  overline?: string;
  title?: string;
  subtitle?: string;
}) {
  const { ref, inView } = useInView();
  const { t } = useTranslation();

  return (
    <div ref={ref} className="mb-12 px-4 text-center sm:mb-16">
      <p
        className={`mb-3 font-body text-[10px] font-bold uppercase tracking-[0.35em] text-rosegold-500 transition-all duration-700 ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
      >
        {overline || t('home.storiesOfCraft')}
      </p>
      <h2
        className={`font-heading text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-navy-700 sm:text-4xl lg:text-[2.75rem] ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        } transition-all duration-700 delay-150`}
      >
        {title || t('home.featuredCollections')}
      </h2>
      <p
        className={`mx-auto mt-4 max-w-lg font-body text-sm leading-[1.75] text-gray-500 sm:text-[15px] ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        } transition-all duration-700 delay-300`}
      >
        {subtitle || t('home.featuredCollectionsSubtitle')}
      </p>

      <div
        className={`mt-6 flex items-center justify-center gap-3 transition-all duration-700 delay-500 ${
          inView ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-rosegold-300" />
        <div className="h-1.5 w-1.5 rotate-45 bg-rosegold-500" />
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-rosegold-300" />
      </div>
    </div>
  );
}

export default function FeaturedCollection() {
  const { data, loading } = useHomepage();
  const { data: products = [] } = useGetProductsQuery();
  const features = data?.featuredCollections ?? [];
  const sectionCopy = data?.sectionCopy?.featured;

  const productsBySlug = useMemo(
    () => Object.fromEntries(products.map(p => [p.slug, p])),
    [products],
  );

  return (
    <section className="overflow-hidden bg-cream-100 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline={sectionCopy?.overline}
          title={sectionCopy?.title}
          subtitle={sectionCopy?.subtitle}
        />
      </div>

      {loading ? (
        <FeaturedSkeleton />
      ) : features.length === 0 ? null : (
        <div className="pb-2">
          {features.map((feature, index) => (
            <FeatureBlock
              key={feature.id}
              feature={feature}
              index={index}
              productsBySlug={productsBySlug}
            />
          ))}
        </div>
      )}
    </section>
  );
}
