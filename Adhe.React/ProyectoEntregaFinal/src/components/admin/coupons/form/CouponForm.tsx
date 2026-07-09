import React, { useCallback, useState } from "react";
import { FaPlus } from "react-icons/fa";

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
    <form className="bg-white rounded-xl shadow-sm overflow-hidden mb-4" onSubmit={handleSubmit}>
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
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="couponExpiresAt">
              Vencimiento <small className="text-gray-500">(opcional)</small>
            </label>
            <input className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent ${errors.expiresAt ? "border-danger focus:ring-danger/30 focus:border-danger" : "border-gray-300"}`} id="couponExpiresAt" min={today} onChange={(e) => handleChange("expiresAt", e.target.value)} type="date" value={expiresAt} />
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
