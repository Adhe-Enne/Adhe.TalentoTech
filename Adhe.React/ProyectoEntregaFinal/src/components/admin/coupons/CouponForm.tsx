import React, { useCallback, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import useCoupons from "../../../hooks/selectors/useCoupons";
import useNotification from "../../../hooks/selectors/useNotification";
import { getTodayString } from "../../../utils/dateUtils";
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
  const { createCoupon } = useCoupons();
  const { setNotification } = useNotification();

  const handleCodeChange: (val: string) => void = useCallback((val: string) => {
    setCode(val.toUpperCase());
  }, []);

  const handleDiscountChange: (val: string) => void = useCallback((val: string) => {
    setDiscountValue(val);
  }, []);

  const handleExpiresAtChange: (val: string) => void = useCallback((val: string) => {
    setExpiresAt(val);
  }, []);

  const validate: () => boolean = useCallback((): boolean => {
    const errs: FormErrors = {};
    const trimmed: string = code.trim();
    if (!trimmed) {
      errs.code = "El codigo es requerido";
    } else if (trimmed.length < 3) {
      errs.code = "El codigo debe tener al menos 3 caracteres";
    }
    if (/\s/.test(trimmed)) {
      errs.code = "El codigo no puede contener espacios";
    }
    const discountNum: number = Number(discountValue);
    if (!discountValue || Number.isNaN(discountNum) || discountNum < 1 || discountNum > 100) {
      errs.discount = "El descuento debe ser un numero entre 1 y 100";
    }
    if (expiresAt && expiresAt < today) {
      errs.expiresAt = "La fecha debe ser hoy o futura";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [code, discountValue, expiresAt]);

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      if (!validate()) {
        return;
      }
      setSubmitting(true);
      createCoupon({
        code: code.trim().toUpperCase(),
        discountValue: Number(discountValue),
        expiresAt: expiresAt || null,
      })
        .then(() => {
          setCode("");
          setDiscountValue("");
          setExpiresAt("");
          setErrors({});
          setNotification("Cupon creado!", 3000, "success");
        })
        .catch(() => {
          setNotification("Error al crear cupon", 3000, "danger");
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [code, discountValue, expiresAt, createCoupon, setNotification, validate],
  );

  return (
    <form className={`card mb-4 ${styles.formCard}`} onSubmit={handleSubmit}>
      <div className="card-body">
        <h5 className="card-title mb-3">Crear cupon</h5>
        <div className="row g-3">
          <div className="col-12 col-sm-4">
            <label className="form-label" htmlFor="couponCode">
              Codigo
            </label>
            <input
              className={`form-control${errors.code ? " is-invalid" : ""}`}
              id="couponCode"
              maxLength={30}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="Ej: DESCUENTO10"
              value={code}
            />
            {errors.code && <div className="invalid-feedback">{errors.code}</div>}
          </div>
          <div className="col-12 col-sm-3">
            <label className="form-label" htmlFor="couponDiscount">
              Descuento (%)
            </label>
            <input
              className={`form-control${errors.discount ? " is-invalid" : ""}`}
              id="couponDiscount"
              max={100}
              min={1}
              onChange={(e) => handleDiscountChange(e.target.value)}
              placeholder="10"
              type="number"
              value={discountValue}
            />
            {errors.discount && <div className="invalid-feedback">{errors.discount}</div>}
          </div>
          <div className="col-12 col-sm-5">
            <label className="form-label" htmlFor="couponExpiresAt">
              Vencimiento <small className="text-muted">(opcional)</small>
            </label>
            <input
              className={`form-control${errors.expiresAt ? " is-invalid" : ""}`}
              id="couponExpiresAt"
              min={today}
              onChange={(e) => handleExpiresAtChange(e.target.value)}
              type="date"
              value={expiresAt}
            />
            {errors.expiresAt && <div className="invalid-feedback">{errors.expiresAt}</div>}
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12">
            <Button aria-label="Crear cupón" className="w-100" disabled={submitting} type="submit" variant="primary">
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
