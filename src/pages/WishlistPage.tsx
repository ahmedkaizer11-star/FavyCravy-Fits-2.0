import React from 'react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';

interface WishlistPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export function WishlistPage({ onNavigate }: WishlistPageProps) {
  const { wishlist, clearWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-neutral-400 border border-neutral-800">
          <Heart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
            Your Wishlist Is Empty
          </h1>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            Save contemporary silhouettes, heavyweight tees, and selvedge denim to your personal curated wishlist.
          </p>
        </div>
        <button
          onClick={() => onNavigate('shop')}
          className="px-8 py-3.5 bg-white text-neutral-950 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-colors shadow-xl"
        >
          Explore Menswear
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wider">
            Saved Distinctions ({wishlist.length})
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Your personal shortlist of menswear fits
          </p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-xs text-neutral-400 hover:text-red-400 underline font-mono"
        >
          Clear Wishlist
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}
