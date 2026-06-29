import React, { useCallback } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { CartItem } from "../../models";

import useCart from "../../hooks/selectors/useCart";
import CartView from "./CartView";

const Cart: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { cart, updateQuantity, removeFromCart } = useCart();

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
      cart={cart}
      onBack={handleBack}
      onItemDecrement={handleItemDecrement}
      onItemIncrement={handleItemIncrement}
      onItemRemove={handleItemRemove}
      onPurchase={handlePurchase}
    />
  );
};

export default Cart;
