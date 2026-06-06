import React, { type ChangeEvent } from "react";
import { Link } from "react-router-dom";

import { type CartItem } from "../../models";
import type { AppliedCoupon } from "../../contexts/Cart/CartType";
import CreditCard from "../icons/CreditCard";

interface CartProps {
  items: CartItem[];
  onBack?: () => void;
  onChangeQty: (productId: string, cantidad: number) => void;
  onPurchase: () => void;
  onRemove: (productId: string) => void;

  couponCode: string;
  onCouponCodeChange: (code: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  appliedCoupon: AppliedCoupon | null;
  discountedTotal: number;
  rawTotal: number;
  isApplyingCoupon: boolean;
  couponError: string | null;
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
    <div className="container py-4">
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
          <div className="list-group">
            {items.map((it) => (
              <div className="list-group-item d-flex align-items-center gap-3" key={it.product.id}>
                <img alt={it.product.name} className="rounded" src={it.product.image} style={{ width: 96, height: 96, objectFit: "cover" }} />
                <div className="flex-grow-1">
                  <strong>{it.product.name}</strong>
                  <div className="text-muted">${it.product.price.toFixed(2)}</div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => onChangeQty(it.product.id, Math.max(1, it.quantity - 1))}>
                    -
                  </button>
                  <span>{it.quantity}</span>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => onChangeQty(it.product.id, it.quantity + 1)}>
                    +
                  </button>
                </div>
                <div style={{ width: 140, textAlign: "right" }}>${(it.product.price * it.quantity).toFixed(2)}</div>
                <div>
                  <button className="btn btn-danger btn-sm" onClick={() => onRemove(it.product.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                <strong>Total:</strong>
              </div>
              <div className="text-end">
                <strong className="d-block">${rawTotal.toFixed(2)}</strong>
              </div>
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
                <span className="badge bg-success fs-6">{appliedCoupon.code}</span>
                <span className="text-success">{appliedCoupon.discountValue}% de descuento</span>
                <button className="btn btn-outline-danger btn-sm ms-auto" onClick={onRemoveCoupon}>
                  Quitar
                </button>
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
                <button className="btn btn-primary" disabled={isApplyingCoupon || !couponCode.trim()} onClick={onApplyCoupon}>
                  {isApplyingCoupon ? "Aplicando..." : "Aplicar"}
                </button>
              </div>
            )}
            {couponError && <div className="text-danger small mt-1">{couponError}</div>}
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-3 p-3 bg-light rounded">
        <strong>Total final:</strong>
        <div className="text-end">
          {appliedCoupon && (
            <small className="text-muted text-decoration-line-through d-block">${rawTotal.toFixed(2)}</small>
          )}
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
          <button className="btn btn-secondary" onClick={onBack}>
            Volver
          </button>
        )}
      </div>
    </div>
  );
};

export default Cart;
