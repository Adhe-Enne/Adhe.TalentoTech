import React from "react";
import { Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";

interface BackButtonProps {
  "aria-label"?: string;
  children?: string;
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = (props) => {
  const { "aria-label": ariaLabel = "Volver", children = "Volver", onClick } = props;

  return (
    <Button aria-label={ariaLabel} onClick={onClick} variant="secondary">
      <FaArrowLeft aria-hidden="true" className="me-2" />
      {children}
    </Button>
  );
};

export default BackButton;
