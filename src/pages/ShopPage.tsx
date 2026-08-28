import React, { useState, useEffect, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { useSettings } from '../context/SettingsContext';

interface ShopPageProps {
  initialCategory?: string;
  onNavigate: (view: string, param?: string) => void;
}

export function ShopPage({ initialCategory, onNavigate }: ShopPageProps) {
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [availability, setAvailability] = useState<'all' | 'in-stock' | 'on-sale'>('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 5000 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // All available standard sizes & colors
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36'];
  const availableColors = ['Black', 'White', 'Navy', 'Olive', 'Grey', 'Beige', 'Indigo'];

  useEffect(() => {
    if (initialCategory) {
      if (initialCategory === 'new-arrivals') {
        setSelectedCategory('all');
        setSortBy('newest');
      } else if (initialCategory === 'best-sellers') {
        setSelectedCategory('all');
        setSortBy('best-seller');
      } else if (initialCategory.startsWith('search=')) {
        const q = decodeURIComponent(initialCategory.replace('search=', ''));
        setSearchQuery(q);
      } else {
        setSelectedCategory(initialCategory);
      }
    }
  }, [initialCategory]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.getProducts({
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            sort: sortBy,
            search: searchQuery || undefined
          }),
          api.getCategories()
        ]);
        if (isMounted) {
          setProducts(prodRes?.products || []);
          setCategories(catRes?.categories || []);
        }
      } catch {
        // Fallback already handled in api.ts
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
  }, [selectedCategory, sortBy, searchQuery]);

  // Client-side additional facet filtering
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;

      if (price < priceRange.min || price > priceRange.max) return false;

      if (availability === 'in-stock' && product.stock <= 0) return false;
      if (availability === 'on-sale' && (!product.salePrice || product.salePrice >= product.price)) return false;

      if (selectedSizes.length > 0) {
        const hasSize = selectedSizes.some((s) => product.sizes.includes(s));
        if (!hasSize) return false;
      }

      if (selectedColors.length > 0) {
        const hasColor = selectedColors.some((c) =>
          product.colors.some((prodCol) => prodCol.toLowerCase().includes(c.toLowerCase()))
        );
        if (!hasColor) return false;
      }

      return true;
    });
  }, [products, priceRange, availability, selectedSizes, selectedColors]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSizes([]);
    setSelectedColors([]);
    setAvailability('all');
    setPriceRange({ min: 0, max: 5000 });
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    availability !== 'all' ||
    priceRange.min > 0 ||
    priceRange.max < 5000 ||
    searchQuery !== '';

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Shop Header */}
      <div className="border-b border-neutral-800 pb-4 sm:pb-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-extrabold text-white uppercase tracking-wider">
              {searchQuery
                ? `Search: "${searchQuery}"`
                : selectedCategory === 'all'
                ? 'All Collections'
                : categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
            </h1>
            <p className="text-xs text-neutral-400 font-mono mt-0.5 sm:mt-1">
              Showing {filteredProducts.length} handcrafted garments
            </p>
          </div>

          {/* Quick Category Pills on Top with Touch-Friendly Edge-to-Edge Scrolling */}
          <div className="-mx-3 px-3 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none touch-pan-x">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
                selectedCategory === 'all'
                  ? 'bg-white text-neutral-950 shadow-md font-bold'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 active:bg-neutral-800'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
                  selectedCategory === cat.slug
                    ? 'bg-white text-neutral-950 shadow-md font-bold'
                    : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 active:bg-neutral-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex items-center justify-between gap-2.5 sm:gap-4 bg-neutral-900/70 p-2.5 sm:p-3 rounded-xl border border-neutral-800 text-xs">
        {/* Mobile Filter Button with 44px+ Touch Area */}
        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden min-h-[44px] flex items-center gap-2 px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-700 text-white rounded-xl font-semibold uppercase tracking-wider text-xs transition-colors cursor-pointer select-none shadow-sm"
        >
          <Filter className="w-4 h-4 text-neutral-300" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>

        {/* Active filters chips (desktop) */}
        <div className="hidden lg:flex items-center gap-2 flex-wrap">
          <span className="text-neutral-400 uppercase tracking-widest font-mono text-[10px]">Filter:</span>
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-800 text-white rounded-md text-[11px]">
              Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
              <button onClick={() => setSelectedCategory('all')} className="hover:text-red-400 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedSizes.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-800 text-white rounded-md text-[11px] font-mono">
              Size: {s}
              <button onClick={() => toggleSize(s)} className="hover:text-red-400 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedColors.map((c) => (
            <span key={c} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-800 text-white rounded-md text-[11px]">
              Color: {c}
              <button onClick={() => toggleColor(c)} className="hover:text-red-400 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-neutral-400 hover:text-white flex items-center gap-1 text-[11px] underline ml-2 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset all
            </button>
          )}
        </div>

        {/* Sort Dropdown with 44px+ Touch Area */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-neutral-400 uppercase tracking-widest font-mono text-[10px] hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="min-h-[44px] bg-neutral-800 hover:bg-neutral-700/80 text-white text-xs font-semibold px-3 py-2.5 rounded-xl border border-neutral-700/80 focus:outline-none focus:border-white cursor-pointer transition-colors"
          >
            <option value="featured">Featured Collection</option>
            <option value="newest">Newest Arrivals</option>
            <option value="best-seller">Best Selling</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Grid + Desktop Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block space-y-6">
          {/* Availability */}
          <div className="bg-neutral-900/60 p-5 rounded-2xl border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Availability</h4>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 text-neutral-300 cursor-pointer hover:text-white">
                <input
                  type="radio"
                  name="avail"
                  checked={availability === 'all'}
                  onChange={() => setAvailability('all')}
                  className="accent-white"
                />
                <span>All Items</span>
              </label>
              <label className="flex items-center gap-2 text-neutral-300 cursor-pointer hover:text-white">
                <input
                  type="radio"
                  name="avail"
                  checked={availability === 'in-stock'}
                  onChange={() => setAvailability('in-stock')}
                  className="accent-white"
                />
                <span>In Stock Only</span>
              </label>
              <label className="flex items-center gap-2 text-neutral-300 cursor-pointer hover:text-white">
                <input
                  type="radio"
                  name="avail"
                  checked={availability === 'on-sale'}
                  onChange={() => setAvailability('on-sale')}
                  className="accent-white"
                />
                <span>On Discount / Sale</span>
              </label>
            </div>
          </div>

          {/* Sizes */}
          <div className="bg-neutral-900/60 p-5 rounded-2xl border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Sizes</h4>
            <div className="grid grid-cols-3 gap-2">
              {availableSizes.map((sz) => {
                const isSelected = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    onClick={() => toggleSize(sz)}
                    className={`py-2 px-2 rounded-lg text-xs font-mono font-semibold uppercase border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-neutral-950 border-white shadow'
                        : 'bg-neutral-800/80 text-neutral-300 border-neutral-700/60 hover:border-neutral-500'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors */}
          <div className="bg-neutral-900/60 p-5 rounded-2xl border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Colors</h4>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((col) => {
                const isSelected = selectedColors.includes(col);
                return (
                  <button
                    key={col}
                    onClick={() => toggleColor(col)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-neutral-950 border-white font-bold shadow'
                        : 'bg-neutral-800/80 text-neutral-300 border-neutral-700/60 hover:border-neutral-500'
                    }`}
                  >
                    {col}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="bg-neutral-900/60 p-5 rounded-2xl border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Price Range</h4>
            <div className="flex items-center gap-2 text-xs font-mono">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white"
                placeholder="Min"
              />
              <span className="text-neutral-500">-</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {/* Product Grid Area Optimized for Small Mobile Devices */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="aspect-[3/4] bg-neutral-900 rounded-xl" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 sm:py-20 bg-neutral-900/40 rounded-2xl border border-neutral-800 p-6 sm:p-8 space-y-4">
              <div className="p-4 bg-neutral-800 rounded-full w-14 h-14 mx-auto flex items-center justify-center text-neutral-400">
                <Filter className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-base sm:text-lg font-bold text-white">No Matching Menswear Found</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Try clearing some filter criteria or selecting another category to see available items.
                </p>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="min-h-[44px] px-6 py-2.5 bg-white text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors shadow cursor-pointer active:scale-95"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Touch-Accessible Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs sm:max-w-sm bg-neutral-900 h-full flex flex-col z-10 border-l border-neutral-800 shadow-2xl safe-area-pb">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 shrink-0">
              <div>
                <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">Refine Filters</h3>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">{filteredProducts.length} items available</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-800/60 active:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content with 44px+ touch targets */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
              {/* Availability */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Availability</h4>
                <div className="space-y-1.5">
                  {[
                    { id: 'all', label: 'All Items' },
                    { id: 'in-stock', label: 'In Stock Only' },
                    { id: 'on-sale', label: 'On Discount / Sale' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAvailability(opt.id as any)}
                      className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-colors ${
                        availability === opt.id
                          ? 'bg-neutral-800 text-white border-neutral-600 font-bold'
                          : 'bg-neutral-900/60 text-neutral-300 border-neutral-800/80 hover:bg-neutral-800/50'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {availability === opt.id && <Check className="w-4 h-4 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Collections</h4>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-left font-semibold border transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-white text-neutral-950 border-white'
                        : 'bg-neutral-900/60 text-neutral-300 border-neutral-800/80 hover:bg-neutral-800/50'
                    }`}
                  >
                    <span>All Collections</span>
                    {selectedCategory === 'all' && <Check className="w-4 h-4 text-neutral-950" />}
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-left font-semibold border transition-colors ${
                        selectedCategory === c.slug
                          ? 'bg-white text-neutral-950 border-white'
                          : 'bg-neutral-900/60 text-neutral-300 border-neutral-800/80 hover:bg-neutral-800/50'
                      }`}
                    >
                      <span>{c.name}</span>
                      {selectedCategory === c.slug && <Check className="w-4 h-4 text-neutral-950" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes (44px min touch target) */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Sizes</h4>
                <div className="grid grid-cols-3 gap-2">
                  {availableSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`min-h-[44px] py-2 px-2 rounded-xl text-xs font-mono font-bold uppercase border transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                        selectedSizes.includes(sz)
                          ? 'bg-white text-neutral-950 border-white shadow'
                          : 'bg-neutral-800/80 text-neutral-300 border-neutral-700/60'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Colors</h4>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => toggleColor(col)}
                      className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-medium border transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                        selectedColors.includes(col)
                          ? 'bg-white text-neutral-950 border-white font-bold shadow'
                          : 'bg-neutral-800/80 text-neutral-300 border-neutral-700/60'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Price Range</h4>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-full min-h-[44px] bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white"
                    placeholder="Min"
                  />
                  <span className="text-neutral-500">-</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full min-h-[44px] bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-900 shrink-0 space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full min-h-[48px] bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200 active:scale-98 transition-all shadow-lg flex items-center justify-center"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    resetFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full min-h-[40px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium rounded-xl transition-colors flex items-center justify-center"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
