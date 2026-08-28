import React, { useState } from 'react';
import { User, LogOut, Package, MapPin, Sparkles, X, Check, ShieldCheck, Mail, Phone, Home } from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';
import { useToast } from '../context/ToastContext';
import { BANGLADESH_DISTRICTS, Order } from '../types';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateOrderTracking?: (orderNumber: string) => void;
}

export function CustomerAuthModal({ isOpen, onClose, onNavigateOrderTracking }: CustomerAuthModalProps) {
  const { currentUser, customerProfile, signInWithGoogle, logout, updateProfileData, fetchUserOrders } = useUserAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [signingIn, setSigningIn] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile Form state
  const [phone, setPhone] = useState(customerProfile?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(customerProfile?.deliveryAddress || '');
  const [district, setDistrict] = useState(customerProfile?.district || 'Dhaka');
  const [savingProfile, setSavingProfile] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
      showToast('Signed in with Google successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Google sign-in failed. Please try again.', 'error');
    } finally {
      setSigningIn(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfileData({
        phone,
        deliveryAddress,
        district
      });
      showToast('Profile and default address saved to Firestore!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const loadOrders = async () => {
    setActiveTab('orders');
    setLoadingOrders(true);
    try {
      const userOrders = await fetchUserOrders();
      setOrders(userOrders);
    } catch (err) {
      console.warn('Orders load note:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                {currentUser ? 'Distinguished Member Account' : 'Customer Sign In'}
              </h3>
              <p className="text-xs text-neutral-400">
                {currentUser ? 'Secured with Firebase Auth & Firestore' : 'Access your orders, saved addresses & style profile'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!currentUser ? (
            /* Unauthenticated View: Google Sign In */
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-neutral-800 border border-neutral-700 mx-auto flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white">Join the Distinction Club</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  Sign in with your Google account to effortlessly track your orders across Bangladesh, sync delivery addresses, and receive AI styling recommendations.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="w-full py-3.5 px-4 bg-white hover:bg-neutral-100 text-neutral-950 font-semibold rounded-xl text-sm flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.99] disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{signingIn ? 'Connecting to Google Auth...' : 'Continue with Google'}</span>
              </button>

              <div className="pt-4 border-t border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Protected by Firebase Auth & Google Identity</span>
              </div>
            </div>
          ) : (
            /* Authenticated View: Tabs (Profile & Orders) */
            <div className="space-y-6">
              {/* User Identity Card */}
              <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-12 h-12 rounded-full border border-amber-400 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400 font-bold text-base">
                      {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white">{currentUser.displayName || 'Distinguished Member'}</h4>
                    <p className="text-xs text-neutral-400 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-neutral-500" /> {currentUser.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800/80 rounded-lg transition-colors text-xs flex items-center gap-1.5"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-neutral-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`pb-2.5 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'profile'
                      ? 'border-amber-400 text-amber-400 font-bold'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile & Address</span>
                </button>

                <button
                  type="button"
                  onClick={loadOrders}
                  className={`pb-2.5 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'orders'
                      ? 'border-amber-400 text-amber-400 font-bold'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Order History</span>
                </button>
              </div>

              {activeTab === 'profile' ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Phone Number (for Courier & Delivery updates)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="017xxxxxxxx / 018xxxxxxxx"
                        className="w-full bg-neutral-800/90 border border-neutral-700 text-white placeholder-neutral-500 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                        District
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                      >
                        {BANGLADESH_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                        Street Address / Apartment
                      </label>
                      <div className="relative">
                        <Home className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="House, Road, Block/Area"
                          className="w-full bg-neutral-800/90 border border-neutral-700 text-white placeholder-neutral-500 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>{savingProfile ? 'Saving to Firestore...' : 'Save Profile & Default Address'}</span>
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  {loadingOrders ? (
                    <div className="py-8 text-center text-xs text-neutral-400">Loading your Firestore orders...</div>
                  ) : orders.length === 0 ? (
                    <div className="py-8 text-center space-y-2">
                      <Package className="w-8 h-8 text-neutral-600 mx-auto" />
                      <p className="text-xs text-neutral-400">No previous orders found under this account.</p>
                    </div>
                  ) : (
                    orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{ord.orderNumber}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-amber-400 border border-neutral-700 capitalize">
                              {ord.orderStatus}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-1">
                            ৳{ord.total} BDT • {ord.items.length} item(s) • {new Date(ord.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {onNavigateOrderTracking && (
                          <button
                            type="button"
                            onClick={() => {
                              onNavigateOrderTracking(ord.orderNumber);
                              onClose();
                            }}
                            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium transition-colors"
                          >
                            Track
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
