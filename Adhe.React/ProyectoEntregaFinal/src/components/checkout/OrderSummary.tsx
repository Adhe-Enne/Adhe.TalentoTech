import React, { useMemo, type JSX } from "react";
import { ListGroup } from "react-bootstrap";

import type { CartItem } from "../../models";

import useCart from "../../hooks/selectors/useCart";

const OrderSummary: React.FC = () => {
  const { cart, appliedCoupon, discountedTotal } = useCart();

  const rawTotal: number = useMemo((): number => cart.reduce((s: number, it: CartItem) => s + it.product.price * it.quantity, 0), [cart]);

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
                    {item.quantity} x ${item.product.price.toFixed(2)}
                  </div>
                </div>
                <div className="small">${(item.product.price * item.quantity).toFixed(2)}</div>
              </ListGroup.Item>
            ),
          )}
        </ListGroup>

        <div className="d-flex justify-content-between small">
          <span>Subtotal</span>
          <span>${rawTotal.toFixed(2)}</span>
        </div>
        {appliedCoupon && (
          <div className="d-flex justify-content-between small text-success">
            <span>Descuento ({appliedCoupon.code})</span>
            <span>-${(rawTotal - discountedTotal).toFixed(2)}</span>
          </div>
        )}
        <hr />
        <div className="d-flex justify-content-between fw-bold">
          <span>Total</span>
          <span>${discountedTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
