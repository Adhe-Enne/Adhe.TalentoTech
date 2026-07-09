import React, { useCallback, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt, FaPlus, FaTimes } from "react-icons/fa";

import useCoupons from "../../../../hooks/selectors/useCoupons";
import { couponService } from "../../../../services/couponService";
import { getTodayString } from "../../../../utils/dateUtils";
import { isValidCouponCode } from "../../../../utils/validators";
import { withToast } from "../../../../utils/withToast";

interface FormErrors {
  code?: string;
  discount?: string;
  expiresAt?: string;
}

const today: string = getTodayString();

const CouponForm: React.FC = () => {
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);
  const { createCoupon } = useCoupons();

  const handleChange: (field: keyof FormErrors, value: string) => void = useCallback((field: keyof FormErrors, value: string): void => {
    if (field === "code") {
      setCode(value.toUpperCase().replace(/\s+/g, ""));
      setIsDuplicate(false);
    } else if (field === "discount") {
      setDiscountValue(value);
    } else {
      setExpiresAt(value);
    }
    setErrors((prev: FormErrors) => {
      const next: FormErrors = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleCodeBlur: () => Promise<void> = useCallback(async () => {
    const trimmed: string = code.trim();
    if (!trimmed || trimmed.length < 3) {
      return;
    }
    try {
      const exists: boolean = await couponService.checkCodeExists(trimmed);
      setIsDuplicate(exists);
      if (exists) {
        setErrors((prev: FormErrors) => ({ ...prev, code: "Este código ya existe" }));
      }
    } catch {
      // fail open — don't block submission if Firestore is unreachable
    }
  }, [code]);

  const validate: () => boolean = useCallback((): boolean => {
    const errs: FormErrors = {};
    const trimmed: string = code.trim();

    if (!trimmed) {
      errs.code = "El código es requerido";
    } else if (trimmed.length < 3) {
      errs.code = "El código debe tener al menos 3 caracteres";
    } else if (!isValidCouponCode(trimmed)) {
      errs.code = "Solo letras, números y guiones";
    } else if (isDuplicate) {
      errs.code = "Este código ya existe";
    }

    const discountNum: number = Number(discountValue);
    if (!discountValue || Number.isNaN(discountNum) || discountNum < 1 || discountNum > 100) {
      errs.discount = "El descuento debe ser un número entre 1 y 100";
    } else if (!Number.isInteger(discountNum)) {
      errs.discount = "El descuento debe ser un número entero";
    }
    if (expiresAt && expiresAt < today) {
      errs.expiresAt = "La fecha debe ser hoy o futura";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [code, discountValue, expiresAt, isDuplicate]);

  const handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void> = useCallback(
    async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      if (!validate()) {
        return;
      }
      setSubmitting(true);
      const created: unknown = await withToast(
        () =>
          createCoupon({
            code: code.trim().toUpperCase(),
            discountValue: Number(discountValue),
            expiresAt: expiresAt || null,
          }) as Promise<unknown>,
        "Creando cupón...",
        "¡Cupón creado!",
        "Error al crear cupón",
      );
      if (created !== undefined) {
        setCode("");
        setDiscountValue("");
        setExpiresAt("");
        setErrors({});
        setIsDuplicate(false);
      }
      setSubmitting(false);
    },
    [code, discountValue, expiresAt, createCoupon, validate],
  );

  const hasErrors: boolean = Object.keys(errors).length > 0;

  return (
    <form className="bg-white rounded-xl shadow-sm overflow-visible mb-4" onSubmit={handleSubmit}>
      <div className="p-4">
        <h5 className="text-lg font-semibold mb-3">Crear cupon</h5>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 sm:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="couponCode">
              Codigo
            </label>
            <input className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent ${errors.code ? "border-danger focus:ring-danger/30 focus:border-danger" : "border-gray-300"}`} id="couponCode" maxLength={30} onBlur={handleCodeBlur} onChange={(e) => handleChange("code", e.target.value)} placeholder="Ej: DESCUENTO10" value={code} />
            {errors.code && <div className="text-danger text-sm mt-1">{errors.code}</div>}
          </div>
          <div className="col-span-12 sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="couponDiscount">
              Descuento (%)
            </label>
            <input className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent ${errors.discount ? "border-danger focus:ring-danger/30 focus:border-danger" : "border-gray-300"}`} id="couponDiscount" max={100} min={1} onChange={(e) => handleChange("discount", e.target.value)} placeholder="10" type="number" value={discountValue} />
            {errors.discount && <div className="text-danger text-sm mt-1">{errors.discount}</div>}
          </div>
          <div className="col-span-12 sm:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vencimiento <small className="text-gray-500">(opcional)</small>
            </label>
            <div className="relative inline-block" ref={pickerRef}>
              <button
                aria-label="Seleccionar fecha de vencimiento"
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all duration-150 cursor-pointer ${errors.expiresAt ? "border-danger" : "border-gray-300"}`}
                onClick={() => setShowPicker(!showPicker)}
                type="button"
              >
                <FaCalendarAlt className="w-3.5 h-3.5 text-gray-400" />
                {expiresAt ? (
                  <span className="text-gray-900">{new Date(expiresAt + "T00:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}</span>
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
                    minDate={new Date(today)}
                    onChange={(date: Date | null) => {
                      if (date) {
                        const y: string = String(date.getFullYear());
                        const m: string = String(date.getMonth() + 1).padStart(2, "0");
                        const d: string = String(date.getDate()).padStart(2, "0");
                        handleChange("expiresAt", `${y}-${m}-${d}`);
                      }
                      setShowPicker(false);
                    }}
                    onClickOutside={() => setShowPicker(false)}
                    open
                    selected={expiresAt ? new Date(expiresAt + "T00:00:00") : null}
                    selectsEnd
                    showMonthDropdown
                    showYearDropdown
                    todayButton="Hoy"
                  />
                  {expiresAt && (
                    <button
                      aria-label="Eliminar fecha de vencimiento"
                      className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleChange("expiresAt", "");
                        setShowPicker(false);
                      }}
                      type="button"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
            {errors.expiresAt && <div className="text-danger text-sm mt-1">{errors.expiresAt}</div>}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-3 mt-3">
          <div className="col-span-12">
            <button aria-label="Crear cupón" className="w-full flex items-center justify-center gap-2 bg-cta text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed" disabled={submitting || hasErrors} type="submit">
              {submitting ? (
                <span className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-accent rounded-full inline-block" />
              ) : (
                <>
                  <FaPlus aria-hidden="true" />
                  Crear cupon
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CouponForm;
