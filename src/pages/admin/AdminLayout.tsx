import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Sliders,
  Settings,
  LogOut,
  ExternalLink,
  Store,
  Menu,
  X
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BrandLogo } from '../../components/BrandLogo';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminOrders } from './AdminOrders';
import { AdminInventory } from './AdminInventory';
import { AdminSettings } from './AdminSettings';

interface AdminLayoutProps {
  onBackToStore: () => void;
}

export function AdminLayout({ onBackToStore }: AdminLayoutProps) {
  const { user, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'orders', label: 'Orders & bKash', icon: ShoppingBag },
    { id: 'inventory', label: 'Inventory', icon: Sliders },
    { id: 'settings', label: 'Store Settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    onBackToStore();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col lg:flex-row">
      {/* Mobile Admin Header */}
      <div className="lg:hidden bg-neutral-900 border-b border-neutral-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrandLogo variant="horizontal" size="xs" theme="dark" />
          <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded font-mono text-neutral-300">
            {user?.username}
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-neutral-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } lg:block w-full lg:w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between shrink-0 p-5 space-y-6 z-30`}
      >
        <div className="space-y-6">
          {/* Brand Logo in Admin */}
          <div className="space-y-2 pb-4 border-b border-neutral-800">
            <BrandLogo variant="horizontal" size="sm" theme="dark" />
            <p className="text-[10px] font-mono text-neutral-400 uppercase">
              Manager: <strong className="text-white">{user?.username}</strong>
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all text-left ${
                    isActive
                      ? 'bg-white text-neutral-950 shadow-md font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 pt-4 border-t border-neutral-800">
          <button
            onClick={onBackToStore}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store className="w-4 h-4 text-neutral-400" />
              <span>View Storefront</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto overflow-y-auto">
        {activeTab === 'overview' && <AdminOverview onNavigateTab={(tab) => setActiveTab(tab)} />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'categories' && <AdminCategories />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'inventory' && <AdminInventory />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
}
