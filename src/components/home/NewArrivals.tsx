import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import ProductCard from '../ui/ProductCard';
import SectionHeading from '../ui/SectionHeading';
import { useHomepage } from '../../hooks/useCatalog';

import 'swiper/css';
import 'swiper/css/pagination';

export default function NewArrivals({ embedded = false }: { embedded?: boolean }) {
  const { t } = useTranslation();
  const { data } = useHomepage();
  const displayProducts = data?.newArrivals?.slice(0, 4) ?? [];
  const copy = data?.sectionCopy?.newArrivals;
  return (
    <section
      className={
        embedded
          ? 'border-y border-navy-950/10 bg-[#faf8f5] py-16 sm:py-20 lg:py-24'
          : 'bg-white py-20'
      }
    >
      <div className="w-full px-2 sm:px-3 lg:px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <SectionHeading
            overline={copy?.overline || t('home.freshThisWeek')}
            title={copy?.title || t('home.newArrivals')}
            subtitle={copy?.subtitle || t('home.newArrivalsSubtitle')}
          />
          <Link
            to="/collections/new-arrivals"
            className="group flex items-center gap-2 text-sm font-body font-medium text-rosegold-500 hover:text-navy-700 transition-colors whitespace-nowrap mb-10 sm:mb-0"
          >
            {copy?.cta || t('home.viewAllNew')}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Desktop grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile swiper */}
        <div className="sm:hidden">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1.5}
            spaceBetween={16}
            pagination={{ clickable: true }}
            className="product-swiper pb-10"
          >
            {displayProducts.map(product => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
