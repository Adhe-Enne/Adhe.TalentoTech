import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  minHeight?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = (props) => {
  const { message = "Cargando...", minHeight = "60vh" } = props;

  return (
    <div className="flex justify-center items-center" style={{ minHeight }}>
      <output className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600">
        <span className="sr-only">{message}</span>
      </output>
    </div>
  );
};

export default LoadingSpinner;
