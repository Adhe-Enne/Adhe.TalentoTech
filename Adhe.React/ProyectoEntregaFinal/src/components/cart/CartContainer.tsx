import React, { useCallback, useRef, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import useCart from "../../hooks/useCart";
import useNotification from "../../hooks/useNotification";
import Cart from "./Cart";

const CartContainer: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { setNotification } = useNotification();
  const {
    cart,
    clearCart,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    discountedTotal,
    applyCoupon,
    removeCoupon,
    isApplyingCoupon,
    getCartTotal,
  } = useCart();
  const timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null> = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [couponCode, setCouponCode] = useState<string>("");
  const [couponError, setCouponError] = useState<string | null>(null);

  React.useEffect((): (() => void) => {
    return (): void => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleBack: () => void = useCallback(() => navigate("/"), [navigate]);

  const handleChangeQty: (id: string, qty: number) => void = useCallback(
    (id: string, qty: number) => {
      const item = cart.find((it) => it.product.id === id);
      if (!item) {return;}

      if (qty > item.quantity && qty > item.product.stock) {
        setNotification(`Stock maximo alcanzado para ${item.product.name}`, 3000, "warning");
        return;
      }

      updateQuantity(id, qty);
      if (qty > item.quantity) {
        setNotification(`${item.product.name}: +1 unidad`, 2000, "info");
      } else if (qty < item.quantity) {
        setNotification(`${item.product.name}: -1 unidad`, 2000, "info");
      }
    },
    [cart, updateQuantity, setNotification],
  );

  const handleRemove: (id: string) => void = useCallback(
    (id: string) => {
      const item = cart.find((it) => it.product.id === id);
      removeFromCart(id);
      if (item) {
        setNotification(`${item.product.name} eliminado del carrito`, 2000, "info");
      }
    },
    [cart, removeFromCart, setNotification],
  );

  const handleApplyCoupon: () => void = useCallback(async () => {
    setCouponError(null);
    const result = await applyCoupon(couponCode);
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

  const handlePurchase: () => void = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setNotification("Compra realizada con exito", 3000, "success");
    timerRef.current = setTimeout(() => {
      clearCart();
      navigate("/");
    }, 3000);
  }, [clearCart, navigate, setNotification]);

  return (
    <Cart
      appliedCoupon={appliedCoupon}
      couponCode={couponCode}
      couponError={couponError}
      discountedTotal={discountedTotal}
      isApplyingCoupon={isApplyingCoupon}
      items={cart}
      onApplyCoupon={handleApplyCoupon}
      onBack={handleBack}
      onChangeQty={handleChangeQty}
      onCouponCodeChange={setCouponCode}
      onPurchase={handlePurchase}
      onRemove={handleRemove}
      onRemoveCoupon={handleRemoveCoupon}
      rawTotal={getCartTotal()}
    />
  );
};

export default CartContainer;
