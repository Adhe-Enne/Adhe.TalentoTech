import React, { useCallback, useMemo, useRef, useState } from "react";

import type { CartItem, Product } from "../../models";
import type { ProviderProps } from "../../types/ProviderProps";
import type { CartContextType } from "./CartTypes";

import useAuth from "../../hooks/selectors/useAuth";
import useCouponManager from "../../hooks/useCouponManager";
import { loadCart, persistCart } from "../../utils/cartPersistence";
import CartContext from "./CartContext";

export const CartProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const { user } = useAuth();
  const userId: string | undefined = user?.uid;

  const [cart, setCart] = useState<CartItem[]>(() => loadCart(userId));
  const prevUserId: React.MutableRefObject<string | undefined> = useRef<string | undefined>(userId);

  if (prevUserId.current !== userId) {
    prevUserId.current = userId;
    setCart(loadCart(userId));
  }

  const rawTotal: number = useMemo(() => cart.reduce((s, it) => s + it.product.price * it.quantity, 0), [cart]);
  const { appliedCoupon, isApplyingCoupon, discountedTotal, applyCoupon, removeCoupon } = useCouponManager(rawTotal, userId);

  const persistSetCart: (fn: (prev: CartItem[]) => CartItem[]) => void = useCallback(
    (fn: (prev: CartItem[]) => CartItem[]): void => {
      setCart((prev) => {
        const next: CartItem[] = fn(prev);
        persistCart(next, userId);
        return next;
      });
    },
    [userId],
  );

  const addToCart: (product: Product, cantidad?: number) => void = useCallback(
    (product: Product, cantidad: number = 1): void => {
      persistSetCart((prev) => {
        const existing: CartItem | undefined = prev.find((it) => it.product.id === product.id);
        if (existing) {
          return prev.map((it) => (it.product.id === product.id ? { ...it, quantity: it.quantity + cantidad } : it));
        }
        return [...prev, { product, quantity: cantidad }];
      });
    },
    [persistSetCart],
  );

  const clearCart: () => void = useCallback(() => {
    persistSetCart(() => []);
    removeCoupon();
  }, [persistSetCart, removeCoupon]);

  const getCartQuantity: () => number = useCallback((): number => cart.reduce((s, it) => s + it.quantity, 0), [cart]);

  const getCartTotal: () => number = useCallback((): number => cart.reduce((s, it) => s + it.product.price * it.quantity, 0), [cart]);

  const getCantidadActual: (productId: string) => number = useCallback((productId: string): number => cart.find((it) => it.product.id === productId)?.quantity ?? 0, [cart]);

  const removeFromCart: (productId: string) => void = useCallback(
    (productId: string) => {
      persistSetCart((prev) => prev.filter((it) => it.product.id !== productId));
    },
    [persistSetCart],
  );

  const updateQuantity: (productId: string, cantidad: number) => void = useCallback(
    (productId: string, cantidad: number) => {
      persistSetCart((prev) => prev.map((it) => (it.product.id === productId ? { ...it, quantity: cantidad } : it)));
    },
    [persistSetCart],
  );

  const value: CartContextType = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartQuantity,
      getCartTotal,
      getCantidadActual,
      appliedCoupon,
      discountedTotal,
      applyCoupon,
      removeCoupon,
      isApplyingCoupon,
    }),
    [
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartQuantity,
      getCartTotal,
      getCantidadActual,
      appliedCoupon,
      discountedTotal,
      applyCoupon,
      removeCoupon,
      isApplyingCoupon,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
