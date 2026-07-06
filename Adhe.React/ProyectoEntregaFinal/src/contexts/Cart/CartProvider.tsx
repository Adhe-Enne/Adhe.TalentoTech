import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { CartItem, CouponValidationResult, Product } from "../../models";
import type { ProviderProps } from "../../types/ProviderProps";
import type { CartContextType, AppliedCoupon } from "./CartContext";

import useAuth from "../../hooks/selectors/useAuth";
import { couponService } from "../../services/couponService";
import { loadFromStorage, saveToStorage } from "../../utils/storage";
import CartContext from "./CartContext";

const CART_KEY_PREFIX: string = "tt_cart";
const COUPON_KEY_PREFIX: string = "tt_coupon";

function getCartKey(userId?: string): string {
  return userId ? `${CART_KEY_PREFIX}_${userId}` : CART_KEY_PREFIX;
}

function getCouponKey(userId?: string): string {
  return userId ? `${COUPON_KEY_PREFIX}_${userId}` : COUPON_KEY_PREFIX;
}

export const CartProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const { user } = useAuth();
  const userId: string | undefined = user?.uid;

  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage<CartItem[]>(getCartKey(userId), []));
  const prevUserId: React.RefObject<string | undefined> = useRef<string | undefined>(userId);

  if (prevUserId.current !== userId) {
    prevUserId.current = userId;
    setCart(loadFromStorage<CartItem[]>(getCartKey(userId), []));
  }

  const rawTotal: number = useMemo(() => cart.reduce((s, it) => s + it.product.price * it.quantity, 0), [cart]);

  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  const totalsByCurrency: Record<string, number> = useMemo(() => {
    const result: Record<string, number> = {};
    for (const it of cart) {
      const c: string = it.product.currency ?? "USD";
      result[c] = (result[c] ?? 0) + it.product.price * it.quantity;
    }
    return result;
  }, [cart]);

  const discountedByCurrency: Record<string, number> = useMemo(() => {
    if (!appliedCoupon) {
      return totalsByCurrency;
    }
    const result: Record<string, number> = {};
    for (const [c, total] of Object.entries(totalsByCurrency)) {
      result[c] = Math.max(0, total - total * (appliedCoupon.discountValue / 100));
    }
    return result;
  }, [totalsByCurrency, appliedCoupon]);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect((): void => {
    const savedCode: string | null = loadFromStorage<string | null>(getCouponKey(userId), null);
    if (savedCode) {
      couponService.validateCoupon(savedCode).then((result: CouponValidationResult) => {
        if (result.valid && result.discountValue != null) {
          setAppliedCoupon({
            code: savedCode,
            discountValue: result.discountValue,
            id: result.id ?? "",
            expiresAt: result.expiresAt ?? null,
          });
        } else {
          saveToStorage(getCouponKey(userId), null);
        }
      });
    }
  }, [userId]);

  const applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }> = useCallback(
    async (code: string): Promise<{ success: boolean; error?: string }> => {
      setIsApplyingCoupon(true);
      try {
        const result: CouponValidationResult = await couponService.validateCoupon(code);
        if (!result.valid || result.discountValue == null) {
          return { success: false, error: result.error ?? "Cupón inválido" };
        }
        setAppliedCoupon({
          code: code.trim().toUpperCase(),
          discountValue: result.discountValue,
          id: result.id ?? "",
          expiresAt: result.expiresAt ?? null,
        });
        saveToStorage(getCouponKey(userId), code.trim().toUpperCase());
        return { success: true };
      } finally {
        setIsApplyingCoupon(false);
      }
    },
    [userId],
  );

  const removeCoupon: () => void = useCallback((): void => {
    setAppliedCoupon(null);
    saveToStorage(getCouponKey(userId), null);
  }, [userId]);

  const discountedTotal: number = appliedCoupon ? Math.max(0, rawTotal - rawTotal * (appliedCoupon.discountValue / 100)) : rawTotal;

  const persistSetCart: (fn: (prev: CartItem[]) => CartItem[]) => void = useCallback(
    (fn: (prev: CartItem[]) => CartItem[]): void => {
      setCart((prev) => {
        const next: CartItem[] = fn(prev);
        saveToStorage(getCartKey(userId), next);
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
      getCantidadActual,
      rawTotal,
      totalsByCurrency,
      discountedByCurrency,
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
      getCantidadActual,
      rawTotal,
      totalsByCurrency,
      discountedByCurrency,
      appliedCoupon,
      discountedTotal,
      applyCoupon,
      removeCoupon,
      isApplyingCoupon,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
