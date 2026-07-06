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
  const { ariaLabel, barHeight = 20, color = "secondary", extra, label, percent = 0, rightText = "" } = props;

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span>{label}</span>
        <span className="text-muted small">{rightText}</span>
      </div>
      {extra}
      <div className="progress" style={{ height: barHeight }}>
        <div className={`progress-bar bg-${color}`} style={{ width: `${percent}%` }}>
          {percent > 8 && `${percent.toFixed(1)}%`}
        </div>
      </div>
      <progress aria-label={ariaLabel ?? `${percent.toFixed(1)}%`} className="visually-hidden" max={100} value={Math.round(percent)} />
    </div>
  );
};

export default ProgressBarRow;
