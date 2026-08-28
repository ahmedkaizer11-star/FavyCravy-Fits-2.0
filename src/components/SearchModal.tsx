import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { handleImageFallback, DEFAULT_PRODUCT_IMAGE } from '../utils/imageFallback';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, param?: string) => void;
}

export function SearchModal({ isOpen, onClose, onNavigate }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { settings } = useSettings();
  const inputRef = useRef<HTMLInputElement>(null);

  const popularSearches = [
    'Oxford Shirt',
    'Heavyweight Tee',
    'Polo Shirt',
    'Pleated Trousers',
    'Selvedge Denim',
    'Overshirt'
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.getProducts({ search: query.trim() });
        setResults(res.products.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectProduct = (product: Product) => {
    onClose();
    onNavigate('product', product.slug || product.id);
  };

  const handleFullSearch = (searchTerm: string) => {
    onClose();
    onNavigate('shop', `search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 z-10"
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-neutral-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-neutral-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim()) {
                    handleFullSearch(query.trim());
                  }
                }}
                placeholder="Search by garment name, SKU, category (e.g. Oxford, Selvedge)..."
                className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white border border-neutral-700 rounded-lg hover:bg-neutral-800"
              >
                ESC
              </button>
            </div>

            {/* Content Area */}
            <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5">
              {/* Popular tags when no search */}
              {!query.trim() && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Popular Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setQuery(term);
                        }}
                        className="px-3 py-1.5 bg-neutral-800/80 hover:bg-neutral-800 hover:text-white text-neutral-300 text-xs rounded-lg border border-neutral-700/60 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading indicator */}
              {loading && (
                <div className="py-8 text-center text-xs text-neutral-400 font-mono animate-pulse">
                  Searching catalog...
                </div>
              )}

              {/* Results List */}
              {!loading && results.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400 uppercase tracking-wider">
                    <span>Products ({results.length})</span>
                    <button
                      onClick={() => handleFullSearch(query)}
                      className="text-white hover:underline flex items-center gap-1"
                    >
                      <span>View all</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="divide-y divide-neutral-800/80">
                    {results.map((product) => {
                      const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
                      return (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          className="py-3 flex items-center justify-between gap-3 hover:bg-neutral-800/50 p-2 rounded-xl cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={product.thumbnail || product.images[0] || DEFAULT_PRODUCT_IMAGE}
                              alt={product.name}
                              className="w-12 h-14 object-cover object-top rounded-lg bg-neutral-800 shrink-0 border border-neutral-800"
                              referrerPolicy="no-referrer"
                              onError={(e) => handleImageFallback(e, DEFAULT_PRODUCT_IMAGE)}
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                {product.category}
                              </p>
                              <h4 className="text-sm font-medium text-white truncate">{product.name}</h4>
                              <p className="text-xs text-neutral-400 font-mono mt-0.5">SKU: {product.sku}</p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono text-sm font-bold text-white">
                              {settings.currencySymbol}
                              {price.toLocaleString()}
                            </span>
                            {product.salePrice && (
                              <p className="text-[10px] text-neutral-400 line-through font-mono">
                                {settings.currencySymbol}
                                {product.price.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No results */}
              {!loading && query.trim() && results.length === 0 && (
                <div className="py-10 text-center space-y-2">
                  <p className="text-sm font-medium text-white">No products found for "{query}"</p>
                  <p className="text-xs text-neutral-400">
                    Try searching for another keyword such as Oxford, Polo, Jeans, or Trousers.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
