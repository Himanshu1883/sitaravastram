import { Link } from 'react-router-dom';
import { BRAND_LOGO, BRAND_NAME } from '../../lib/brand';

const FULL_SIZES = {
  sm: 'h-10',
  md: 'h-12',
  lg: 'h-16',
  xl: 'h-20',
  '2xl': 'h-24',
  nav: 'h-[5.75rem]',
} as const;

const EMBLEM_SIZES = {
  xs: 'h-9 w-9',
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-20 w-20',
  '2xl': 'h-24 w-24',
} as const;

type LogoSize = keyof typeof FULL_SIZES | keyof typeof EMBLEM_SIZES;
type LogoVariant = 'full' | 'emblem';

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  className?: string;
  imageClassName?: string;
  to?: string;
}

export default function Logo({
  size = 'md',
  variant = 'full',
  className = '',
  imageClassName = '',
  to,
}: LogoProps) {
  const image =
    variant === 'emblem' ? (
      <span
        className={`brand-logo-emblem relative inline-flex items-center justify-center rounded-full overflow-hidden bg-navy-700 ${
          EMBLEM_SIZES[size as keyof typeof EMBLEM_SIZES] ?? EMBLEM_SIZES.md
        }`}
      >
        <img
          src={BRAND_LOGO}
          alt={BRAND_NAME}
          className={`absolute inset-0 h-full w-full object-cover object-[center_20%] scale-[2.7] ${imageClassName}`}
        />
      </span>
    ) : (
      <img
        src={BRAND_LOGO}
        alt={BRAND_NAME}
        className={`brand-logo w-auto object-contain ${
          FULL_SIZES[size as keyof typeof FULL_SIZES] ?? FULL_SIZES.md
        } ${imageClassName}`}
      />
    );

  if (to) {
    return (
      <Link to={to} className={`inline-flex items-center ${className}`} aria-label={BRAND_NAME}>
        {image}
      </Link>
    );
  }

  return <span className={`inline-flex items-center ${className}`}>{image}</span>;
}
