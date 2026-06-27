import React, { type ChangeEvent } from "react";
import { Badge, Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

interface CouponSectionProps {
  appliedCoupon: { code: string; discountValue: number; expiresAt?: string | null } | null;
  couponCode: string;
  couponError: string | null;
  daysUntilExpiry: number | null;
  isApplyingCoupon: boolean;
  onApplyCoupon: () => void;
  onCouponCodeChange: (code: string) => void;
  onRemoveCoupon: () => void;
}

const CouponSection: React.FC<CouponSectionProps> = (props) => {
  const { appliedCoupon, couponCode, couponError, daysUntilExpiry, isApplyingCoupon, onApplyCoupon, onCouponCodeChange, onRemoveCoupon } = props;

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5 className="card-title">Cupon de descuento</h5>
        {appliedCoupon ? (
          <div className="d-flex align-items-center gap-2">
            <Badge bg="success" className="fs-6">
              {appliedCoupon.code}
            </Badge>
            <span className="text-success">{appliedCoupon.discountValue}% de descuento</span>
            {daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
              <Badge bg="warning" className="text-dark">
                Vence en {daysUntilExpiry} d&iacute;a{daysUntilExpiry === 1 ? "" : "s"}
              </Badge>
            )}
            <Button aria-label="Quitar cupón" className="ms-auto" onClick={onRemoveCoupon} size="sm" variant="outline-danger">
              <FaTrash className="me-1" />
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
            <Button aria-label="Aplicar cupón" disabled={isApplyingCoupon || !couponCode.trim()} onClick={onApplyCoupon} variant="primary">
              {isApplyingCoupon ? "Aplicando..." : "Aplicar"}
            </Button>
          </div>
        )}
        {couponError && <div className="text-danger small mt-1">{couponError}</div>}
      </div>
    </div>
  );
};

export default CouponSection;
