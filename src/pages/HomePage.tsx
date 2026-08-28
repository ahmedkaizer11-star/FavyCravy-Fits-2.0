import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Truck, ShieldCheck, RefreshCw, Star, CheckCircle, ChevronRight, MessageCircle } from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { useSettings } from '../context/SettingsContext';
import { BrandLogo } from '../components/BrandLogo';

interface HomePageProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenAiStylist?: () => void;
}

export function HomePage({ onNavigate, onOpenAiStylist }: HomePageProps) {
  const { settings } = useSettings();
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.getProducts({ publishedOnly: true } as any),
          api.getCategories()
        ]);

        if (isMounted) {
          const allProducts = productsRes?.products || [];
          setNewArrivals(allProducts.filter((p) => p.newArrival).slice(0, 4));
          setBestSellers(allProducts.filter((p) => p.bestSeller || p.rating >= 4.8).slice(0, 4));
          setCategories(categoriesRes?.categories || []);
        }
      } catch {
        // Handled silently by api layer fallback
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-neutral-950 overflow-hidden border-b border-neutral-800">
        {/* Background Image with sophisticated dark gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=2000&q=85"
            alt="Favy Cravy Fits Menswear Collection"
            className="w-full h-full object-cover object-center opacity-40 scale-105 filter brightness-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-neutral-950/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8 py-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700/80 text-neutral-300 text-xs font-mono tracking-widest uppercase shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Autumn/Winter 2026 Collection Live</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.1]">
              Wear Distinction. <br />
              <span className="italic font-normal font-serif text-neutral-200">Own the Moment.</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
              Contemporary menswear designed for the modern man. Engineered with heavyweight long-staple fabrics, clean tailored lines, and zero compromises.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-neutral-950 font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-200 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 group"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('shop', 'new-arrivals')}
              className="w-full sm:w-auto px-8 py-4 bg-neutral-900/90 hover:bg-neutral-800 text-white border border-neutral-700 font-semibold text-xs uppercase tracking-[0.2em] rounded-xl transition-all backdrop-blur-md"
            >
              Explore New Arrivals
            </button>
          </div>

          {/* Quick trust metrics */}
          <div className="pt-6 grid grid-cols-3 max-w-lg mx-auto border-t border-neutral-800/80 text-neutral-400 text-xs font-mono">
            <div>
              <p className="text-white font-bold text-sm">100% Cotton</p>
              <p className="text-[11px]">Premium Weaves</p>
            </div>
            <div>
              <p className="text-white font-bold text-sm">৳0 Delivery</p>
              <p className="text-[11px]">All Bangladesh</p>
            </div>
            <div>
              <p className="text-white font-bold text-sm">7 Days</p>
              <p className="text-[11px]">Hassle-free Returns</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Categories</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
              Explore By Category
            </h2>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="text-xs font-bold uppercase tracking-widest text-neutral-300 hover:text-white flex items-center gap-1.5 group"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', cat.slug)}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-all duration-300 cursor-pointer shadow-md"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
              <div className="absolute inset-x-3 bottom-3 text-left">
                <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider group-hover:text-neutral-200">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                  {cat.itemCount ? `${cat.itemCount} items` : 'Explore fit'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. New Arrivals Dynamic Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Latest Drops</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop', 'new-arrivals')}
            className="text-xs font-bold uppercase tracking-widest text-neutral-300 hover:text-white flex items-center gap-1.5 group"
          >
            <span>Explore All New</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[3/4] bg-neutral-900 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          {/* Subtle background element */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-neutral-800/40 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white text-neutral-950 text-[10px] font-black uppercase tracking-widest">
              <span>SPECIAL PROMOTION</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight leading-tight">
              FREE HOME DELIVERY ACROSS BANGLADESH
            </h2>
            <p className="text-sm text-neutral-300 font-light leading-relaxed">
              Order now with zero delivery charges across all 64 districts. Pay securely with bKash, Nagad, or Cash on Delivery upon home arrival.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <button
              onClick={() => onNavigate('shop')}
              className="px-8 py-4 bg-white text-neutral-950 font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-200 transition-all shadow-xl flex items-center gap-3 group"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 4.5 Personal AI Fashion Stylist Showcase */}
      {onOpenAiStylist && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-amber-950/20 border border-amber-500/20 rounded-2xl p-6 sm:p-10 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-[11px] font-semibold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Google Search Grounded AI</span>
                </div>
                <h3 className="font-serif text-xl sm:text-3xl font-bold text-white uppercase tracking-wide">
                  Personal Menswear Stylist
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Need outfit matching advice for an evening in Banani, a tropical vacation, or summer humidity in Dhaka? Consult our AI Stylist for smart Bangladesh fashion intelligence and curated garment pairings.
                </p>
              </div>
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={onOpenAiStylist}
                  className="w-full sm:w-auto px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-neutral-950" />
                  <span>Consult AI Stylist</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Customer Favorites</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
              Best Sellers
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop', 'best-sellers')}
            className="text-xs font-bold uppercase tracking-widest text-neutral-300 hover:text-white flex items-center gap-1.5 group"
          >
            <span>View All Best Sellers</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[3/4] bg-neutral-900 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Why Choose Us / Brand Pillars */}
      <section className="bg-neutral-950 py-16 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Distinction In Every Stitch</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
              Why Choose Favy Cravy Fits 2.0
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-white border border-neutral-700">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wide">
                Premium Quality Fabrics
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Long-staple Egyptian cottons, heavy 240+ GSM combed tees, and authentic 13.5 oz selvedge denim built to withstand daily wear.
              </p>
            </div>

            <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-white border border-neutral-700">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wide">
                Free Home Delivery Nationwide
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Rapid delivery to your doorstep across Dhaka, Chittagong, Sylhet, and all 64 districts in Bangladesh with zero hidden charges.
              </p>
            </div>

            <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-white border border-neutral-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wide">
                bKash, Nagad & COD
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Seamless manual bKash/Nagad transfer with manual transaction verification, or pay comfortably with Cash on Delivery upon inspection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Brand Statement */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 py-8">
        <div className="flex justify-center pb-2">
          <BrandLogo variant="full" size="lg" theme="dark" showTagline={false} />
        </div>
        <span className="text-xs font-mono tracking-[0.3em] text-neutral-400 uppercase">Our Philosophy</span>
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
          Modern. Minimal. Magnetic.
        </h2>
        <p className="text-base text-neutral-300 font-light leading-relaxed">
          "Favy Cravy Fits 2.0 was created with a singular mandate: to provide the contemporary Bangladeshi man with timeless, masculine silhouettes crafted from the world's most durable luxury cottons. We eliminate loud branding to focus entirely on precision drape, feel, and magnetic confidence."
        </p>
        <p className="font-serif italic text-sm text-neutral-400">
          Wear Distinction | Own the Moment — For The Modern Man
        </p>
      </section>

      {/* 8. Social / Lookbook Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Community & Lookbook</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
            Styled by You @favycravyfits
          </h2>
          <p className="text-xs text-neutral-400">Tag #FavyCravyFits to be featured in our Dhaka lookbook</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 group">
            <img
              src="https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=600&q=80"
              alt="Community Style 1"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 group">
            <img
              src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80"
              alt="Community Style 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 group">
            <img
              src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80"
              alt="Community Style 3"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 group">
            <img
              src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80"
              alt="Community Style 4"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
