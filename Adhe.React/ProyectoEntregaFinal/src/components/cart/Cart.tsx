import React, { useCallback } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { CartItem } from "../../models";

import useCart from "../../hooks/selectors/useCart";
import useCartActions from "../../hooks/useCartActions";
import CartView from "./CartView";

const Cart: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { appliedCoupon, cart, discountedByCurrency, totalsByCurrency, removeFromCart } = useCart();
  const { increment, decrement } = useCartActions();

  const handleBack: () => void = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handlePurchase: () => void = useCallback(() => {
    navigate("/checkout");
  }, [navigate]);

  const handleItemIncrement: (item: CartItem) => void = useCallback(
    (item: CartItem): void => {
      increment(item.product);
    },
    [increment],
  );

  const handleItemDecrement: (item: CartItem) => void = useCallback(
    (item: CartItem): void => {
      decrement(item.product);
    },
    [decrement],
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
      discountedByCurrency={discountedByCurrency}
      onBack={handleBack}
      onItemDecrement={handleItemDecrement}
      onItemIncrement={handleItemIncrement}
      onItemRemove={handleItemRemove}
      onPurchase={handlePurchase}
      totalsByCurrency={totalsByCurrency}
    />
  );
};

export default Cart;
