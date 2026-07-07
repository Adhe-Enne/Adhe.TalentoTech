import React from "react";
import { Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

interface DeleteButtonProps {
  "aria-label": string;
  disabled?: boolean;
  size?: "sm" | "lg";
  onClick: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = (props) => {
  const { "aria-label": ariaLabel, disabled = false, onClick, size = "sm" } = props;

  return (
    <Button aria-label={ariaLabel} disabled={disabled} onClick={onClick} size={size} variant="outline-danger">
      <FaTrash aria-hidden="true" className="me-1" />
      Eliminar
    </Button>
  );
};

export default DeleteButton;
