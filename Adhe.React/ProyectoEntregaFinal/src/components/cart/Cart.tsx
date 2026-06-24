import React, { useCallback, useRef } from "react";
import { Button, Container, ListGroup } from "react-bootstrap";
import { FaCreditCard } from "react-icons/fa";
import { Link, useNavigate, type NavigateFunction } from "react-router-dom";

import useCart from "../../hooks/useCart";
import useNotification from "../../hooks/useNotification";
import HelmetMeta from "../ui/HelmetMeta";
import CartItemRow from "./CartItemRow";
import CouponSection from "./CouponSection";

const Cart: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { setNotification } = useNotification();
  const { cart, clearCart, discountedTotal, appliedCoupon, getCartTotal } = useCart();
  const timerRef: React.RefObject<ReturnType<typeof setTimeout> | null> = useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect((): (() => void) => {
    return (): void => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleBack: () => void = useCallback(() => {
    navigate("/");
  }, [navigate]);

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

  const rawTotal: number = getCartTotal();

  return (
    <Container className="py-4">
      <HelmetMeta description="Revisa tu carrito de compras en Talento Tech." title="Talento Tech | Carrito" />
      <h2>Carrito</h2>
      {cart.length === 0 ? (
        <div className="text-center py-5">
          <h4>Tu carrito está vacío</h4>
          <p className="text-muted">Agregá productos para continuar la compra.</p>
          <Link className="btn btn-primary" to="/productos">
            Ver Productos
          </Link>
        </div>
      ) : (
        <div className="cart-list">
          <ListGroup>
            {cart.map((it) => (
              <CartItemRow item={it} key={it.product.id} />
            ))}
          </ListGroup>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <strong>Total:</strong>
            </div>
            <div className="text-end">
              <strong className="d-block">${rawTotal.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      )}

      {cart.length > 0 && <CouponSection />}

      <div className="d-flex justify-content-between align-items-center mt-3 p-3 bg-light rounded">
        <strong>Total final:</strong>
        <div className="text-end">
          {appliedCoupon && <small className="text-muted text-decoration-line-through d-block">${rawTotal.toFixed(2)}</small>}
          <strong className="fs-4">${discountedTotal.toFixed(2)}</strong>
        </div>
      </div>

      {cart.length > 0 && (
        <div className="mt-2">
          <button className="btn btn-cta btn-icon w-100" onClick={handlePurchase}>
            <FaCreditCard />
            Proceder al pago
          </button>
        </div>
      )}

      <div className="mt-3">
        <Button onClick={handleBack} variant="secondary">
          Volver
        </Button>
      </div>
    </Container>
  );
};

export default Cart;