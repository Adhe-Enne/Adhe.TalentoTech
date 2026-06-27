import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { CartItem } from "../../models";

import useCart from "../../hooks/selectors/useCart";
import useNotification from "../../hooks/selectors/useNotification";
import CartView from "./CartView";

const Cart: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { cart, discountedTotal, appliedCoupon, rawTotal, isApplyingCoupon, applyCoupon, removeCoupon, updateQuantity, removeFromCart } = useCart();
  const { setNotification } = useNotification();
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleBack: () => void = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handlePurchase: () => void = useCallback(() => {
    navigate("/checkout");
  }, [navigate]);

  const handleItemIncrement: (item: CartItem) => void = useCallback(
    (item: CartItem): void => {
      if (item.quantity >= item.product.stock) {
        return;
      }
      updateQuantity(item.product.id, item.quantity + 1);
    },
    [updateQuantity],
  );

  const handleItemDecrement: (item: CartItem) => void = useCallback(
    (item: CartItem): void => {
      if (item.quantity <= 1) {
        removeFromCart(item.product.id);
        return;
      }
      updateQuantity(item.product.id, item.quantity - 1);
    },
    [updateQuantity, removeFromCart],
  );

  const handleItemRemove: (item: CartItem) => void = useCallback(
    (item: CartItem): void => {
      removeFromCart(item.product.id);
    },
    [removeFromCart],
  );

  const handleApplyCoupon: () => Promise<void> = useCallback(async (): Promise<void> => {
    setCouponError(null);
    const result: { success: boolean; error?: string } = await applyCoupon(couponCode);
    if (result.success) {
      setCouponCode("");
      setNotification("Cupon aplicado con exito", 2000, "success");
    } else {
      setCouponError(result.error ?? "Error al aplicar cupon");
      setNotification(result.error ?? "Error al aplicar cupon", 3000, "danger");
    }
  }, [applyCoupon, couponCode, setNotification]);

  const handleRemoveCoupon: () => void = useCallback(() => {
    removeCoupon();
    setCouponError(null);
  }, [removeCoupon]);

  const daysUntilExpiry: number | null = useMemo((): number | null => {
    if (!appliedCoupon?.expiresAt) {
      return null;
    }
    const now: Date = new Date();
    const expiry: Date = new Date(appliedCoupon.expiresAt);
    const diff: number = expiry.getTime() - now.getTime();
    const days: number = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  }, [appliedCoupon]);

  return (
    <CartView
      appliedCoupon={appliedCoupon}
      cart={cart}
      couponCode={couponCode}
      couponError={couponError}
      daysUntilExpiry={daysUntilExpiry}
      discountedTotal={discountedTotal}
      isApplyingCoupon={isApplyingCoupon}
      onApplyCoupon={handleApplyCoupon}
      onBack={handleBack}
      onCouponCodeChange={setCouponCode}
      onItemDecrement={handleItemDecrement}
      onItemIncrement={handleItemIncrement}
      onItemRemove={handleItemRemove}
      onPurchase={handlePurchase}
      onRemoveCoupon={handleRemoveCoupon}
      rawTotal={rawTotal}
    />
  );
};

export default Cart;
