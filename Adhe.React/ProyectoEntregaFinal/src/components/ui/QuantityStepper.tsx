import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

import styles from "./QuantityStepper.module.css";

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

  const btnClass: string = `btn ${size === "sm" ? "btn-sm" : ""} btn-outline-secondary ${styles.btn}`;
  const valClass: string = size === "sm" ? "px-2 fw-semibold" : "px-3 fw-semibold fs-5";

  return (
    <fieldset aria-label="Cantidad" className={`d-inline-flex align-items-center gap-0 ${styles.fieldset}`}>
      <button
        aria-label="Reducir cantidad"
        className={`${btnClass} ${styles.btnMinus}`}
        disabled={disabled || atMin}
        onClick={onDecrement}
        type="button"
      >
        <FaMinus aria-hidden="true" />
      </button>
      <span
        aria-live="polite"
        className={`${valClass} ${styles.value}`}
        style={{ fontSize: size === "sm" ? "0.875rem" : "1rem" }}
      >
        {value}
      </span>
      <button
        aria-label="Aumentar cantidad"
        className={`${btnClass} ${styles.btnPlus}`}
        disabled={disabled || atMax}
        onClick={onIncrement}
        type="button"
      >
        <FaPlus aria-hidden="true" />
      </button>
    </fieldset>
  );
};

export default QuantityStepper;
