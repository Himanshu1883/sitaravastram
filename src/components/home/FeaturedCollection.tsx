import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useHomepage } from '../../hooks/useCatalog';
import CatalogImage from '../ui/CatalogImage';

function FeaturedSkeleton() {
  return (
    <div className="space-y-24 animate-pulse">
      {[1, 2, 3].map(id => (
        <div key={id} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="aspect-[4/5] lg:aspect-[5/6] bg-cream-200 rounded-sm" />
          <div className="space-y-4 lg:px-6">
            <div className="h-3 w-24 bg-cream-200 rounded" />
            <div className="h-10 w-full max-w-md bg-cream-200 rounded" />
            <div className="h-24 w-full bg-cream-200 rounded" />
            <div className="h-10 w-32 bg-cream-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FeaturedCollection() {
  const { t } = useTranslation();
  const { data, loading } = useHomepage();
  const features = data?.featuredCollections ?? [];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-cream-100">
      <div className="section-container">
        <div className="text-center mb-10 sm:mb-16 px-2">
          <p className="font-body text-xs tracking-[0.25em] uppercase font-semibold text-rosegold-500 mb-3">
            {t('home.storiesOfCraft')}
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-navy-700">
            {t('home.featuredCollections')}
          </h2>
          <p className="font-body text-sm sm:text-base text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
            {t('home.featuredCollectionsSubtitle')}
          </p>
          <div className="flex items-center gap-3 mt-5 justify-center">
            <div className="h-px w-12 bg-rosegold-500" />
            <div className="w-2 h-2 rotate-45 bg-rosegold-500" />
            <div className="h-px w-12 bg-rosegold-500" />
          </div>
        </div>

        {loading || features.length === 0 ? (
          <FeaturedSkeleton />
        ) : (
          <div className="space-y-16 sm:space-y-20 lg:space-y-24">
            {features.map(feature => (
              <div
                key={feature.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center ${feature.reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}
              >
                <div className="relative group overflow-hidden rounded-sm shadow-luxury-lg">
                  <div className="aspect-[4/5] lg:aspect-[5/6]">
                    <CatalogImage
                      src={feature.image}
                      alt={feature.imageAlt}
                      className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/30 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                    <span className="inline-block bg-white/90 backdrop-blur-sm text-navy-700 text-[10px] sm:text-xs font-body font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm tracking-widest uppercase shadow-card">
                      {t(`featured.${feature.id}.tag`)}
                    </span>
                  </div>
                  <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6">
                    <span className="inline-block bg-rosegold-500/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-body font-medium px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-sm">
                      {t(`featured.${feature.id}.stat`)}
                    </span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-rosegold-500/20" />
                </div>

                <div className="flex flex-col justify-center px-1 sm:px-0 lg:px-6">
                  <p className="font-body text-xs tracking-[0.3em] uppercase font-semibold text-rosegold-500 mb-3 sm:mb-4">
                    {t(`featured.${feature.id}.eyebrow`)}
                  </p>
                  <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-navy-700 leading-tight mb-4 sm:mb-6 whitespace-pre-line">
                    {t(`featured.${feature.id}.title`)}
                  </h3>
                  <div className="flex items-center gap-4 mb-4 sm:mb-6">
                    <div className="h-px w-8 bg-rosegold-500" />
                    <div className="w-1.5 h-1.5 rotate-45 bg-rosegold-500" />
                  </div>
                  <p className="font-body text-sm sm:text-base text-gray-600 leading-relaxed mb-6 sm:mb-8">
                    {t(`featured.${feature.id}.description`)}
                  </p>
                  <Link
                    to={feature.href}
                    className="group inline-flex items-center gap-3 self-start"
                  >
                    <span className="font-body text-sm font-semibold text-navy-700 tracking-widest uppercase group-hover:text-rosegold-500 transition-colors">
                      {t(`featured.${feature.id}.cta`)}
                    </span>
                    <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-navy-700 flex items-center justify-center group-hover:bg-rosegold-500 group-hover:border-rosegold-500 transition-all duration-300">
                      <ArrowRight size={16} className="text-navy-700 group-hover:text-white transition-colors" />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
