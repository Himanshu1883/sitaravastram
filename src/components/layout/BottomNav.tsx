import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartCount, toggleCart } from '../../store/cartSlice';
import { selectWishlistIds } from '../../store/wishlistSlice';
import { openAuthModal, selectIsLoggedIn, selectIsAdmin } from '../../store/authSlice';

export default function BottomNav() {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const wishlistIds = useSelector(selectWishlistIds);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAdminUser = useSelector(selectIsAdmin);
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-rosegold-200/40 sm:hidden shadow-lg">
      <div className="flex items-center justify-around py-2">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${isActive('/') ? 'text-rosegold-500' : 'text-gray-500 hover:text-navy-700'}`}
        >
          <Home size={20} />
          <span className="text-[10px] font-body">{t('bottomNav.home')}</span>
        </Link>

        <Link
          to="/collections"
          className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${location.pathname.includes('/collections') ? 'text-rosegold-500' : 'text-gray-500 hover:text-navy-700'}`}
        >
          <Search size={20} />
          <span className="text-[10px] font-body">{t('bottomNav.shop')}</span>
        </Link>

        <button
          onClick={() => dispatch(toggleCart())}
          className="flex flex-col items-center gap-1 px-4 py-1 text-gray-500 hover:text-navy-700 transition-colors relative"
        >
          <ShoppingBag size={20} />
          <span className="text-[10px] font-body">{t('bottomNav.cart')}</span>
          {cartCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-rosegold-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>

        <Link
          to="/account/wishlist"
          className={`flex flex-col items-center gap-1 px-4 py-1 relative transition-colors ${location.pathname.includes('/wishlist') ? 'text-rosegold-500' : 'text-gray-500 hover:text-navy-700'}`}
        >
          <Heart size={20} />
          <span className="text-[10px] font-body">{t('bottomNav.wishlist')}</span>
          {wishlistIds.length > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-rosegold-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              {wishlistIds.length}
            </span>
          )}
        </Link>

        {isLoggedIn ? (
          <Link
            to={isAdminUser ? '/admin/dashboard' : '/account'}
            className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${(isAdminUser ? location.pathname.startsWith('/admin') : location.pathname.includes('/account')) ? 'text-rosegold-500' : 'text-gray-500 hover:text-navy-700'}`}
          >
            <User size={20} />
            <span className="text-[10px] font-body">{t('bottomNav.account')}</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => dispatch(openAuthModal('/account'))}
            className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${location.pathname.includes('/account') ? 'text-rosegold-500' : 'text-gray-500 hover:text-navy-700'}`}
          >
            <User size={20} />
            <span className="text-[10px] font-body">{t('bottomNav.account')}</span>
          </button>
        )}
      </div>
    </nav>
  );
}
