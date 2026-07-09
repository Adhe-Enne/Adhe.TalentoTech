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

  const isSm: boolean = size === "sm";
  const btnClass: string = isSm
    ? "w-7 h-7 flex items-center justify-center bg-transparent border-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 cursor-pointer rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    : "w-9 h-9 flex items-center justify-center bg-transparent border-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 cursor-pointer rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const valClass: string = isSm
    ? "w-8 text-center text-sm font-semibold text-gray-800 self-stretch flex items-center justify-center border-x border-gray-200"
    : "w-10 text-center text-base font-semibold text-gray-800 self-stretch flex items-center justify-center border-x border-gray-200";

  return (
    <fieldset aria-label="Cantidad" className="inline-flex items-center rounded-full border border-gray-300 bg-white overflow-hidden">
      <button
        aria-label="Reducir cantidad"
        className={btnClass}
        disabled={disabled || atMin}
        onClick={onDecrement}
        type="button"
      >
        <FaMinus aria-hidden="true" />
      </button>
      <span
        aria-live="polite"
        className={valClass}
      >
        {value}
      </span>
      <button
        aria-label="Aumentar cantidad"
        className={btnClass}
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
