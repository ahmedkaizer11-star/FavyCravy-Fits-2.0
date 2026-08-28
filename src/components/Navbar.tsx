import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, Shield, ChevronRight, Phone, Truck, Sparkles, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import { useUserAuth } from '../context/UserAuthContext';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  currentView?: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenSearch?: () => void;
  onOpenCart?: () => void;
  onOpenAiStylist?: () => void;
  onOpenCustomerAuth?: () => void;
}

export function Navbar({
  currentView = 'home',
  onNavigate,
  onOpenSearch,
  onOpenCart,
  onOpenAiStylist,
  onOpenCustomerAuth
}: NavbarProps) {
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { settings } = useSettings();
  const { currentUser } = useUserAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', view: 'home' },
    { name: 'Shop', view: 'shop' },
    { name: 'Categories', view: 'categories' },
    { name: 'New Arrivals', view: 'shop', param: 'new-arrivals' },
    { name: 'Track Order', view: 'track-order' },
    { name: 'About', view: 'about' },
    { name: 'Contact', view: 'contact' },
  ];

  const handleCartClick = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      setIsCartOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-neutral-950 text-neutral-300 text-xs py-2 px-4 border-b border-neutral-800 tracking-wider">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium text-neutral-200">
            <Truck className="w-3.5 h-3.5 text-neutral-400" />
            <span>FREE HOME DELIVERY ACROSS BANGLADESH</span>
            <span className="hidden sm:inline text-neutral-500">|</span>
            <span className="hidden sm:inline text-neutral-400">Cash on Delivery & bKash / Nagad</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-neutral-400" />
              <span className="font-mono text-xs">{settings.phone}</span>
            </a>
            <button
              onClick={() => onNavigate('admin')}
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-medium uppercase tracking-widest pl-2 border-l border-neutral-800"
              title="Admin Portal"
            >
              <Shield className="w-3 h-3" />
              <span className="hidden md:inline">Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-neutral-900/95 backdrop-blur-md border-neutral-800 shadow-md py-3.5'
            : 'bg-neutral-900 border-neutral-800 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="p-1.5 text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-800"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Brand Logo */}
          <button
            onClick={() => {
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center group transition-transform active:scale-95"
            aria-label="Favy Cravy Fits 2.0 Home"
          >
            <BrandLogo variant="horizontal" size="sm" theme="dark" />
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.name}
                  onClick={() => onNavigate(link.view, link.param)}
                  className={`text-xs uppercase tracking-[0.18em] font-medium transition-colors relative py-1 ${
                    isActive ? 'text-white' : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* AI Stylist Button */}
            {onOpenAiStylist && (
              <button
                type="button"
                onClick={onOpenAiStylist}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm group"
                title="AI Stylist Consultation (Google Search Grounded)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>AI Stylist</span>
              </button>
            )}

            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="hidden lg:flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 px-3.5 py-2 rounded-full border border-neutral-700/60 transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="tracking-wider">Search...</span>
              </button>
            )}

            {/* Customer Account / Sign in */}
            {onOpenCustomerAuth && (
              <button
                type="button"
                onClick={onOpenCustomerAuth}
                className="relative p-2 text-neutral-300 hover:text-white transition-colors"
                title={currentUser ? `Account: ${currentUser.displayName || currentUser.email}` : 'Sign In / Account'}
              >
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Account"
                    className="w-5 h-5 rounded-full border border-amber-400 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
                {currentUser && (
                  <span className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-neutral-900" />
                )}
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative p-2 text-neutral-300 hover:text-white transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-white text-neutral-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={handleCartClick}
              className="relative p-2 text-white bg-neutral-800 hover:bg-neutral-700 rounded-full border border-neutral-700/60 transition-all shadow-sm flex items-center justify-center"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-neutral-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-800 bg-neutral-900 px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
            {/* Mobile AI Stylist button */}
            {onOpenAiStylist && (
              <div className="pb-2 border-b border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    onOpenAiStylist();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-semibold"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Personal AI Fashion Stylist</span>
                </button>
              </div>
            )}
            <div className="space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    onNavigate(link.view, link.param);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between py-3 px-3 rounded-lg text-sm uppercase tracking-wider font-medium text-neutral-200 hover:bg-neutral-800 hover:text-white transition-all text-left"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-800 space-y-2">
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-neutral-800 text-xs uppercase tracking-widest font-semibold text-neutral-300 hover:text-white"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard Portal
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
