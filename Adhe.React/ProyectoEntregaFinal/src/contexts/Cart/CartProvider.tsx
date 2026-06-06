import React, { useState, useCallback, useMemo } from "react";

import type { CartItem, Product } from "../../models";
import type { ProviderProps } from "../../models/ProviderProps";
import type { AppliedCoupon, CartContextType } from "./CartType";

import { couponService, type CouponValidationResult } from "../../services/couponService";
import CartContext from "./CartContext";

const CART_KEY: string = "tt_cart";
const COUPON_KEY: string = "tt_coupon";

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

function loadSavedCouponCode(): string | null {
  try {
    return localStorage.getItem(COUPON_KEY);
  } catch {
    return null;
  }
}

function persistCouponCode(code: string | null): void {
  try {
    if (code) {
      localStorage.setItem(COUPON_KEY, code);
    } else {
      localStorage.removeItem(COUPON_KEY);
    }
  } catch {
    /* ignore */
  }
}

export const CartProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Re-validate saved coupon on mount
  React.useEffect(() => {
    const savedCode: string | null = loadSavedCouponCode();
    if (savedCode) {
      couponService.validateCoupon(savedCode).then((result) => {
        if (result.valid && result.discountValue != null) {
          setAppliedCoupon({
            code: savedCode,
            discountValue: result.discountValue,
            id: "",
          });
        } else {
          persistCouponCode(null);
        }
      });
    }
  }, []);

  const persistSetCart: (fn: (prev: CartItem[]) => CartItem[]) => void = useCallback((fn: (prev: CartItem[]) => CartItem[]): void => {
    setCart((prev) => {
      const next: CartItem[] = fn(prev);
      persistCart(next);
      return next;
    });
  }, []);

  const addToCart: (product: Product, cantidad?: number) => void = useCallback(
    (product: Product, cantidad: number = 1): void => {
      persistSetCart((prev) => {
        const existing: CartItem | undefined = prev.find((it) => it.product.id === product.id);
        if (existing) {
          return prev.map((it) => (it.product.id === product.id ? { ...it, quantity: it.quantity + cantidad } : it));
        }
        return [...prev, { quantity: cantidad, product }];
      });
    },
    [persistSetCart],
  );

  const clearCart: () => void = useCallback(() => {
    persistSetCart(() => []);
    setAppliedCoupon(null);
    persistCouponCode(null);
  }, [persistSetCart]);

  const getCartQuantity: () => number = useCallback((): number => cart.reduce((s, it) => s + it.quantity, 0), [cart]);

  const getCartTotal: () => number = useCallback((): number => cart.reduce((s, it) => s + it.product.price * it.quantity, 0), [cart]);

  const getCantidadActual: (productId: string) => number = useCallback((productId: string): number => cart.find((it) => it.product.id === productId)?.quantity ?? 0, [cart]);

  const isInCart: (productId: string) => boolean = useCallback((productId: string): boolean => cart.some((it) => it.product.id === productId), [cart]);

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

  const applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }> = useCallback(async (code: string): Promise<{ success: boolean; error?: string }> => {
    setIsApplyingCoupon(true);
    try {
      const result: CouponValidationResult = await couponService.validateCoupon(code);
      if (!result.valid || result.discountValue == null) {
        return { success: false, error: result.error ?? "Cupon invalido" };
      }
      const couponData: AppliedCoupon = {
        code: code.trim().toUpperCase(),
        discountValue: result.discountValue,
        id: "",
      };
      setAppliedCoupon(couponData);
      persistCouponCode(couponData.code);
      return { success: true };
    } finally {
      setIsApplyingCoupon(false);
    }
  }, []);

  const removeCoupon: () => void = useCallback((): void => {
    setAppliedCoupon(null);
    persistCouponCode(null);
  }, []);

  const rawTotal: number = useMemo(() => cart.reduce((s, it) => s + it.product.price * it.quantity, 0), [cart]);

  const discountedTotal: number = useMemo(() => {
    if (!appliedCoupon) {
      return rawTotal;
    }
    const discount: number = rawTotal * (appliedCoupon.discountValue / 100);
    return Math.max(0, rawTotal - discount);
  }, [rawTotal, appliedCoupon]);

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
      isInCart,
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
      isInCart,
      appliedCoupon,
      discountedTotal,
      applyCoupon,
      removeCoupon,
      isApplyingCoupon,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
