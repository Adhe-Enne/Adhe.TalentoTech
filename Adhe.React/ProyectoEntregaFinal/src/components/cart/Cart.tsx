import React, { type ChangeEvent } from "react";
import { Badge, Button, Container, ListGroup } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

import type { AppliedCoupon } from "../../contexts/Cart/CartType";

import { type CartItem } from "../../models";
import CreditCard from "../icons/CreditCard";
import HelmetMeta from "../ui/HelmetMeta";

interface CartProps {
  appliedCoupon: AppliedCoupon | null;
  couponCode: string;
  couponError: string | null;
  discountedTotal: number;
  isApplyingCoupon: boolean;

  items: CartItem[];
  rawTotal: number;
  onApplyCoupon: () => void;
  onBack?: () => void;
  onChangeQty: (productId: string, cantidad: number) => void;
  onCouponCodeChange: (code: string) => void;
  onPurchase: () => void;
  onRemove: (productId: string) => void;
  onRemoveCoupon: () => void;
}

const Cart: React.FC<CartProps> = (props) => {
  const {
    items,
    onBack,
    onChangeQty,
    onPurchase,
    onRemove,
    couponCode,
    onCouponCodeChange,
    onApplyCoupon,
    onRemoveCoupon,
    appliedCoupon,
    discountedTotal,
    rawTotal,
    isApplyingCoupon,
    couponError,
  } = props;

  return (
    <Container className="py-4">
      <HelmetMeta description="Revisa tu carrito de compras en Talento Tech." title="Talento Tech | Carrito" />
      <h2>Carrito</h2>
      {items.length === 0 ? (
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
            {items.map((it) => (
              <ListGroup.Item className="d-flex align-items-center gap-3" key={it.product.id}>
                <img alt={it.product.name} className="rounded" src={it.product.image} style={{ width: 96, height: 96, objectFit: "cover" }} />
                <div className="flex-grow-1">
                  <strong>{it.product.name}</strong>
                  <div className="text-muted">${it.product.price.toFixed(2)}</div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Button size="sm" variant="outline-secondary" onClick={() => onChangeQty(it.product.id, Math.max(1, it.quantity - 1))}>
                    -
                  </Button>
                  <span>{it.quantity}</span>
                  <Button size="sm" variant="outline-secondary" onClick={() => onChangeQty(it.product.id, it.quantity + 1)}>
                    +
                  </Button>
                </div>
                <div style={{ width: 140, textAlign: "right" }}>${(it.product.price * it.quantity).toFixed(2)}</div>
                <div>
                  <Button size="sm" variant="danger" onClick={() => onRemove(it.product.id)}>
                    <FaTrash />
                  </Button>
                </div>
              </ListGroup.Item>
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

      {items.length > 0 && (
        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">Cupon de descuento</h5>
            {appliedCoupon ? (
              <div className="d-flex align-items-center gap-2">
                <Badge bg="success" className="fs-6">{appliedCoupon.code}</Badge>
                <span className="text-success">{appliedCoupon.discountValue}% de descuento</span>
                <Button size="sm" variant="outline-danger" className="ms-auto" onClick={onRemoveCoupon}>
                  Quitar
                </Button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <input
                  className="form-control text-uppercase"
                  disabled={isApplyingCoupon}
                  maxLength={20}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => onCouponCodeChange(e.target.value)}
                  placeholder="INGRESA TU CODIGO"
                  type="text"
                  value={couponCode}
                />
                <Button variant="primary" disabled={isApplyingCoupon || !couponCode.trim()} onClick={onApplyCoupon}>
                  {isApplyingCoupon ? "Aplicando..." : "Aplicar"}
                </Button>
              </div>
            )}
            {couponError && <div className="text-danger small mt-1">{couponError}</div>}
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-3 p-3 bg-light rounded">
        <strong>Total final:</strong>
        <div className="text-end">
          {appliedCoupon && <small className="text-muted text-decoration-line-through d-block">${rawTotal.toFixed(2)}</small>}
          <strong className="fs-4">${discountedTotal.toFixed(2)}</strong>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mt-2">
          <button className="btn btn-cta btn-icon w-100" onClick={onPurchase}>
            <CreditCard style={{ width: 18, height: 18 }} />
            Proceder al pago
          </button>
        </div>
      )}

      <div className="mt-3">
        {onBack && (
          <Button variant="secondary" onClick={onBack}>
            Volver
          </Button>
        )}
      </div>
    </Container>
  );
};

export default Cart;
