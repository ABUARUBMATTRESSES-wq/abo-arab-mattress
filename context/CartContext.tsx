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
  discountCode: string | null;
  discountPercent: number;
  applyDiscountCode: (code: string) => boolean;
  removeDiscountCode: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "abo_arab_cart";
const DISCOUNT_STORAGE_KEY = "abo_arab_discount";

// أكواد خصم تجريبية — عدّلها حسب حملاتك
const VALID_DISCOUNT_CODES: Record<string, number> = {
  ABOARAB10: 10,
  ROYAL15: 15,
};

function itemKey(productId: string, sizeLabel: string, heightLabel: string) {
  return `${productId}__${sizeLabel}__${heightLabel}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      const code = window.localStorage.getItem(DISCOUNT_STORAGE_KEY);
      if (code) setDiscountCode(code);
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

  const applyDiscountCode = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    if (VALID_DISCOUNT_CODES[normalized]) {
      setDiscountCode(normalized);
      try {
        window.localStorage.setItem(DISCOUNT_STORAGE_KEY, normalized);
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  }, []);

  const removeDiscountCode = useCallback(() => {
    setDiscountCode(null);
    try {
      window.localStorage.removeItem(DISCOUNT_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const subtotalBeforeCode = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items]
  );
  const originalSubtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.originalUnitPrice * i.quantity, 0),
    [items]
  );
  const discountPercent = discountCode ? VALID_DISCOUNT_CODES[discountCode] ?? 0 : 0;
  const subtotal = useMemo(
    () => Math.round(subtotalBeforeCode * (1 - discountPercent / 100)),
    [subtotalBeforeCode, discountPercent]
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
    discountCode,
    discountPercent,
    applyDiscountCode,
    removeDiscountCode,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
