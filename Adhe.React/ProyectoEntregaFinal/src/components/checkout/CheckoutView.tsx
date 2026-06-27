import React from "react";
import { Container } from "react-bootstrap";
import { FaArrowLeft, FaCreditCard } from "react-icons/fa";

import HelmetMeta from "../ui/HelmetMeta";
import OrderSummary from "./OrderSummary";
import { type ShippingFormHandle } from "./ShippingForm";
import ShippingForm from "./ShippingForm";

interface CheckoutViewProps {
  error: string | null;
  isLoading: boolean;
  shippingRef: React.RefObject<ShippingFormHandle | null>;
  onBack: () => void;
  onConfirm: () => void;
}

const CheckoutView: React.FC<CheckoutViewProps> = (props) => {
  const { error, isLoading, onBack, onConfirm, shippingRef } = props;
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
          <button className="btn btn-cta btn-icon w-100 mt-3" disabled={isLoading} onClick={onConfirm}>
            <FaCreditCard />
            {isLoading ? "Procesando..." : "Confirmar compra"}
          </button>
          {error && <div className="text-danger mt-2">{error}</div>}
        </div>
      </div>

      <button className="btn btn-outline-secondary mt-3" onClick={onBack}>
        <FaArrowLeft className="me-1" />
        Volver al carrito
      </button>
    </Container>
  );
};

export default CheckoutView;
