import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import ProductCard from '../ui/ProductCard';
import SectionHeading from '../ui/SectionHeading';
import { products } from '../../data/products';

import 'swiper/css';
import 'swiper/css/pagination';

const newProducts = products.filter(p => p.isNew);
const displayProducts = newProducts.length >= 4 ? newProducts : [...newProducts, ...products.filter(p => !p.isNew)].slice(0, 4);

export default function NewArrivals() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <SectionHeading
            overline="Fresh This Week"
            title="New Arrivals"
            subtitle="Designs crafted for the modern Indian woman — contemporary silhouettes rooted in timeless craft."
          />
          <Link
            to="/collections/new-arrivals"
            className="group flex items-center gap-2 text-sm font-inter font-medium text-rosegold-500 hover:text-navy-700 transition-colors whitespace-nowrap mb-10 sm:mb-0"
          >
            View All New
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
            {products.slice(0, 6).map(product => (
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
