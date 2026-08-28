import React, { useEffect } from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  MessageCircle,
  Printer,
  ArrowRight,
  ShieldCheck,
  Clock,
  Home
} from 'lucide-react';
import { Order } from '../types';
import { useSettings } from '../context/SettingsContext';
import { BrandLogo } from '../components/BrandLogo';
import { handleImageFallback, DEFAULT_PRODUCT_IMAGE } from '../utils/imageFallback';

interface OrderConfirmationPageProps {
  order?: Order | null;
  orderNumber?: string;
  onNavigate: (view: string, param?: string) => void;
}

export function OrderConfirmationPage({ order, orderNumber, onNavigate }: OrderConfirmationPageProps) {
  const { settings } = useSettings();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-white">Order Confirmed</h2>
        <p className="text-xs text-neutral-400">
          Order reference: <strong className="text-white font-mono">{orderNumber || 'Pending'}</strong>
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <button
            onClick={() => onNavigate('track-order', orderNumber)}
            className="px-6 py-3 bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200"
          >
            Track Order
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const cleanPhone = settings.whatsapp.replace(/^0/, '880').replace(/[^0-9]/g, '');
  const whatsappMsg = encodeURIComponent(
    `Hello Favy Cravy Fits 2.0! I just placed Order #${order.orderNumber}. Could you please confirm the dispatch time?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMsg}`;

  const handlePrint = () => {
    window.print();
  };

  const customerPhone = order.phone || '';
  const customerEmail = order.email || '';
  const deliveryAddress = order.address || '';
  const district = order.district || 'Dhaka';
  const thanaArea = order.thanaArea || '';
  const totalVal = order.total || order.subtotal || 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 print:p-0">
      {/* Top Banner with Brand Logo */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <BrandLogo variant="full" size="md" theme="dark" showTagline={false} />
        </div>
        <div className="w-12 h-12 bg-emerald-950 border border-emerald-800 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
            Order Successfully Placed
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wider">
            Distinction In Progress
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto">
            Thank you, <strong className="text-white">{order.customerName}</strong>. We are preparing your order for prompt dispatch.
          </p>
        </div>
      </div>

      {/* Main Order Details Card */}
      <div className="bg-neutral-900/80 rounded-2xl border border-neutral-800 p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Order Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <p className="text-[11px] font-mono uppercase text-neutral-400">Order Number</p>
            <p className="font-mono text-xl sm:text-2xl font-bold text-white tracking-wider">
              {order.orderNumber}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                order.paymentMethod === 'cod'
                  ? 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              {order.paymentMethod === 'cod'
                ? 'Cash on Delivery (Pending Delivery)'
                : 'bKash / Nagad (Verification Pending)'}
            </span>
          </div>
        </div>

        {/* Transaction ID if bKash/Nagad */}
        {order.transactionId && (
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-neutral-400 uppercase">Payment Method:</span>
              <span className="text-white font-bold uppercase">{order.paymentMethod}</span>
            </div>
            {order.senderPhone && (
              <div className="flex justify-between font-mono">
                <span className="text-neutral-400 uppercase">Sender Mobile:</span>
                <span className="text-white">{order.senderPhone}</span>
              </div>
            )}
            <div className="flex justify-between font-mono">
              <span className="text-neutral-400 uppercase">Transaction ID (TrxID):</span>
              <span className="text-emerald-400 font-bold">{order.transactionId}</span>
            </div>
          </div>
        )}

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-neutral-300">
          <div className="space-y-1.5">
            <h4 className="font-bold text-white uppercase tracking-wider font-sans">Customer Info</h4>
            <p><span className="text-neutral-400">Name:</span> {order.customerName}</p>
            <p><span className="text-neutral-400">Phone:</span> {customerPhone}</p>
            {customerEmail && <p><span className="text-neutral-400">Email:</span> {customerEmail}</p>}
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-white uppercase tracking-wider font-sans">Delivery Address</h4>
            <p className="text-white">{deliveryAddress}</p>
            <p>{thanaArea ? `${thanaArea}, ` : ''}{district}</p>
            <p className="text-emerald-400 font-medium">Free Home Delivery Included</p>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="space-y-3 pt-4 border-t border-neutral-800">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs font-sans">
            Garments in Order ({order.items.length})
          </h4>
          <div className="divide-y divide-neutral-800/80">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 object-cover object-top rounded-lg bg-neutral-800 border border-neutral-800 shrink-0"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageFallback(e, DEFAULT_PRODUCT_IMAGE)}
                    />
                  )}
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-[11px] text-neutral-400 font-mono">
                      Size: {item.selectedSize} • Color: {item.selectedColor} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-white">
                  {settings.currencySymbol}
                  {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Totals */}
        <div className="pt-4 border-t border-neutral-800 space-y-2 text-xs">
          <div className="flex justify-between text-neutral-400">
            <span>Subtotal</span>
            <span className="font-mono text-white">
              {settings.currencySymbol}
              {totalVal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Delivery Fee</span>
            <span className="text-emerald-400 font-bold uppercase">FREE</span>
          </div>
          <div className="pt-3 border-t border-neutral-800 flex justify-between items-baseline text-base font-bold text-white">
            <span>Total Paid / Payable</span>
            <span className="font-mono text-2xl text-white">
              {settings.currencySymbol}
              {totalVal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors shadow"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirm on WhatsApp</span>
          </a>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xl border border-neutral-700 flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={() => onNavigate('track-order', order.orderNumber)}
              className="flex-1 sm:flex-none px-5 py-3 bg-white text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-200 flex items-center justify-center gap-2 shadow"
            >
              <span>Track Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
