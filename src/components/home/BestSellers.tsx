import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from '../ui/ProductCard';
import SectionHeading from '../ui/SectionHeading';
import { useHomepage } from '../../hooks/useCatalog';

import 'swiper/css';
import 'swiper/css/navigation';

export default function BestSellers() {
  const { t } = useTranslation();
  const { data } = useHomepage();
  const displayProducts = data?.bestSellers ?? [];

  return (
    <section className="py-20 bg-cream-100">
      <div className="w-full px-2 sm:px-3 lg:px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <SectionHeading
            overline={t('home.mostLoved')}
            title={t('home.bestSellers')}
            subtitle={t('home.bestSellersSubtitle')}
          />
          <Link
            to="/collections/best-sellers"
            className="group flex items-center gap-2 text-sm font-body font-medium text-rosegold-500 hover:text-navy-700 transition-colors whitespace-nowrap mb-10 sm:mb-0"
          >
            {t('home.allBestsellers')}            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="product-swiper"
        >
          {displayProducts.map(product => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
