import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { Home, Compass, Search, Heart, ShoppingBag, ChevronUp } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSearch?: () => void;
  onOpenCart?: () => void;
}

export function MobileBottomNav({ currentView, onNavigate, onOpenSearch, onOpenCart }: MobileBottomNavProps) {
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const [isDismissed, setIsDismissed] = useState(false);

  const handleCartClick = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      setIsCartOpen(true);
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If dragged downward past threshold or fast flick down
    if (info.offset.y > 30 || info.velocity.y > 200) {
      setIsDismissed(true);
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <AnimatePresence mode="wait">
        {!isDismissed ? (
          <motion.div
            key="full-nav"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 80 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="pointer-events-auto bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 px-2 pt-1.5 pb-2 shadow-2xl safe-area-pb touch-pan-y"
          >
            {/* Grab / Swipe-to-dismiss handle */}
            <div className="flex flex-col items-center justify-center pb-1 -mt-0.5 group cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 bg-neutral-700/80 rounded-full group-hover:bg-neutral-500 transition-colors" />
              <span className="text-[9px] font-mono text-neutral-500 tracking-tighter opacity-75">
                Swipe down to hide
              </span>
            </div>

            <div className="flex items-center justify-around">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] tracking-wider uppercase font-medium transition-colors ${
                  currentView === 'home' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('shop')}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] tracking-wider uppercase font-medium transition-colors ${
                  currentView === 'shop' || currentView === 'categories' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Compass className="w-5 h-5" />
                <span>Shop</span>
              </button>

              <button
                type="button"
                onClick={onOpenSearch}
                className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] tracking-wider uppercase font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('wishlist')}
                className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] tracking-wider uppercase font-medium transition-colors ${
                  currentView === 'wishlist' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <div className="relative">
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-2 bg-white text-neutral-950 text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <span>Wishlist</span>
              </button>

              <button
                type="button"
                onClick={handleCartClick}
                className="relative flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] tracking-wider uppercase font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-2 bg-white text-neutral-950 text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="minimized-pill"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="pointer-events-auto flex justify-center pb-3"
          >
            <button
              type="button"
              onClick={() => setIsDismissed(false)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900/95 border border-neutral-700/80 rounded-full shadow-2xl backdrop-blur-md text-neutral-200 text-xs font-mono tracking-wide hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95"
            >
              <ChevronUp className="w-3.5 h-3.5 text-white animate-bounce" />
              <span>Show Navigation</span>
              {(totalItems > 0 || wishlist.length > 0) && (
                <span className="w-2 h-2 rounded-full bg-white ml-0.5" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

