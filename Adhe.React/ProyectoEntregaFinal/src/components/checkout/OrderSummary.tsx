import React, { type JSX } from "react";
import { ListGroup } from "react-bootstrap";

import type { AppliedCoupon } from "../../contexts/Cart/CartContext";
import type { CartItem } from "../../models";

import { formatPrice } from "../../utils/format";

interface OrderSummaryProps {
  appliedCoupon: AppliedCoupon | null;
  cart: CartItem[];
  discountedTotal: number;
  rawTotal: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = (props) => {
  const { appliedCoupon, cart, discountedTotal, rawTotal } = props;
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Resumen del pedido</h5>
        <ListGroup className="mb-3" variant="flush">
          {cart.map(
            (item: CartItem): JSX.Element => (
              <ListGroup.Item className="d-flex align-items-center gap-2" key={item.product.id}>
                <img alt={item.product.name} className="rounded" src={item.product.image} style={{ width: 48, height: 48, objectFit: "cover" }} />
                <div className="flex-grow-1">
                  <strong className="small">{item.product.name}</strong>
                  <div className="text-muted small">
                    {item.quantity} x {formatPrice(item.product.price, item.product.currency)}
                  </div>
                </div>
                <div className="small">{formatPrice(item.product.price * item.quantity, item.product.currency)}</div>
              </ListGroup.Item>
            ),
          )}
        </ListGroup>

        <div className="d-flex justify-content-between small">
          <span>Subtotal</span>
          <span>{formatPrice(rawTotal, cart[0]?.product.currency)}</span>
        </div>
        {appliedCoupon && (
          <div className="d-flex justify-content-between small text-success">
            <span>Descuento ({appliedCoupon.code})</span>
            <span>-{formatPrice(rawTotal - discountedTotal, cart[0]?.product.currency)}</span>
          </div>
        )}
        <hr />
        <div className="d-flex justify-content-between fw-bold">
          <span>Total</span>
          <span>{formatPrice(discountedTotal, cart[0]?.product.currency)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
