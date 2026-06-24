import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Product } from '../../types';
import { useFormatPrice } from '../../hooks/useFormatPrice';

export interface HotspotData {
  productSlug: string;
  x: number;
  y: number;
}

type ProductHotspotProps = {
  hotspot: HotspotData;
  product: Product | undefined;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export default function ProductHotspot({
  hotspot,
  product,
  isOpen,
  onToggle,
  onClose,
}: ProductHotspotProps) {
  const { t } = useTranslation();
  const formatPrice = useFormatPrice();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (cardRef.current?.contains(e.target as Node)) return;
      onClose();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen, onClose]);

  return (
    <div
      className="absolute z-20"
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: 'translate(-50%, -50%)' }}
    >
      <button
        type="button"
        aria-label={product ? product.name : t('home.shopTheLook.hotspot')}
        aria-expanded={isOpen}
        onClick={e => {
          e.stopPropagation();
          onToggle();
        }}
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/95 shadow-md transition-all duration-200 hover:scale-105 hover:bg-white ${
          isOpen ? 'ring-2 ring-rosegold-400/60' : ''
        }`}
      >
        <Plus size={16} strokeWidth={1.5} className="text-navy-700" />
      </button>

      {isOpen && product && (
        <div
          ref={cardRef}
          className="absolute left-1/2 top-full z-20 mt-2 w-[min(240px,calc(100vw-2rem))] -translate-x-1/2 border border-gray-200 bg-white shadow-luxury-lg"
        >
          <div className="px-4 py-3">
            <p className="font-body text-sm font-medium text-navy-700 leading-snug">{product.name}</p>
            <p className="font-body text-sm text-gray-600 mt-1">{formatPrice(product.price)}</p>
          </div>
          <div className="h-px bg-gray-200" />
          <Link
            to={`/product/${product.slug}`}
            className="flex items-center justify-between gap-2 px-4 py-3 font-body text-[11px] font-semibold tracking-[0.2em] uppercase text-navy-700 hover:text-rosegold-500 transition-colors"
            onClick={onClose}
          >
            {t('home.shopTheLook.viewProduct')}
            <ChevronRight size={14} strokeWidth={2} />
          </Link>
        </div>
      )}
    </div>
  );
}
