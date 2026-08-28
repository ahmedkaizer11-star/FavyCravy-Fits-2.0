import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ruler, CheckCircle2 } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export function SizeGuideModal({ isOpen, onClose, category = 'Shirts' }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [activeTab, setActiveTab] = useState<'tops' | 'bottoms'>(
    category.toLowerCase().includes('pant') || category.toLowerCase().includes('jean') ? 'bottoms' : 'tops'
  );

  const topsData = [
    { size: 'S', chest: unit === 'inches' ? '38"' : '96.5 cm', length: unit === 'inches' ? '28"' : '71 cm', shoulder: unit === 'inches' ? '17.5"' : '44.5 cm', sleeve: unit === 'inches' ? '24.5"' : '62 cm' },
    { size: 'M', chest: unit === 'inches' ? '40"' : '101.5 cm', length: unit === 'inches' ? '29"' : '73.5 cm', shoulder: unit === 'inches' ? '18.25"' : '46.5 cm', sleeve: unit === 'inches' ? '25"' : '63.5 cm' },
    { size: 'L', chest: unit === 'inches' ? '42"' : '106.5 cm', length: unit === 'inches' ? '30"' : '76 cm', shoulder: unit === 'inches' ? '19"' : '48.5 cm', sleeve: unit === 'inches' ? '25.5"' : '65 cm' },
    { size: 'XL', chest: unit === 'inches' ? '44"' : '112 cm', length: unit === 'inches' ? '31"' : '78.5 cm', shoulder: unit === 'inches' ? '19.75"' : '50 cm', sleeve: unit === 'inches' ? '26"' : '66 cm' },
    { size: 'XXL', chest: unit === 'inches' ? '46"' : '117 cm', length: unit === 'inches' ? '32"' : '81 cm', shoulder: unit === 'inches' ? '20.5"' : '52 cm', sleeve: unit === 'inches' ? '26.5"' : '67 cm' }
  ];

  const bottomsData = [
    { size: '30', waist: unit === 'inches' ? '30"' : '76 cm', hip: unit === 'inches' ? '38"' : '96.5 cm', length: unit === 'inches' ? '39"' : '99 cm', thigh: unit === 'inches' ? '22"' : '56 cm' },
    { size: '32', waist: unit === 'inches' ? '32"' : '81 cm', hip: unit === 'inches' ? '40"' : '101.5 cm', length: unit === 'inches' ? '40"' : '101.5 cm', thigh: unit === 'inches' ? '23.5"' : '59.5 cm' },
    { size: '34', waist: unit === 'inches' ? '34"' : '86 cm', hip: unit === 'inches' ? '42"' : '106.5 cm', length: unit === 'inches' ? '41"' : '104 cm', thigh: unit === 'inches' ? '25"' : '63.5 cm' },
    { size: '36', waist: unit === 'inches' ? '36"' : '91.5 cm', hip: unit === 'inches' ? '44"' : '112 cm', length: unit === 'inches' ? '41.5"' : '105.5 cm', thigh: unit === 'inches' ? '26.5"' : '67 cm' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 max-h-[90vh] flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Ruler className="w-5 h-5 text-white" />
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                  Menswear Sizing Matrix
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Controls */}
            <div className="p-5 pb-0 flex flex-wrap items-center justify-between gap-3">
              {/* Tops vs Bottoms Tabs */}
              <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                <button
                  onClick={() => setActiveTab('tops')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeTab === 'tops' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Tops (Shirts / Tees / Polos)
                </button>
                <button
                  onClick={() => setActiveTab('bottoms')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeTab === 'bottoms' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Bottoms (Pants / Jeans)
                </button>
              </div>

              {/* Unit Switcher */}
              <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                <button
                  onClick={() => setUnit('inches')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    unit === 'inches' ? 'bg-white text-neutral-950 font-bold shadow' : 'text-neutral-400'
                  }`}
                >
                  Inches
                </button>
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    unit === 'cm' ? 'bg-white text-neutral-950 font-bold shadow' : 'text-neutral-400'
                  }`}
                >
                  CM
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="p-5 overflow-x-auto">
              {activeTab === 'tops' ? (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-widest font-mono">
                      <th className="py-3 px-4 font-bold text-white">Size</th>
                      <th className="py-3 px-4">Chest</th>
                      <th className="py-3 px-4">Body Length</th>
                      <th className="py-3 px-4">Shoulder</th>
                      <th className="py-3 px-4">Sleeve</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-mono">
                    {topsData.map((row) => (
                      <tr key={row.size} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-white font-sans text-sm">{row.size}</td>
                        <td className="py-3 px-4 text-neutral-300">{row.chest}</td>
                        <td className="py-3 px-4 text-neutral-300">{row.length}</td>
                        <td className="py-3 px-4 text-neutral-300">{row.shoulder}</td>
                        <td className="py-3 px-4 text-neutral-300">{row.sleeve}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-widest font-mono">
                      <th className="py-3 px-4 font-bold text-white">Waist Size</th>
                      <th className="py-3 px-4">True Waist</th>
                      <th className="py-3 px-4">Hip</th>
                      <th className="py-3 px-4">Outseam Length</th>
                      <th className="py-3 px-4">Thigh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-mono">
                    {bottomsData.map((row) => (
                      <tr key={row.size} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-white font-sans text-sm">{row.size}</td>
                        <td className="py-3 px-4 text-neutral-300">{row.waist}</td>
                        <td className="py-3 px-4 text-neutral-300">{row.hip}</td>
                        <td className="py-3 px-4 text-neutral-300">{row.length}</td>
                        <td className="py-3 px-4 text-neutral-300">{row.thigh}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Sizing Advisory */}
            <div className="p-5 border-t border-neutral-800 bg-neutral-950/60 space-y-2 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-neutral-200">Fitting Guidance:</strong> For regular relaxed drape, choose your true standard size. For oversized aesthetic on T-shirts, select one size up.
                </p>
              </div>
              <p className="text-[11px] text-neutral-400 pl-6">
                Still unsure? Contact our Dhaka studio stylist directly on WhatsApp: <strong>01843667400</strong>.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
