import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Product } from '../../types';
import ProductCard from '../ui/ProductCard';
import AccountEmptyState from './AccountEmptyState';

export default function AccountWishlist({ products }: { products: Product[] }) {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="mb-6 font-heading text-2xl font-semibold text-navy-700">
        {t('account.wishlistTitle', { count: products.length })}
      </h2>

      {products.length === 0 ? (
        <AccountEmptyState
          icon={<Heart size={28} />}
          title={t('account.emptyWishlist')}
          description={t('account.emptyWishlistSubtitle')}
          action={
            <Link to="/collections" className="btn-primary">
              {t('account.exploreCollections')}
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
