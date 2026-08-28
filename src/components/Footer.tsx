import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones, ArrowRight, Instagram, Facebook } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenSizeGuide?: () => void;
}

export function Footer({ onNavigate, onOpenSizeGuide }: FooterProps) {
  const { settings } = useSettings();

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-800">
      {/* Brand Value Pillars */}
      <div className="border-b border-neutral-800/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-white">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase">Free Home Delivery</h4>
            <p className="text-xs text-neutral-400 max-w-xs">Zero delivery fees across all 64 districts in Bangladesh</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase">bKash, Nagad & COD</h4>
            <p className="text-xs text-neutral-400 max-w-xs">Pay after delivery or via secure manual bKash/Nagad transfer</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-white">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase">7-Day Easy Exchange</h4>
            <p className="text-xs text-neutral-400 max-w-xs">Hassle-free size replacement and fit exchanges nationwide</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-white">
              <Headphones className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase">Dedicated Support</h4>
            <p className="text-xs text-neutral-400 max-w-xs">WhatsApp and hotline assistance: {settings.phone}</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-3">
              <BrandLogo variant="horizontal" size="md" theme="dark" />
              <p className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
                Modern • Minimal • Magnetic
              </p>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
              Contemporary menswear engineered for the modern man. Distinct cuts, heavyweight luxury cottons, and refined tailored essentials built for distinction.
            </p>
            <div className="pt-2 text-xs text-neutral-300 font-mono space-y-1">
              <p>Hotline: <a href={`tel:${settings.phone}`} className="text-white hover:underline">{settings.phone}</a></p>
              <p>Email: <a href={`mailto:${settings.email}`} className="text-white hover:underline">{settings.email}</a></p>
              <p>Studio: Banani, Dhaka, Bangladesh</p>
            </div>
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg border border-neutral-800 transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg border border-neutral-800 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.2em] text-white uppercase">Collections</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('shop', 'shirts')} className="text-neutral-400 hover:text-white transition-colors">
                  Oxford & Linen Shirts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 't-shirts')} className="text-neutral-400 hover:text-white transition-colors">
                  Heavyweight T-Shirts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'polo-shirts')} className="text-neutral-400 hover:text-white transition-colors">
                  Mercerized Polo Shirts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'pants')} className="text-neutral-400 hover:text-white transition-colors">
                  Tailored Pleated Pants
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'jeans')} className="text-neutral-400 hover:text-white transition-colors">
                  Selvedge Denim Jeans
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'overshirts')} className="text-neutral-400 hover:text-white transition-colors">
                  Utility Overshirts
                </button>
              </li>
            </ul>
          </div>

          {/* Quick & Customer Care */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.2em] text-white uppercase">Customer Care</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('track-order')} className="text-neutral-400 hover:text-white transition-colors font-medium text-white">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('return-policy')} className="text-neutral-400 hover:text-white transition-colors">
                  Return & Exchange Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="text-neutral-400 hover:text-white transition-colors">
                  Size Guidance & Help
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy-policy')} className="text-neutral-400 hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="text-neutral-400 hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-neutral-400 hover:text-white transition-colors font-mono text-xs flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>
                  <span>Store Manager Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Payment Methods & Verification */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.2em] text-white uppercase">Accepted Payment</h4>
            <div className="space-y-2 text-xs text-neutral-400">
              <div className="flex items-center gap-2 p-2 bg-neutral-900 rounded border border-neutral-800">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                <span className="text-neutral-200 font-semibold">bKash Personal Payment</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-neutral-900 rounded border border-neutral-800">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span className="text-neutral-200 font-semibold">Nagad Personal Payment</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-neutral-900 rounded border border-neutral-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-neutral-200 font-semibold">Cash on Delivery (COD)</span>
              </div>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              For manual bKash / Nagad send money to <span className="font-mono text-white">{settings.bkashNumber}</span> and provide TrxID at checkout.
            </p>
          </div>
        </div>

        {/* Bottom Tagline & Copyright */}
        <div className="mt-14 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} FAVY CRAVY FITS 2.0. All Rights Reserved. Dhaka, Bangladesh.</p>
          <div className="flex items-center gap-3">
            <span className="font-serif italic text-neutral-400">Wear Distinction | Own the Moment</span>
            <span className="text-neutral-400">•</span>
            <span className="text-neutral-400">For The Modern Man</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
