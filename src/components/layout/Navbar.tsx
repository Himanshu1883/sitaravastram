import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, Globe, Phone } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectCartCount, toggleCart } from '../../store/cartSlice';
import { selectWishlistIds } from '../../store/wishlistSlice';
import type { NavItem } from '../../data/nav';
import { useTranslatedNav } from '../../hooks/useTranslatedNav';
import MegaMenu from './MegaMenu';
import Logo from '../ui/Logo';
import CurrencySelector from '../ui/CurrencySelector';
import SearchOverlay from './SearchOverlay';
import { openAuthModal, selectAuth } from '../../store/authSlice';

function DesktopNavLinks({
  items,
  activeMega,
  setActiveMega,
}: {
  items: NavItem[];
  activeMega: string | null;
  setActiveMega: (label: string | null) => void;
}) {
  return (
    <div className="flex items-center gap-10 xl:gap-14 2xl:gap-16">
      {items.map(item => (
        <div
          key={item.label}
          className="relative"
          onMouseEnter={() => item.columns.length > 0 && setActiveMega(item.href)}
        >
          <Link
            to={item.href}
            className={`flex items-center gap-1.5 type-nav font-bold transition-colors duration-200 hover:text-rosegold-500 ${
              activeMega === item.href ? 'text-rosegold-500' : item.href === '/sale' ? 'text-red-500' : 'text-navy-700'
            }`}
          >
            {item.label}
            {item.columns.length > 0 && <ChevronDown size={14} className={`opacity-60 transition-transform ${activeMega === item.href ? 'rotate-180' : ''}`} />}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function Navbar({ showCategoryStrip = false }: { showCategoryStrip?: boolean }) {
  const { t, i18n } = useTranslation();
  const navItems = useTranslatedNav();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const wishlistIds = useSelector(selectWishlistIds);
  const { isLoggedIn } = useSelector(selectAuth);

  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate('/account');
    } else {
      dispatch(openAuthModal('/account'));
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle('no-category-strip', !showCategoryStrip);
    return () => document.documentElement.classList.remove('no-category-strip');
  }, [showCategoryStrip]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setActiveMega(null);
  }, [location]);

  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('sitara_lang', next);
  };

  const activeItem = navItems.find(item => item.href === activeMega);

  return (
    <>
      {/* Announcement — scrolls away */}
      <div className="bg-navy-700 text-white text-center py-2 px-4 type-body-xs tracking-[0.12em]">
        <span className="hidden sm:inline" dangerouslySetInnerHTML={{ __html: t('nav.announcementDesktop') }} />
        <span className="sm:hidden" dangerouslySetInnerHTML={{ __html: t('nav.announcementMobile') }} />
      </div>

      {/* Sticky header: navbar + category strip + megamenu */}
      <header
        ref={headerRef}
        className={`site-header sticky top-0 z-40 bg-white transition-shadow duration-300 ${
          scrolled || activeMega || searchOpen ? 'shadow-luxury' : ''
        }`}
        onMouseLeave={() => setActiveMega(null)}
      >
        <nav
          className={`relative border-b transition-colors duration-300 ${
            scrolled || activeMega ? 'border-rosegold-200/60' : 'border-rosegold-100/80'
          }`}
        >
          {/* Desktop — full width, equal columns around centered logo */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] items-center h-24 w-full px-4 sm:px-6 lg:px-8 xl:px-10">
            <div className="flex items-center justify-start min-w-0 pr-6 xl:pr-10">
              <DesktopNavLinks items={navItems} activeMega={activeMega} setActiveMega={setActiveMega} />
            </div>

            <Logo
              to="/"
              size="nav"
              className="justify-self-center z-10 transition-transform duration-300 hover:scale-[1.03]"
            />

            <div className="flex items-center justify-end gap-4 xl:gap-6 2xl:gap-8 min-w-0 pl-6 xl:pl-10">
              <CurrencySelector variant="desktop" />
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-xs font-body font-bold text-navy-700 hover:border-rosegold-500 transition-colors"
                title={t('common.language')}
              >
                <Globe size={14} />
                {i18n.language === 'en' ? t('common.hiShort') : t('common.enShort')}
              </button>
              <button
                className="p-2.5 rounded-sm text-navy-700 hover:text-rosegold-500 transition-colors"
                onClick={() => setSearchOpen(true)}
                aria-label={t('nav.search')}
              >
                <Search size={19} />
              </button>
              <Link
                to="/account/wishlist"
                className="p-2.5 rounded-sm text-navy-700 hover:text-rosegold-500 relative transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={19} />
                {wishlistIds.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rosegold-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {wishlistIds.length}
                  </span>
                )}
              </Link>
              <button
                className="p-2.5 rounded-sm text-navy-700 hover:text-rosegold-500 relative transition-colors"
                onClick={() => dispatch(toggleCart())}
                aria-label="Cart"
              >
                <ShoppingBag size={19} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rosegold-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={handleAccountClick}
                className="px-4 py-2 text-sm font-body font-bold tracking-wide rounded-sm border border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white transition-all duration-200"
              >
                {t('nav.myAccount')}
              </button>
            </div>
          </div>

          {/* Mobile */}
          <div className="relative flex lg:hidden items-center justify-between h-[4.25rem] gap-3 w-full px-4 sm:px-6">
              <button
                className="p-2 text-navy-700 hover:text-rosegold-500 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <Logo
                to="/"
                size="lg"
                className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
              />

              <div className="flex items-center gap-0.5">
                <CurrencySelector variant="compact" />
                <button
                  className="p-2 text-navy-700 hover:text-rosegold-500"
                  onClick={() => setSearchOpen(true)}
                  aria-label={t('nav.search')}
                >
                  <Search size={18} />
                </button>
                <button
                  className="p-2 text-navy-700 hover:text-rosegold-500 relative"
                  onClick={() => dispatch(toggleCart())}
                  aria-label="Cart"
                >
                  <ShoppingBag size={18} />
                  {cartCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-rosegold-500 text-white text-[10px] rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

          {activeItem && (
            <MegaMenu item={activeItem} onNavigate={() => setActiveMega(null)} />
          )}
        </nav>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} anchorRef={headerRef} />

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[min(100vw-3rem,22rem)] bg-white shadow-luxury-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-rosegold-200/40">
              <span className="type-heading-sm text-navy-700">{t('nav.menu')}</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-navy-700 hover:text-rosegold-500">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-3 px-3">
              {navItems.map(item => (
                <div key={item.label} className="mb-3">
                  <Link
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-sm text-sm font-body font-semibold ${
                      item.href === '/sale' ? 'text-red-500' : 'text-navy-700'
                    } hover:bg-cream-100`}
                  >
                    {item.label}
                  </Link>
                  {item.columns.map(column => (
                    <div key={column.heading} className="px-3 mt-2 mb-3">
                      <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gray-500 mb-2">
                        {column.heading}
                      </p>
                      {column.links.map(link => (
                        <Link
                          key={link.href + link.label}
                          to={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-1.5 text-sm text-navy-700 hover:text-rosegold-500"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="px-5 pb-6 pt-3 border-t border-rosegold-200/40 space-y-2">
              <div className="flex gap-2">
                <CurrencySelector variant="menu" className="flex-1 min-w-0" />
                <button
                  onClick={toggleLanguage}
                  className="flex-1 py-2 text-xs font-body font-medium border border-rosegold-200 rounded-sm text-navy-700"
                >
                  {i18n.language === 'en' ? t('common.hindi') : t('common.english')}
                </button>
              </div>
              <button
                type="button"
                className="btn-primary w-full text-center block"
                onClick={() => {
                  setMobileOpen(false);
                  handleAccountClick();
                }}
              >
                {t('nav.myAccount')}
              </button>
              <a href="tel:+919876543210" className="flex items-center gap-2 text-sm font-body text-navy-700 justify-center hover:text-rosegold-500 transition-colors">
                <Phone size={16} />
                +91 98765 43210
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
