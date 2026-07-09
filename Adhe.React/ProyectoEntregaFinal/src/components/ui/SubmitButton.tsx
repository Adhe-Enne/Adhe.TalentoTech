import React from "react";

interface SubmitButtonProps {
  loading: boolean;
  loadingLabel: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { children = "Guardar", disabled, loading, loadingLabel } = props;

  return (
    <button
      aria-label={loadingLabel}
      className="w-full bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
      disabled={disabled ?? loading}
      type="submit"
    >
      {loading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
      {loading ? loadingLabel : children}
    </button>
  );
};

export default SubmitButton;
