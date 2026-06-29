import React, { useCallback, useMemo, useState, type ChangeEvent } from "react";
import { Badge, Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

import useCart from "../../hooks/selectors/useCart";
import useNotification from "../../hooks/selectors/useNotification";

const CouponSection: React.FC = () => {
  const { appliedCoupon, isApplyingCoupon, applyCoupon, removeCoupon } = useCart();
  const { setNotification } = useNotification();
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponError, setCouponError] = useState<string | null>(null);

  const daysUntilExpiry: number | null = useMemo((): number | null => {
    if (!appliedCoupon?.expiresAt) {
      return null;
    }
    const now: Date = new Date();
    const expiry: Date = new Date(appliedCoupon.expiresAt);
    const diff: number = expiry.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [appliedCoupon]);

  const handleApplyCoupon: () => Promise<void> = useCallback(async (): Promise<void> => {
    setCouponError(null);
    const result: { success: boolean; error?: string } = await applyCoupon(couponCode);
    if (result.success) {
      setCouponCode("");
      setNotification("Cupon aplicado con exito", 2000, "success");
    } else {
      setCouponError(result.error ?? "Error al aplicar cupon");
      setNotification(result.error ?? "Error al aplicar cupon", 3000, "danger");
    }
  }, [applyCoupon, couponCode, setNotification]);

  const handleRemoveCoupon: () => void = useCallback(() => {
    removeCoupon();
    setCouponError(null);
  }, [removeCoupon]);

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
            <Button aria-label="Quitar cupón" className="ms-auto" onClick={handleRemoveCoupon} size="sm" variant="outline-danger">
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCouponCode(e.target.value)}
              placeholder="INGRESA TU CODIGO"
              type="text"
              value={couponCode}
            />
            <Button aria-label="Aplicar cupón" disabled={isApplyingCoupon || !couponCode.trim()} onClick={() => void handleApplyCoupon()} variant="primary">
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
