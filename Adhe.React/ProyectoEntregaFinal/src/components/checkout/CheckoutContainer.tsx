import React, { useCallback, useRef } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { ShippingInfo } from "../../models";

import useAuth from "../../hooks/selectors/useAuth";
import useCart from "../../hooks/selectors/useCart";
import useNotification from "../../hooks/selectors/useNotification";
import useOrders from "../../hooks/useOrders";
import { OrderStatus } from "../../models/Order";
import CheckoutView from "./CheckoutView";
import { type ShippingFormHandle } from "./ShippingForm";

const CheckoutContainer: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart, rawTotal, appliedCoupon, discountedTotal } = useCart();
  const { setNotification } = useNotification();
  const { checkout, isLoading, error } = useOrders();
  const shippingRef: React.RefObject<ShippingFormHandle | null> = useRef<ShippingFormHandle>(null);

  const handleConfirm: () => Promise<void> = useCallback(async (): Promise<void> => {
    if (!user) {
      return;
    }
    if (cart.length === 0) {
      setNotification("El carrito está vacío", 3000, "warning");
      return;
    }

    const result: { valid: boolean; data?: ShippingInfo; error?: string } = shippingRef.current?.getData() ?? { valid: false, error: "Error inesperado" };
    if (!result.valid || !result.data) {
      setNotification(result.error ?? "Completá todos los campos de envío", 3000, "warning");
      return;
    }

    try {
      const orderId: string = await checkout({
        userId: user.uid,
        userEmail: user.email,
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.image,
          price: item.product.price,
          quantity: item.quantity,
          subtotal: item.product.price * item.quantity,
        })),
        subtotal: rawTotal,
        discount: appliedCoupon ? rawTotal - discountedTotal : 0,
        discountCode: appliedCoupon?.code ?? null,
        couponId: appliedCoupon?.id ?? null,
        total: discountedTotal,
        status: OrderStatus.Completado,
        shippingInfo: result.data,
      });

      clearCart();
      setNotification("Compra realizada con éxito", 3000, "success");
      navigate(`/orden/${orderId}`);
    } catch {
      setNotification(error ?? "Error al procesar la compra", 4000, "danger");
    }
  }, [user, cart, checkout, clearCart, navigate, setNotification, rawTotal, appliedCoupon, discountedTotal, error]);

  const handleBack: () => void = useCallback(() => {
    navigate("/carrito");
  }, [navigate]);

  if (!user) {
    return null;
  }

  if (cart.length === 0) {
    navigate("/carrito", { replace: true });
    return null;
  }

  return <CheckoutView error={error} isLoading={isLoading} onBack={handleBack} onConfirm={handleConfirm} shippingRef={shippingRef} />;
};

export default CheckoutContainer;
