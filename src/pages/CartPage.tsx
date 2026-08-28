import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, Truck, ShieldCheck, ArrowLeft, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { handleImageFallback, DEFAULT_PRODUCT_IMAGE } from '../utils/imageFallback';

interface CartPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export function CartPage({ onNavigate }: CartPageProps) {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, totalItems } = useCart();
  const { settings } = useSettings();
  const { showToast } = useToast();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    if (promoCode.trim().toUpperCase() === 'FAVY10') {
      const discount = Math.round(subtotal * 0.1);
      setPromoDiscount(discount);
      setPromoApplied(true);
      showToast('10% Distinction promo applied!', 'success');
    } else {
      showToast('Invalid promo code. Try "FAVY10"', 'error');
    }
  };

  const finalTotal = Math.max(0, subtotal - promoDiscount);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-neutral-400 border border-neutral-800">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
            Your Shopping Bag Is Empty
          </h1>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            Discover tailored oxfords, heavyweight luxury tees, and selvedge denim built for the modern Bangladeshi man.
          </p>
        </div>
        <button
          onClick={() => onNavigate('shop')}
          className="px-8 py-3.5 bg-white text-neutral-950 text-xs font-extrabold uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-colors shadow-xl"
        >
          Explore Menswear Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wider">
            Shopping Bag ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Review your selected fits before secure checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-neutral-400 hover:text-red-400 transition-colors underline font-mono"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 divide-y divide-neutral-800/70 overflow-hidden">
            {cart.map((item) => {
              const unitPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
              return (
                <div
                  key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.image || DEFAULT_PRODUCT_IMAGE}
                      alt={item.name}
                      className="w-20 h-24 sm:w-24 sm:h-28 object-cover object-top rounded-xl bg-neutral-800 border border-neutral-800 shrink-0 cursor-pointer"
                      onClick={() => onNavigate('product', item.productId)}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageFallback(e, DEFAULT_PRODUCT_IMAGE)}
                    />
                    <div className="min-w-0 space-y-1">
                      <h3
                        onClick={() => onNavigate('product', item.productId)}
                        className="font-serif text-sm sm:text-base font-bold text-white hover:underline cursor-pointer truncate"
                      >
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                        <span className="bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">
                          Size: {item.selectedSize}
                        </span>
                        <span>•</span>
                        <span>Color: {item.selectedColor}</span>
                      </div>
                      <p className="font-mono text-xs text-neutral-400">
                        Unit: {settings.currencySymbol}
                        {unitPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Total in item */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                    {/* Stepper */}
                    <div className="flex items-center border border-neutral-700 rounded-xl bg-neutral-800">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.selectedColor, item.selectedSize, item.quantity - 1)
                        }
                        className="p-2 text-neutral-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-mono text-xs font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.selectedColor, item.selectedSize, item.quantity + 1)
                        }
                        className="p-2 text-neutral-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <span className="font-mono text-sm sm:text-base font-bold text-white">
                        {settings.currencySymbol}
                        {(unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId, item.selectedColor, item.selectedSize)}
                      className="p-2 text-neutral-400 hover:text-red-400 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-5">
            <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
              Order Summary
            </h3>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="text-xs text-neutral-400">Coupon / Promo Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="e.g. FAVY10"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase rounded-xl border border-neutral-700"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>Promo code applied (-10%)</span>
                </p>
              )}
            </form>

            <div className="space-y-3 pt-3 border-t border-neutral-800 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="font-mono text-neutral-200">
                  {settings.currencySymbol}
                  {subtotal.toLocaleString()}
                </span>
              </div>

              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-mono">
                  <span>Coupon Discount</span>
                  <span>
                    -{settings.currencySymbol}
                    {promoDiscount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-neutral-400">
                <span>Nationwide Home Delivery</span>
                <span className="text-emerald-400 font-bold uppercase">FREE (৳0)</span>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-between items-baseline text-base font-bold text-white">
                <span>Total Amount</span>
                <span className="font-mono text-xl text-white">
                  {settings.currencySymbol}
                  {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('checkout')}
              className="w-full py-4 bg-white hover:bg-neutral-200 text-neutral-950 font-extrabold text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="space-y-2 pt-2 border-t border-neutral-800 text-[11px] text-neutral-400">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Delivery Charges across 64 districts</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>bKash, Nagad & Cash on Delivery Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
