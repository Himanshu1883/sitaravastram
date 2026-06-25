import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import AnimatedProductCard from '../ui/AnimatedProductCard';
import SectionHeading from '../ui/SectionHeading';
import { useHomepage } from '../../hooks/useCatalog';

import 'swiper/css';
import 'swiper/css/navigation';

export default function BestSellers() {
  const { t } = useTranslation();
  const { data } = useHomepage();
  const displayProducts = data?.bestSellers ?? [];
  const copy = data?.sectionCopy?.bestSellers;

  return (
    <section className="bg-cream-100 py-20">
      <div className="w-full px-2 sm:px-3 lg:px-4">
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            overline={copy?.overline || t('home.mostLoved')}
            title={copy?.title || t('home.bestSellers')}
            subtitle={copy?.subtitle || t('home.bestSellersSubtitle')}
          />
          <Link
            to="/collections/best-sellers"
            className="btn-link group mb-10 whitespace-nowrap sm:mb-0"
          >
            {copy?.cta || t('home.allBestsellers')}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView={1.15}
          spaceBetween={14}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 18 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
          }}
          className="product-swiper"
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
    </section>
  );
}
