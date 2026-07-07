import React, { useCallback, useRef, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { ShippingInfo } from "../../models";

import useAuth from "../../hooks/selectors/useAuth";
import useCart from "../../hooks/selectors/useCart";
import useNotification from "../../hooks/selectors/useNotification";
import useOrders from "../../hooks/useOrders";
import { OrderStatus } from "../../models/Order";
import { exchangeRateService } from "../../services/exchangeRateService";
import { withToast } from "../../utils/withToast";
import CheckoutView from "./CheckoutView";
import { type ShippingFormHandle } from "./ShippingForm";

const CheckoutContainer: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart, rawTotal, appliedCoupon, discountedTotal } = useCart();
  const { setNotification } = useNotification();
  const { checkout, isLoading, error } = useOrders();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const shippingRef: React.RefObject<ShippingFormHandle | null> = useRef<ShippingFormHandle>(null);
  const isSubmittingRef: React.RefObject<boolean> = useRef<boolean>(false);

  const handleConfirm: () => Promise<void> = useCallback(async (): Promise<void> => {
    if (!user || isSubmittingRef.current) {
      return;
    }
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      if (cart.length === 0) {
        setNotification("El carrito está vacío", 3000, "warning");
        return;
      }

      const result: { valid: boolean; data?: ShippingInfo; error?: string } = shippingRef.current?.getData() ?? { valid: false, error: "Error inesperado" };
      if (!result.valid || !result.data) {
        setNotification(result.error ?? "Completá todos los campos de envío", 3000, "warning");
        return;
      }

      const currencies: string[] = [...new Set(cart.map((it) => it.product.currency ?? "USD"))];
      const isMixed: boolean = currencies.length > 1;

      const rates: Record<string, number> = {};
      for (const c of currencies) {
        rates[c] = await exchangeRateService.getRate(c);
      }

      let orderCurrency: string;
      let exchangeRate: number;
      let subtotal: number;
      let discount: number;
      let total: number;

      if (isMixed) {
        let subtotalUSD: number = 0;
        for (const item of cart) {
          const c: string = item.product.currency ?? "USD";
          subtotalUSD += item.product.price * item.quantity * rates[c];
        }
        subtotalUSD = Number(subtotalUSD.toFixed(2));
        const discountUSD: number = appliedCoupon ? Number((subtotalUSD * (appliedCoupon.discountValue / 100)).toFixed(2)) : 0;
        const totalUSD: number = Number(Math.max(0, subtotalUSD - discountUSD).toFixed(2));

        orderCurrency = "USD";
        exchangeRate = 1;
        subtotal = subtotalUSD;
        discount = discountUSD;
        total = totalUSD;
      } else {
        const [singleCurrency] = currencies;
        orderCurrency = singleCurrency;
        exchangeRate = rates[singleCurrency];
        subtotal = rawTotal;
        discount = appliedCoupon ? rawTotal - discountedTotal : 0;
        total = discountedTotal;
      }

      const totalInBase: number = Number((total * exchangeRate).toFixed(2));

      const orderId: string | undefined = await withToast(
        () =>
          checkout({
            userId: user.uid,
            userEmail: user.email,
            items: cart.map((item) => ({
              productId: item.product.id,
              productName: item.product.name,
              productImage: item.product.image,
              price: item.product.price,
              quantity: item.quantity,
              subtotal: item.product.price * item.quantity,
              currency: item.product.currency ?? "USD",
            })),
            currency: orderCurrency,
            exchangeRate,
            baseCurrency: "USD",
            totalInBase,
            subtotal,
            discount,
            discountCode: appliedCoupon?.code ?? null,
            couponId: appliedCoupon?.id ?? null,
            total,
            status: OrderStatus.Completado,
            shippingInfo: result.data!,
          }),
        "Procesando compra...",
        "Compra realizada con éxito",
        "Error al procesar la compra",
      );
      if (orderId) {
        navigate(`/orden/${orderId}`);
        clearCart();
      }
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [user, cart, checkout, clearCart, navigate, setNotification, rawTotal, appliedCoupon, discountedTotal]);

  const handleBack: () => void = useCallback(() => {
    navigate("/carrito");
  }, [navigate]);

  if (!user) {
    return null;
  }

  if (cart.length === 0) {
    return null;
  }

  return (
    <CheckoutView
      appliedCoupon={appliedCoupon}
      cart={cart}
      discountedTotal={discountedTotal}
      error={error}
      isLoading={isLoading || isSubmitting}
      onBack={handleBack}
      onConfirm={handleConfirm}
      rawTotal={rawTotal}
      shippingRef={shippingRef}
    />
  );
};

export default CheckoutContainer;
