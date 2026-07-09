import React from "react";

interface ProgressBarRowProps {
  ariaLabel?: string;
  barHeight?: number;
  color?: string;
  extra?: React.ReactNode;
  label?: React.ReactNode;
  percent?: number;
  rightText?: string;
}

const ProgressBarRow: React.FC<ProgressBarRowProps> = (props) => {
  const { ariaLabel, barHeight = 20, color = "bg-gray-400", extra, label, percent = 0, rightText = "" } = props;

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span>{label}</span>
        <span className="text-gray-500 text-sm">{rightText}</span>
      </div>
      {extra}
      <div className="bg-gray-200 rounded-full overflow-hidden" style={{ height: barHeight }}>
        <div className={`${color} h-full`} style={{ width: `${percent}%` }} />
      </div>
      <div className="flex justify-end mt-1">
        <span className="text-xs text-gray-400">{percent.toFixed(1)}%</span>
      </div>
      <progress aria-label={ariaLabel ?? `${percent.toFixed(1)}%`} className="sr-only" max={100} value={Math.round(percent)} />
    </div>
  );
};

export default ProgressBarRow;
