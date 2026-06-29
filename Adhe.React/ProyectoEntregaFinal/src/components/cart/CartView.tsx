import React from "react";
import { Button, Container, ListGroup } from "react-bootstrap";
import { FaCreditCard } from "react-icons/fa";
import { Link } from "react-router-dom";

import type { CartItem } from "../../models";

import useCart from "../../hooks/selectors/useCart";
import { formatPrice } from "../../utils/format";
import HelmetMeta from "../ui/HelmetMeta";
import CartItemRow from "./CartItemRow";
import CouponSection from "./CouponSection";

interface CartListViewProps {
  cart: CartItem[];
  onBack: () => void;
  onItemDecrement: (item: CartItem) => void;
  onItemIncrement: (item: CartItem) => void;
  onItemRemove: (item: CartItem) => void;
  onPurchase: () => void;
}

const CartView: React.FC<CartListViewProps> = (props) => {
  const { cart, onBack, onItemDecrement, onItemIncrement, onItemRemove, onPurchase } = props;
  const { appliedCoupon, discountedTotal, rawTotal } = useCart();

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
              <CartItemRow
                item={it}
                key={it.product.id}
                onDecrement={() => onItemDecrement(it)}
                onIncrement={() => onItemIncrement(it)}
                onRemove={() => onItemRemove(it)}
              />
            ))}
          </ListGroup>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <strong>Total:</strong>
            </div>
            <div className="text-end">
              <strong className="d-block">{formatPrice(rawTotal)}</strong>
            </div>
          </div>
        </div>
      )}

      {cart.length > 0 && <CouponSection />}

      <div className="d-flex justify-content-between align-items-center mt-3 p-3 bg-light rounded">
        <strong>Total final:</strong>
        <div className="text-end">
          {appliedCoupon && <small className="text-muted text-decoration-line-through d-block">{formatPrice(rawTotal)}</small>}
          <strong className="fs-4">{formatPrice(discountedTotal ?? rawTotal)}</strong>
        </div>
      </div>

      {cart.length > 0 && (
        <div className="mt-2">
          <button className="btn btn-cta btn-icon w-100" onClick={onPurchase}>
            <FaCreditCard />
            Proceder al pago
          </button>
        </div>
      )}

      <div className="mt-3">
        <Button onClick={onBack} variant="secondary">
          Volver
        </Button>
      </div>
    </Container>
  );
};

export default CartView;
