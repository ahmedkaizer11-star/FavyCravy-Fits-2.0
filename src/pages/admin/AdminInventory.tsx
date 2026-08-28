import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, Check, RefreshCw, Search } from 'lucide-react';
import { api } from '../../services/api';
import { Product } from '../../types';
import { useToast } from '../../context/ToastContext';
import { handleImageFallback, DEFAULT_PRODUCT_IMAGE } from '../../utils/imageFallback';

export function AdminInventory() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stockChanges, setStockChanges] = useState<{ [productId: string]: number }>({});
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminProducts();
      setProducts(res.products || []);
      setStockChanges({});
    } catch (err) {
      console.error(err);
      showToast('Failed to load inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStockChange = (productId: string, val: number) => {
    setStockChanges((prev) => ({
      ...prev,
      [productId]: Math.max(0, val)
    }));
  };

  const handleSaveAll = async () => {
    const idsToUpdate = Object.keys(stockChanges);
    if (idsToUpdate.length === 0) {
      showToast('No stock modifications to save', 'info');
      return;
    }

    setSaving(true);
    try {
      await Promise.all(
        idsToUpdate.map((id) =>
          api.updateProduct(id, { stock: stockChanges[id] })
        )
      );
      showToast('All inventory adjustments saved successfully', 'success');
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Failed to update inventory', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white uppercase tracking-wider">
            Inventory & Stock Velocity
          </h1>
          <p className="text-xs text-neutral-400 font-mono">
            Fast inline stock balance adjustment
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving || Object.keys(stockChanges).length === 0}
            className="px-5 py-2.5 bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors shadow flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : `Save Changes (${Object.keys(stockChanges).length})`}</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search garment SKU or name..."
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-mono uppercase bg-neutral-950/60">
                <th className="py-3 px-4">Garment & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">New Stock Input</th>
                <th className="py-3 px-4">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {filtered.map((p) => {
                const currentStock = p.stock;
                const newStock = stockChanges[p.id] !== undefined ? stockChanges[p.id] : currentStock;
                const isModified = stockChanges[p.id] !== undefined && stockChanges[p.id] !== currentStock;

                return (
                  <tr key={p.id} className="hover:bg-neutral-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.thumbnail || p.images[0] || DEFAULT_PRODUCT_IMAGE}
                          alt={p.name}
                          className="w-10 h-12 object-cover object-top rounded bg-neutral-800 border border-neutral-800 shrink-0"
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageFallback(e, DEFAULT_PRODUCT_IMAGE)}
                        />
                        <div>
                          <p className="font-sans font-semibold text-white">{p.name}</p>
                          <p className="text-[10px] text-neutral-400">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-neutral-300 font-sans">
                      {p.category}
                    </td>

                    <td className="py-3 px-4 font-bold text-white">
                      {currentStock} units
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={newStock}
                          onChange={(e) => handleStockChange(p.id, parseInt(e.target.value) || 0)}
                          className={`w-24 bg-neutral-800 border rounded-lg px-2.5 py-1.5 text-xs text-white font-bold ${
                            isModified ? 'border-amber-400 ring-1 ring-amber-400' : 'border-neutral-700'
                          }`}
                        />
                        {isModified && (
                          <span className="text-[10px] text-amber-400 font-sans font-bold">
                            Modified
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {newStock <= 0 ? (
                        <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold">
                          OUT OF STOCK
                        </span>
                      ) : newStock <= 5 ? (
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold">
                          LOW STOCK ({newStock})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                          HEALTHY ({newStock})
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
