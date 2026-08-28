import React from 'react';
import { RefreshCw, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface PolicyPageProps {
  type: 'returns' | 'privacy' | 'terms';
  onNavigate: (view: string) => void;
}

export function PolicyPages({ type, onNavigate }: PolicyPageProps) {
  if (type === 'returns') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-neutral-300">
        <div className="border-b border-neutral-800 pb-4 space-y-1">
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Customer Guarantee</span>
          <h1 className="font-serif text-3xl font-extrabold text-white uppercase tracking-wider">
            7-Day Return & Fit Exchange Policy
          </h1>
        </div>

        <div className="bg-neutral-900/60 p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-6 text-xs sm:text-sm leading-relaxed font-light">
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <p>
              We want you to wear your FCF 2.0 garments with absolute distinction. If the size or fit isn't right, you may request an exchange within <strong>7 calendar days</strong> of receiving your delivery.
            </p>
          </div>

          <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
            1. Conditions for Fit Exchange
          </h3>
          <ul className="space-y-2 list-disc list-inside text-neutral-400">
            <li>Garments must be unworn, unwashed, and in original condition.</li>
            <li>Original tags and packaging must remain intact.</li>
            <li>Exchange is applicable for size replacement or any manufacturing defect.</li>
          </ul>

          <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
            2. How to Initiate an Exchange
          </h3>
          <p className="text-neutral-400">
            Simply send a WhatsApp message to our Dhaka studio at <strong>01843667400</strong> with your Order Number and desired replacement size. Our team will arrange a doorstep replacement courier.
          </p>

          <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
            3. Exchange Courier Charges
          </h3>
          <p className="text-neutral-400">
            If there is a defect or shipping mistake on our end, the replacement is 100% free. For standard size changes, a nominal courier exchange charge (৳70 inside Dhaka, ৳130 outside Dhaka) applies for the return ride.
          </p>
        </div>
      </div>
    );
  }

  if (type === 'privacy') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-neutral-300">
        <div className="border-b border-neutral-800 pb-4 space-y-1">
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Trust & Security</span>
          <h1 className="font-serif text-3xl font-extrabold text-white uppercase tracking-wider">
            Privacy Policy
          </h1>
        </div>

        <div className="bg-neutral-900/60 p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-6 text-xs sm:text-sm leading-relaxed font-light">
          <p>
            At <strong>Favy Cravy Fits 2.0</strong>, we respect your personal privacy. We only collect the minimal information necessary to fulfill your orders, process your bKash/Nagad transactions, and communicate delivery updates.
          </p>

          <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
            Information We Collect
          </h3>
          <ul className="space-y-2 list-disc list-inside text-neutral-400">
            <li>Contact details: Name, phone number, delivery address, and optional email.</li>
            <li>Payment data: Manual bKash / Nagad sender numbers and transaction IDs solely for verification.</li>
            <li>Order history: Records of garments purchased for size exchange matching.</li>
          </ul>

          <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
            Zero Third-Party Sharing
          </h3>
          <p className="text-neutral-400">
            We never sell, rent, or trade your phone number or personal details to advertisers. Your address and phone are shared only with our trusted Bangladesh courier logistics partners for home delivery.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-neutral-300">
      <div className="border-b border-neutral-800 pb-4 space-y-1">
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Terms of Service</span>
        <h1 className="font-serif text-3xl font-extrabold text-white uppercase tracking-wider">
          Terms & Conditions
        </h1>
      </div>

      <div className="bg-neutral-900/60 p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-6 text-xs sm:text-sm leading-relaxed font-light">
        <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
          1. Order Confirmation & Availability
        </h3>
        <p className="text-neutral-400">
          All orders are subject to stock availability and address verification. In rare instances where a fabric roll is exhausted, our team will promptly contact you for an alternative fit or immediate refund.
        </p>

        <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
          2. Delivery Timelines
        </h3>
        <p className="text-neutral-400">
          Standard delivery within Dhaka Metropolitan area is 24 to 48 hours. Delivery to all other 63 districts is typically 2 to 4 business days.
        </p>

        <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
          3. bKash / Nagad Transaction Verification
        </h3>
        <p className="text-neutral-400">
          For manual bKash or Nagad payments, orders are confirmed once our admin ledger validates the matching TrxID. Orders with invalid TrxIDs will be contacted via WhatsApp/phone before dispatch.
        </p>
      </div>
    </div>
  );
}
