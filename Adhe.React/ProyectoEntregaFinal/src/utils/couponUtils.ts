import type { Coupon } from "../models";

export const getStatusBadge: (coupon: Coupon) => { label: string; variant: string } = (coupon: Coupon) => {
  if (!coupon.isEnabled) {
    return { label: "Deshabilitado", variant: "secondary" };
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { label: "Expirado", variant: "danger" };
  }
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return { label: "Agotado", variant: "warning" };
  }
  return { label: "Activo", variant: "success" };
};
