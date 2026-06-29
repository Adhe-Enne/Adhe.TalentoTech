import React, { useCallback, useEffect, useRef, useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

import type { Coupon, CouponUpdatePayload } from "../../../models";

import { getTodayString } from "../../../utils/dateUtils";
import { withToast } from "../../../utils/withToast";
import ToggleSwitch from "../../ui/ToggleSwitch";
import styles from "./CouponItem.module.css";

const today: string = getTodayString();

interface CouponItemProps {
  coupon: Coupon;
  onDeleteRequest: (id: string, label: string) => void;
  onUpdateCoupon: (id: string, data: CouponUpdatePayload) => Promise<void>;
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
  const { coupon, onDeleteRequest, onUpdateCoupon } = props;
  const badge: { label: string; variant: string } = getStatusBadge(coupon);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [toggling, setToggling] = useState(false);
  const dateInputRef: React.RefObject<HTMLInputElement | null> = useRef<HTMLInputElement | null>(null);

  useEffect((): void => {
    if (isEditingDate && dateInputRef.current) {
      dateInputRef.current.focus();
    }
  }, [isEditingDate]);

  const handleToggle: () => Promise<void> = useCallback(async (): Promise<void> => {
    setToggling(true);
    await withToast(
      () => onUpdateCoupon(coupon.id, { isEnabled: !coupon.isEnabled }),
      "Procesando...",
      coupon.isEnabled ? "Cupon desactivado" : "Cupon activado",
      "Error al cambiar estado del cupon",
    );
    setToggling(false);
  }, [coupon.id, coupon.isEnabled, onUpdateCoupon]);

  const handleDateClick: () => void = useCallback((): void => {
    setEditDate(coupon.expiresAt ?? "");
    setIsEditingDate(true);
  }, [coupon.expiresAt]);

  const handleDateSave: () => Promise<void> = useCallback(async (): Promise<void> => {
    setIsEditingDate(false);
    const newDate: string | null = editDate || null;
    if (newDate === (coupon.expiresAt ?? null)) {
      return;
    }
    if (newDate && newDate < today) {
      toast.error("La fecha debe ser hoy o futura", { autoClose: 3000 });
      return;
    }
    await withToast(
      () => onUpdateCoupon(coupon.id, { expiresAt: newDate }),
      "Actualizando fecha...",
      newDate ? "Fecha de vencimiento actualizada" : "Vencimiento eliminado",
      "Error al actualizar fecha",
    );
  }, [editDate, coupon.id, coupon.expiresAt, onUpdateCoupon]);

  const handleDateCancel: () => void = useCallback((): void => {
    setIsEditingDate(false);
    setEditDate(coupon.expiresAt ?? "");
  }, [coupon.expiresAt]);

  const handleDateKeyDown: (e: React.KeyboardEvent) => void = useCallback(
    (e: React.KeyboardEvent): void => {
      if (e.key === "Enter") {
        void handleDateSave();
      }
      if (e.key === "Escape") {
        handleDateCancel();
      }
    },
    [handleDateSave, handleDateCancel],
  );

  return (
    <tr>
      <td>
        <strong>{coupon.code}</strong>
      </td>
      <td>{coupon.discountValue}%</td>
      <td>
        <Badge bg={badge.variant} className={`${badge.variant === "warning" ? "text-dark " : ""}${styles.badgePill}`}>
          {badge.label}
        </Badge>
      </td>
      <td>
        {coupon.usedCount}
        {coupon.usageLimit !== null && coupon.usageLimit !== undefined ? ` / ${coupon.usageLimit}` : ""}
      </td>
      <td>
        {isEditingDate ? (
          <input className="form-control form-control-sm" min={today} onBlur={() => void handleDateSave()} onChange={(e) => setEditDate(e.target.value)} onKeyDown={handleDateKeyDown} ref={dateInputRef} type="date" value={editDate} />
        ) : (
          <button
            aria-label="Editar fecha de vencimiento"
            className={styles.editableDate}
            onClick={handleDateClick}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === "Enter") {
                handleDateClick();
              }
            }}
            tabIndex={0}
            type="button"
          >
            {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Sin vencimiento"}
          </button>
        )}
      </td>
      <td>
        <ToggleSwitch checked={coupon.isEnabled} label={`${coupon.isEnabled ? "Desactivar" : "Activar"} cupon ${coupon.code}`} loading={toggling} onToggle={handleToggle} />
      </td>
      <td>
        <Button aria-label={`Eliminar cupon ${coupon.code}`} onClick={() => onDeleteRequest(coupon.id, coupon.code)} size="sm" variant="outline-danger">
          <FaTrash className="me-1" />
          Eliminar
        </Button>
      </td>
    </tr>
  );
};

export default CouponItem;
