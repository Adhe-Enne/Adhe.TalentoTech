import React from "react";

interface CouponFormProps {
  code: string;
  discountValue: string;
  errors: { code?: string; discount?: string };
  submitting: boolean;
  onCodeChange: (val: string) => void;
  onDiscountChange: (val: string) => void;
  onSubmit: () => void;
}

const CouponForm: React.FC<CouponFormProps> = (props) => {
  const { code, discountValue, onCodeChange, onDiscountChange, onSubmit, submitting, errors } = props;

  const handleSubmit: React.SubmitEventHandler = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="card mb-4" onSubmit={handleSubmit} style={{ borderRadius: 12 }}>
      <div className="card-body">
        <h5 className="card-title mb-3">Crear cupon</h5>
        <div className="row g-3">
          <div className="col-12 col-sm-5">
            <label className="form-label" htmlFor="couponCode">
              Codigo
            </label>
            <input
              className={`form-control${errors.code ? " is-invalid" : ""}`}
              id="couponCode"
              maxLength={30}
              onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
              placeholder="Ej: DESCUENTO10"
              value={code}
            />
            {errors.code && <div className="invalid-feedback">{errors.code}</div>}
          </div>
          <div className="col-12 col-sm-4">
            <label className="form-label" htmlFor="couponDiscount">
              Descuento (%)
            </label>
            <input
              className={`form-control${errors.discount ? " is-invalid" : ""}`}
              id="couponDiscount"
              max={100}
              min={1}
              onChange={(e) => onDiscountChange(e.target.value)}
              placeholder="10"
              type="number"
              value={discountValue}
            />
            {errors.discount && <div className="invalid-feedback">{errors.discount}</div>}
          </div>
          <div className="col-12 col-sm-3 d-flex align-items-end">
            <button className="btn btn-primary w-100" disabled={submitting} type="submit">
              {submitting ? <span className="spinner-border spinner-border-sm" /> : "Crear cupon"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CouponForm;
