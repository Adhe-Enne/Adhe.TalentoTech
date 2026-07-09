import React from "react";
import { FaArrowLeft, FaCreditCard } from "react-icons/fa";

import type { AppliedCoupon } from "../../contexts/Cart/CartContext";
import type { CartItem } from "../../models";

import HelmetMeta from "../ui/HelmetMeta";
import OrderSummary from "./OrderSummary";
import { type ShippingFormHandle } from "./ShippingForm";
import ShippingForm from "./ShippingForm";

interface CheckoutViewProps {
  appliedCoupon: AppliedCoupon | null;
  cart: CartItem[];
  discountedTotal: number;
  error: string | null;
  isLoading: boolean;
  rawTotal: number;
  shippingRef: React.RefObject<ShippingFormHandle | null>;
  onBack: () => void;
  onConfirm: () => void;
}

const CheckoutView: React.FC<CheckoutViewProps> = (props) => {
  const { appliedCoupon, cart, discountedTotal, error, isLoading, rawTotal, onBack, onConfirm, shippingRef } = props;
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <HelmetMeta description="Confirmá tu compra en Talento Tech." title="Talento Tech | Checkout" />
      <h2>Checkout</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <ShippingForm ref={shippingRef} />
        </div>
        <div>
          <OrderSummary appliedCoupon={appliedCoupon} cart={cart} discountedTotal={discountedTotal} rawTotal={rawTotal} />
          <button className="bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90 inline-flex items-center gap-2 w-full mt-3" disabled={isLoading} onClick={onConfirm}>
            <FaCreditCard />
            {isLoading ? "Procesando..." : "Confirmar compra"}
          </button>
          {error && <div className="text-danger mt-2" role="alert">{error}</div>}
        </div>
      </div>

      <button className="bg-transparent border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50 mt-3" onClick={onBack}>
        <FaArrowLeft className="mr-1" />
        Volver al carrito
      </button>
    </div>
  );
};

export default CheckoutView;
