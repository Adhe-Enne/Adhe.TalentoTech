import React from "react";
import { Button, Container, ListGroup } from "react-bootstrap";
import { FaCreditCard } from "react-icons/fa";
import { Link } from "react-router-dom";

import type { AppliedCoupon } from "../../contexts/Cart/CartContext";
import type { CartItem } from "../../models";

import { formatPrice } from "../../utils/format";
import EmptyState from "../ui/EmptyState";
import HelmetMeta from "../ui/HelmetMeta";
import CartItemRow from "./CartItemRow";
import CouponSection from "./CouponSection";

interface CartListViewProps {
  appliedCoupon: AppliedCoupon | null;
  cart: CartItem[];
  discountedByCurrency: Record<string, number>;
  totalsByCurrency: Record<string, number>;
  onBack: () => void;
  onItemDecrement: (item: CartItem) => void;
  onItemIncrement: (item: CartItem) => void;
  onItemRemove: (item: CartItem) => void;
  onPurchase: () => void;
}

const CartView: React.FC<CartListViewProps> = (props) => {
  const { appliedCoupon, cart, discountedByCurrency, onBack, onItemDecrement, onItemIncrement, onItemRemove, onPurchase, totalsByCurrency } = props;

  return (
    <Container className="py-4">
      <HelmetMeta description="Revisa tu carrito de compras en Talento Tech." title="Talento Tech | Carrito" />
      <h2>Carrito</h2>
      {cart.length === 0 ? (
        <EmptyState
          action={<Link className="btn btn-primary" to="/productos">Ver Productos</Link>}
          message="Agregá productos para continuar la compra."
          title="Tu carrito está vacío"
        />
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

          <div className="d-flex justify-content-between align-items-start mt-3">
            <div>
              <strong>Subtotal:</strong>
            </div>
            <div className="text-end">
              {Object.entries(totalsByCurrency).map(([c, total]) => (
                <span className="d-block" key={c}>{formatPrice(total, c)}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {cart.length > 0 && <CouponSection />}

      <div className="d-flex justify-content-between align-items-start mt-3 p-3 bg-light rounded">
        <div>
          <strong>Total{appliedCoupon ? " final" : ""}:</strong>
        </div>
        <div className="text-end">
          {appliedCoupon && Object.entries(totalsByCurrency).map(([c, total]) => (
            <small className="text-muted text-decoration-line-through d-block" key={c}>{formatPrice(total, c)}</small>
          ))}
          {Object.entries(discountedByCurrency).map(([c, total]) => (
            <strong className="fs-5 d-block" key={c}>{formatPrice(total, c)}</strong>
          ))}
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
