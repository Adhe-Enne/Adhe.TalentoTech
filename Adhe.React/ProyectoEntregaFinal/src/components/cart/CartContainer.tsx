import React, { useCallback, useRef } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import useCart from "../../hooks/useCart";
import useNotification from "../../hooks/useNotification";
import Cart from "./Cart";

const CartContainer: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { setNotification } = useNotification();
  const { cart, clearCart, removeFromCart, updateQuantity } = useCart();
  const timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null> = useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect((): (() => void) => {
    return (): void => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleBack: () => void = useCallback(() => navigate("/"), [navigate]);
  const handleChangeQty: (id: string, qty: number) => void = useCallback((id: string, qty: number) => updateQuantity(id, qty), [updateQuantity]);
  const handleRemove: (id: string) => void = useCallback((id: string) => removeFromCart(id), [removeFromCart]);

  const handlePurchase: () => void = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setNotification("¡Compra realizada con éxito! (Carrito se limpiará y será redirigido a Home)", 3000, "success");
    timerRef.current = setTimeout(() => {
      clearCart();
      navigate("/");
    }, 3000);
  }, [clearCart, navigate, setNotification]);

  return <Cart items={cart} onBack={handleBack} onChangeQty={handleChangeQty} onPurchase={handlePurchase} onRemove={handleRemove} />;
};

export default CartContainer;
