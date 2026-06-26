import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  Truck,
  RefreshCw,
  Shield,
  ChevronDown,
  Star,
  ZoomIn,
  Play,
  Share2,
  Home,
  ArrowRight,
  Ruler,
  Zap,
  CreditCard,
  Award,
  MapPin,
  Plus,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, toggleCart } from '../store/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../store/wishlistSlice';
import { saveReview, addRecentlyViewed } from '../lib/storage';
import { fetchReviews, submitReview } from '../lib/api';
import { mediaUrl } from '../lib/media';
import { useProduct, useProducts, useCategories } from '../hooks/useCatalog';
import ProductCard from '../components/ui/ProductCard';
import ProductCustomFieldValue from '../components/product/ProductCustomFieldValue';
import CatalogImage from '../components/ui/CatalogImage';
import { preloadProductDetail, preloadProductGallery } from '../lib/preloadImages';
import type { RootState } from '../store';
import type { Product, Review } from '../types';
import { useFormatPrice } from '../hooks/useFormatPrice';
import ShopBagPlusIcon from '../components/ui/ShopBagPlusIcon';
import ProductImageMagnifier, {
  ProductMagnifierPreviewPane,
  INACTIVE_MAGNIFIER,
  type MagnifierPreviewState,
} from '../components/product/ProductImageMagnifier';
import ProductZoomModal from '../components/product/ProductZoomModal';

function getCartVariants(
  product: Product,
  selectedSize: string,
  selectedColor: string,
): { size: string; color: string; sizeMissing: boolean } {
  const size = product.showSizeSelector
    ? selectedSize
    : (product.sizes[0] ?? 'Free Size');
  const color = product.showColorSelector
    ? selectedColor
    : (product.colors[0] ?? 'Default');
  return {
    size,
    color,
    sizeMissing: product.showSizeSelector === true && !selectedSize,
  };
}

function PdpAccordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-neutral-200 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-body text-xs font-bold uppercase tracking-[0.15em] text-navy-800">
          {title}
        </span>
        {open ? (
          <ChevronDown size={18} className="rotate-180 text-navy-700 transition-transform" />
        ) : (
          <Plus size={18} className="text-navy-700" />
        )}
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-5 font-body text-sm leading-relaxed text-gray-600">{children}</div>
        </div>
      </div>
    </div>
  );
}

function GalleryOverlays({
  product,
  isWishlisted,
  onToggleWishlist,
  onShare,
  onZoom,
  showClickZoom,
}: {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onShare: () => void;
  onZoom: () => void;
  showClickZoom?: boolean;
}) {
  return (
    <>
      {product.discount != null && product.discount > 0 && (
        <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-sm bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
          {product.discount}% OFF
        </div>
      )}

      <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors ${
            isWishlisted ? 'text-rosegold-500' : 'text-navy-700'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
        </button>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onShare();
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-navy-700 shadow-sm"
          aria-label="Share"
        >
          <Share2 size={16} />
        </button>
      </div>

      {showClickZoom && (
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onZoom();
          }}
          className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-sm bg-white/90 px-3 py-1.5 text-xs font-semibold text-navy-700 shadow-sm"
        >
          <ZoomIn size={14} />
          Click to Zoom
        </button>
      )}
    </>
  );
}

function ProductGallery({
  product,
  selectedImage,
  onSelectImage,
  onZoom,
  onMagnifyChange,
  isWishlisted,
  onToggleWishlist,
}: {
  product: Product;
  selectedImage: number;
  onSelectImage: (i: number) => void;
  onZoom: () => void;
  onMagnifyChange?: (state: MagnifierPreviewState) => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    preloadProductGallery(product.images);
  }, [product.id, product.images]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.name, url }).catch(() => undefined);
    } else {
      await navigator.clipboard.writeText(url).catch(() => undefined);
    }
  };

  const imageRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const el = imageRefs.current[selectedImage];
    if (el && window.matchMedia('(min-width: 1024px)').matches) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedImage]);

  const overlays = (
    <GalleryOverlays
      product={product}
      isWishlisted={isWishlisted}
      onToggleWishlist={onToggleWishlist}
      onShare={() => void handleShare()}
      onZoom={onZoom}
      showClickZoom
    />
  );

  const thumbnails = (
    <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:max-h-[calc(100svh-6rem)] lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:[scrollbar-width:thin] lg:[&::-webkit-scrollbar]:w-1 lg:[&::-webkit-scrollbar-thumb]:rounded-full lg:[&::-webkit-scrollbar-thumb]:bg-neutral-300">
      {product.images.map((img, i) => (
        <button
          key={i}
          type="button"
          onClick={() => {
            onSelectImage(i);
            setShowVideo(false);
          }}
          className={`h-16 w-14 lg:h-[72px] lg:w-[56px] flex-shrink-0 overflow-hidden rounded-sm border-2 transition-all ${
            selectedImage === i && !showVideo ? 'border-navy-700' : 'border-transparent'
          }`}
        >
          <CatalogImage src={img} alt="" variant="thumb" className="h-full w-full object-cover object-top" />
        </button>
      ))}
      {product.video && (
        <button
          type="button"
          onClick={() => setShowVideo(true)}
          className={`flex h-16 w-14 lg:h-[72px] lg:w-[56px] flex-shrink-0 flex-col items-center justify-center gap-0.5 rounded-sm border-2 bg-navy-900 text-[9px] font-semibold uppercase tracking-wide text-white transition-all ${
            showVideo ? 'border-rosegold-500' : 'border-transparent'
          }`}
        >
          <Play size={14} />
          Video
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
      <div className="order-2 shrink-0 lg:sticky lg:top-24 lg:z-10 lg:order-1 lg:w-14 lg:self-start">{thumbnails}</div>

      <div className="relative order-1 min-w-0 flex-1 lg:order-2">
        {showVideo && product.video ? (
          <div className="aspect-[3/4] overflow-hidden rounded-sm bg-black">
            <video
              src={mediaUrl(product.video)}
              controls
              autoPlay
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <>
            {/* Desktop — stacked images (page scroll) + magnifier on active frame */}
            <div className="hidden lg:flex lg:flex-col lg:gap-1">
              {product.images.map((img, i) => (
                <div
                  key={`${img}-${i}`}
                  ref={el => {
                    imageRefs.current[i] = el;
                  }}
                  className="scroll-mt-28"
                >
                  {i === selectedImage ? (
                    <ProductImageMagnifier
                      src={img}
                      alt={product.name}
                      overlays={overlays}
                      onImageClick={onZoom}
                      onMagnifyChange={onMagnifyChange}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectImage(i)}
                      className="relative block w-full overflow-hidden rounded-sm bg-cream-100"
                    >
                      <CatalogImage
                        src={img}
                        alt={`${product.name} — view ${i + 1}`}
                        variant="detail"
                        loading="eager"
                        className="aspect-[3/4] w-full object-cover object-top"
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile — tap to open fullscreen zoom */}
            <div
              className="relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-sm bg-cream-100 lg:hidden"
              onClick={onZoom}
            >
              {product.images.map((img, i) => (
                <CatalogImage
                  key={`${img}-${i}`}
                  src={img}
                  alt={i === selectedImage ? product.name : ''}
                  variant="detail"
                  priority={i === 0}
                  loading="eager"
                  aria-hidden={i !== selectedImage}
                  className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-100 ${
                    i === selectedImage ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                />
              ))}
              {overlays}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PdpTrustBar() {
  const { t } = useTranslation();
  const items = [
    { icon: Shield, label: t('footer.authentic') },
    { icon: Award, label: t('footer.premiumQuality') },
    { icon: MapPin, label: `${t('footer.madeInIndiaPrefix')} ${t('footer.madeInIndiaSuffix')}` },
    { icon: CreditCard, label: t('footer.securePayments') },
  ];

  return (
    <section className="border-y border-rosegold-100 bg-cream-50">
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-rosegold-100">
          {items.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 px-4 py-6 text-center"
            >
              <Icon size={20} className="text-rosegold-500" />
              <p className="font-body text-xs font-semibold text-navy-700">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, loading } = useProduct(slug);
  const { products: allProducts } = useProducts();
  const { categories } = useCategories();
  const isWishlisted = useSelector((state: RootState) =>
    product ? selectIsWishlisted(product.id)(state) : false,
  );
  const formatPrice = useFormatPrice();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity] = useState(1);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    details: false,
    fabric: false,
    shipping: false,
  });
  const [sizeError, setSizeError] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [magnifierPreview, setMagnifierPreview] = useState<MagnifierPreviewState>(INACTIVE_MAGNIFIER);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);
  const [apiReviews, setApiReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ author: '', location: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (slug) addRecentlyViewed(slug);
  }, [slug]);

  useEffect(() => {
    if (product?.colors[0]) setSelectedColor(product.colors[0]);
    setSelectedSize('');
    setSizeError(false);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    fetchReviews(product.id).then(setApiReviews).catch(() => setApiReviews([]));
    preloadProductDetail(product);
  }, [product]);

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <p className="font-body text-sm text-gray-500">{t('search.searching')}</p>
      </div>
    );
  }

  const category = categories.find(c => c.slug === product.category);
  const categoryLabel = category?.name ?? product.category.replace(/-/g, ' ');
  const productReviews = apiReviews.filter(r => r.productId === product.id);
  const uniqueReviews = productReviews.filter((r, i, arr) => arr.findIndex(x => x.id === r.id) === i);
  const similar = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.fabric === product.fabric))
    .slice(0, 4);

  const addToCartWithVariants = () => {
    const { size, color, sizeMissing } = getCartVariants(product, selectedSize, selectedColor);
    if (sizeMissing) {
      setSizeError(true);
      return false;
    }
    setSizeError(false);
    dispatch(addToCart({ product, size, color, quantity }));
    return true;
  };

  const handleAddToCart = () => {
    if (!addToCartWithVariants()) return;
    dispatch(toggleCart());
  };

  const handleBuyNow = () => {
    if (!addToCartWithVariants()) return;
    navigate('/checkout');
  };

  const checkPincode = () => {
    const cleaned = pincode.replace(/\D/g, '');
    if (cleaned.length !== 6) {
      setPincodeResult('Please enter a valid 6-digit pincode.');
      return;
    }
    setPincodeResult(product.deliveryTime || 'Delivery in 4–7 business days.');
  };

  const toggleSection = (section: 'details' | 'fabric' | 'shipping') => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.author || !reviewForm.comment) return;
    try {
      const newReview = await submitReview({
        productId: product.id,
        author: reviewForm.author,
        location: reviewForm.location || 'India',
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setApiReviews(prev => [newReview, ...prev]);
      setReviewSubmitted(true);
      setReviewForm({ author: '', location: '', rating: 5, comment: '' });
      setTimeout(() => setReviewSubmitted(false), 3000);
    } catch {
      const newReview: Review = {
        id: `user-${Date.now()}`,
        productId: product.id,
        author: reviewForm.author,
        location: reviewForm.location || 'India',
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        date: new Date().toISOString().split('T')[0],
        verified: false,
      };
      saveReview(newReview);
      setApiReviews(prev => [newReview, ...prev]);
      setReviewSubmitted(true);
      setReviewForm({ author: '', location: '', rating: 5, comment: '' });
      setTimeout(() => setReviewSubmitted(false), 3000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="section-container py-5 sm:py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs font-body text-gray-500">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-navy-700 transition-colors">
            <Home size={13} />
          </Link>
          <span className="text-gray-300">/</span>
          <Link to={`/collections/${product.category}`} className="hover:text-navy-700 transition-colors capitalize">
            {categoryLabel}
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-400 capitalize">{product.fabric}</span>
          <span className="text-gray-300">/</span>
          <span className="line-clamp-1 font-medium text-navy-700">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,400px)] lg:items-start xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,420px)] xl:gap-10">
          {/* Gallery — scrolls with the page */}
          <div className="min-w-0">
            <ProductGallery
              product={product}
              selectedImage={selectedImage}
              onSelectImage={setSelectedImage}
              onZoom={() => setZoomOpen(true)}
              onMagnifyChange={setMagnifierPreview}
              isWishlisted={isWishlisted}
              onToggleWishlist={() => dispatch(toggleWishlist(product.id))}
            />
          </div>

          {/* Buy box — sticky while gallery is in view */}
          <div className="lg:sticky lg:top-24 lg:z-10 lg:max-h-[calc(100svh-6rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pt-2 lg:pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300">
            <ProductMagnifierPreviewPane
              state={magnifierPreview}
              className="mb-4 hidden lg:block"
            />

            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-body">
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {product.inStock ? t('product.inStock') : t('product.outOfStock')}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">
                SKU: <span className="font-medium text-navy-700">{product.sku}</span>
              </span>
            </div>

            <h1 className={`mb-2 font-heading text-2xl font-semibold leading-tight text-navy-800 sm:text-3xl ${magnifierPreview.active ? 'lg:hidden' : ''}`}>
              {product.name}
            </h1>

            <p className={`mb-4 font-body text-sm leading-relaxed text-gray-600 ${magnifierPreview.active ? 'lg:hidden' : ''}`}>
              {product.description}
            </p>

            <div className="mb-5 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <span className="font-body text-sm font-semibold text-navy-800">{product.rating.toFixed(1)}</span>
              </div>
              <span className="font-body text-sm text-gray-500">
                {product.reviewCount} {product.reviewCount === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>

            <div className="mb-6 flex flex-wrap items-baseline gap-3">
              <span className="font-heading text-3xl font-bold text-navy-800">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice != null && product.originalPrice > product.price && (
                <span className="font-body text-base text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount != null && product.discount > 0 && (
                <span className="rounded-sm bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">
                  {product.discount}% {t('product.off')}
                </span>
              )}
            </div>

            {/* Color — only when admin enables */}
            {product.showColorSelector && product.colors.length > 0 && (
              <div className="mb-5">
                <p className="mb-3 font-body text-xs font-bold uppercase tracking-wider text-navy-800">
                  {t('collection.color')}:{' '}
                  <span className="font-normal normal-case tracking-normal text-gray-600">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`min-w-[2.75rem] border px-3 py-2 text-xs font-body transition-all ${
                        selectedColor === color
                          ? 'border-navy-700 bg-navy-700 text-white'
                          : 'border-neutral-200 text-gray-700 hover:border-navy-700'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size — only when admin enables */}
            {product.showSizeSelector && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p
                    className={`font-body text-xs font-bold uppercase tracking-wider ${
                      sizeError ? 'text-red-500' : 'text-navy-800'
                    }`}
                  >
                    {t('collection.size')}
                    {sizeError && (
                      <span className="ml-1 font-normal normal-case tracking-normal text-red-400">
                        — {t('product.selectSize')}
                      </span>
                    )}
                  </p>
                  <Link
                    to="/size-guide"
                    className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-navy-700"
                  >
                    <Ruler size={13} />
                    {t('product.sizeGuide')}
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      className={`min-h-[44px] min-w-[2.75rem] border px-3 text-sm font-body font-medium transition-all ${
                        selectedSize === size
                          ? 'border-navy-700 bg-navy-700 text-white'
                          : `border-neutral-200 text-gray-700 hover:border-navy-700 ${
                              sizeError ? 'border-red-300' : ''
                            }`
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="mb-3 flex h-12 w-full items-center justify-center gap-2.5 bg-navy-800 font-body text-sm font-semibold text-white transition-colors hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShopBagPlusIcon className="h-[18px] w-4" />
              {t('product.addToBag')}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="mb-6 flex h-12 w-full items-center justify-center gap-2 border-2 border-rosegold-400 bg-white font-body text-sm font-semibold text-navy-800 transition-colors hover:bg-cream-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Zap size={16} className="text-rosegold-500" />
              {t('product.buyNow')}
            </button>

            <div className="mb-6 grid grid-cols-3 gap-3 border-y border-neutral-100 py-5">
              {[
                { icon: RefreshCw, title: t('footer.easyReturns') },
                { icon: Shield, title: t('footer.securePayments') },
                { icon: Truck, title: t('footer.codAvailable') },
              ].map(({ icon: Icon, title }) => (
                <div key={title} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon size={18} className="text-rosegold-500" />
                  <p className="font-body text-[11px] font-medium leading-tight text-navy-700">{title}</p>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <p className="mb-2 font-body text-xs font-bold uppercase tracking-wider text-navy-800">
                Delivery
              </p>
              <div className="flex gap-0">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={e => {
                    setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setPincodeResult(null);
                  }}
                  placeholder="Enter Pincode"
                  className="input-field flex-1 rounded-r-none border-r-0"
                />
                <button
                  type="button"
                  onClick={checkPincode}
                  className="flex items-center justify-center rounded-r-sm border border-navy-700 bg-navy-700 px-4 text-white transition-colors hover:bg-navy-800"
                  aria-label="Check delivery"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
              {pincodeResult && (
                <p className="mt-2 font-body text-xs text-gray-600">{pincodeResult}</p>
              )}
            </div>

            <div className="space-y-0">
              <PdpAccordion
                title={t('product.productDetails')}
                open={openSections.details}
                onToggle={() => toggleSection('details')}
              >
                <ul className="space-y-2">
                  {product.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-navy-700" />
                      {detail}
                    </li>
                  ))}
                </ul>
                {product.includes.length > 0 && (
                  <p className="mt-4 text-xs text-gray-500">
                    <span className="font-semibold text-navy-700">{t('product.includes')}:</span>{' '}
                    {product.includes.join(', ')}
                  </p>
                )}
              </PdpAccordion>

              <PdpAccordion
                title="Fabric & Care"
                open={openSections.fabric}
                onToggle={() => toggleSection('fabric')}
              >
                <p>{product.washCare}</p>
                <p className="mt-3 text-xs text-gray-500">
                  <span className="font-semibold text-navy-700">Fabric:</span> {product.fabric}
                </p>
              </PdpAccordion>

              <PdpAccordion
                title="Shipping & Returns"
                open={openSections.shipping}
                onToggle={() => toggleSection('shipping')}
              >
                <p className="mb-2">{product.deliveryTime}</p>
                <p>{product.returnPolicy}</p>
              </PdpAccordion>

              {(product.customFields ?? [])
                .filter(f => f.showOnStorefront)
                .sort((a, b) => a.order - b.order)
                .map(field => (
                  <PdpAccordion
                    key={field.id}
                    title={field.label}
                    open={openSections[`custom-${field.id}`] ?? false}
                    onToggle={() =>
                      setOpenSections(prev => ({
                        ...prev,
                        [`custom-${field.id}`]: !prev[`custom-${field.id}`],
                      }))
                    }
                  >
                    <ProductCustomFieldValue field={field} />
                  </PdpAccordion>
                ))}
            </div>
          </div>
        </div>
      </div>

      <PdpTrustBar />

      {/* Reviews */}
      <div className="section-container py-12">
        <h2 className="mb-6 font-heading text-2xl font-semibold text-navy-800">
          {t('product.reviews')} ({uniqueReviews.length})
        </h2>

        <form
          onSubmit={handleSubmitReview}
          className="mb-8 rounded-sm border border-neutral-200 bg-neutral-50 p-6"
        >
          <h3 className="mb-4 font-heading text-lg font-bold text-navy-900">{t('product.writeReview')}</h3>
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder={t('product.yourName')}
              value={reviewForm.author}
              onChange={e => setReviewForm({ ...reviewForm, author: e.target.value })}
              className="input-field"
              required
            />
            <input
              type="text"
              placeholder="City"
              value={reviewForm.location}
              onChange={e => setReviewForm({ ...reviewForm, location: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="mb-4 flex gap-1">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: s })}>
                <Star
                  size={20}
                  className={s <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Share your experience..."
            value={reviewForm.comment}
            onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
            className="input-field mb-4 min-h-[100px]"
            required
          />
          <button type="submit" className="btn-primary">
            {t('product.submitReview')}
          </button>
          {reviewSubmitted && (
            <p className="mt-2 text-sm text-emerald-600">{t('product.thankYouReview')}</p>
          )}
        </form>

        <div className="space-y-6">
          {uniqueReviews.length === 0 ? (
            <p className="text-sm text-gray-500">{t('product.noReviews')}</p>
          ) : (
            uniqueReviews.map(review => (
              <div key={review.id} className="border-b border-neutral-100 pb-6 last:border-b-0">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rosegold-200">
                      <span className="font-heading text-sm font-bold text-navy-700">
                        {review.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-navy-800">
                        {review.author}{' '}
                        {review.verified && (
                          <span className="text-xs font-normal text-emerald-600">✓ Verified</span>
                        )}
                      </p>
                      <p className="font-body text-xs text-gray-500">{review.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        size={12}
                        className={
                          s <= review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-gray-300 text-gray-300'
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="font-body text-sm leading-relaxed text-gray-700">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Similar products */}
      {similar.length > 0 && (
        <div className="section-container mb-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-rosegold-500 mb-2">
                You May Also Like
              </p>
              <h2 className="font-heading text-2xl font-semibold text-navy-700 sm:text-3xl">
                {t('product.similarProducts')}
              </h2>
            </div>
            <Link
              to={`/collections/${product.category}`}
              className="hidden text-sm font-semibold text-navy-700 hover:text-rosegold-500 sm:inline"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {similar.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Zoom modal */}
      {zoomOpen && (
        <ProductZoomModal
          images={product.images}
          index={selectedImage}
          alt={product.name}
          onIndexChange={setSelectedImage}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </div>
  );
}
