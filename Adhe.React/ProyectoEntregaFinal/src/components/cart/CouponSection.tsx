import React, { useCallback, useMemo, useState, type ChangeEvent } from "react";
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
    <div className="border border-gray-200 rounded-lg shadow-sm bg-white mt-3">
      <div className="p-4">
        <h5 className="text-lg font-semibold mb-3">Cupon de descuento</h5>
        {appliedCoupon ? (
          <div className="flex items-center gap-2">
            <span className="bg-success/10 text-success text-sm font-medium px-2.5 py-0.5 rounded-full">
              {appliedCoupon.code}
            </span>
            <span className="text-success">{appliedCoupon.discountValue}% de descuento</span>
            {daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
              <span className="bg-warning/10 text-warning text-sm font-medium px-2.5 py-0.5 rounded-full">
                Vence en {daysUntilExpiry} d&iacute;a{daysUntilExpiry === 1 ? "" : "s"}
              </span>
            )}
            <button aria-label="Quitar cupón" className="bg-transparent border border-danger/70 text-danger px-3 py-1.5 rounded-lg text-sm hover:bg-danger/5 ml-auto" onClick={handleRemoveCoupon}>
              <FaTrash className="mr-1" />
              Quitar
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
              <input
                aria-label="Código de cupón"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isApplyingCoupon}
                maxLength={20}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCouponCode(e.target.value)}
                placeholder="INGRESA TU CODIGO"
                type="text"
                value={couponCode}
              />
            <button aria-label="Aplicar cupón" className="bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap" disabled={isApplyingCoupon || !couponCode.trim()} onClick={() => void handleApplyCoupon()}>
              {isApplyingCoupon ? "Aplicando..." : "Aplicar"}
            </button>
          </div>
        )}
        {couponError && <div className="text-danger text-sm mt-1" role="alert">{couponError}</div>}
      </div>
    </div>
  );
};

export default CouponSection;
