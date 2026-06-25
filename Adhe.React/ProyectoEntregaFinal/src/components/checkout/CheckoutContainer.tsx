import React, { useCallback, useMemo, useRef } from "react";
import { Container } from "react-bootstrap";
import { FaArrowLeft, FaCreditCard } from "react-icons/fa";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { ShippingInfo } from "../../models";
import { OrderStatus } from "../../models/Order";

import useAuth from "../../hooks/selectors/useAuth";
import useCart from "../../hooks/selectors/useCart";
import useNotification from "../../hooks/selectors/useNotification";
import useOrders from "../../hooks/useOrders";
import HelmetMeta from "../ui/HelmetMeta";
import OrderSummary from "./OrderSummary";
import ShippingForm, { type ShippingFormHandle } from "./ShippingForm";

const CheckoutContainer: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart, getCartTotal, appliedCoupon, discountedTotal } = useCart();
  const { setNotification } = useNotification();
  const { checkout, isLoading, error } = useOrders();
  const shippingRef: React.RefObject<ShippingFormHandle | null> = useRef<ShippingFormHandle>(null);

  const rawTotal: number = useMemo((): number => getCartTotal(), [getCartTotal]);

  const handleConfirm: () => void = useCallback(async (): Promise<void> => {
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

  return (
    <Container className="py-4">
      <HelmetMeta description="Confirmá tu compra en Talento Tech." title="Talento Tech | Checkout" />
      <h2>Checkout</h2>

      <div className="row">
        <div className="col-md-6 mb-4">
          <ShippingForm ref={shippingRef} />
        </div>
        <div className="col-md-6">
          <OrderSummary />
          <button className="btn btn-cta btn-icon w-100 mt-3" disabled={isLoading} onClick={handleConfirm}>
            <FaCreditCard />
            {isLoading ? "Procesando..." : "Confirmar compra"}
          </button>
          {error && <div className="text-danger mt-2">{error}</div>}
        </div>
      </div>

      <button className="btn btn-outline-secondary mt-3" onClick={handleBack}>
        <FaArrowLeft className="me-1" />
        Volver al carrito
      </button>
    </Container>
  );
};

export default CheckoutContainer;
