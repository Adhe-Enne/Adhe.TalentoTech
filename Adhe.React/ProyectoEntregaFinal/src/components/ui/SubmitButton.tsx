import React from "react";
import { Button, Spinner } from "react-bootstrap";

interface SubmitButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
  loading: boolean;
  loadingLabel: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { children = "Guardar", disabled, loading, loadingLabel } = props;

  return (
    <Button aria-label={loadingLabel} className="w-100" disabled={disabled ?? loading} type="submit" variant="primary">
      {loading && <Spinner animation="border" className="me-2" size="sm" />}
      {loading ? loadingLabel : children}
    </Button>
  );
};

export default SubmitButton;
