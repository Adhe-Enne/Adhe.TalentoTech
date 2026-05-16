import React, { useCallback } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import { useCart } from "../../hooks/useCart";
import Carrito from "./Carrito";

const CarritoContainer: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const handleBack: () => void | Promise<void> = useCallback(() => navigate("/"), [navigate]);
  const { cart, updateQuantity, removeFromCart } = useCart();

  const handleChangeCantidad: (id: number, qty: number) => void = useCallback(
    (id: number, qty: number) => updateQuantity(id, qty),
    [updateQuantity],
  );

  const handleRemove: (id: number) => void = useCallback((id: number) => removeFromCart(id), [removeFromCart]);

  return <Carrito items={cart} onBack={handleBack} onChangeCantidad={handleChangeCantidad} onRemove={handleRemove} />;
};

export default CarritoContainer;
