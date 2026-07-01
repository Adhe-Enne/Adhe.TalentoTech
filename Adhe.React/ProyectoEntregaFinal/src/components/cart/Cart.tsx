import React, { useCallback } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { CartItem } from "../../models";

import useCart from "../../hooks/selectors/useCart";
import CartView from "./CartView";

const Cart: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { appliedCoupon, cart, discountedTotal, rawTotal, updateQuantity, removeFromCart } = useCart();

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

  return (
    <CartView
      appliedCoupon={appliedCoupon}
      cart={cart}
      discountedTotal={discountedTotal}
      onBack={handleBack}
      onItemDecrement={handleItemDecrement}
      onItemIncrement={handleItemIncrement}
      onItemRemove={handleItemRemove}
      onPurchase={handlePurchase}
      rawTotal={rawTotal}
    />
  );
};

export default Cart;
