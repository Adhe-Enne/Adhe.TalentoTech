import React from "react";
import { Button, Spinner } from "react-bootstrap";
import { FaSync } from "react-icons/fa";

interface RefreshButtonProps {
  loading: boolean;
  label?: string;
  onRefresh: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = (props) => {
  const { loading, onRefresh, label = "Refrescar" } = props;

  return (
    <Button aria-label={label} disabled={loading} onClick={onRefresh} size="sm" variant="outline-secondary">
      {loading ? (
        <Spinner animation="border" size="sm" />
      ) : (
        <>
          <FaSync className="me-2" />
          {label}
        </>
      )}
    </Button>
  );
};

export default RefreshButton;
