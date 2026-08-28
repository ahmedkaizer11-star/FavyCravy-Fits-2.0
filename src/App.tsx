import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { UserAuthProvider } from './context/UserAuthContext';

// Components
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { AiStylistModal } from './components/AiStylistModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PolicyPages } from './pages/PolicyPages';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Order, Product } from './types';

function MainAppContent() {
  const { isAdminAuthenticated, isAdminLoggedIn } = useAdminAuth();
  const isAuthenticated = isAdminAuthenticated || isAdminLoggedIn;

  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParam, setViewParam] = useState<string | undefined>(undefined);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAiStylistOpen, setIsAiStylistOpen] = useState(false);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [activeStylingProduct, setActiveStylingProduct] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Navigation handler
  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    setViewParam(param);
    setIsCartOpen(false);
    setIsSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStylist = (product?: Product | null) => {
    setActiveStylingProduct(product || null);
    setIsAiStylistOpen(true);
  };

  // If Admin portal requested
  if (currentView === 'admin' || currentView === 'admin-login') {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-center">
          <AdminLogin
            onSuccess={() => setCurrentView('admin')}
            onBackToStore={() => handleNavigate('home')}
          />
        </div>
      );
    }
    return <AdminLayout onBackToStore={() => handleNavigate('home')} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-white selection:text-neutral-950">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Main Brand Navigation */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAiStylist={() => handleOpenStylist(null)}
        onOpenCustomerAuth={() => setIsCustomerAuthOpen(true)}
      />

      {/* Primary View Routing */}
      <main className="flex-1 pb-16 md:pb-0">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenAiStylist={() => handleOpenStylist(null)}
          />
        )}

        {currentView === 'shop' && (
          <ShopPage initialCategory={viewParam} onNavigate={handleNavigate} />
        )}

        {currentView === 'product' && (
          <ProductDetailPage
            productIdOrSlug={viewParam || ''}
            onNavigate={handleNavigate}
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            onOpenAiStylist={(prod) => handleOpenStylist(prod)}
          />
        )}

        {currentView === 'categories' && (
          <CategoriesPage onNavigate={handleNavigate} />
        )}

        {currentView === 'cart' && (
          <CartPage onNavigate={handleNavigate} />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onNavigate={handleNavigate}
            onOrderPlaced={(order) => {
              setConfirmedOrder(order);
              handleNavigate('order-confirmation', order.orderNumber);
            }}
          />
        )}

        {currentView === 'order-confirmation' && (
          <OrderConfirmationPage
            order={confirmedOrder || undefined}
            orderNumber={viewParam}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'track-order' && (
          <OrderTrackingPage
            initialOrderNumber={viewParam}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistPage onNavigate={handleNavigate} />
        )}

        {currentView === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {currentView === 'contact' && (
          <ContactPage />
        )}

        {currentView === 'return-policy' && (
          <PolicyPages type="returns" onNavigate={handleNavigate} />
        )}

        {currentView === 'privacy-policy' && (
          <PolicyPages type="privacy" onNavigate={handleNavigate} />
        )}

        {currentView === 'terms' && (
          <PolicyPages type="terms" onNavigate={handleNavigate} />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onNavigate={handleNavigate}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <AiStylistModal
        isOpen={isAiStylistOpen}
        onClose={() => setIsAiStylistOpen(false)}
        selectedProduct={activeStylingProduct}
        onNavigateProduct={(id) => handleNavigate('product', id)}
      />

      <CustomerAuthModal
        isOpen={isCustomerAuthOpen}
        onClose={() => setIsCustomerAuthOpen(false)}
        onNavigateOrderTracking={(orderNum) => handleNavigate('track-order', orderNum)}
      />

      {/* Floating WhatsApp Support Trigger */}
      <FloatingWhatsApp onOpenTrack={() => handleNavigate('track-order')} />

      {/* Mobile Bottom Bar */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Store Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <SettingsProvider>
        <AdminAuthProvider>
          <UserAuthProvider>
            <WishlistProvider>
              <CartProvider>
                <MainAppContent />
              </CartProvider>
            </WishlistProvider>
          </UserAuthProvider>
        </AdminAuthProvider>
      </SettingsProvider>
    </ToastProvider>
  );
}
