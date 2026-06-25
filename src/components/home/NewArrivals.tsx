import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import AnimatedProductCard from '../ui/AnimatedProductCard';
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
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            overline={copy?.overline || t('home.freshThisWeek')}
            title={copy?.title || t('home.newArrivals')}
            subtitle={copy?.subtitle || t('home.newArrivalsSubtitle')}
          />
          <Link
            to="/collections/new-arrivals"
            className="btn-link group mb-10 whitespace-nowrap sm:mb-0"
          >
            {copy?.cta || t('home.viewAllNew')}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {displayProducts.map((product, index) => (
            <AnimatedProductCard
              key={product.id}
              product={product}
              index={index}
              hideColors
              compact
            />
          ))}
        </div>

        <div className="sm:hidden">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1.65}
            spaceBetween={14}
            pagination={{ clickable: true }}
            className="product-swiper pb-10"
          >
            {displayProducts.map((product, index) => (
              <SwiperSlide key={product.id}>
                <AnimatedProductCard
                  product={product}
                  index={index}
                  hideColors
                  compact
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
