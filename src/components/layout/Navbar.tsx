import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, Phone } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const wishlistIds = useSelector(selectWishlistIds);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const navBg = scrolled || !isHome
    ? 'bg-white/95 backdrop-blur-md shadow-luxury border-b border-rosegold-200/40'
    : 'bg-transparent';

  const textColor = scrolled || !isHome ? 'text-navy-700' : 'text-white';
  const logoFilter = scrolled || !isHome ? '' : 'brightness-0 invert';

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-navy-700 text-white text-center py-2 px-4 text-xs font-inter tracking-widest">
        <span className="hidden sm:inline">USE CODE <strong>SITARA10</strong> FOR 10% OFF YOUR FIRST ORDER &nbsp;|&nbsp; FREE SHIPPING ABOVE ₹999 &nbsp;|&nbsp; COD AVAILABLE &nbsp;|&nbsp; 7-DAY RETURNS</span>
        <span className="sm:hidden">USE CODE <strong>SITARA10</strong> FOR 10% OFF · FREE SHIPPING ABOVE ₹999</span>
      </div>

      <nav className={`fixed top-8 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 rounded-sm transition-colors ${textColor} hover:text-rosegold-500`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <img
                src="/assets/images/sitaravastram_logo.webp"
                alt="Sitara Vastram"
                className={`h-12 w-auto transition-all duration-300 ${logoFilter}`}
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map(item => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center gap-1 font-inter text-sm font-medium tracking-wide transition-colors duration-200 hover:text-rosegold-500 ${textColor} ${item.label === 'Sale' ? 'text-red-400 font-semibold' : ''}`}
                  >
                    {item.label}
                    {item.children && <ChevronDown size={14} className="opacity-60" />}
                  </Link>

                  {/* Dropdown */}
                  {item.children && activeDropdown === item.label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white shadow-luxury-lg border border-rosegold-200/30 rounded-sm py-2 z-50">
                      {item.children.map(child => (
                        <Link
                          key={child.label}
                          to={child.href}
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

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <button
                className={`p-2.5 rounded-sm transition-colors hover:text-rosegold-500 ${textColor}`}
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <Search size={19} />
              </button>

              {/* Wishlist */}
              <Link
                to="/account/wishlist"
                className={`p-2.5 rounded-sm transition-colors hover:text-rosegold-500 relative ${textColor}`}
                aria-label="Wishlist"
              >
                <Heart size={19} />
                {wishlistIds.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rosegold-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {wishlistIds.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                className={`p-2.5 rounded-sm transition-colors hover:text-rosegold-500 relative ${textColor}`}
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

              {/* Account - desktop only */}
              <Link
                to="/account"
                className={`hidden sm:block px-4 py-2 text-sm font-inter font-medium tracking-wide rounded-sm border transition-all duration-200 ${scrolled || !isHome ? 'border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white' : 'border-white text-white hover:bg-white hover:text-navy-700'}`}
              >
                My Account
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="bg-white border-t border-rosegold-200/40 shadow-luxury">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="relative max-w-2xl mx-auto">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for suits, kurtas, silk, wedding..."
                  className="w-full pl-12 pr-10 py-3.5 border border-rosegold-200 rounded-sm font-inter text-sm text-navy-700 bg-cream-100 focus:outline-none focus:border-rosegold-500 focus:ring-2 focus:ring-rosegold-200 placeholder:text-gray-400 transition-all"
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
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {['Cotton Suits', 'Silk', 'Party Wear', 'Wedding', 'Festive'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1 text-xs font-inter font-medium text-navy-700 bg-cream-200 rounded-full hover:bg-rosegold-300 hover:text-white transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-luxury-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-rosegold-200/40">
              <img src="/assets/images/sitaravastram_logo.webp" alt="Sitara Vastram" className="h-10 w-auto" />
              <button onClick={() => setMobileOpen(false)} className="p-2 text-navy-700 hover:text-rosegold-500">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-4">
              {navItems.map(item => (
                <div key={item.label} className="mb-1">
                  <Link
                    to={item.href}
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
              <Link to="/account" className="btn-primary w-full text-center block mb-3">
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
