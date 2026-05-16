import React, { useState, useCallback, useMemo } from "react";

import type { CartItem, Product } from "../../models";
import type { ProviderProps } from "../../models/ProviderProps";
import type { CartContextType } from "./Cart.Type";

import CartContext from "./CartContext";

export const CartProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart: (product: Product, cantidad?: number) => void = useCallback(
    (product: Product, cantidad: number = 1): void => {
      setCart((prev) => {
        const existing: CartItem | undefined = prev.find((it) => it.product.id === product.id);

        if (existing) {
          return prev.map((it) => (it.product.id === product.id ? { ...it, cantidad: it.cantidad + cantidad } : it));
        }

        return [...prev, { cantidad, product }];
      });
    },
    [],
  );

  const clearCart: () => void = useCallback(() => setCart([]), []);

  const getCartQuantity: () => number = useCallback((): number => cart.reduce((s, it) => s + it.cantidad, 0), [cart]);

  const getCartTotal: () => number = useCallback(
    (): number => cart.reduce((s, it) => s + it.product.precio * it.cantidad, 0),
    [cart],
  );

  const removeFromCart: (productId: number) => void = useCallback((productId: number) => {
    setCart((prev) => prev.filter((it) => it.product.id !== productId));
  }, []);

  const updateQuantity: (productId: number, cantidad: number) => void = useCallback(
    (productId: number, cantidad: number) => {
      setCart((prev) => prev.map((it) => (it.product.id === productId ? { ...it, cantidad } : it)));
    },
    [],
  );

  const value: CartContextType = useMemo(
    () => ({ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartQuantity, getCartTotal }),
    [cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartQuantity, getCartTotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
