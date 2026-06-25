import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export function useAutoplayVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      void video.play().catch(() => undefined);
    };

    play();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
      },
      { threshold: 0.15 },
    );
    observer.observe(video);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') play();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return videoRef;
}

type VideoEditorialOverlayProps = {
  title: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
  compact?: boolean;
};

export function VideoEditorialOverlay({
  title,
  subtitle,
  ctaHref,
  ctaLabel,
  compact = false,
}: VideoEditorialOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-5 text-center text-white sm:px-8 md:px-12">
      <div
        className={`flex max-w-4xl flex-col items-center ${
          compact ? 'gap-3 sm:gap-4' : 'gap-4 sm:gap-5 md:gap-6'
        }`}
      >
        <h2
          className={`font-body font-bold leading-[1.05] tracking-[-0.02em] text-white ${
            compact
              ? 'text-[1.75rem] sm:text-4xl md:text-5xl'
              : 'text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-7xl'
          }`}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className={`max-w-xl font-body font-normal leading-relaxed text-white/90 ${
              compact ? 'text-sm sm:text-base' : 'text-sm sm:text-base md:text-lg'
            }`}
          >
            {subtitle}
          </p>
        )}

        {ctaHref && ctaLabel && (
          <Link
            to={ctaHref}
            className={`btn-primary pointer-events-auto inline-flex min-h-[44px] items-center justify-center ${
              compact ? 'mt-1 sm:mt-2' : 'mt-1 sm:mt-2'
            }`}
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

type VideoEditorialBannerProps = {
  src: string;
  ariaLabel: string;
  layout?: 'fullscreen' | 'inline';
  title: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
};

export default function VideoEditorialBanner({
  src,
  ariaLabel,
  layout = 'fullscreen',
  title,
  subtitle,
  ctaHref,
  ctaLabel,
  className = '',
}: VideoEditorialBannerProps) {
  const videoRef = useAutoplayVideo();

  const video = (
    <video
      ref={videoRef}
      className={
        layout === 'fullscreen'
          ? 'absolute inset-0 h-full w-full object-cover'
          : 'block h-auto w-full'
      }
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label={ariaLabel}
    />
  );

  const gradient = (
    <div className="pointer-events-none absolute inset-0 bg-black/30" />
  );

  const overlay = (
    <VideoEditorialOverlay
      title={title}
      subtitle={subtitle}
      ctaHref={ctaHref}
      ctaLabel={ctaLabel}
      compact={layout === 'inline'}
    />
  );

  if (layout === 'inline') {
    return (
      <div className={`relative w-full overflow-hidden ${className}`}>
        {video}
        {gradient}
        {overlay}
      </div>
    );
  }

  return (
    <div
      className={`relative h-svh w-full min-h-[480px] max-h-svh overflow-hidden ${className}`}
    >
      {video}
      {gradient}
      {overlay}
    </div>
  );
}
