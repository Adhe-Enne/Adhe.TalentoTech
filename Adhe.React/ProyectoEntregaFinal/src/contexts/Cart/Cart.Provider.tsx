import React, { useState, useCallback, useMemo } from "react";

import type { CartItem, Product } from "../../models";
import type { ProviderProps } from "../../models/ProviderProps";
import type { CartContextType } from "./Cart.Type";

import CartContext from "./CartContext";

export const CartProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart: (product: Product, cantidad?: number) => void = useCallback((product: Product, cantidad: number = 1): void => {
    setCart((prev) => {
      const existing: CartItem | undefined = prev.find((it) => it.product.id === product.id);

      if (existing) {
        return prev.map((it) => (it.product.id === product.id ? { ...it, quantity: it.quantity + cantidad } : it));
      }

      return [...prev, { quantity: cantidad, product }];
    });
  }, []);

  const clearCart: () => void = useCallback(() => setCart([]), []);

  const getCartQuantity: () => number = useCallback((): number => cart.reduce((s, it) => s + it.quantity, 0), [cart]);

  const getCartTotal: () => number = useCallback((): number => cart.reduce((s, it) => s + it.product.price * it.quantity, 0), [cart]);

  const removeFromCart: (productId: string) => void = useCallback((productId: string) => {
    setCart((prev) => prev.filter((it) => it.product.id !== productId));
  }, []);

  const updateQuantity: (productId: string, cantidad: number) => void = useCallback((productId: string, cantidad: number) => {
    setCart((prev) => prev.map((it) => (it.product.id === productId ? { ...it, quantity: cantidad } : it)));
  }, []);

  const value: CartContextType = useMemo(
    () => ({ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartQuantity, getCartTotal }),
    [cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartQuantity, getCartTotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
