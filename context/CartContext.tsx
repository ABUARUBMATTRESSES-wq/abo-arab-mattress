"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartItem } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, sizeLabel: string, heightLabel: string) => void;
  updateQuantity: (productId: string, sizeLabel: string, heightLabel: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  originalSubtotal: number;
  totalSavings: number;
  itemsCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// The previous key may contain demo products with obsolete prices.
const STORAGE_KEY = "abo_arab_cart_core_20261122";
const DISCOUNT_STORAGE_KEY = "abo_arab_discount";

function itemKey(productId: string, sizeLabel: string, heightLabel: string) {
  return `${productId}__${sizeLabel}__${heightLabel}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      window.localStorage.removeItem(DISCOUNT_STORAGE_KEY);
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const key = itemKey(item.productId, item.sizeLabel, item.heightLabel);
      const existingIndex = prev.findIndex(
        (i) => itemKey(i.productId, i.sizeLabel, i.heightLabel) === key
      );
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + item.quantity,
        };
        return next;
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: string, sizeLabel: string, heightLabel: string) => {
    setItems((prev) =>
      prev.filter((i) => itemKey(i.productId, i.sizeLabel, i.heightLabel) !== itemKey(productId, sizeLabel, heightLabel))
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, sizeLabel: string, heightLabel: string, quantity: number) => {
      setItems((prev) =>
        prev.map((i) =>
          itemKey(i.productId, i.sizeLabel, i.heightLabel) === itemKey(productId, sizeLabel, heightLabel)
            ? { ...i, quantity: Math.max(1, quantity) }
            : i
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items]
  );
  const originalSubtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.originalUnitPrice * i.quantity, 0),
    [items]
  );
  const totalSavings = originalSubtotal - subtotal;
  const itemsCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    originalSubtotal,
    totalSavings,
    itemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
