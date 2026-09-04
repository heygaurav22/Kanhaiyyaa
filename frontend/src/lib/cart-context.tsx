'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';
import { useAuth } from './auth-context';
import { fetchApi } from './api';

interface CartContextType {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  loading: boolean;
  addToCart: (productId: string, variantId?: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<boolean>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  items: [],
  subtotal: 0,
  itemCount: 0,
  loading: false,
  addToCart: async () => false,
  updateQuantity: async () => false,
  removeFromCart: async () => false,
  clearCart: () => {},
  refreshCart: async () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshCart = async () => {
    if (!token) {
      setItems([]);
      setSubtotal(0);
      return;
    }
    setLoading(true);
    try {
      const res = await fetchApi<{ items: CartItem[]; subtotal: number; itemCount: number }>('/cart', { token });
      if (res.success && res.data) {
        setItems(res.data.items);
        setSubtotal(res.data.subtotal);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [token, user]);

  const addToCart = async (productId: string, variantId?: string, quantity: number = 1): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetchApi('/cart', {
        method: 'POST',
        token,
        body: JSON.stringify({ productId, variantId, quantity }),
      });
      if (res.success) {
        await refreshCart();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetchApi(`/cart/${itemId}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify({ quantity }),
      });
      if (res.success) {
        await refreshCart();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const removeFromCart = async (itemId: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetchApi(`/cart/${itemId}`, {
        method: 'DELETE',
        token,
      });
      if (res.success) {
        await refreshCart();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const clearCart = () => {
    setItems([]);
    setSubtotal(0);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        itemCount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
