import type { SyntheticEvent } from 'react';

export const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80';

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  shirts: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
  'short-sleeve': 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
  't-shirts': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  'polo-shirts': 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
  pants: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
  jeans: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
  overshirts: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
  accessories: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'
};

/**
 * Handle image error and replace with a graceful fallback.
 */
export function handleImageFallback(e: SyntheticEvent<HTMLImageElement, Event>, fallbackUrl?: string) {
  const target = e.currentTarget;
  const fallback = fallbackUrl || DEFAULT_PRODUCT_IMAGE;
  // Clear handler to prevent any recursive error cycle
  target.onerror = null;
  if (!target.src.endsWith(fallback) && target.src !== fallback) {
    target.src = fallback;
  }
}
