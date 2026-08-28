import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedColor: string, selectedSize: string, quantity?: number) => boolean;
  removeFromCart: (productId: string, selectedColor: string, selectedSize: string) => void;
  updateQuantity: (productId: string, selectedColor: string, selectedSize: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'fcf_cart_v2';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  const addToCart = (product: Product, selectedColor: string, selectedSize: string, quantity: number = 1): boolean => {
    // Check variant or main product stock with resilient fallback
    let maxStock = product.stock;
    if (product.variants && product.variants.length > 0) {
      const v = product.variants.find(item => item.size === selectedSize);
      if (v && v.stock !== undefined) {
        if (v.stock > 0) {
          maxStock = v.stock;
        } else if (product.stock > 0) {
          maxStock = product.stock;
        } else {
          maxStock = 0;
        }
      }
    }

    if (maxStock <= 0 || product.stock <= 0) {
      showToast(`Sorry, size ${selectedSize} of "${product.name}" is currently out of stock`, 'error');
      return false;
    }

    let success = true;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = currentQty + quantity;
        if (newQty > maxStock) {
          showToast(`Cannot add more than ${maxStock} items available in stock`, 'error');
          success = false;
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty, maxStock };
        return updated;
      } else {
        if (quantity > maxStock) {
          showToast(`Only ${maxStock} items available in stock`, 'error');
          success = false;
          return prev;
        }
        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          salePrice: product.salePrice,
          image: product.thumbnail || (product.images && product.images[0]) || '',
          selectedColor,
          selectedSize,
          quantity,
          maxStock,
          sku: product.sku
        };
        return [...prev, newItem];
      }
    });

    if (success) {
      showToast(`Added "${product.name}" (${selectedSize}, ${selectedColor}) to cart`, 'success');
      setIsCartOpen(true);
    }

    return success;
  };

  const removeFromCart = (productId: string, selectedColor: string, selectedSize: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.selectedColor === selectedColor && item.selectedSize === selectedSize)
      )
    );
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, selectedColor: string, selectedSize: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor, selectedSize);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.selectedColor === selectedColor && item.selectedSize === selectedSize) {
          if (quantity > item.maxStock) {
            showToast(`Maximum ${item.maxStock} items available in stock`, 'error');
            return { ...item, quantity: item.maxStock };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
    return sum + price * item.quantity;
  }, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        totalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
