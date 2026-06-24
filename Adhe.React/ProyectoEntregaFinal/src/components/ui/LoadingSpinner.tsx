import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  minHeight?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = (props) => {
  const { message = "Cargando...", minHeight = "60vh" } = props;

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight }}>
      <output className="spinner-border">
        <span className="visually-hidden">{message}</span>
      </output>
    </div>
  );
};

export default LoadingSpinner;
