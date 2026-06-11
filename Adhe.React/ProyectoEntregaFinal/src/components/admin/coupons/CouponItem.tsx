import React from "react";
import { Badge, Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

import type { Coupon } from "../../../models";

interface CouponItemProps {
  coupon: Coupon;
  onDelete: (id: string) => void;
  onToggle: (id: string, current: boolean) => void;
}

const getStatusBadge: (coupon: Coupon) => { label: string; variant: string } = (coupon: Coupon) => {
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

const CouponItem: React.FC<CouponItemProps> = (props) => {
  const { coupon, onDelete, onToggle } = props;
  const badge: { label: string; variant: string } = getStatusBadge(coupon);

  return (
    <tr>
      <td>
        <strong>{coupon.code}</strong>
      </td>
      <td>{coupon.discountValue}%</td>
      <td>
        <Badge bg={badge.variant} className={badge.variant === "warning" ? "text-dark" : ""} style={{ borderRadius: 999 }}>
          {badge.label}
        </Badge>
      </td>
      <td>
        {coupon.usedCount}
        {coupon.usageLimit !== null && coupon.usageLimit !== undefined ? ` / ${coupon.usageLimit}` : ""}
      </td>
      <td>{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Sin vencimiento"}</td>
      <td>
        <button
          aria-checked={coupon.isEnabled}
          aria-label={`${coupon.isEnabled ? "Desactivar" : "Activar"} cupon ${coupon.code}`}
          className="btn btn-sm"
          onClick={() => onToggle(coupon.id, coupon.isEnabled)}
          role="switch"
          style={{
            width: 44,
            height: 24,
            borderRadius: 999,
            background: coupon.isEnabled ? "#0f6670" : "#6c757d",
            border: "none",
            cursor: "pointer",
            position: "relative",
            padding: 0,
            transition: "background 200ms ease",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 2,
              left: coupon.isEnabled ? 22 : 2,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              transition: "transform 200ms ease",
            }}
          />
        </button>
      </td>
      <td>
        <Button size="sm" variant="outline-danger" aria-label={`Eliminar cupon ${coupon.code}`} onClick={() => onDelete(coupon.id)}>
          <FaTrash className="me-1" />
          Eliminar
        </Button>
      </td>
    </tr>
  );
};

export default CouponItem;
