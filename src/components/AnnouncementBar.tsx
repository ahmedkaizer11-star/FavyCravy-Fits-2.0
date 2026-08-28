import React, { useState } from 'react';
import { Truck, Sparkles, Shield, X, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export function AnnouncementBar() {
  const { settings } = useSettings();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-neutral-900 border-b border-neutral-800 text-neutral-200 text-xs py-2 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto text-center sm:text-left">
          <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-medium tracking-wide">
            <strong className="text-white">FREE HOME DELIVERY</strong> ACROSS ALL 64 BANGLADESH DISTRICTS
          </span>
          <span className="hidden md:inline text-neutral-500">•</span>
          <span className="hidden md:inline text-neutral-400">bKash, Nagad & Cash on Delivery Available</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-neutral-400 hover:text-white p-1 rounded transition-colors hidden sm:block"
          aria-label="Close announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
