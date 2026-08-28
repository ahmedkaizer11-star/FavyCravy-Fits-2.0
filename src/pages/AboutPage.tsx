import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Truck, Target } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4">
        <span className="text-xs font-mono tracking-[0.3em] text-neutral-400 uppercase">Our Heritage & Mandate</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-wider leading-tight">
          Modern. Minimal. Magnetic.
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 font-light max-w-2xl mx-auto leading-relaxed">
          Favy Cravy Fits 2.0 is an independent contemporary menswear studio established in Dhaka, Bangladesh. We build high-caliber everyday clothing defined by architectural lines, long-staple cottons, and quiet confidence.
        </p>
      </div>

      {/* Story Narrative */}
      <div className="bg-neutral-900/60 p-8 sm:p-10 rounded-2xl border border-neutral-800 space-y-6 text-sm text-neutral-300 leading-relaxed font-light">
        <h2 className="font-serif text-xl font-bold text-white uppercase tracking-wider">
          The Origin of Distinction
        </h2>
        <p>
          In a fast-fashion market inundated with disposable garments, synthetic blends, and oversized logos, Favy Cravy Fits 2.0 was founded to restore distinction to men’s wardrobe essentials. We engineer garments designed to be worn across seasons—pieces that retain their structure, weight, and collar sharpness after dozens of washes.
        </p>
        <p>
          Every silhouette in our collection is precision-patterned for Bangladeshi ergonomics. We focus relentlessly on shoulder drop, chest comfort, and clean drape without excess billow.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-neutral-800 text-center font-mono">
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800">
            <span className="text-2xl font-black text-white">100%</span>
            <p className="text-xs text-neutral-400 mt-1">Long-Staple Cotton</p>
          </div>
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800">
            <span className="text-2xl font-black text-white">64</span>
            <p className="text-xs text-neutral-400 mt-1">Districts Free Delivery</p>
          </div>
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800">
            <span className="text-2xl font-black text-white">7 Days</span>
            <p className="text-xs text-neutral-400 mt-1">Hassle-Free Exchange</p>
          </div>
        </div>
      </div>

      {/* Brand Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
            Material Honesty
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            We disclose exact GSM counts (240+ GSM on tees, 13.5 oz on selvedge denim, 80s two-ply yarn on oxfords) so you know the physical substance of what you wear.
          </p>
        </div>

        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-white">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
            Distinction in Everyday Wear
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Our clothing is made for work, coffee meetings, evening dinners, and weekend travel—effortless elegance that needs no justification.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center space-y-4 pt-4">
        <h3 className="font-serif text-2xl font-bold text-white uppercase">
          Wear Distinction | Own the Moment
        </h3>
        <button
          onClick={() => onNavigate('shop')}
          className="px-8 py-3.5 bg-white text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-colors shadow-xl inline-flex items-center gap-2"
        >
          <span>Explore Current Drop</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
