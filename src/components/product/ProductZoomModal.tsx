import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import CatalogImage from '../ui/CatalogImage';
import { preloadImageUrl } from '../../lib/preloadImages';
import { mediaUrl } from '../../lib/media';

type ProductZoomModalProps = {
  images: string[];
  index: number;
  alt: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

export default function ProductZoomModal({
  images,
  index,
  alt,
  onIndexChange,
  onClose,
}: ProductZoomModalProps) {
  const touchStartX = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [animating, setAnimating] = useState(false);

  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) onIndexChange(index - 1);
  }, [hasPrev, index, onIndexChange]);

  const goNext = useCallback(() => {
    if (hasNext) onIndexChange(index + 1);
  }, [hasNext, index, onIndexChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, goPrev, goNext]);

  useEffect(() => {
    const current = images[index];
    const prev = images[index - 1];
    const next = images[index + 1];
    if (current) preloadImageUrl(mediaUrl(current, 'zoom'));
    if (prev) preloadImageUrl(mediaUrl(prev, 'zoom'));
    if (next) preloadImageUrl(mediaUrl(next, 'zoom'));
  }, [images, index]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setAnimating(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    setDragOffset(e.touches[0].clientX - touchStartX.current);
  };

  const onTouchEnd = () => {
    if (touchStartX.current == null) return;
    const threshold = 60;
    if (dragOffset > threshold) goPrev();
    else if (dragOffset < -threshold) goNext();
    touchStartX.current = null;
    setAnimating(true);
    setDragOffset(0);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label="Product image zoom"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <p className="font-body text-sm text-white/80">
          {index + 1} / {images.length}
        </p>
        <button
          type="button"
          className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
          onClick={onClose}
          aria-label="Close zoom"
        >
          <X size={24} />
        </button>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-2"
        onClick={e => e.stopPropagation()}
      >
        {hasPrev && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:left-4"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        <div
          className="flex h-full w-full max-w-5xl items-center justify-center touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className={`flex h-full w-full items-center justify-center ${animating ? 'transition-transform duration-200 ease-out' : ''}`}
            style={{ transform: dragOffset ? `translateX(${dragOffset}px)` : undefined }}
          >
            <CatalogImage
              key={images[index]}
              src={images[index]}
              alt={`${alt} — view ${index + 1}`}
              variant="zoom"
              priority
              className="max-h-[calc(100vh-10rem)] max-w-full select-none object-contain"
              draggable={false}
            />
          </div>
        </div>

        {hasNext && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:right-4"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div
          className="flex justify-center gap-2 overflow-x-auto px-4 pb-5 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onClick={e => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => onIndexChange(i)}
              className={`h-16 w-12 flex-shrink-0 overflow-hidden rounded-sm border-2 transition-all ${
                i === index ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <CatalogImage src={img} alt="" variant="thumb" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
