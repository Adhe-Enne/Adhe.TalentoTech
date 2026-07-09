import React from "react";
import { FaTrash } from "react-icons/fa";

interface DeleteButtonProps {
  "aria-label": string;
  disabled?: boolean;
  size?: "sm" | "lg";
  onClick: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = (props) => {
  const { "aria-label": ariaLabel, disabled = false, onClick } = props;

  return (
    <button
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1.5 rounded-lg text-sm hover:bg-red-100 hover:border-red-300 transition-colors disabled:opacity-50"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <FaTrash aria-hidden="true" />
      Eliminar
    </button>
  );
};

export default DeleteButton;
