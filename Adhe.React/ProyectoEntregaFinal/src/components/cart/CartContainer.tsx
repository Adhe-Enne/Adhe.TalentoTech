import React, { useCallback } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import { useCart } from "../../hooks/useCart";
import Cart from "./Cart";

const CartContainer: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const handleBack: () => void | Promise<void> = useCallback(() => navigate("/"), [navigate]);
  const { cart, updateQuantity, removeFromCart } = useCart();

  const handleChangeQty: (id: number, qty: number) => void = useCallback((id: number, qty: number) => updateQuantity(id, qty), [updateQuantity]);

  const handleRemove: (id: number) => void = useCallback((id: number) => removeFromCart(id), [removeFromCart]);

  return <Cart items={cart} onBack={handleBack} onChangeQty={handleChangeQty} onRemove={handleRemove} />;
};

export default CartContainer;
