import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Ruler,
  Star,
  Check,
  ChevronRight,
  Plus,
  Minus,
  MessageCircle,
  Share2,
  AlertCircle,
  Sparkles,
  ZoomIn,
  Maximize2,
  X
} from 'lucide-react';
import { Product, Review } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { ProductCard } from '../components/ProductCard';
import { handleImageFallback, DEFAULT_PRODUCT_IMAGE, CATEGORY_FALLBACK_IMAGES } from '../utils/imageFallback';

interface ProductDetailPageProps {
  productIdOrSlug: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenSizeGuide?: () => void;
  onOpenAiStylist?: (product: Product) => void;
}

export function ProductDetailPage({
  productIdOrSlug,
  onNavigate,
  onOpenSizeGuide,
  onOpenAiStylist
}: ProductDetailPageProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { settings } = useSettings();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // User Selections
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Hover-to-Zoom State for Fabric Texture Inspection
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Review Form
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await api.getProduct(productIdOrSlug);
        if (isMounted && res && res.product) {
          setProduct(res.product);
          setReviews(res.reviews || []);
          setSelectedColor(res.product.colors[0] || 'Standard');
          setSelectedSize(res.product.sizes[0] || 'M');
          setSelectedImageIndex(0);
          setQuantity(1);

          // Fetch related products in the same category
          const relatedRes = await api.getProducts({ category: res.product.categorySlug });
          if (isMounted) {
            setRelatedProducts(
              (relatedRes?.products || []).filter((p) => p.id !== res.product.id).slice(0, 4)
            );
          }
        }
      } catch {
        // Fallback already handled in api.ts
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      isMounted = false;
    };
  }, [productIdOrSlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[3/4] bg-neutral-900 rounded-2xl" />
          <div className="space-y-6">
            <div className="h-8 bg-neutral-900 rounded w-3/4" />
            <div className="h-6 bg-neutral-900 rounded w-1/4" />
            <div className="h-24 bg-neutral-900 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-white">Garment Not Found</h2>
        <p className="text-sm text-neutral-400">The product you are looking for may have been archived or moved.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-3 bg-white text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-200"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const displayPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const isOutOfStock = product.stock <= 0;

  // Determine variant stock if specified
  let currentVariantStock = product.stock;
  if (product.variants && product.variants.length > 0) {
    const v = product.variants.find((item) => item.size === selectedSize);
    if (v && v.stock !== undefined) {
      if (v.stock > 0) {
        currentVariantStock = v.stock;
      } else if (product.stock > 0) {
        currentVariantStock = product.stock;
      } else {
        currentVariantStock = 0;
      }
    }
  }

  // Handle Size Selection with automatic quantity adjustment
  const handleSelectSize = (sz: string) => {
    setSelectedSize(sz);
    if (product.variants && product.variants.length > 0) {
      const v = product.variants.find((item) => item.size === sz);
      const stock = v?.stock ?? product.stock;
      if (stock > 0 && quantity > stock) {
        setQuantity(stock);
      }
    }
  };

  // Hover-to-Zoom Mouse and Touch Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomPos({ x: 50, y: 50 });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsZoomed(true);
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
      setZoomPos({ x, y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
      setZoomPos({ x, y });
    }
  };

  const handleTouchEnd = () => {
    setIsZoomed(false);
    setZoomPos({ x: 50, y: 50 });
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast('This product is currently out of stock', 'error');
      return;
    }
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      showToast('This product is currently out of stock', 'error');
      return;
    }
    const success = addToCart(product, selectedColor, selectedSize, quantity);
    if (success) {
      onNavigate('checkout');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} at Favy Cravy Fits 2.0`,
          url: window.location.href
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(window.location.href);
          showToast('Product link copied to clipboard!', 'success');
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'success');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      showToast('Please provide your name and review remarks', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.addReview(product.id, {
        customerName: reviewName,
        rating: reviewRating,
        comment: reviewComment
      });
      setReviews([res.review, ...reviews]);
      setReviewFormOpen(false);
      setReviewName('');
      setReviewComment('');
      showToast('Thank you for your review!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-neutral-400 font-mono">
        <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-neutral-600" />
        <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
          Shop
        </button>
        <ChevronRight className="w-3 h-3 text-neutral-600" />
        <button
          onClick={() => onNavigate('shop', product.categorySlug)}
          className="hover:text-white transition-colors uppercase"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3 h-3 text-neutral-600" />
        <span className="text-white truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Image Gallery (7 Cols on LG) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Hero Image with Interactive Hover-to-Zoom capability */}
          <div
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl group select-none ${
              isZoomed ? 'cursor-crosshair' : 'cursor-zoom-in'
            }`}
          >
            <img
              src={product.images[selectedImageIndex] || product.thumbnail || DEFAULT_PRODUCT_IMAGE}
              alt={product.name}
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: isZoomed ? 'scale(2.2)' : 'scale(1)'
              }}
              className="w-full h-full object-cover object-top will-change-transform transition-transform duration-150 ease-out pointer-events-none"
              referrerPolicy="no-referrer"
              onError={(e) =>
                handleImageFallback(
                  e,
                  CATEGORY_FALLBACK_IMAGES[product.categorySlug] ||
                    DEFAULT_PRODUCT_IMAGE
                )
              }
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
              {product.newArrival && (
                <span className="bg-white text-neutral-950 font-black text-xs uppercase tracking-widest px-3 py-1 rounded-md shadow">
                  NEW ARRIVAL
                </span>
              )}
              {product.bestSeller && (
                <span className="bg-neutral-900/90 backdrop-blur-md text-white border border-neutral-700 font-bold text-xs uppercase tracking-widest px-2.5 py-1 rounded-md">
                  BEST SELLER
                </span>
              )}
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="bg-red-600 text-white font-black text-xs tracking-wider px-2.5 py-1 rounded-md shadow">
                  -{product.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Top Right Actions */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="p-2.5 bg-black/60 hover:bg-black text-white rounded-full backdrop-blur-md transition-all shadow"
                title="Full-screen view"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 bg-black/60 hover:bg-black text-white rounded-full backdrop-blur-md transition-all shadow"
                title="Share garment"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow ${
                  isFavorited ? 'bg-red-500 text-white' : 'bg-black/60 hover:bg-black text-white'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Hover to Zoom Helper Badge */}
            <div
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-10 transition-all duration-300 ${
                isZoomed ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-neutral-700 text-neutral-200 text-[11px] font-mono shadow-lg">
                <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Hover to inspect fabric texture</span>
              </div>
            </div>

            {/* Active Zoom Badge indicator */}
            {isZoomed && (
              <div className="absolute bottom-4 right-4 pointer-events-none z-10 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-950/90 border border-amber-500/50 text-amber-300 font-mono text-[10px] font-bold tracking-wider shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>2.2× TEXTURE ZOOM</span>
                </div>
              </div>
            )}

            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center pointer-events-none">
                <span className="px-5 py-2.5 bg-neutral-900 border border-neutral-700 text-white font-bold text-sm uppercase tracking-widest rounded-xl">
                  Currently Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 sm:w-24 aspect-[3/4] rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-white shadow-lg scale-95'
                      : 'border-neutral-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumb ${idx + 1}`}
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                    onError={(e) =>
                      handleImageFallback(
                        e,
                        CATEGORY_FALLBACK_IMAGES[product.categorySlug] || DEFAULT_PRODUCT_IMAGE
                      )
                    }
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions (5 Cols on LG) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Title */}
          <div className="space-y-2 border-b border-neutral-800 pb-5">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono uppercase tracking-widest">
              <span>{product.category}</span>
              <span>SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-wide uppercase leading-tight">
              {product.name}
            </h1>

            {/* Ratings summary */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-amber-400 font-mono text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold">{product.rating}</span>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                ({reviews.length} verified customer {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-3xl font-black text-white">
                {settings.currencySymbol}
                {displayPrice.toLocaleString()}
              </span>
              {product.salePrice && product.price > product.salePrice && (
                <span className="font-mono text-lg text-neutral-400 line-through">
                  {settings.currencySymbol}
                  {product.price.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              <span>Includes Free Home Delivery across Bangladesh</span>
            </p>
          </div>

          {/* Short Description */}
          <p className="text-sm text-neutral-300 leading-relaxed font-light">
            {product.shortDescription || product.description}
          </p>

          {/* Color Selection */}
          <div className="space-y-2.5 pt-2 border-t border-neutral-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white uppercase tracking-wider">
                Color: <span className="font-normal text-neutral-300">{selectedColor}</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-white text-neutral-950 border-white font-bold shadow'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500'
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selection & Size Guide */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white uppercase tracking-wider">
                Select Size: <span className="font-mono text-neutral-300">{selectedSize}</span>
              </span>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="text-neutral-300 hover:text-white flex items-center gap-1 underline text-xs font-mono font-medium"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((sz) => {
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    onClick={() => handleSelectSize(sz)}
                    className={`min-w-[48px] h-11 px-3 rounded-xl font-mono text-xs font-bold uppercase border transition-all flex items-center justify-center ${
                      isSelected
                        ? 'bg-white text-neutral-950 border-white shadow-md'
                        : 'bg-neutral-900 text-neutral-200 border-neutral-700 hover:border-neutral-500'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>

            {/* Low stock notice */}
            {currentVariantStock > 0 && currentVariantStock <= 5 && (
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Low Stock: Only {currentVariantStock} remaining in size {selectedSize}</span>
              </div>
            )}
          </div>

          {/* Quantity & Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-neutral-800">
            <div className="flex items-center gap-4">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-neutral-700 rounded-xl bg-neutral-900 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-neutral-400 hover:text-white transition-colors disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-mono text-sm font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentVariantStock || 10, quantity + 1))}
                  className="p-2 text-neutral-400 hover:text-white transition-colors disabled:opacity-30"
                  disabled={quantity >= currentVariantStock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl border border-neutral-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
            </div>

            {/* Instant Buy Now Button */}
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-4 px-6 bg-white hover:bg-neutral-200 text-neutral-950 font-extrabold text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-center"
            >
              Buy Now (Instant Checkout)
            </button>

            {/* AI Stylist Prompt for this specific garment */}
            {onOpenAiStylist && (
              <button
                type="button"
                onClick={() => onOpenAiStylist(product)}
                className="w-full py-3 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Ask AI Stylist How to Style This Fit</span>
              </button>
            )}
          </div>

          {/* Delivery & Trust Guarantee Badges */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3 text-xs text-neutral-300">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Free Home Delivery Across Bangladesh</p>
                <p className="text-[11px] text-neutral-400">Dhaka: 24–48 hours | Outside Dhaka: 2–4 business days</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">bKash, Nagad & Cash on Delivery</p>
                <p className="text-[11px] text-neutral-400">Inspect the garment upon delivery before payment</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <RefreshCw className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">7-Day Fit Guarantee & Exchanges</p>
                <p className="text-[11px] text-neutral-400">Easy size exchange if fit is not 100% satisfactory</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details, Fabric Specifications & Reviews Tabs */}
      <div className="border-t border-neutral-800 pt-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Garment Specifications */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
              Fabric & Tailoring Specifications
            </h3>
            <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 space-y-4 text-xs">
              <div className="flex justify-between py-2 border-b border-neutral-800">
                <span className="text-neutral-400">Material / Composition</span>
                <span className="text-white font-medium">{product.material}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-800">
                <span className="text-neutral-400">Silhouette / Cut</span>
                <span className="text-white font-medium">{product.subcategory || 'Contemporary Fit'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-800">
                <span className="text-neutral-400">Origin / Studio</span>
                <span className="text-white font-medium">Dhaka, Bangladesh</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-400">Care Instructions</span>
                <span className="text-white font-medium">Machine wash cold, air dry in shade</span>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
              Design Distinctions
            </h3>
            <ul className="space-y-3 text-xs text-neutral-300">
              {product.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-neutral-900/40 p-3 rounded-xl border border-neutral-800/80">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="border-t border-neutral-800 pt-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-white uppercase tracking-wider">
                Customer Reviews ({reviews.length})
              </h3>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Rated {product.rating} / 5.0 based on verified Dhaka purchases
              </p>
            </div>
            <button
              onClick={() => setReviewFormOpen(!reviewFormOpen)}
              className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-neutral-700 transition-colors"
            >
              Write a Review
            </button>
          </div>

          {/* Write Review Form */}
          {reviewFormOpen && (
            <form onSubmit={handleSubmitReview} className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-4 max-w-xl">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Submit Garment Feedback</h4>
              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Kaizer Ahmed"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400' : 'text-neutral-600'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-white ml-2">{reviewRating} / 5</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Your Experience / Fit Feedback</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details regarding the fabric feel, shoulder taper, or sizing..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-2.5 bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFormOpen(false)}
                  className="px-4 py-2.5 bg-neutral-800 text-neutral-400 hover:text-white text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">No reviews yet. Be the first to review this garment!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-neutral-900/50 p-5 rounded-xl border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{rev.customerName}</span>
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800 font-mono">
                          Verified Fit
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">{rev.comment}</p>
                  <p className="text-[10px] text-neutral-500 font-mono">
                    {new Date(rev.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-neutral-800 pt-12 space-y-6">
            <h3 className="font-serif text-xl font-bold text-white uppercase tracking-wider">
              Pair With & Related Menswear
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        category={product.category}
      />

      {/* Fullscreen High-Resolution Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                Fabric Inspection • {selectedImageIndex + 1} of {product.images.length || 1}
              </span>
              <span className="text-white font-serif font-bold text-sm hidden sm:inline">{product.name}</span>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-3 bg-neutral-800/80 hover:bg-neutral-700 text-white rounded-full transition-colors cursor-pointer"
              title="Close inspection"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Center Image */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
            <img
              src={product.images[selectedImageIndex] || product.thumbnail || DEFAULT_PRODUCT_IMAGE}
              alt={product.name}
              className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
              referrerPolicy="no-referrer"
              onError={(e) =>
                handleImageFallback(
                  e,
                  CATEGORY_FALLBACK_IMAGES[product.categorySlug] || DEFAULT_PRODUCT_IMAGE
                )
              }
            />
          </div>

          {/* Lightbox Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-14 sm:w-16 aspect-[3/4] rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-white scale-105 shadow'
                      : 'border-neutral-700 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumb ${idx + 1}`}
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
