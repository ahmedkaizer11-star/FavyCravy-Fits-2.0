import React, { useState, useEffect } from 'react';
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  AlertCircle,
  Phone,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { BrandLogo } from '../components/BrandLogo';
import { handleImageFallback, DEFAULT_PRODUCT_IMAGE } from '../utils/imageFallback';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
  onNavigate: (view: string, param?: string) => void;
}

export function OrderTrackingPage({ initialOrderNumber, onNavigate }: OrderTrackingPageProps) {
  const { settings } = useSettings();
  const { showToast } = useToast();

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber || '');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialOrderNumber) {
      setOrderNumber(initialOrderNumber);
      handleTrack(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleTrack = async (searchNum?: string) => {
    const num = searchNum || orderNumber;
    if (!num.trim()) {
      showToast('Please enter your order number', 'error');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.getOrder(num.trim(), phone.trim() || undefined);
      if (res && res.order) {
        setOrder(res.order);
      } else {
        setOrder(null);
      }
    } catch (err: any) {
      setOrder(null);
      showToast(err.message || 'Order not found. Please verify your order number.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'pending', label: 'Order Received' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Tailoring & QC' },
    { key: 'packed', label: 'Packed' },
    { key: 'shipped', label: 'In Transit / Courier' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const s = (currentStatus || '').toLowerCase();
    const orderLevels: Record<string, number> = {
      pending: 0,
      'payment pending': 0,
      'payment verified': 1,
      confirmed: 1,
      processing: 2,
      packed: 3,
      shipped: 4,
      delivered: 5,
      cancelled: -1
    };

    const currentLevel = orderLevels[s] ?? 0;
    const stepLevel = orderLevels[stepKey] ?? 0;

    if (s === 'cancelled') return 'cancelled';
    if (currentLevel > stepLevel) return 'completed';
    if (currentLevel === stepLevel) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Live Fulfillment</span>
        <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-wider">
          Track Your Fit
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
          Enter your Order ID (e.g. FCF-2026-XXXX) to monitor dispatch status and courier tracking.
        </p>
      </div>

      {/* Search Bar Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleTrack();
        }}
        className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 space-y-4 max-w-2xl mx-auto shadow-xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-300">Order Number *</label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. FCF-2026-8492"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase font-mono placeholder-neutral-500 focus:outline-none focus:border-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-300">Phone Number (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-white text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-colors shadow flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>{loading ? 'Searching Record...' : 'Track Order'}</span>
        </button>
      </form>

      {/* Result Display */}
      {order && (
        <div className="bg-neutral-900/80 rounded-2xl border border-neutral-800 p-6 sm:p-8 space-y-8 shadow-2xl animate-in fade-in duration-300">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
            <div>
              <span className="text-[11px] font-mono uppercase text-neutral-400">Order Number</span>
              <h3 className="font-mono text-xl sm:text-2xl font-bold text-white tracking-wider">
                {order.orderNumber}
              </h3>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-mono uppercase">Status:</span>
              <span className="px-3 py-1 bg-white text-neutral-950 font-bold text-xs uppercase font-mono rounded-lg shadow">
                {order.orderStatus || 'Confirmed'}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-sans">
              Delivery Progress
            </h4>

            {(order.orderStatus || '').toLowerCase() === 'cancelled' ? (
              <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>This order was cancelled. Please contact our support team on WhatsApp if you require assistance.</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {steps.map((st) => {
                  const status = getStepStatus(st.key, (order.orderStatus || 'pending').toLowerCase());
                  return (
                    <div
                      key={st.key}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-1.5 transition-all ${
                        status === 'completed'
                          ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-400'
                          : status === 'current'
                          ? 'bg-white text-neutral-950 border-white font-bold shadow-lg'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-500'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-[11px] uppercase tracking-wider font-medium leading-tight">
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Details & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-800 text-xs">
            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase tracking-wider">Recipient & Address</h5>
              <p className="text-white font-medium">{order.customerName}</p>
              <p className="text-neutral-400">{order.phone}</p>
              <p className="text-neutral-300">{order.address}</p>
              <p className="text-neutral-300">{order.thanaArea ? `${order.thanaArea}, ` : ''}{order.district}, Bangladesh</p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase tracking-wider">Payment Breakdown (BDT)</h5>
              <p className="text-neutral-400 uppercase">
                Method: <strong className="text-white">{order.paymentMethod === 'cod' ? 'Cash on Delivery (BDT)' : order.paymentMethod.toUpperCase() + ' BDT Transfer'}</strong> ({order.paymentStatus})
              </p>
              {order.transactionId && (
                <p className="font-mono text-emerald-400">TrxID: {order.transactionId}</p>
              )}
              <p className="text-sm font-mono font-bold text-white pt-1">
                Total: ৳{(order.total || order.subtotal || 0).toLocaleString()} BDT (Free Nationwide Delivery)
              </p>
            </div>
          </div>

          {/* Items Preview */}
          <div className="pt-4 border-t border-neutral-800 space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">Garments Included</h5>
            <div className="divide-y divide-neutral-800/60 text-xs">
              {order.items.map((it, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-neutral-300">
                  <div className="flex items-center gap-3">
                    {it.image && (
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-8 h-10 object-cover rounded bg-neutral-800"
                        referrerPolicy="no-referrer"
                        onError={(e) => handleImageFallback(e, DEFAULT_PRODUCT_IMAGE)}
                      />
                    )}
                    <div>
                      <span className="font-medium text-white">{it.name}</span>
                      <span className="text-[11px] text-neutral-400 font-mono ml-2">
                        ({it.selectedSize} / {it.selectedColor}) x{it.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-white">
                    {settings.currencySymbol}{(it.price * it.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Not found state */}
      {hasSearched && !loading && !order && (
        <div className="text-center py-12 space-y-3 bg-neutral-900/40 rounded-2xl border border-neutral-800 p-8">
          <AlertCircle className="w-10 h-10 text-neutral-500 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-white">No Record Found for "{orderNumber}"</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Please double check your order number or reach out to our WhatsApp hotline for manual dispatch assistance.
          </p>
        </div>
      )}
    </div>
  );
}
