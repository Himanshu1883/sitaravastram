import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../../store/wishlistSlice';
import type { Product } from '../../types';
import type { RootState } from '../../store';
import { useFormatPrice } from '../../hooks/useFormatPrice';
import CatalogImage from './CatalogImage';
import ShopBagPlusIcon from './ShopBagPlusIcon';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  const dispatch = useDispatch();
  const isWishlisted = useSelector((state: RootState) => selectIsWishlisted(product.id)(state));
  const formatPrice = useFormatPrice();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart({
      product,
      size: product.sizes[2] || product.sizes[0],
      color: product.colors[0],
      quantity: 1,
    }));
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleWishlist(product.id));
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className={`group block luxury-card overflow-hidden ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-cream-200">
        <CatalogImage
          src={product.images[hovered && product.images.length > 1 ? 1 : 0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/45 via-navy-900/5 to-transparent transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          className={`absolute inset-x-0 bottom-4 flex justify-center px-3 transition-all duration-300 ${
            hovered ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
          }`}
        >
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-900 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-colors duration-300 hover:bg-navy-900 hover:text-white"
            aria-label={t('product.addToBag')}
          >
            <ShopBagPlusIcon />
            <span>{t('product.addToBag')}</span>
          </button>
        </div>

        <Link
          to={`/product/${product.slug}`}
          onClick={e => e.stopPropagation()}
          className={`absolute right-3 top-12 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-navy-700 shadow-card transition-all duration-300 hover:bg-navy-900 hover:text-white ${
            hovered ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
          }`}
          aria-label="Quick view"
        >
          <Eye size={14} />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-card ${isWishlisted ? 'bg-rosegold-500 text-white' : 'bg-white text-gray-500 hover:text-rosegold-500'}`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={14} className={isWishlisted ? 'fill-white' : ''} />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.discount && <span className="badge-sale">-{product.discount}%</span>}
          {product.isNew && !product.discount && <span className="badge-new">New</span>}
          {product.isBestSeller && <span className="badge-bestseller">Bestseller</span>}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="type-overline text-rosegold-500 mb-1">{product.fabric}</p>
        <h3 className="type-body-sm font-medium text-navy-700 line-clamp-2 mb-2 group-hover:text-rosegold-500 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(s => (
              <Star
                key={s}
                size={11}
                className={s <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-300'}
              />
            ))}
          </div>
          <span className="type-caption">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="type-price text-navy-700">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="type-body-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Color swatches */}
        {product.colors.length > 1 && (
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors.slice(0, 4).map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0"
                style={{ backgroundColor: getColorHex(color) }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-400">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

function getColorHex(colorName: string): string {
  const map: Record<string, string> = {
    'Sage Green': '#8fae88',
    'Dusty Rose': '#d4a5a5',
    'Ivory': '#f5f0e8',
    'Royal Blue': '#2c4a8c',
    'Emerald': '#2e8b57',
    'Wine': '#722f37',
    'Powder Blue': '#b0c4de',
    'Mint': '#98d8c8',
    'Peach': '#ffcba4',
    'Midnight Navy': '#1b2a4a',
    'Deep Burgundy': '#800020',
    'Champagne': '#f7e7ce',
    'Natural': '#f5ebe0',
    'Indigo': '#4b0082',
    'Terracotta': '#c27c4a',
    'Crimson Red': '#dc143c',
    'Bridal Pink': '#e8b4c0',
    'Ivory Gold': '#f5f0d8',
    'Coral': '#ff6b6b',
    'Teal': '#008080',
    'Mustard': '#ffdb58',
    'Mauve': '#c8a2c8',
    'Sky Blue': '#87ceeb',
    'Olive': '#808000',
  };
  return map[colorName] || '#c9956a';
}
