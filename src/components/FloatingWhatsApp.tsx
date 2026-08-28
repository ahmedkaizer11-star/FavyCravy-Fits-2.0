import React, { useState } from 'react';
import { MessageCircle, Phone, X, ArrowUpRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export function FloatingWhatsApp() {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  const phoneFormatted = settings.whatsapp || '01843667400';
  // Bangladesh international code prefix format for WhatsApp web/app
  const cleanPhone = phoneFormatted.replace(/^0/, '880').replace(/[^0-9]/g, '');

  const whatsappMessage = encodeURIComponent(
    'Hello Favy Cravy Fits 2.0! I would like to inquire about menswear fits, sizes, and order delivery.'
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-6 z-40">
      {isOpen ? (
        <div className="bg-neutral-900 border border-neutral-800 text-white rounded-2xl p-4 shadow-2xl w-72 space-y-3 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider">Studio Support Live</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            Need fit advice, size confirmation, bKash verification, or order updates? Chat directly with us!
          </p>

          <div className="space-y-2 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-between transition-colors shadow"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              href={`tel:${settings.phone}`}
              className="w-full py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-neutral-400" />
              <span>Call: {settings.phone}</span>
            </a>
          </div>
        </div>
      ) : null}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-neutral-900 hover:bg-neutral-800 text-white p-3.5 sm:px-4 sm:py-3 rounded-full border border-neutral-700/80 shadow-2xl transition-all hover:scale-105 group"
        title="Direct Support"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 text-emerald-400" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
        </div>
        <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider font-sans">
          Inquire / Chat
        </span>
      </button>
    </div>
  );
}
