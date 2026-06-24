import { useRef, useState, useCallback, useEffect, type ReactNode } from 'react';
import { mediaUrl } from '../../lib/media';

const LENS_SIZE = 130;
const ZOOM_SCALE = 2.6;

export type MagnifierPreviewState = {
  active: boolean;
  zoomUrl: string;
  bgX: number;
  bgY: number;
  bgSize: number;
};

export const INACTIVE_MAGNIFIER: MagnifierPreviewState = {
  active: false,
  zoomUrl: '',
  bgX: 50,
  bgY: 50,
  bgSize: 250,
};

type ProductImageMagnifierProps = {
  src: string;
  alt: string;
  className?: string;
  overlays?: ReactNode;
  onImageClick?: () => void;
  onMagnifyChange?: (state: MagnifierPreviewState) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ProductMagnifierPreviewPane({
  state,
  className = '',
}: {
  state: MagnifierPreviewState;
  className?: string;
}) {
  if (!state.active || !state.zoomUrl) return null;

  return (
    <div
      className={`overflow-hidden rounded-sm border border-neutral-200 bg-cream-50 ${className}`}
      aria-live="polite"
    >
      <div
        className="aspect-[3/4] w-full"
        style={{
          backgroundImage: `url(${state.zoomUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${state.bgSize}%`,
          backgroundPosition: `${state.bgX}% ${state.bgY}%`,
        }}
      />
    </div>
  );
}

export default function ProductImageMagnifier({
  src,
  alt,
  className = '',
  overlays,
  onImageClick,
  onMagnifyChange,
}: ProductImageMagnifierProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState({ x: 0, y: 0, visible: false });

  const detailUrl = mediaUrl(src, 'detail');
  const zoomUrl = mediaUrl(src, 'zoom');

  const measure = useCallback(() => {
    containerRef.current?.getBoundingClientRect();
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure, src]);

  useEffect(() => {
    setLens(prev => ({ ...prev, visible: false }));
    onMagnifyChange?.(INACTIVE_MAGNIFIER);
  }, [src, onMagnifyChange]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const maxX = Math.max(0, rect.width - LENS_SIZE);
    const maxY = Math.max(0, rect.height - LENS_SIZE);
    const lensX = clamp(x - LENS_SIZE / 2, 0, maxX);
    const lensY = clamp(y - LENS_SIZE / 2, 0, maxY);

    const bgSize = (rect.width / LENS_SIZE) * 100 * (ZOOM_SCALE / 2.2);
    const bgX = maxX > 0 ? (lensX / maxX) * 100 : 50;
    const bgY = maxY > 0 ? (lensY / maxY) * 100 : 50;

    setLens({ x: lensX, y: lensY, visible: true });
    onMagnifyChange?.({
      active: true,
      zoomUrl,
      bgX,
      bgY,
      bgSize,
    });
  };

  const onLeave = () => {
    setLens(prev => ({ ...prev, visible: false }));
    onMagnifyChange?.(INACTIVE_MAGNIFIER);
  };

  return (
    <div
      ref={containerRef}
      className={`relative aspect-[3/4] w-full cursor-crosshair overflow-hidden rounded-sm bg-cream-100 ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onImageClick}
    >
      <img
        src={detailUrl}
        alt={alt}
        className="pointer-events-none h-full w-full select-none object-contain object-top"
        draggable={false}
      />

      {lens.visible && (
        <div
          className="pointer-events-none absolute border-2 border-white/90 bg-white/20 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
          style={{
            left: lens.x,
            top: lens.y,
            width: LENS_SIZE,
            height: LENS_SIZE,
          }}
          aria-hidden
        />
      )}

      {overlays}
    </div>
  );
}
