import React, { useCallback, useEffect, useRef, useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

import type { Coupon } from "../../../models";

import useCoupons from "../../../hooks/selectors/useCoupons";
import { getTodayString } from "../../../utils/dateUtils";
import ToggleSwitch from "../../ui/ToggleSwitch";
import styles from "./CouponItem.module.css";

const today: string = getTodayString();

interface CouponItemProps {
  coupon: Coupon;
  onDeleteRequest: (id: string, label: string) => void;
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
  const { coupon, onDeleteRequest } = props;
  const badge: { label: string; variant: string } = getStatusBadge(coupon);
  const { updateCoupon } = useCoupons();
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
    const toastId: string | number = toast.loading("Procesando...");
    setToggling(true);
    try {
      await updateCoupon(coupon.id, { isEnabled: !coupon.isEnabled });
      toast.update(toastId, { autoClose: 2000, isLoading: false, render: coupon.isEnabled ? "Cupon desactivado" : "Cupon activado", type: "info" });
    } catch {
      toast.update(toastId, { autoClose: 3000, isLoading: false, render: "Error al cambiar estado del cupon", type: "error" });
    } finally {
      setToggling(false);
    }
  }, [coupon.id, coupon.isEnabled, updateCoupon]);

  const handleDateClick: () => void = useCallback((): void => {
    setEditDate(coupon.expiresAt ?? "");
    setIsEditingDate(true);
  }, [coupon.expiresAt]);

  const handleDateSave: () => void = useCallback((): void => {
    setIsEditingDate(false);
    const newDate: string | null = editDate || null;
    if (newDate === (coupon.expiresAt ?? null)) {
      return;
    }
    const toastId: string | number = toast.loading("Actualizando fecha...");
    updateCoupon(coupon.id, { expiresAt: newDate })
      .then(() => {
        toast.update(toastId, { autoClose: 2000, isLoading: false, render: newDate ? "Fecha de vencimiento actualizada" : "Vencimiento eliminado", type: "success" });
      })
      .catch(() => {
        toast.update(toastId, { autoClose: 3000, isLoading: false, render: "Error al actualizar fecha", type: "error" });
      });
  }, [editDate, coupon.id, coupon.expiresAt, updateCoupon]);

  const handleDateCancel: () => void = useCallback((): void => {
    setIsEditingDate(false);
    setEditDate(coupon.expiresAt ?? "");
  }, [coupon.expiresAt]);

  const handleDateKeyDown: (e: React.KeyboardEvent) => void = useCallback(
    (e: React.KeyboardEvent): void => {
      if (e.key === "Enter") {
        handleDateSave();
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
          <input className="form-control form-control-sm" min={today} onBlur={handleDateSave} onChange={(e) => setEditDate(e.target.value)} onKeyDown={handleDateKeyDown} ref={dateInputRef} type="date" value={editDate} />
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
