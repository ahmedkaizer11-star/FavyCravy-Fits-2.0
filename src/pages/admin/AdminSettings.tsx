import React, { useState } from 'react';
import { Save, ShieldCheck, Phone, MessageCircle, DollarSign, Truck, Store } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';

export function AdminSettings() {
  const { settings, updateSettings } = useSettings();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ ...settings });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(formData);
      showToast('Store settings updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white uppercase tracking-wider">
          Store Configuration & Payment Channels
        </h1>
        <p className="text-xs text-neutral-400 font-mono">
          Update bKash/Nagad payment numbers, studio contact, and delivery policies
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs text-neutral-100">
        {/* Payment Channels */}
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Bangladesh Payment Gateways (Personal Send Money)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-neutral-300 font-semibold">bKash Personal Mobile Number</label>
              <input
                type="text"
                value={formData.bkashNumber}
                onChange={(e) => setFormData({ ...formData, bkashNumber: e.target.value })}
                placeholder="01843667400"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-300 font-semibold">Nagad Personal Mobile Number</label>
              <input
                type="text"
                value={formData.nagadNumber}
                onChange={(e) => setFormData({ ...formData, nagadNumber: e.target.value })}
                placeholder="01843667400"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Contact & WhatsApp */}
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Hotline & Support Channels
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-neutral-300 font-semibold">WhatsApp Live Number</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="01843667400"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-300 font-semibold">Studio Phone Hotline</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="01843667400"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-300 font-semibold">Support Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Brand & Banner */}
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Store className="w-4 h-4 text-sky-400" />
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Brand Identity & Announcement Bar
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-neutral-300 font-semibold">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-300 font-semibold">Top Announcement Bar Text</label>
              <input
                type="text"
                value={formData.announcement}
                onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-300 font-semibold">Facebook Page URL</label>
              <input
                type="text"
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-[11px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-300 font-semibold">Instagram Profile URL</label>
              <input
                type="text"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-white text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-colors shadow flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating Store...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
