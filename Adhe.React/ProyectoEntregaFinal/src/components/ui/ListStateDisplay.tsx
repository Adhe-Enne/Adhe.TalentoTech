import React from "react";
import { Alert, Button, Spinner } from "react-bootstrap";

interface ListStateDisplayProps {
  children: React.ReactNode;
  error: string | null;
  loading: boolean;
  loadingMessage?: string;
  onRetry?: () => void;
}

const ListStateDisplay: React.FC<ListStateDisplayProps> = (props: ListStateDisplayProps) => {
  const { children, error, loading, loadingMessage = "Cargando...", onRetry } = props;
  if (loading) {
    return (
      <div aria-busy="true" className="d-flex justify-content-center py-5">
        <Spinner animation="border" role="status" />
        <output aria-live="polite" className="visually-hidden">
          {loadingMessage}
        </output>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="d-flex align-items-center gap-2" variant="danger">
        <span>{error}</span>
        {onRetry && (
          <Button aria-label="Reintentar" className="ms-auto" onClick={onRetry} size="sm" variant="outline-danger">
            Reintentar
          </Button>
        )}
      </Alert>
    );
  }

  return <>{children}</>;
};

export default ListStateDisplay;
