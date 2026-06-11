import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

interface QuantityStepperProps {
  max: number;
  value: number;
  disabled?: boolean;
  min?: number;
  size?: "sm" | "md";
  onDecrement: () => void;
  onIncrement: () => void;
}

const QuantityStepper: React.FC<QuantityStepperProps> = (props) => {
  const { value, min = 0, max, onIncrement, onDecrement, disabled = false, size = "sm" } = props;
  const atMin: boolean = value <= min;
  const atMax: boolean = value >= max;

  const btnClass: string = size === "sm" ? "btn btn-sm btn-outline-secondary" : "btn btn-outline-secondary";
  const valClass: string = size === "sm" ? "px-2 fw-semibold" : "px-3 fw-semibold fs-5";

  return (
    <fieldset aria-label="Cantidad" className="d-inline-flex align-items-center gap-0" style={{ border: "none", margin: 0, padding: 0 }}>
      <button
        aria-label="Reducir cantidad"
        className={btnClass}
        disabled={disabled || atMin}
        onClick={onDecrement}
        style={{ minWidth: 44, minHeight: 44, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        type="button"
      >
        <FaMinus aria-hidden="true" />
      </button>
      <span
        aria-live="polite"
        className={valClass}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 44,
          minHeight: 44,
          borderTop: "1px solid #dee2e6",
          borderBottom: "1px solid #dee2e6",
          fontSize: size === "sm" ? "0.875rem" : "1rem",
        }}
      >
        {value}
      </span>
      <button
        aria-label="Aumentar cantidad"
        className={btnClass}
        disabled={disabled || atMax}
        onClick={onIncrement}
        style={{ minWidth: 44, minHeight: 44, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        type="button"
      >
        <FaPlus aria-hidden="true" />
      </button>
    </fieldset>
  );
};

export default QuantityStepper;
