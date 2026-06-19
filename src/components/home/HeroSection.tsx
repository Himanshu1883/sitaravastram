import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { heroSlides } from '../../data/products';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HeroSection() {
  const swiperRef = useRef(null);

  return (
    <section className="relative h-screen min-h-[600px] max-h-[920px] overflow-hidden">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        loop
        speed={900}
        className="hero-swiper h-full w-full"
      >
        {heroSlides.map(slide => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {/* Background */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-navy-700/85 via-navy-700/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 via-transparent to-transparent" />
              </div>

              {/* Decorative elements */}
              <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full border border-rosegold-400/10 float-slow hidden lg:block" />
              <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full border border-rosegold-400/15 float-slow hidden lg:block" style={{ animationDelay: '2s' }} />

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
                  <div className="max-w-xl">
                    {/* Badge */}
                    {slide.badge && (
                      <div className="inline-flex items-center gap-2 mb-5">
                        <div className="w-6 h-px bg-rosegold-400" />
                        <span className="font-inter text-xs font-semibold tracking-[0.3em] uppercase text-rosegold-300">
                          {slide.badge}
                        </span>
                      </div>
                    )}

                    {/* Subtitle */}
                    <p className="font-inter text-sm font-medium tracking-[0.2em] uppercase text-white/70 mb-3 animate-fade-in">
                      {slide.subtitle}
                    </p>

                    {/* Title */}
                    <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-5 animate-fade-up">
                      {slide.title}
                    </h1>

                    {/* Description */}
                    <p className="font-inter text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-md animate-fade-up">
                      {slide.description}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-4 animate-fade-up">
                      <Link
                        to={slide.ctaLink}
                        className="group inline-flex items-center gap-2 bg-rosegold-500 text-white font-inter font-semibold text-sm tracking-wider uppercase px-7 py-4 rounded-sm hover:bg-rosegold-600 transition-all duration-300 hover:shadow-rose-lg"
                      >
                        {slide.cta1}
                        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                      <Link
                        to={slide.ctaLink}
                        className="group inline-flex items-center gap-2 text-white font-inter font-medium text-sm tracking-wider border-b border-white/50 pb-0.5 hover:border-rosegold-400 hover:text-rosegold-300 transition-all duration-300"
                      >
                        {slide.cta2}
                        <ChevronRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-pulse-soft">
        <div className="w-px h-8 bg-white/40" />
        <span className="text-white/60 text-xs font-inter tracking-widest uppercase">Scroll</span>
      </div>
    </section>
  );
}
