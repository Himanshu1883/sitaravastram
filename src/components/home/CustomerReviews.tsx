import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';
import type { Review } from '../../types';
import { useHomepage } from '../../hooks/useCatalog';
import { mediaUrl } from '../../lib/api';

import 'swiper/css';

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="w-[220px] sm:w-[240px] flex flex-col">
      <div className="relative w-[108px] h-[108px] sm:w-[116px] sm:h-[116px] mb-5">
        {review.avatar ? (
          <img
            src={mediaUrl(review.avatar)}
            alt={review.author}
            className="w-full h-full rounded-full object-cover object-top bg-cream-200"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-cream-300 flex items-center justify-center">
            <span className="type-heading-md text-navy-700">{review.author.charAt(0)}</span>
          </div>
        )}
        <div
          className="absolute -bottom-1 -left-1 w-9 h-9 bg-[#1a1a1a] rounded-full flex items-center justify-center ring-[3px] ring-[#f5f5f5]"
          aria-hidden
        >
          <Quote size={14} className="text-white fill-white" strokeWidth={0} />
        </div>
      </div>

      <h3 className="type-heading-sm text-navy-900 mb-1">{review.author}</h3>
      <p className="type-body-xs text-gray-500 mb-5">{review.location}</p>
      <p className="type-body-sm text-gray-700 leading-relaxed">{review.comment}</p>
    </article>
  );
}

export default function CustomerReviews() {
  const { t } = useTranslation();
  const { data } = useHomepage();
  const reviews = data?.reviews ?? [];
  const swiperRef = useRef<SwiperType | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncNav = (swiper: SwiperType) => {
    setAtStart(swiper.isBeginning);
    setAtEnd(swiper.isEnd);
  };

  return (
    <section className="py-16 lg:py-24 bg-[#f5f5f5]">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(240px,320px)_1fr] gap-10 lg:gap-14 xl:gap-20 items-start lg:items-center">
          {/* Heading — own column, never overlaps carousel */}
          <div className="relative z-10">
            <h2 className="type-heading-xl text-navy-900 leading-[1.15]">
              {t('home.reviewsHeading1')}
              <br />
              {t('home.reviewsHeading2')}
            </h2>
          </div>

          {/* Carousel + nav — separate column */}
          <div className="min-w-0 w-full">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                aria-label="Previous review"
                disabled={atStart}
                onClick={() => swiperRef.current?.slidePrev()}
                className="reviews-nav-btn shrink-0 hidden md:flex"
              >
                <ChevronLeft size={20} strokeWidth={2} />
              </button>

              <div className="flex-1 min-w-0 overflow-hidden">
                <Swiper
                  onSwiper={swiper => {
                    swiperRef.current = swiper;
                    syncNav(swiper);
                  }}
                  onSlideChange={syncNav}
                  onReachBeginning={() => setAtStart(true)}
                  onReachEnd={() => setAtEnd(true)}
                  onFromEdge={syncNav}
                  slidesPerView="auto"
                  spaceBetween={28}
                  breakpoints={{
                    640: { spaceBetween: 36 },
                    1024: { spaceBetween: 48 },
                  }}
                  className="reviews-swiper"
                >
                  {reviews.map(review => (
                    <SwiperSlide key={review.id}>
                      <ReviewCard review={review} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <button
                type="button"
                aria-label="Next review"
                disabled={atEnd}
                onClick={() => swiperRef.current?.slideNext()}
                className="reviews-nav-btn shrink-0 hidden md:flex"
              >
                <ChevronRight size={20} strokeWidth={2} />
              </button>
            </div>

            <div className="flex justify-between mt-6 md:hidden">
              <button
                type="button"
                aria-label="Previous review"
                disabled={atStart}
                onClick={() => swiperRef.current?.slidePrev()}
                className="reviews-nav-btn"
              >
                <ChevronLeft size={20} strokeWidth={2} />
              </button>
              <button
                type="button"
                aria-label="Next review"
                disabled={atEnd}
                onClick={() => swiperRef.current?.slideNext()}
                className="reviews-nav-btn"
              >
                <ChevronRight size={20} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
