import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { reviews } from '../../data/products';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function CustomerReviews() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          overline="Women Who Wear Sitara"
          title="Their Words, Our Pride"
          subtitle="50,000+ women across India and the world trust Sitara Vastram to dress their most beautiful moments."
          center
        />

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 my-12 max-w-lg mx-auto border-y border-rosegold-100 py-8">
          {[
            { value: '50,000+', label: 'Happy Customers' },
            { value: '4.9 / 5', label: 'Average Rating' },
            { value: '98%', label: 'Would Recommend' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="font-playfair text-2xl lg:text-3xl font-bold text-navy-700">{stat.value}</p>
              <p className="font-inter text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          slidesPerView={1}
          spaceBetween={24}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="product-swiper pb-12"
        >
          {reviews.map(review => (
            <SwiperSlide key={review.id}>
              <div className="bg-cream-100 rounded-sm p-6 border border-rosegold-100 hover:border-rosegold-300 hover:shadow-luxury transition-all duration-300 h-full flex flex-col">
                {/* Quote icon */}
                <Quote size={28} className="text-rosegold-300 mb-4 flex-shrink-0" />

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      size={14}
                      className={s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-300'}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="font-inter text-sm text-gray-700 leading-relaxed flex-1 mb-5">
                  "{review.comment}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-rosegold-100">
                  <div className="w-10 h-10 rounded-full bg-rosegold-200 flex items-center justify-center flex-shrink-0">
                    <span className="font-playfair text-sm font-bold text-navy-700">
                      {review.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-inter text-sm font-semibold text-navy-700">{review.author}</p>
                    <div className="flex items-center gap-2">
                      <p className="font-inter text-xs text-gray-500">{review.location}</p>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-xs font-inter text-emerald-600">
                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[8px] font-bold">✓</span>
                          </span>
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
