import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Copy,
  Check,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { useUserAuth } from '../context/UserAuthContext';
import { api } from '../services/api';
import { BANGLADESH_DISTRICTS } from '../types';
import { handleImageFallback, DEFAULT_PRODUCT_IMAGE } from '../utils/imageFallback';

interface CheckoutPageProps {
  onNavigate: (view: string, param?: string) => void;
  onOrderPlaced: (order: any) => void;
}

export function CheckoutPage({ onNavigate, onOrderPlaced }: CheckoutPageProps) {
  const { cart, subtotal, clearCart, totalItems } = useCart();
  const { settings } = useSettings();
  const { showToast } = useToast();
  const { currentUser, customerProfile, saveOrderToFirestore } = useUserAuth();

  // Form State initialized with logged in Firebase Customer profile if available
  const [customerName, setCustomerName] = useState(customerProfile?.displayName || currentUser?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState(customerProfile?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(customerProfile?.email || currentUser?.email || '');
  const [streetAddress, setStreetAddress] = useState(customerProfile?.deliveryAddress || '');
  const [district, setDistrict] = useState(customerProfile?.district || 'Dhaka');
  const [thana, setThana] = useState(customerProfile?.thanaArea || '');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'cod'>('cod');
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-sm text-neutral-400">Add garments to your shopping bag to proceed with checkout.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-3 bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200"
        >
          Browse Collection
        </button>
      </div>
    );
  }

  const finalTotal = subtotal;

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    showToast('Payment number copied to clipboard', 'info');
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!customerName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }

    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11) {
      showToast('Please enter a valid 11-digit Bangladesh phone number', 'error');
      return;
    }

    if (!streetAddress.trim()) {
      showToast('Please enter your detailed delivery address', 'error');
      return;
    }

    if (paymentMethod === 'bkash' || paymentMethod === 'nagad') {
      if (!senderPhone.trim()) {
        showToast(`Please enter the ${paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} sender number`, 'error');
        return;
      }
      if (!transactionId.trim()) {
        showToast('Please enter the Transaction ID (TrxID)', 'error');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: customerName.trim(),
        phone: customerPhone.trim(),
        email: customerEmail.trim() || undefined,
        address: streetAddress.trim(),
        district,
        thanaArea: thana.trim() || district,
        postalCode: postalCode.trim() || undefined,
        customerNotes: notes.trim() || undefined,
        items: cart.map((item) => ({
          productId: item.productId,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          quantity: item.quantity
        })),
        paymentMethod,
        transactionId: transactionId.trim() || undefined,
        senderPhone: senderPhone.trim() || undefined
      };

      const res = await api.createOrder(orderPayload);
      if (res && res.order) {
        // Save order backup to Firestore for customer tracking
        await saveOrderToFirestore(res.order);
        clearCart();
        onOrderPlaced(res.order);
        onNavigate('order-confirmation', res.order.orderNumber);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Checkout Title */}
      <div className="border-b border-neutral-800 pb-4 space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wider">
          Distinction Checkout
        </h1>
        <p className="text-xs text-neutral-400 font-mono">
          Free Delivery to all 64 Bangladesh districts • bKash / Nagad / Cash on Delivery
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Shipping & Payment Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Customer & Shipping Details */}
          <div className="bg-neutral-900/60 p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-5 shadow-xl">
            <div className="flex items-center gap-2.5 border-b border-neutral-800 pb-3">
              <span className="w-6 h-6 rounded-full bg-white text-neutral-950 font-mono font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                Shipping Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Kaizer Ahmed"
                  className="w-full bg-neutral-800/90 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Mobile Number (Bangladesh) <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 017XXXXXXXX or 018XXXXXXXX"
                  className="w-full bg-neutral-800/90 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. kaizer@example.com"
                  className="w-full bg-neutral-800/90 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Detailed Street Address / House / Road / Area <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="House #, Road #, Sector/Block, Landmark"
                  className="w-full bg-neutral-800/90 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  District <span className="text-red-400">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Thana / Upazila / Police Station
                </label>
                <input
                  type="text"
                  value={thana}
                  onChange={(e) => setThana(e.target.value)}
                  placeholder="e.g. Banani, Gulshan, Uttara"
                  className="w-full bg-neutral-800/90 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Special Delivery Instructions / Fit Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any gate instructions or preferred delivery times..."
                  className="w-full bg-neutral-800/90 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method Selection */}
          <div className="bg-neutral-900/60 p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-5 shadow-xl">
            <div className="flex items-center gap-2.5 border-b border-neutral-800 pb-3">
              <span className="w-6 h-6 rounded-full bg-white text-neutral-950 font-mono font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                Select Payment Method
              </h2>
            </div>

            {/* Payment Method Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-neutral-800 border-white shadow-lg ring-1 ring-white/20'
                    : 'bg-neutral-900/90 border-neutral-700/80 hover:border-neutral-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-mono font-bold uppercase bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded">
                    BDT • Cash on Delivery
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-white">Cash on Delivery (BDT)</h4>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Pay <strong>৳{finalTotal.toLocaleString()} BDT</strong> in cash upon doorstep delivery
                </p>
              </div>

              {/* bKash */}
              <div
                onClick={() => setPaymentMethod('bkash')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'bkash'
                    ? 'bg-neutral-800 border-pink-500 shadow-lg ring-1 ring-pink-500/30'
                    : 'bg-neutral-900/90 border-neutral-700/80 hover:border-neutral-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-3 h-3 rounded-full bg-pink-500" />
                  <span className="text-[10px] font-mono font-bold uppercase bg-pink-950 text-pink-300 px-2 py-0.5 rounded">
                    bKash BDT
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-white">bKash Transfer (BDT)</h4>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Send <strong>৳{finalTotal.toLocaleString()} BDT</strong> via bKash Personal App/*247#
                </p>
              </div>

              {/* Nagad */}
              <div
                onClick={() => setPaymentMethod('nagad')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'nagad'
                    ? 'bg-neutral-800 border-orange-500 shadow-lg ring-1 ring-orange-500/30'
                    : 'bg-neutral-900/90 border-neutral-700/80 hover:border-neutral-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-[10px] font-mono font-bold uppercase bg-orange-950 text-orange-300 px-2 py-0.5 rounded">
                    Nagad BDT
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-white">Nagad Transfer (BDT)</h4>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Send <strong>৳{finalTotal.toLocaleString()} BDT</strong> via Nagad Personal App/*167#
                </p>
              </div>
            </div>

            {/* bKash / Nagad Detailed Instructions Box */}
            {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
              <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-700/80 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${paymentMethod === 'bkash' ? 'bg-pink-500' : 'bg-orange-500'}`} />
                    {paymentMethod === 'bkash' ? 'bKash Personal Send Money (BDT ৳)' : 'Nagad Personal Send Money (BDT ৳)'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyNumber(paymentMethod === 'bkash' ? settings.bkashNumber : settings.nagadNumber)
                    }
                    className="flex items-center gap-1 text-[11px] font-mono text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 rounded transition-colors"
                  >
                    {copiedNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Number</span>
                  </button>
                </div>

                <div className="bg-neutral-900 p-3.5 rounded-lg border border-neutral-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-mono text-neutral-400">
                      Target {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Number
                    </p>
                    <p className="font-mono text-base font-bold text-white tracking-widest">
                      {paymentMethod === 'bkash' ? settings.bkashNumber : settings.nagadNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-mono text-neutral-400">Total Payable in BDT</p>
                    <p className="font-mono text-base font-bold text-white">
                      ৳ {finalTotal.toLocaleString()} <span className="text-xs font-sans text-neutral-400 font-normal">BDT</span>
                    </p>
                  </div>
                </div>

                <ol className="text-xs text-neutral-300 space-y-1.5 list-decimal list-inside font-light">
                  <li>Open your <strong>{paymentMethod === 'bkash' ? 'bKash App' : 'Nagad App'}</strong> or dial {paymentMethod === 'bkash' ? '*247#' : '*167#'}.</li>
                  <li>Select <strong>Send Money</strong> and enter the recipient mobile number above.</li>
                  <li>Enter exact BDT amount: <strong className="text-white">৳{finalTotal.toLocaleString()} BDT</strong>.</li>
                  <li>After transaction completion, enter your sender number and <strong>TrxID</strong> below:</li>
                </ol>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-300">
                      Your {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Sender Mobile # <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="e.g. 017XXXXXXXX"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-300">
                      Transaction ID (TrxID) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. 9J8X7Y12"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-xs text-white font-mono uppercase placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-start gap-3 text-xs text-neutral-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  You will pay exactly <strong className="text-white">৳{finalTotal.toLocaleString()} BDT</strong> in cash directly to our delivery courier upon inspecting your package at your doorstep anywhere in Bangladesh. Zero advance charge required.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 space-y-5 shadow-xl sticky top-24">
            <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
              Order Review ({totalItems} Items)
            </h3>

            {/* Items list */}
            <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-neutral-800/80 pr-1">
              {cart.map((item) => {
                const unitPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
                return (
                  <div key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image || DEFAULT_PRODUCT_IMAGE}
                        alt={item.name}
                        className="w-12 h-14 object-cover object-top rounded-lg bg-neutral-800 shrink-0 border border-neutral-800"
                        referrerPolicy="no-referrer"
                        onError={(e) => handleImageFallback(e, DEFAULT_PRODUCT_IMAGE)}
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                        <p className="text-[10px] text-neutral-400 font-mono">
                          {item.selectedSize} / {item.selectedColor} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-white shrink-0">
                      {settings.currencySymbol}
                      {(unitPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="font-mono text-white">
                  ৳ {subtotal.toLocaleString()} BDT
                </span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Nationwide Home Delivery</span>
                <span className="text-emerald-400 font-bold uppercase">FREE (৳ 0 BDT)</span>
              </div>
              <div className="pt-3 border-t border-neutral-800 flex justify-between items-baseline text-base font-bold text-white">
                <span>Total Payable</span>
                <div className="text-right">
                  <span className="font-mono text-2xl text-white">
                    ৳ {finalTotal.toLocaleString()}
                  </span>
                  <span className="text-xs font-mono font-normal text-neutral-400 ml-1">BDT</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-white hover:bg-neutral-200 text-neutral-950 font-extrabold text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-2xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Placing Distinction Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order (৳ {finalTotal.toLocaleString()} BDT)</span>
                </>
              )}
            </button>

            <div className="space-y-2 pt-2 text-[11px] text-neutral-400">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Fast Dhaka Delivery (24-48 hrs) | Outside Dhaka (2-4 days)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>7-Day Easy Exchange Policy Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
