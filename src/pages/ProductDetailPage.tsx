import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Heart, Truck, RefreshCw, Shield,
  ChevronDown, Star, ZoomIn, X, Play
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, toggleCart } from '../store/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../store/wishlistSlice';
import { saveReview, addRecentlyViewed } from '../lib/storage';
import { fetchReviews, submitReview } from '../lib/api';
import { mediaUrl } from '../lib/media';
import { useProduct, useProducts } from '../hooks/useCatalog';
import ProductCard from '../components/ui/ProductCard';
import CatalogImage from '../components/ui/CatalogImage';
import { preloadProductDetail } from '../lib/preloadImages';
import type { RootState } from '../store';
import type { Review } from '../types';
import { useFormatPrice } from '../hooks/useFormatPrice';
import ShopBagPlusIcon from '../components/ui/ShopBagPlusIcon';

function ProductAccordionSection({
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
    <div className="flex min-h-0 flex-col border-b border-neutral-200 lg:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-6 text-left transition-colors hover:text-navy-700 sm:px-6 lg:px-8 lg:py-8"
      >
        <span className="font-heading text-lg font-bold leading-tight text-navy-900 sm:text-xl lg:text-[1.35rem]">
          {title}
        </span>
        <ChevronDown
          size={20}
          strokeWidth={2}
          className={`flex-shrink-0 text-navy-900 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-5 pb-8 font-body text-sm leading-relaxed text-gray-700 sm:px-6 lg:max-h-[min(70vh,720px)] lg:overflow-y-auto lg:px-8 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQRow({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-100 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-body text-sm font-semibold text-navy-800">{question}</span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <p className="pb-4 font-body text-sm leading-relaxed text-gray-600">{answer}</p>}
    </div>
  );
}

const MOSAIC_ROW_SIZES = [2, 3, 2, 1] as const;

function groupImagesForMosaic(images: string[]): string[][] {
  const rows: string[][] = [];
  let index = 0;
  let patternIndex = 0;

  while (index < images.length) {
    const size = MOSAIC_ROW_SIZES[patternIndex % MOSAIC_ROW_SIZES.length];
    rows.push(images.slice(index, index + size));
    index += size;
    patternIndex += 1;
  }

  return rows;
}

function ProductImageMosaic({
  images,
  productName,
  discount,
  onImageClick,
}: {
  images: string[];
  productName: string;
  discount?: number;
  onImageClick: (index: number) => void;
}) {
  const rows = groupImagesForMosaic(images);
  let globalIndex = 0;

  return (
    <div className="flex flex-col gap-[2px]">
      {rows.map((row, rowIndex) => {
        const cols = row.length;
        const gridClass = cols === 1 ? 'grid-cols-1' : cols === 2 ? 'grid-cols-2' : 'grid-cols-3';

        return (
          <div key={rowIndex} className={`grid ${gridClass} gap-[2px]`}>
            {row.map(img => {
              const imageIndex = globalIndex++;
              return (
                <div
                  key={imageIndex}
                  className="group relative cursor-zoom-in overflow-hidden bg-cream-200"
                  onClick={() => onImageClick(imageIndex)}
                >
                  <CatalogImage
                    src={img}
                    alt={`${productName} — view ${imageIndex + 1}`}
                    variant={imageIndex === 0 ? 'detail' : 'thumb'}
                    priority={imageIndex === 0}
                    loading={imageIndex === 0 ? 'eager' : 'lazy'}
                    className={`block w-full object-cover object-top ${
                      cols === 1 ? 'min-h-[70vh] aspect-[3/4]' : cols === 3 ? 'aspect-[4/5]' : 'aspect-square'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onImageClick(imageIndex);
                    }}
                    className="absolute right-3 top-3 hidden h-9 w-9 items-center justify-center rounded-full bg-white/85 text-navy-700 opacity-0 transition-opacity group-hover:flex group-hover:opacity-100"
                  >
                    <ZoomIn size={16} />
                  </button>
                  {imageIndex === 0 && discount != null && (
                    <div className="badge-sale absolute left-3 top-3 px-3 py-1 text-sm">
                      -{discount}% OFF
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useProduct(slug);
  const { products: allProducts } = useProducts();
  const isWishlisted = useSelector((state: RootState) =>
    product ? selectIsWishlisted(product.id)(state) : false,
  );
  const formatPrice = useFormatPrice();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [openSections, setOpenSections] = useState({
    details: true,
    reviews: true,
    faq: true,
  });
  const [sizeError, setSizeError] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [apiReviews, setApiReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ author: '', location: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (slug) addRecentlyViewed(slug);
  }, [slug]);

  useEffect(() => {
    if (product?.colors[0]) setSelectedColor(product.colors[0]);
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

  const productReviews = apiReviews.filter(r => r.productId === product.id);
  const uniqueReviews = productReviews.filter((r, i, arr) => arr.findIndex(x => x.id === r.id) === i);
  const similar = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.fabric === product.fabric))
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    dispatch(addToCart({ product, size: selectedSize, color: selectedColor, quantity }));
    dispatch(toggleCart());
  };

  const handleBuyNow = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    dispatch(addToCart({ product, size: selectedSize, color: selectedColor, quantity }));
  };

  const toggleSection = (section: 'details' | 'reviews' | 'faq') => {
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

      {/* one8-style: grid gives right column full row height so sticky works */}
      <div className="w-full lg:grid lg:grid-cols-[minmax(0,1fr)_28rem] xl:grid-cols-[minmax(0,1.15fr)_32rem]">

        {/* LEFT — scrollable mosaic gallery, edge-to-edge */}
        <div className="min-w-0 bg-neutral-100">
          <div className="lg:hidden">
            <div
              className="aspect-[3/4] overflow-hidden bg-cream-200 cursor-zoom-in"
              onClick={() => setZoomOpen(true)}
            >
              <CatalogImage
                src={product.images[selectedImage]}
                alt={product.name}
                variant="detail"
                priority
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto border-b border-rosegold-100 bg-white p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedImage(i); setShowVideo(false); }}
                  className={`h-18 w-14 flex-shrink-0 overflow-hidden rounded-sm border-2 transition-all ${selectedImage === i && !showVideo ? 'border-rosegold-500' : 'border-transparent'}`}
                >
                  <CatalogImage src={img} alt="" variant="thumb" className="h-full w-full object-cover" />
                </button>
              ))}
              {product.video && (
                <button
                  onClick={() => setShowVideo(true)}
                  className={`flex h-18 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-sm border-2 bg-navy-900 transition-all ${showVideo ? 'border-rosegold-500' : 'border-transparent'}`}
                >
                  <Play size={16} className="text-white" />
                </button>
              )}
            </div>
            {showVideo && product.video && (
              <div className="aspect-[3/4] bg-black">
                <video src={mediaUrl(product.video)} controls autoPlay className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <ProductImageMosaic
              images={product.images}
              productName={product.name}
              discount={product.discount}
              onImageClick={i => { setSelectedImage(i); setZoomOpen(true); }}
            />
            {product.video && (
              <div className="mt-[2px] min-h-[70vh] bg-black">
                <video src={mediaUrl(product.video)} controls className="h-full min-h-[70vh] w-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — sticky product panel (sticks while left gallery scrolls) */}
        <div className="relative border-rosegold-100 bg-white lg:border-l">
          <div className="px-6 py-8 lg:sticky lg:top-24 lg:z-10 lg:max-h-[calc(100svh-6rem)] lg:overflow-y-auto xl:px-10">

            <nav className="mb-6 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] font-body text-gray-500">
              <Link to="/" className="hover:text-navy-700 transition-colors">Home</Link>
              <span className="text-gray-300">/</span>
              <span className="line-clamp-1 font-medium text-navy-700">{product.name}</span>
            </nav>

            <p className="mb-2 text-[11px] font-body font-semibold uppercase tracking-[0.2em] text-gray-500">
              {product.fabric}
            </p>

            <div className="mb-3 flex items-center gap-2">
              {product.isNew && <span className="badge-new">New</span>}
              {product.isBestSeller && <span className="badge-bestseller">Bestseller</span>}
              {product.discount != null && (
                <span className="badge-sale text-[10px]">-{product.discount}%</span>
              )}
            </div>

            <h1 className="mb-3 font-heading text-3xl font-semibold leading-tight text-navy-700 xl:text-[2rem]">
              {product.name}
            </h1>

            <p className="mb-6 font-body text-sm leading-relaxed text-gray-600">
              {product.description}
            </p>

            <div className="mb-6 flex items-baseline gap-3 border-b border-rosegold-100 pb-6">
              <span className="font-heading text-2xl font-bold text-navy-700">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="font-body text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            {/* color */}
            <div className="mb-6">
              <p className="mb-3 font-body text-xs font-semibold uppercase tracking-wider text-navy-700">
                Colour: <span className="font-normal normal-case tracking-normal text-gray-600">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`min-w-[3rem] px-3 py-2 text-xs font-body transition-all duration-200 ${
                      selectedColor === color
                        ? 'bg-navy-700 text-white'
                        : 'border border-neutral-200 text-gray-700 hover:border-navy-700'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* size */}
            <div className="mb-8">
              <p className={`mb-3 font-body text-xs font-semibold uppercase tracking-wider ${sizeError ? 'text-red-500' : 'text-navy-700'}`}>
                Size {sizeError && <span className="font-normal normal-case tracking-normal text-red-400">— select a size</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`min-h-[44px] min-w-[3rem] px-3 text-sm font-body font-medium transition-all duration-200 ${
                      selectedSize === size
                        ? 'bg-navy-700 text-white'
                        : `border border-neutral-200 text-gray-700 hover:border-navy-700 ${sizeError ? 'border-red-300' : ''}`
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="mb-3 flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-navy-900 font-body text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-navy-800"
            >
              <ShopBagPlusIcon className="h-[18px] w-4" />
              {t('product.addToBag')}
            </button>

            <div className="mb-3 flex items-center gap-3">
              <div className="flex items-center border border-neutral-200">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-11 w-10 items-center justify-center text-navy-700 hover:bg-neutral-50">−</button>
                <span className="w-10 text-center text-sm font-medium text-navy-700">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="flex h-11 w-10 items-center justify-center text-navy-700 hover:bg-neutral-50">+</button>
              </div>
              <button onClick={handleBuyNow} className="btn-rose h-11 flex-1 text-sm font-semibold">{t('product.buyNow')}</button>
              <button
                onClick={() => dispatch(toggleWishlist(product.id))}
                className={`flex h-11 w-11 items-center justify-center border transition-all duration-200 ${
                  isWishlisted ? 'border-rosegold-500 bg-rosegold-500 text-white' : 'border-neutral-200 text-gray-600 hover:border-rosegold-500'
                }`}
                aria-label="Add to wishlist"
              >
                <Heart size={17} className={isWishlisted ? 'fill-white' : ''} />
              </button>
            </div>

            <a
              href={`https://wa.me/919876543210?text=Hi! I'm interested in: ${product.name} (SKU: ${product.sku})`}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-6 flex w-full items-center justify-center gap-2 border border-green-200 py-3 text-sm font-body font-medium text-green-700 transition-colors hover:bg-green-50"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              {t('product.whatsapp')}
            </a>

            <div className="grid grid-cols-3 gap-2 border-t border-rosegold-100 py-5">
              {[
                { icon: Truck, title: 'Free Delivery', desc: `Above ${formatPrice(999)}` },
                { icon: RefreshCw, title: '7-Day Returns', desc: 'Easy returns' },
                { icon: Shield, title: 'Authentic', desc: 'Genuine fabric' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center gap-1 text-center">
                  <Icon size={16} className="text-rosegold-500" />
                  <p className="font-body text-[11px] font-medium leading-tight text-navy-700">{title}</p>
                  <p className="font-body text-[10px] text-gray-400">{desc}</p>
                </div>
              ))}
            </div>

            <div className="space-y-1 border-t border-rosegold-100 pt-4 text-xs font-body text-gray-500">
              <p><span className="font-semibold text-navy-700">SKU</span> {product.sku}</p>
              <p><span className="font-semibold text-navy-700">Includes</span> {product.includes.join(', ')}</p>
            </div>

          </div>
        </div>
      </div>

      {/* ── Accordion columns: Details · Reviews · FAQ ── */}
      <div className="w-full border-t border-neutral-200 bg-white">
        <div className="grid w-full grid-cols-1 lg:grid-cols-3 lg:divide-x lg:divide-neutral-200">

          <ProductAccordionSection
            title={t('product.productDetails')}
            open={openSections.details}
            onToggle={() => toggleSection('details')}
          >
            <p className="mb-6 text-[15px] leading-relaxed text-gray-800">{product.description}</p>
            <ul className="mb-8 space-y-3">
              {product.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-navy-900" />
                  {detail}
                </li>
              ))}
            </ul>
            <div className="space-y-5 border-t border-neutral-100 pt-6 text-sm text-gray-700">
              <div>
                <p className="mb-1 font-body text-xs font-bold uppercase tracking-wider text-navy-900">Fabric &amp; Care</p>
                <p className="leading-relaxed">{product.washCare}</p>
              </div>
              <div>
                <p className="mb-1 font-body text-xs font-bold uppercase tracking-wider text-navy-900">Delivery</p>
                <p className="leading-relaxed">{product.deliveryTime}</p>
              </div>
              <div>
                <p className="mb-1 font-body text-xs font-bold uppercase tracking-wider text-navy-900">Returns</p>
                <p className="leading-relaxed">{product.returnPolicy}</p>
              </div>
              <div className="space-y-1 pt-2 text-xs text-gray-500">
                <p><span className="font-semibold text-navy-800">SKU:</span> {product.sku}</p>
                <p><span className="font-semibold text-navy-800">Fabric:</span> {product.fabric}</p>
                <p><span className="font-semibold text-navy-800">Includes:</span> {product.includes.join(', ')}</p>
                <p><span className="font-semibold text-navy-800">Country of origin:</span> India</p>
              </div>
            </div>
          </ProductAccordionSection>

          <ProductAccordionSection
            title={`${t('product.reviews')} (${uniqueReviews.length})`}
            open={openSections.reviews}
            onToggle={() => toggleSection('reviews')}
          >
            <form onSubmit={handleSubmitReview} className="mb-8 rounded-sm border border-neutral-200 bg-neutral-50 p-6">
              <h3 className="mb-4 font-heading text-lg font-bold text-navy-900">{t('product.writeReview')}</h3>
              <div className="mb-4 grid grid-cols-1 gap-4">
                <input type="text" placeholder={t('product.yourName')} value={reviewForm.author} onChange={e => setReviewForm({ ...reviewForm, author: e.target.value })} className="input-field" required />
                <input type="text" placeholder="City" value={reviewForm.location} onChange={e => setReviewForm({ ...reviewForm, location: e.target.value })} className="input-field" />
              </div>
              <div className="mb-4 flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: s })}>
                    <Star size={20} className={s <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
              <textarea placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} className="input-field mb-4 min-h-[100px]" required />
              <button type="submit" className="btn-primary">{t('product.submitReview')}</button>
              {reviewSubmitted && <p className="mt-2 text-sm text-emerald-600">{t('product.thankYouReview')}</p>}
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
                          <span className="font-heading text-sm font-bold text-navy-700">{review.author.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-body text-sm font-semibold text-navy-800">
                            {review.author}{' '}
                            {review.verified && <span className="text-xs font-normal text-emerald-600">✓ Verified</span>}
                          </p>
                          <p className="font-body text-xs text-gray-500">{review.location}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={12} className={s <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-300 text-gray-300'} />
                        ))}
                      </div>
                    </div>
                    <p className="font-body text-sm leading-relaxed text-gray-700">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </ProductAccordionSection>

          <ProductAccordionSection
            title={t('product.faq')}
            open={openSections.faq}
            onToggle={() => toggleSection('faq')}
          >
            <FAQRow question="What is the fabric of this product?" answer={`This product is made from premium ${product.fabric}.`} />
            <FAQRow question="How do I wash this garment?" answer={product.washCare} />
            <FAQRow question="What sizes are available?" answer={`Available sizes: ${product.sizes.join(' | ')}`} />
            <FAQRow question="What is your return policy?" answer={product.returnPolicy} />
            <FAQRow question="When will I receive my order?" answer={product.deliveryTime} />
            <FAQRow question="Is COD available?" answer={`Yes! Cash on Delivery is available across India. A nominal handling fee of ${formatPrice(49)} applies for COD orders.`} />
          </ProductAccordionSection>

        </div>
      </div>

      {/* ── SIMILAR PRODUCTS ── */}
      {similar.length > 0 && (
        <div className="mb-20 mt-8 w-full px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-10">
            <p className="font-body text-xs tracking-[0.25em] uppercase font-semibold text-rosegold-500 mb-3">You May Also Like</p>
            <h2 className="font-heading text-3xl font-semibold text-navy-700">{t('product.similarProducts')}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
            {similar.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* ── ZOOM MODAL ── */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setZoomOpen(false)}>
          <button className="absolute top-4 right-4 text-white p-2" onClick={() => setZoomOpen(false)}><X size={24} /></button>
          <CatalogImage
            src={product.images[selectedImage]}
            alt={product.name}
            variant="zoom"
            priority
            className="max-h-[90vh] max-w-full object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}