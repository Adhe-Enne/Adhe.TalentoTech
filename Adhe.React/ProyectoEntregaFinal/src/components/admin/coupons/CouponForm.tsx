import React, { useCallback, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import useCoupons from "../../../hooks/selectors/useCoupons";
import { couponService } from "../../../services/couponService";
import { getTodayString } from "../../../utils/dateUtils";
import { isValidCouponCode } from "../../../utils/validators";
import { withToast } from "../../../utils/withToast";
import styles from "./CouponForm.module.css";

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
      const duplicate: boolean = await couponService.checkCodeExists(code.trim());
      if (duplicate) {
        setIsDuplicate(true);
        setErrors((prev: FormErrors) => ({ ...prev, code: "Este código ya existe" }));
        setSubmitting(false);
        return;
      }
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
    <form className={`card mb-4 ${styles.formCard}`} onSubmit={handleSubmit}>
      <div className="card-body">
        <h5 className="card-title mb-3">Crear cupon</h5>
        <div className="row g-3">
          <div className="col-12 col-sm-4">
            <label className="form-label" htmlFor="couponCode">
              Codigo
            </label>
            <input className={`form-control${errors.code ? " is-invalid" : ""}`} id="couponCode" maxLength={30} onBlur={handleCodeBlur} onChange={(e) => handleChange("code", e.target.value)} placeholder="Ej: DESCUENTO10" value={code} />
            {errors.code && <div className="invalid-feedback">{errors.code}</div>}
          </div>
          <div className="col-12 col-sm-3">
            <label className="form-label" htmlFor="couponDiscount">
              Descuento (%)
            </label>
            <input className={`form-control${errors.discount ? " is-invalid" : ""}`} id="couponDiscount" max={100} min={1} onChange={(e) => handleChange("discount", e.target.value)} placeholder="10" type="number" value={discountValue} />
            {errors.discount && <div className="invalid-feedback">{errors.discount}</div>}
          </div>
          <div className="col-12 col-sm-5">
            <label className="form-label" htmlFor="couponExpiresAt">
              Vencimiento <small className="text-muted">(opcional)</small>
            </label>
            <input className={`form-control${errors.expiresAt ? " is-invalid" : ""}`} id="couponExpiresAt" min={today} onChange={(e) => handleChange("expiresAt", e.target.value)} type="date" value={expiresAt} />
            {errors.expiresAt && <div className="invalid-feedback">{errors.expiresAt}</div>}
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12">
            <Button aria-label="Crear cupón" className="w-100" disabled={submitting || hasErrors} type="submit" variant="primary">
              {submitting ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <>
                  <FaPlus aria-hidden="true" className="me-1" />
                  Crear cupon
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CouponForm;
