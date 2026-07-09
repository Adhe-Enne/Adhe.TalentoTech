import React from "react";
import { FaSync } from "react-icons/fa";

interface RefreshButtonProps {
  loading: boolean;
  label?: string;
  onRefresh: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = (props) => {
  const { loading, onRefresh, label = "Refrescar" } = props;

  return (
    <button
      aria-busy={loading}
      aria-label={label}
      className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-brand/90 hover:shadow-md active:scale-[0.98] active:shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2 transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
      disabled={loading}
      onClick={onRefresh}
      type="button"
    >
      {loading ? (
        <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
      ) : (
        <>
          <FaSync />
          {label}
        </>
      )}
    </button>
  );
};

export default RefreshButton;
