import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../../store/wishlistSlice';
import type { Product } from '../../types';
import type { RootState } from '../../store';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const dispatch = useDispatch();
  const isWishlisted = useSelector((state: RootState) => selectIsWishlisted(product.id)(state));

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
        <img
          src={product.images[hovered && product.images.length > 1 ? 1 : 0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Overlay Actions */}
        <div className={`absolute inset-0 bg-navy-700/20 flex items-center justify-center gap-3 transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-navy-700 hover:bg-navy-700 hover:text-white transition-all duration-200 shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform"
            aria-label="Add to cart"
          >
            <ShoppingBag size={16} />
          </button>
          <Link
            to={`/product/${product.slug}`}
            onClick={e => e.stopPropagation()}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-navy-700 hover:bg-navy-700 hover:text-white transition-all duration-200 shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform delay-75"
            aria-label="Quick view"
          >
            <Eye size={16} />
          </Link>
        </div>

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
        <p className="text-xs font-inter text-rosegold-500 uppercase tracking-widest mb-1">{product.fabric}</p>
        <h3 className="font-inter text-sm font-medium text-navy-700 leading-snug line-clamp-2 mb-2 group-hover:text-rosegold-500 transition-colors">
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
          <span className="text-xs font-inter text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-playfair text-base font-semibold text-navy-700">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="text-xs font-inter text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
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
