import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, Globe, Phone } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectCartCount, toggleCart } from '../../store/cartSlice';
import { selectWishlistIds } from '../../store/wishlistSlice';

const navItems = [
  {
    label: 'Collections',
    href: '/collections',
    children: [
      { label: 'New Arrivals', href: '/collections/new-arrivals' },
      { label: 'Best Sellers', href: '/collections/best-sellers' },
      { label: 'Featured', href: '/collections/featured' },
    ],
  },
  {
    label: 'Shop',
    href: '/shop',
    children: [
      { label: 'Cotton Suits', href: '/collections/cotton-suits' },
      { label: 'Party Wear', href: '/collections/party-wear' },
      { label: 'Designer Suits', href: '/collections/designer-suits' },
      { label: 'Kurta Sets', href: '/collections/kurta-sets' },
      { label: 'Dupattas', href: '/collections/dupattas' },
      { label: 'Silk Collection', href: '/collections/silk' },
    ],
  },
  {
    label: 'Occasions',
    href: '/occasions',
    children: [
      { label: 'Casual Wear', href: '/collections/casual' },
      { label: 'Office Wear', href: '/collections/office' },
      { label: 'Party Wear', href: '/collections/party' },
      { label: 'Festive', href: '/collections/festive' },
      { label: 'Wedding', href: '/collections/wedding' },
    ],
  },
  { label: 'Sale', href: '/sale' },
];

function NavLinks({
  className = '',
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <div className={className}>
      {navItems.map(item => (
        <div
          key={item.label}
          className="relative"
          onMouseEnter={() => item.children && setActiveDropdown(item.label)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <Link
            to={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-1 font-inter text-sm font-medium tracking-wide text-navy-700 transition-colors duration-200 hover:text-rosegold-500 ${item.label === 'Sale' ? 'text-red-500 font-semibold' : ''}`}
          >
            {item.label}
            {item.children && <ChevronDown size={14} className="opacity-60" />}
          </Link>

          {item.children && activeDropdown === item.label && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-luxury-lg border border-rosegold-200/30 rounded-sm py-2 z-50">
              {item.children.map(child => (
                <Link
                  key={child.label}
                  to={child.href}
                  onClick={onNavigate}
                  className="block px-4 py-2.5 text-sm font-inter text-navy-700 hover:bg-cream-100 hover:text-rosegold-500 transition-colors duration-150"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const wishlistIds = useSelector(selectWishlistIds);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('sitara_lang', next);
  };

  return (
    <>
      {/* Announcement — scrolls away */}
      <div className="bg-navy-700 text-white text-center py-2 px-4 text-xs font-inter tracking-widest">
        <span className="hidden sm:inline">
          USE CODE <strong>SITARA10</strong> FOR 10% OFF YOUR FIRST ORDER &nbsp;|&nbsp; FREE SHIPPING ABOVE ₹999 &nbsp;|&nbsp; COD AVAILABLE &nbsp;|&nbsp; 7-DAY RETURNS
        </span>
        <span className="sm:hidden">USE CODE <strong>SITARA10</strong> FOR 10% OFF · FREE SHIPPING ABOVE ₹999</span>
      </div>

      {/* Sticky navbar */}
      <nav
        className={`sticky top-0 z-50 bg-white border-b transition-all duration-300 ${
          scrolled ? 'border-rosegold-200/60 shadow-luxury' : 'border-rosegold-100/80'
        }`}
      >
        <div className="section-container">
          {/* Desktop: 3-column — nav left | logo center | actions right */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] items-center h-20 gap-4">
            <NavLinks className="flex items-center gap-7 justify-start" />

            <Link to="/" className="flex items-center gap-3 justify-center group">
              <img
                src="/assets/images/sitaravastram_logo.webp"
                alt="Sitara Vastram"
                className="h-11 w-11 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-playfair text-2xl font-semibold text-navy-700 tracking-wide whitespace-nowrap">
                SitaraVastram
              </span>
            </Link>

            <div className="flex items-center gap-1 justify-end">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-xs font-inter font-medium border border-rosegold-200 text-navy-700 hover:border-rosegold-500 transition-colors"
                title={t('common.language')}
              >
                <Globe size={14} />
                {i18n.language === 'en' ? 'हिं' : 'EN'}
              </button>
              <button
                className="p-2.5 rounded-sm text-navy-700 hover:text-rosegold-500 transition-colors"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
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
              <Link
                to="/account"
                className="ml-1 px-4 py-2 text-sm font-inter font-medium tracking-wide rounded-sm border border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white transition-all duration-200"
              >
                My Account
              </Link>
            </div>
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden items-center justify-between h-16 gap-3">
            <button
              className="p-2 text-navy-700 hover:text-rosegold-500 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link to="/" className="flex items-center gap-2 min-w-0">
              <img
                src="/assets/images/sitaravastram_logo.webp"
                alt="Sitara Vastram"
                className="h-9 w-9 object-contain flex-shrink-0"
              />
              <span className="font-playfair text-lg font-semibold text-navy-700 truncate">
                SitaraVastram
              </span>
            </Link>

            <div className="flex items-center gap-0.5">
              <button
                className="p-2 text-navy-700 hover:text-rosegold-500"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
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
        </div>

        {searchOpen && (
          <div className="border-t border-rosegold-200/40 bg-white">
            <div className="section-container py-4">
              <div className="relative max-w-2xl mx-auto">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for suits, kurtas, silk, wedding..."
                  className="w-full pl-12 pr-10 py-3.5 border border-rosegold-200 rounded-sm font-inter text-sm text-navy-700 bg-cream-100 focus:outline-none focus:border-rosegold-500 focus:ring-2 focus:ring-rosegold-200 placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-luxury-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-rosegold-200/40">
              <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <img src="/assets/images/sitaravastram_logo.webp" alt="Sitara Vastram" className="h-9 w-9" />
                <span className="font-playfair text-lg font-semibold text-navy-700">SitaraVastram</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-navy-700 hover:text-rosegold-500">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-4">
              {navItems.map(item => (
                <div key={item.label} className="mb-1">
                  <Link
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-sm text-sm font-inter font-medium text-navy-700 hover:bg-cream-100 hover:text-rosegold-500 transition-colors ${item.label === 'Sale' ? 'text-red-500' : ''}`}
                  >
                    {item.label}
                    {item.children && <ChevronDown size={14} />}
                  </Link>
                  {item.children && (
                    <div className="ml-4 border-l-2 border-rosegold-200/50 pl-4 mt-1 mb-2">
                      {item.children.map(child => (
                        <Link
                          key={child.label}
                          to={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 text-xs font-inter text-gray-600 hover:text-rosegold-500 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="px-6 pb-8 pt-4 border-t border-rosegold-200/40">
              <Link to="/account" className="btn-primary w-full text-center block mb-3" onClick={() => setMobileOpen(false)}>
                My Account
              </Link>
              <a href="tel:+919876543210" className="flex items-center gap-2 text-sm font-inter text-navy-700 justify-center hover:text-rosegold-500 transition-colors">
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
