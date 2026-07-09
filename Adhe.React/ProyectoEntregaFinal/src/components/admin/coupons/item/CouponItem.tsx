import React, { useCallback, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

import type { Coupon, CouponUpdatePayload } from "../../../../models";

import { getStatusBadge } from "../../../../utils/couponUtils";
import { getTodayString } from "../../../../utils/dateUtils";
import { withToast } from "../../../../utils/withToast";
import DeleteButton from "../../../ui/DeleteButton";
import ToggleSwitch from "../../../ui/ToggleSwitch";

const today: string = getTodayString();

interface CouponItemProps {
  coupon: Coupon;
  onDeleteRequest: (id: string, label: string) => void;
  onUpdateCoupon: (id: string, data: CouponUpdatePayload) => Promise<void>;
}

const CouponItem: React.FC<CouponItemProps> = (props) => {
  const { coupon, onDeleteRequest, onUpdateCoupon } = props;
  const badge: { label: string; variant: string } = getStatusBadge(coupon);
  const [toggling, setToggling] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

  const handleToggle: () => Promise<void> = useCallback(async (): Promise<void> => {
    setToggling(true);
    try {
      await withToast(() => onUpdateCoupon(coupon.id, { isEnabled: !coupon.isEnabled }), "Procesando...", coupon.isEnabled ? "Cupon desactivado" : "Cupon activado", "Error al cambiar estado del cupon");
    } finally {
      setToggling(false);
    }
  }, [coupon.id, coupon.isEnabled, onUpdateCoupon]);

  const handleDateChange: (date: Date | null) => Promise<void> = useCallback(async (date: Date | null): Promise<void> => {
    setShowPicker(false);
    const newDate: string | null = date ? date.toISOString().split("T")[0] : null;
    if (newDate === (coupon.expiresAt ?? null)) {
      return;
    }
    if (newDate && newDate < today) {
      toast.error("La fecha debe ser hoy o futura", { autoClose: 3000 });
      return;
    }
    await withToast(() => onUpdateCoupon(coupon.id, { expiresAt: newDate }), "Actualizando fecha...", newDate ? "Fecha de vencimiento actualizada" : "Vencimiento eliminado", "Error al actualizar fecha");
  }, [coupon.id, coupon.expiresAt, onUpdateCoupon]);

  const handleClearDate: (e: React.MouseEvent) => Promise<void> = useCallback(async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation();
    setShowPicker(false);
    if (coupon.expiresAt === null) {
      return;
    }
    await withToast(() => onUpdateCoupon(coupon.id, { expiresAt: null }), "Actualizando fecha...", "Vencimiento eliminado", "Error al actualizar fecha");
  }, [coupon.id, coupon.expiresAt, onUpdateCoupon]);

  const parsedDate: Date | null = coupon.expiresAt ? new Date(coupon.expiresAt + "T00:00:00") : null;

  return (
    <tr>
      <td className="px-3 py-3 whitespace-nowrap">
        <span className="inline-flex items-center font-mono text-sm font-extrabold text-blue-700 bg-blue-50 px-4 py-2 rounded-xl border-2 border-blue-200 shadow-sm tracking-wider uppercase">
          {coupon.code}
        </span>
      </td>
      <td className="px-3 py-3 whitespace-nowrap font-bold text-emerald-600">{coupon.discountValue}%</td>
      <td>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.variant === "success" ? "bg-success/10 text-success" : badge.variant === "warning" ? "bg-warning/10 text-warning" : badge.variant === "danger" ? "bg-danger/10 text-danger" : badge.variant === "info" ? "bg-info/10 text-info" : "bg-gray-100 text-gray-800"}`}>
          {badge.label}
        </span>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
          <span className="font-semibold">{coupon.usedCount}</span>
          {coupon.usageLimit !== null && coupon.usageLimit !== undefined && (
            <span className="text-gray-400">/ {coupon.usageLimit}</span>
          )}
        </span>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="relative inline-block" ref={pickerRef}>
          <button
            aria-label="Editar fecha de vencimiento"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all duration-150 cursor-pointer"
            onClick={() => setShowPicker(!showPicker)}
            type="button"
          >
            <FaCalendarAlt className="w-3.5 h-3.5 text-gray-400" />
            {parsedDate ? (
              <span className="text-gray-900">{parsedDate.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}</span>
            ) : (
              <span className="text-gray-400 italic">Sin vencimiento</span>
            )}
          </button>
          {showPicker && (
            <div className="absolute z-50 mt-1 left-0">
              <DatePicker
                calendarClassName="!border-gray-200 !shadow-lg"
                customInput={<div />}
                dateFormat="dd/MM/yyyy"
                inline
                maxDate={new Date()}
                minDate={new Date(today)}
                onChange={(date: Date | null) => void handleDateChange(date)}
                onClickOutside={() => setShowPicker(false)}
                open
                selected={parsedDate}
                selectsEnd
                showMonthDropdown
                showYearDropdown
                todayButton="Hoy"
              />
              {parsedDate && (
                <button
                  aria-label="Eliminar fecha de vencimiento"
                  className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                  onClick={(e: React.MouseEvent) => void handleClearDate(e)}
                  type="button"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </td>
      <td>
        <ToggleSwitch checked={coupon.isEnabled} label={`${coupon.isEnabled ? "Desactivar" : "Activar"} cupon ${coupon.code}`} loading={toggling} onToggle={handleToggle} />
      </td>
      <td>
        <DeleteButton aria-label={`Eliminar cupon ${coupon.code}`} onClick={() => onDeleteRequest(coupon.id, coupon.code)} />
      </td>
    </tr>
  );
};

export default CouponItem;
