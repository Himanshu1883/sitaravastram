import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from '../ui/ProductCard';
import SectionHeading from '../ui/SectionHeading';
import { products } from '../../data/products';

import 'swiper/css';
import 'swiper/css/navigation';

const bestsellers = products.filter(p => p.isBestSeller);
const displayProducts = bestsellers.length > 0 ? bestsellers : products;

export default function BestSellers() {
  return (
    <section className="py-20 bg-cream-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <SectionHeading
            overline="Most Loved"
            title="Best Sellers"
            subtitle="The pieces our women come back for again and again — worn at home, at work, and everywhere in between."
          />
          <Link
            to="/collections/best-sellers"
            className="group flex items-center gap-2 text-sm font-inter font-medium text-rosegold-500 hover:text-navy-700 transition-colors whitespace-nowrap mb-10 sm:mb-0"
          >
            All Bestsellers
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
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
