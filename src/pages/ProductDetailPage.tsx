import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Truck, RefreshCw, Shield, ChevronDown, Star, ZoomIn, X, Play, Package, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, toggleCart } from '../store/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../store/wishlistSlice';
import { products } from '../data/products';
import { reviews as defaultReviews } from '../data/products';
import { loadReviews, saveReview } from '../lib/storage';
import ProductCard from '../components/ui/ProductCard';
import type { RootState } from '../store';
import type { Review } from '../types';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-rosegold-100">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-4 text-left">
        <span className="font-inter text-sm font-medium text-navy-700">{question}</span>
        <ChevronDown size={16} className={`text-rosegold-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="font-inter text-sm text-gray-600 leading-relaxed pb-4">{answer}</p>}
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const product = products.find(p => p.slug === slug) || products[0];
  const isWishlisted = useSelector((state: RootState) => selectIsWishlisted(product.id)(state));

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<'details' | 'reviews' | 'faq'>('details');
  const [sizeError, setSizeError] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [localReviews, setLocalReviews] = useState<Review[]>(() => loadReviews());
  const [reviewForm, setReviewForm] = useState({ author: '', location: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const productReviews = [
    ...defaultReviews.filter(r => r.productId === product.id),
    ...localReviews.filter(r => r.productId === product.id),
  ];
  const uniqueReviews = productReviews.filter((r, i, arr) => arr.findIndex(x => x.id === r.id) === i);

  const similar = products.filter(p => p.id !== product.id && (p.category === product.category || p.fabric === product.fabric)).slice(0, 4);

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

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.author || !reviewForm.comment) return;
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
    setLocalReviews(prev => [newReview, ...prev]);
    setReviewSubmitted(true);
    setReviewForm({ author: '', location: '', rating: 5, comment: '' });
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="bg-white border-b border-rosegold-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs font-inter text-gray-500">
            <Link to="/" className="hover:text-rosegold-500 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/collections" className="hover:text-rosegold-500 transition-colors">Collections</Link>
            <span>/</span>
            <Link to={`/collections/${product.category}`} className="hover:text-rosegold-500 transition-colors capitalize">{product.category.replace(/-/g, ' ')}</Link>
            <span>/</span>
            <span className="text-navy-700 font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-x-visible scrollbar-hide">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => { setSelectedImage(i); setShowVideo(false); }} className={`flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-sm overflow-hidden border-2 transition-all duration-200 ${selectedImage === i && !showVideo ? 'border-rosegold-500' : 'border-transparent'}`}>
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              {product.video && (
                <button onClick={() => setShowVideo(true)} className={`flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-sm overflow-hidden border-2 flex items-center justify-center bg-navy-700 transition-all ${showVideo ? 'border-rosegold-500' : 'border-transparent'}`}>
                  <Play size={20} className="text-white" />
                </button>
              )}
            </div>

            <div className="flex-1 relative group rounded-sm overflow-hidden aspect-[3/4] bg-cream-200 shadow-luxury">
              {showVideo && product.video ? (
                <video src={product.video} controls autoPlay className="w-full h-full object-cover" />
              ) : (
                <>
                  <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in" onClick={() => setZoomOpen(true)} />
                  <button onClick={() => setZoomOpen(true)} className="absolute top-4 right-4 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center text-navy-700 hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                    <ZoomIn size={16} />
                  </button>
                </>
              )}
              {product.discount && (
                <div className="absolute top-4 left-4 badge-sale text-sm px-3 py-1">-{product.discount}% OFF</div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-inter font-medium text-rosegold-500 uppercase tracking-widest">{product.fabric}</span>
              {product.isNew && <span className="badge-new">New</span>}
              {product.isBestSeller && <span className="badge-bestseller">Bestseller</span>}
            </div>

            <h1 className="font-playfair text-3xl lg:text-4xl font-semibold text-navy-700 leading-tight mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={14} className={s <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-300'} />
                ))}
              </div>
              <span className="text-sm font-inter text-gray-500">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-baseline gap-4 mb-2">
              <span className="font-inter text-sm text-gray-500">Offer Price:</span>
              <span className="font-playfair text-3xl font-bold text-navy-700">₹{product.price.toLocaleString('en-IN')}</span>
            </div>
            {product.originalPrice && (
              <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-rosegold-100">
                <span className="font-inter text-sm text-gray-500">Price:</span>
                <span className="font-inter text-base text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                <span className="text-sm font-inter font-semibold text-emerald-600">Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}</span>
              </div>
            )}
            {!product.originalPrice && <div className="mb-6 pb-6 border-b border-rosegold-100" />}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-4 bg-white rounded-sm border border-rosegold-100">
              <div className="flex items-start gap-2">
                <Package size={16} className="text-rosegold-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-inter text-xs font-semibold text-navy-700">Includes</p>
                  <p className="font-inter text-xs text-gray-600">{product.includes.join(' + ')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <RefreshCw size={16} className="text-rosegold-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-inter text-xs font-semibold text-navy-700">Wash Care</p>
                  <p className="font-inter text-xs text-gray-600">{product.washCare}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={16} className="text-rosegold-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-inter text-xs font-semibold text-navy-700">Delivery Time</p>
                  <p className="font-inter text-xs text-gray-600">{product.deliveryTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield size={16} className="text-rosegold-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-inter text-xs font-semibold text-navy-700">Return Policy</p>
                  <p className="font-inter text-xs text-gray-600">{product.returnPolicy}</p>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <p className="font-inter text-sm font-medium text-navy-700 mb-2">Color: <span className="font-semibold">{selectedColor}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button key={color} onClick={() => setSelectedColor(color)} className={`px-3 py-1.5 text-xs font-inter rounded-sm border transition-all duration-200 ${selectedColor === color ? 'border-navy-700 bg-navy-700 text-white' : 'border-rosegold-200 text-gray-700 hover:border-rosegold-500'}`}>{color}</button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className={`font-inter text-sm font-medium ${sizeError ? 'text-red-500' : 'text-navy-700'}`}>
                  Sizes: {sizeError && <span className="text-xs font-normal">(Please select a size)</span>}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button key={size} onClick={() => { setSelectedSize(size); setSizeError(false); }} className={`min-w-[3rem] h-12 px-2 text-sm font-inter font-medium rounded-sm border transition-all duration-200 ${selectedSize === size ? 'border-navy-700 bg-navy-700 text-white' : 'border-rosegold-200 text-gray-700 hover:border-rosegold-500'} ${sizeError ? 'border-red-200' : ''}`}>{size}</button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center border border-rosegold-200 rounded-sm">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 flex items-center justify-center text-navy-700 hover:bg-cream-100 text-lg">−</button>
                <span className="w-12 text-center text-sm font-medium text-navy-700">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-11 h-11 flex items-center justify-center text-navy-700 hover:bg-cream-100 text-lg">+</button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 btn-primary flex items-center justify-center gap-2"><ShoppingBag size={17} />Add to Bag</button>
              <button onClick={() => dispatch(toggleWishlist(product.id))} className={`w-11 h-11 flex items-center justify-center border rounded-sm transition-all duration-200 ${isWishlisted ? 'bg-rosegold-500 border-rosegold-500 text-white' : 'border-rosegold-200 text-gray-600 hover:border-rosegold-500'}`}>
                <Heart size={18} className={isWishlisted ? 'fill-white' : ''} />
              </button>
            </div>

            <button onClick={handleBuyNow} className="btn-rose w-full mb-6">Buy Now</button>

            <a href={`https://wa.me/919876543210?text=Hi! I'm interested in: ${product.name} (SKU: ${product.sku})`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 border border-green-200 text-green-700 text-sm font-inter font-medium rounded-sm hover:bg-green-50 transition-colors mb-6">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Inquire on WhatsApp
            </a>

            <div className="grid grid-cols-3 gap-3 mb-6 py-5 border-t border-b border-rosegold-100">
              {[{ icon: Truck, title: 'Free Delivery', desc: 'Above ₹999' }, { icon: RefreshCw, title: '7-Day Returns', desc: 'Easy returns' }, { icon: Shield, title: 'Authentic', desc: 'Genuine fabric' }].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center text-center gap-1.5">
                  <Icon size={18} className="text-rosegold-500" />
                  <p className="font-inter text-xs font-medium text-navy-700">{title}</p>
                  <p className="font-inter text-xs text-gray-500">{desc}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs font-inter text-gray-600">
              <p><span className="font-medium text-navy-700">SKU:</span> {product.sku}</p>
              <p><span className="font-medium text-navy-700">Fabric:</span> {product.fabric}</p>
              <p><span className="font-medium text-navy-700">Occasions:</span> {product.occasion.join(', ')}</p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex border-b border-rosegold-200">
            {(['details', 'reviews', 'faq'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-6 py-4 text-sm font-inter font-medium capitalize transition-all duration-200 border-b-2 -mb-px ${tab === t ? 'border-rosegold-500 text-rosegold-500' : 'border-transparent text-gray-500 hover:text-navy-700'}`}>
                {t === 'faq' ? 'FAQ' : t === 'reviews' ? `Reviews (${uniqueReviews.length})` : 'Product Details'}
              </button>
            ))}
          </div>

          <div className="py-8">
            {tab === 'details' && (
              <div className="max-w-2xl">
                <p className="font-inter text-sm text-gray-700 leading-relaxed mb-6">{product.description}</p>
                <ul className="space-y-2">
                  {product.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm font-inter text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-rosegold-500 mt-1.5 flex-shrink-0" />{detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tab === 'reviews' && (
              <div className="max-w-3xl">
                <form onSubmit={handleSubmitReview} className="bg-white rounded-sm border border-rosegold-100 p-6 mb-8">
                  <h3 className="font-playfair text-lg font-semibold text-navy-700 mb-4">Write a Review</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <input type="text" placeholder="Your Name" value={reviewForm.author} onChange={e => setReviewForm({ ...reviewForm, author: e.target.value })} className="input-field" required />
                    <input type="text" placeholder="City" value={reviewForm.location} onChange={e => setReviewForm({ ...reviewForm, location: e.target.value })} className="input-field" />
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: s })}>
                        <Star size={20} className={s <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                      </button>
                    ))}
                  </div>
                  <textarea placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} className="input-field mb-4 min-h-[100px]" required />
                  <button type="submit" className="btn-primary">Submit Review</button>
                  {reviewSubmitted && <p className="text-sm text-emerald-600 mt-2">Thank you! Your review has been submitted.</p>}
                </form>
                <div className="space-y-6">
                  {uniqueReviews.length === 0 ? (
                    <p className="text-sm text-gray-500">No reviews yet. Be the first to review!</p>
                  ) : uniqueReviews.map(review => (
                    <div key={review.id} className="border-b border-rosegold-100 pb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-rosegold-200 flex items-center justify-center">
                            <span className="font-playfair text-sm font-bold text-navy-700">{review.author.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-inter text-sm font-semibold text-navy-700">{review.author} {review.verified && <span className="text-xs text-emerald-600 font-normal">✓ Verified</span>}</p>
                            <p className="font-inter text-xs text-gray-500">{review.location}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className={s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-300'} />)}
                        </div>
                      </div>
                      <p className="font-inter text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'faq' && (
              <div className="max-w-2xl">
                <FAQItem question="What is the fabric of this product?" answer={`This product is made from premium ${product.fabric}.`} />
                <FAQItem question="How do I wash this garment?" answer={product.washCare} />
                <FAQItem question="What sizes are available?" answer={`Available sizes: ${product.sizes.join(' | ')}`} />
                <FAQItem question="What is your return policy?" answer={product.returnPolicy} />
                <FAQItem question="When will I receive my order?" answer={product.deliveryTime} />
                <FAQItem question="Is COD available?" answer="Yes! Cash on Delivery is available across India. A nominal handling fee of ₹49 applies for COD orders." />
              </div>
            )}
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-10">
              <p className="font-inter text-xs tracking-[0.25em] uppercase font-semibold text-rosegold-500 mb-3">You May Also Like</p>
              <h2 className="font-playfair text-3xl font-semibold text-navy-700">Similar Products</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {similar.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {zoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setZoomOpen(false)}>
          <button className="absolute top-4 right-4 text-white p-2" onClick={() => setZoomOpen(false)}><X size={24} /></button>
          <img src={product.images[selectedImage]} alt={product.name} className="max-w-full max-h-[90vh] object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
