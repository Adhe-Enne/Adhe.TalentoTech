import React, { useState, useCallback, useMemo } from "react";

import type { CartItem, Product } from "../../models";
import type { ProviderProps } from "../../models/ProviderProps";
import type { CartContextType } from "./CartType";

import CartContext from "./CartContext";

const CART_KEY: string = "tt_cart";

function loadCart(): CartItem[] {
  try {
    const raw: string | null = localStorage.getItem(CART_KEY);
    if (raw) {
      return JSON.parse(raw) as CartItem[];
    }
  } catch {
    /* ignore */
  }
  return [];
}

function persistCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* ignore */
  }
}

export const CartProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const [cart, setCart] = useState<CartItem[]>(loadCart);

  const persistSetCart: (fn: (prev: CartItem[]) => CartItem[]) => void = useCallback((fn: (prev: CartItem[]) => CartItem[]): void => {
    setCart((prev) => {
      const next: CartItem[] = fn(prev);
      persistCart(next);
      return next;
    });
  }, []);

  const addToCart: (product: Product, cantidad?: number) => void = useCallback((product: Product, cantidad: number = 1): void => {
    persistSetCart((prev) => {
      const existing: CartItem | undefined = prev.find((it) => it.product.id === product.id);
      if (existing) {
        return prev.map((it) => (it.product.id === product.id ? { ...it, quantity: it.quantity + cantidad } : it));
      }
      return [...prev, { quantity: cantidad, product }];
    });
  }, [persistSetCart]);

  const clearCart: () => void = useCallback(() => persistSetCart(() => []), [persistSetCart]);

  const getCartQuantity: () => number = useCallback((): number => cart.reduce((s, it) => s + it.quantity, 0), [cart]);

  const getCartTotal: () => number = useCallback((): number => cart.reduce((s, it) => s + it.product.price * it.quantity, 0), [cart]);

  const removeFromCart: (productId: string) => void = useCallback((productId: string) => {
    persistSetCart((prev) => prev.filter((it) => it.product.id !== productId));
  }, [persistSetCart]);

  const updateQuantity: (productId: string, cantidad: number) => void = useCallback((productId: string, cantidad: number) => {
    persistSetCart((prev) => prev.map((it) => (it.product.id === productId ? { ...it, quantity: cantidad } : it)));
  }, [persistSetCart]);

  const value: CartContextType = useMemo(
    () => ({ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartQuantity, getCartTotal }),
    [cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartQuantity, getCartTotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
