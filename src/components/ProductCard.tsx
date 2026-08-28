import React, { useState, useRef } from 'react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { handleImageFallback, DEFAULT_PRODUCT_IMAGE, CATEGORY_FALLBACK_IMAGES } from '../utils/imageFallback';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onNavigate: (view: string, param?: string) => void;
}

export function ProductCard({ product, onNavigate }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { settings } = useSettings();

  const [isHovered, setIsHovered] = useState(false);
  const [quickSizeModal, setQuickSizeModal] = useState(false);

  const primaryImage = (product.images && product.images.length > 0 && product.images[0]) 
    ? product.images[0] 
    : (product.thumbnail || DEFAULT_PRODUCT_IMAGE);

  const isFavorited = isInWishlist(product.id);
  const displayPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const isOutOfStock = product.stock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    if (product.sizes.length > 1) {
      setQuickSizeModal(true);
    } else {
      addToCart(product, product.colors[0] || 'Standard', product.sizes[0] || 'Free Size', 1);
    }
  };

  const confirmQuickSizeAdd = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    addToCart(product, product.colors[0] || 'Standard', size, 1);
    setQuickSizeModal(false);
  };

  return (
    <div
      className="group relative flex flex-col bg-neutral-900/70 rounded-xl overflow-hidden border border-neutral-800/80 hover:border-neutral-700 transition-all duration-300 hover:shadow-xl cursor-pointer touch-manipulation active:scale-[0.99]"
      onClick={() => onNavigate('product', product.slug || product.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setQuickSizeModal(false);
      }}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
        <img
          src={primaryImage}
          alt={product.name}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) =>
            handleImageFallback(
              e,
              CATEGORY_FALLBACK_IMAGES[product.categorySlug] || DEFAULT_PRODUCT_IMAGE
            )
          }
        />

        {/* Gallery count indicator if product has multiple gallery photos */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/75 backdrop-blur-xs rounded text-[9px] sm:text-[10px] font-mono text-neutral-300 border border-neutral-700 pointer-events-none">
            +{product.images.length}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-10">
          {product.newArrival && (
            <span className="bg-white text-neutral-950 font-black text-[9px] sm:text-[10px] uppercase tracking-widest px-2 py-0.5 sm:px-2.5 sm:py-1 rounded shadow-sm">
              NEW
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-neutral-900/90 backdrop-blur-xs text-white border border-neutral-700 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest px-1.5 py-0.5 sm:px-2 rounded">
              BESTSELLER
            </span>
          )}
          {product.discountPercentage && product.discountPercentage > 0 && (
            <span className="bg-red-600 text-white font-black text-[9px] sm:text-[10px] tracking-wider px-1.5 py-0.5 sm:px-2 rounded shadow-sm">
              -{product.discountPercentage}%
            </span>
          )}
        </div>

        {/* Wishlist Button with 36px+ Touch Target */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 min-w-[32px] min-h-[32px] rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-90 z-10 cursor-pointer ${
            isFavorited
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-black/50 hover:bg-black/80 text-white'
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-neutral-900 border border-neutral-700 text-neutral-300 font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick Add Overlay on Desktop Hover */}
        {!isOutOfStock && (
          <div className="hidden lg:flex absolute inset-x-3 bottom-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col gap-1.5">
            {quickSizeModal ? (
              <div className="bg-neutral-950/95 backdrop-blur-md p-2.5 rounded-xl border border-neutral-700 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider text-center mb-1.5">
                  Select Size to Add:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={(e) => confirmQuickSizeAdd(e, sz)}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-white hover:text-neutral-950 text-white font-mono text-xs font-bold rounded border border-neutral-700 transition-colors cursor-pointer"
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleQuickAdd}
                className="w-full py-2.5 px-3 bg-white/95 hover:bg-white text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg backdrop-blur-xs flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-2">
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-400 font-medium uppercase tracking-wider mb-0.5 sm:mb-1">
            <span className="truncate max-w-[70%]">{product.category}</span>
            {product.rating > 0 && (
              <div className="flex items-center gap-0.5 sm:gap-1 text-amber-400 font-mono shrink-0">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                {product.reviewCount > 0 && (
                  <span className="text-neutral-400 text-[9px] sm:text-[10px]">({product.reviewCount})</span>
                )}
              </div>
            )}
          </div>

          <h3 className="font-medium text-xs sm:text-sm text-neutral-100 group-hover:text-white line-clamp-1 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Sizes preview */}
        <div className="flex items-center gap-1 flex-wrap">
          {product.sizes.slice(0, 4).map((size) => (
            <span
              key={size}
              className="text-[9px] sm:text-[10px] font-mono px-1 py-0.5 rounded bg-neutral-800/80 text-neutral-400 border border-neutral-800"
            >
              {size}
            </span>
          ))}
          {product.sizes.length > 4 && (
            <span className="text-[9px] sm:text-[10px] font-mono text-neutral-500">+{product.sizes.length - 4}</span>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between pt-1 sm:pt-1.5 border-t border-neutral-800/80 mt-auto">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="font-mono text-xs sm:text-base font-bold text-white">
              {settings.currencySymbol}
              {displayPrice.toLocaleString()}
            </span>
            {product.salePrice && product.price > product.salePrice && (
              <span className="font-mono text-[10px] sm:text-xs text-neutral-400 line-through">
                {settings.currencySymbol}
                {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Mobile Direct View Details Button with 36px+ Touch Target */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('product', product.slug || product.id);
            }}
            className="lg:hidden min-w-[36px] min-h-[36px] p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 active:bg-white active:text-neutral-950 text-neutral-200 flex items-center justify-center transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
