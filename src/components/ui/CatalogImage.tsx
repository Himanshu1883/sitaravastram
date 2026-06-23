import { mediaUrl, type MediaVariant } from '../../lib/media';

type CatalogImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string | undefined;
  priority?: boolean;
  variant?: MediaVariant;
};

export default function CatalogImage({
  src,
  priority = false,
  variant = 'card',
  alt = '',
  className,
  loading: loadingProp,
  ...rest
}: CatalogImageProps) {
  const url = mediaUrl(src, priority && variant === 'card' ? 'detail' : variant);
  if (!url) return null;

  const loading = loadingProp ?? (priority ? 'eager' : 'lazy');

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      {...rest}
    />
  );
}
