import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { handleImageFallback, DEFAULT_PRODUCT_IMAGE } from '../utils/imageFallback';

interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate: (view: string) => void;
}

export function CartDrawer({ isOpen, onClose, onNavigate }: CartDrawerProps) {
  const { cart, isCartOpen: contextCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();
  const { settings } = useSettings();

  const isDrawerOpen = isOpen !== undefined ? isOpen : contextCartOpen;
  const handleClose = () => {
    if (onClose) onClose();
    setIsCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              drag="x"
              dragConstraints={{ left: 0, right: 300 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                if (info.offset.x > 80 || info.velocity.x > 300) {
                  handleClose();
                }
              }}
              className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 text-neutral-100 flex flex-col shadow-2xl relative"
            >
              {/* Mobile Drag Indicator Handle */}
              <div className="lg:hidden absolute top-1/2 -left-3 -translate-y-1/2 w-1.5 h-12 bg-neutral-600 rounded-full opacity-60 pointer-events-none" />

              {/* Drawer Header */}
              <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-white" />
                  <h3 className="font-serif tracking-wider text-base font-bold text-white uppercase">
                    Your Cart ({totalItems})
                  </h3>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Delivery Banner */}
              <div className="bg-neutral-950 px-5 py-3 border-b border-neutral-800 flex items-center gap-2.5 text-xs text-neutral-300">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong className="text-white">Free Home Delivery</strong> across all Bangladesh included.
                </span>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-neutral-800/60">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                    <div className="p-5 rounded-full bg-neutral-800/80 text-neutral-400">
                      <ShoppingBag className="w-10 h-10 stroke-[1.2]" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-serif text-base text-white">Your bag is empty</p>
                      <p className="text-xs text-neutral-400 max-w-xs">
                        Explore our contemporary menswear collection and select your fit.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        onNavigate('shop');
                      }}
                      className="px-6 py-2.5 bg-white text-neutral-950 text-xs font-semibold uppercase tracking-widest rounded-lg hover:bg-neutral-200 transition-colors shadow"
                    >
                      Browse Collection
                    </button>
                  </div>
                ) : (
                  cart.map((item) => {
                    const unitPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
                    return (
                      <div key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`} className="pt-4 first:pt-0 flex gap-4">
                        <img
                          src={item.image || DEFAULT_PRODUCT_IMAGE}
                          alt={item.name}
                          className="w-20 h-24 object-cover object-top rounded-lg bg-neutral-800 border border-neutral-800 shrink-0"
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageFallback(e, DEFAULT_PRODUCT_IMAGE)}
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                              <button
                                onClick={() => removeFromCart(item.productId, item.selectedColor, item.selectedSize)}
                                className="text-neutral-400 hover:text-red-400 transition-colors p-1"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                              <span className="bg-neutral-800 px-2 py-0.5 rounded text-[11px] text-neutral-300 font-mono">
                                Size: {item.selectedSize}
                              </span>
                              <span>•</span>
                              <span className="text-[11px] truncate">{item.selectedColor}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-neutral-700/80 rounded-lg bg-neutral-800/60">
                              <button
                                onClick={() =>
                                  updateQuantity(item.productId, item.selectedColor, item.selectedSize, item.quantity - 1)
                                }
                                className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2 text-xs font-mono font-medium text-white">{item.quantity}</span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.productId, item.selectedColor, item.selectedSize, item.quantity + 1)
                                }
                                className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="text-right">
                              <span className="font-mono text-sm font-bold text-white">
                                {settings.currencySymbol}
                                {(unitPrice * item.quantity).toLocaleString()}
                              </span>
                              {item.salePrice && item.price > item.salePrice && (
                                <p className="text-[10px] text-neutral-400 line-through font-mono">
                                  {settings.currencySymbol}
                                  {(item.price * item.quantity).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-neutral-800 bg-neutral-950 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>Subtotal</span>
                      <span className="font-mono text-neutral-200">
                        {settings.currencySymbol}
                        {subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>Nationwide Delivery</span>
                      <span className="text-emerald-400 font-medium">FREE</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-base font-bold text-white">
                      <span>Estimated Total</span>
                      <span className="font-mono text-lg text-white">
                        {settings.currencySymbol}
                        {subtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        onNavigate('checkout');
                      }}
                      className="w-full py-3.5 px-4 bg-white text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-lg group cursor-pointer"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        onNavigate('cart');
                      }}
                      className="w-full py-2.5 px-4 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors text-center"
                    >
                      View Full Bag
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Safe bKash / Nagad / Cash on Delivery Checkout</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
