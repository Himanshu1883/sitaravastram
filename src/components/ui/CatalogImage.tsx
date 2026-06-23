import { mediaUrl } from '../../lib/api';

type CatalogImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string | undefined;
  priority?: boolean;
};

export default function CatalogImage({
  src,
  priority = false,
  alt = '',
  className,
  ...rest
}: CatalogImageProps) {
  const url = mediaUrl(src);
  if (!url) return null;

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      {...rest}
    />
  );
}
