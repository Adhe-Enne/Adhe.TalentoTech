import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  label: string;
  disabled?: boolean;
  loading?: boolean;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = (props) => {
  const { checked, disabled, label, loading, onToggle } = props;
  const isDisabled: boolean = disabled === true || loading === true;

  return (
    <button
      aria-busy={loading}
      aria-checked={checked}
      aria-disabled={isDisabled}
      aria-label={label}
      className={`w-[44px] h-6 rounded-full cursor-pointer relative p-0 flex items-center justify-center disabled:cursor-not-allowed transition-colors border ${checked ? "bg-emerald-500 border-emerald-500" : "bg-gray-200 border-gray-300"} ${loading ? "!bg-[#5a6268] !border-[#5a6268] opacity-80" : ""}`}
      data-checked={checked}
      disabled={isDisabled}
      onClick={onToggle}
      role="switch"
      type="button"
    >
      {loading ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" /> : <span className={`absolute top-[2px] w-5 h-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)] transition-all duration-200 ${checked ? "left-[22px]" : "left-[2px]"}`} />}
    </button>
  );
};

export default ToggleSwitch;
