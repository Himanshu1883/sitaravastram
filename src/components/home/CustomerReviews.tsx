import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';
import type { Review } from '../../types';
import { useHomepage } from '../../hooks/useCatalog';
import { mediaUrl } from '../../lib/api';

import 'swiper/css';

function ReviewsNavButton({
  direction,
  disabled,
  onClick,
  className = '',
}: {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
  className?: string;
}) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={direction === 'prev' ? 'Previous review' : 'Next review'}
      disabled={disabled}
      onClick={onClick}
      className={`reviews-nav-btn ${className}`}
    >
      <Icon size={20} strokeWidth={2} />
    </button>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex h-full w-[min(78vw,17.5rem)] flex-col sm:w-[15rem] md:w-[16rem] lg:w-[15rem] xl:w-[16rem]">
      <div className="relative mb-4 h-[5.5rem] w-[5.5rem] sm:mb-5 sm:h-[6.75rem] sm:w-[6.75rem]">
        {review.avatar ? (
          <img
            src={mediaUrl(review.avatar)}
            alt={review.author}
            className="h-full w-full rounded-full bg-cream-200 object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-cream-300">
            <span className="font-heading text-xl font-semibold text-navy-700 sm:text-2xl">
              {review.author.charAt(0)}
            </span>
          </div>
        )}
        <div
          className="absolute -bottom-1 -left-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a1a] ring-[3px] ring-[#f5f5f5] sm:h-9 sm:w-9"
          aria-hidden
        >
          <Quote size={13} className="fill-white text-white sm:hidden" strokeWidth={0} />
          <Quote size={14} className="hidden fill-white text-white sm:block" strokeWidth={0} />
        </div>
      </div>

      <h3 className="font-heading text-base font-semibold text-navy-900 sm:text-lg">{review.author}</h3>
      <p className="mb-3 font-body text-xs text-gray-500 sm:mb-5 sm:text-sm">{review.location}</p>
      <p className="font-body text-sm leading-relaxed text-gray-700 sm:text-[0.9375rem]">
        {review.comment}
      </p>
    </article>
  );
}

export default function CustomerReviews() {
  const { t } = useTranslation();
  const { data } = useHomepage();
  const reviews = data?.reviews ?? [];
  const copy = data?.sectionCopy?.reviews;
  const swiperRef = useRef<SwiperType | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncNav = (swiper: SwiperType) => {
    setAtStart(swiper.isBeginning);
    setAtEnd(swiper.isEnd);
  };

  if (reviews.length === 0) return null;

  return (
    <section className="w-full overflow-hidden bg-[#f5f5f5] py-10 sm:py-14 lg:py-24">
      <div className="lg:flex lg:items-center lg:gap-8 xl:gap-12 2xl:gap-16">
        <header className="mb-6 shrink-0 px-4 sm:mb-8 sm:px-6 lg:mb-0 lg:max-w-[13rem] lg:pl-8 lg:pr-0 xl:max-w-none xl:pl-10 2xl:pl-14">
          <h2 className="text-center font-heading text-[1.625rem] font-semibold leading-[1.15] text-navy-900 sm:text-3xl lg:text-left lg:text-4xl xl:text-[2.5rem]">
            {copy?.heading1 || t('home.reviewsHeading1')}
            <br />
            {copy?.heading2 || t('home.reviewsHeading2')}
          </h2>
        </header>

        <div className="min-w-0 w-full flex-1">
          <div className="flex items-stretch gap-2 px-4 sm:gap-3 sm:px-6 lg:px-0 lg:pr-6 xl:pr-8 2xl:pr-10">
            <div className="hidden shrink-0 items-center md:flex">
              <ReviewsNavButton
                direction="prev"
                disabled={atStart}
                onClick={() => swiperRef.current?.slidePrev()}
              />
            </div>

            <div className="min-w-0 flex-1 overflow-hidden">
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
                spaceBetween={16}
                breakpoints={{
                  480: { spaceBetween: 20 },
                  640: { spaceBetween: 28 },
                  1024: { spaceBetween: 40 },
                  1280: { spaceBetween: 48 },
                }}
                className="reviews-swiper"
              >
                {reviews.map(review => (
                  <SwiperSlide key={review.id} className="!h-auto">
                    <ReviewCard review={review} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="hidden shrink-0 items-center md:flex">
              <ReviewsNavButton
                direction="next"
                disabled={atEnd}
                onClick={() => swiperRef.current?.slideNext()}
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-4 px-4 sm:mt-6 sm:px-6 md:hidden">
            <ReviewsNavButton
              direction="prev"
              disabled={atStart}
              onClick={() => swiperRef.current?.slidePrev()}
            />
            <ReviewsNavButton
              direction="next"
              disabled={atEnd}
              onClick={() => swiperRef.current?.slideNext()}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
