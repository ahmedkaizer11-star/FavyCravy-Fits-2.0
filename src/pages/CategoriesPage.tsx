import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Category } from '../types';
import { api } from '../services/api';

interface CategoriesPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export function CategoriesPage({ onNavigate }: CategoriesPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetch = async () => {
      try {
        const res = await api.getCategories();
        if (isMounted) {
          setCategories(res?.categories || []);
        }
      } catch {
        // Fallback already handled in api.ts
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetch();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 space-y-2">
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Menswear Taxonomy</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-wider">
          Curated Garment Collections
        </h1>
        <p className="text-sm text-neutral-400 max-w-2xl font-light">
          From crisp button-down oxfords to selvedge denim and heavyweight luxury jersey tees, explore silhouettes engineered for distinction.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="aspect-[4/3] bg-neutral-900 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', cat.slug)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-all duration-300 cursor-pointer shadow-xl"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />

              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-white uppercase tracking-wider group-hover:text-neutral-200">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-300 line-clamp-2 max-w-xs font-light">
                    {cat.description}
                  </p>
                  <span className="inline-block text-[11px] font-mono text-neutral-400 uppercase">
                    {cat.itemCount ? `${cat.itemCount} Garments` : 'Explore fit'}
                  </span>
                </div>

                <div className="p-3 bg-white text-neutral-950 rounded-full group-hover:translate-x-1 transition-transform shadow-lg shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
