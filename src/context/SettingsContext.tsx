import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreSettings } from '../types';
import { api } from '../services/api';

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Favy Cravy Fits 2.0',
  tagline: 'Wear Distinction | Own the Moment',
  brandStatement: 'Modern. Minimal. Magnetic. Contemporary menswear designed for the modern Bangladeshi man.',
  phone: '01843667400',
  whatsapp: '01843667400',
  email: 'support@favycravyfits.com',
  address: 'Road 11, Block D, Banani',
  city: 'Dhaka',
  country: 'Bangladesh',
  bkashNumber: '01843667400',
  nagadNumber: '01843667400',
  enableCod: true,
  freeDeliveryEnabled: true,
  freeDeliveryThreshold: 0,
  standardDeliveryFee: 0,
  dhakaDeliveryFee: 0,
  outsideDhakaDeliveryFee: 0,
  facebookUrl: 'https://facebook.com/favycravyfits',
  instagramUrl: 'https://instagram.com/favycravyfits',
  currencySymbol: '৳',
  currencyCode: 'BDT'
};

interface SettingsContextType {
  settings: StoreSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await api.getSettings();
      if (data && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.warn('Using default settings fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const res = await api.updateAdminSettings(newSettings);
    if (res && res.settings) {
      setSettings(res.settings);
    } else {
      setSettings(prev => ({ ...prev, ...newSettings }));
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
