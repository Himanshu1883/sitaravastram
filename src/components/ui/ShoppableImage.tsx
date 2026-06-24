import { useCallback, useMemo, useState } from 'react';
import type { Product } from '../../types';
import CatalogImage from './CatalogImage';
import ProductHotspot, { type HotspotData } from './ProductHotspot';
import type { MediaVariant } from '../../lib/media';

type ShoppableImageProps = {
  src: string;
  alt: string;
  hotspots?: HotspotData[];
  productsBySlug: Record<string, Product>;
  className?: string;
  imageClassName?: string;
  aspectClassName?: string;
  fill?: boolean;
  imageVariant?: MediaVariant;
  priority?: boolean;
  children?: React.ReactNode;
};

export default function ShoppableImage({
  src,
  alt,
  hotspots = [],
  productsBySlug,
  className = '',
  imageClassName = '',
  aspectClassName = 'aspect-[4/5] lg:aspect-[5/6]',
  fill = false,
  imageVariant = 'detail',
  priority = false,
  children,
}: ShoppableImageProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const validHotspots = useMemo(
    () => hotspots.filter(h => productsBySlug[h.productSlug]),
    [hotspots, productsBySlug],
  );

  const handleToggle = useCallback((slug: string) => {
    setOpenSlug(prev => (prev === slug ? null : slug));
  }, []);

  const handleClose = useCallback(() => setOpenSlug(null), []);

  const image = (
    <CatalogImage
      src={src}
      alt={alt}
      variant={imageVariant}
      priority={priority}
      className={
        fill
          ? `w-full h-full object-cover object-center ${imageClassName}`
          : `w-full h-full object-cover object-top ${imageClassName}`
      }
    />
  );

  return (
    <div
      className={
        fill
          ? `absolute inset-0 z-0 overflow-hidden ${className}`
          : `relative overflow-hidden ${className}`
      }
    >
      {fill ? image : <div className={aspectClassName}>{image}</div>}

      {children}

      {validHotspots.map(hotspot => (
        <ProductHotspot
          key={`${hotspot.productSlug}-${hotspot.x}-${hotspot.y}`}
          hotspot={hotspot}
          product={productsBySlug[hotspot.productSlug]}
          isOpen={openSlug === hotspot.productSlug}
          onToggle={() => handleToggle(hotspot.productSlug)}
          onClose={handleClose}
        />
      ))}
    </div>
  );
}
