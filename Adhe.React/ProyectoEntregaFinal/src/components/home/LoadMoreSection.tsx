import React from "react";
import { Button, Spinner } from "react-bootstrap";
import { FaChevronUp } from "react-icons/fa";

interface LoadMoreSectionProps {
  hasMore: boolean;
  itemsPerPage: number;
  loadingMore: boolean;
  productCount: number;
  onLoadMore?: () => void;
  onReload?: () => void;
}

const LoadMoreSection: React.FC<LoadMoreSectionProps> = (props) => {
  const { hasMore, loadingMore, productCount, itemsPerPage, onLoadMore, onReload } = props;
  const showReset: boolean = productCount > itemsPerPage;
  const showLoadMore: boolean = hasMore && productCount > 0 && !loadingMore;

  return (
    <>
      {showLoadMore && (
        <div className="d-flex justify-content-center gap-2 mt-4">
          {showReset && (
            <Button aria-label="Ver menos productos" onClick={() => onReload?.()} variant="outline-secondary">
              <FaChevronUp aria-hidden="true" className="me-1" />
              Ver menos
            </Button>
          )}
          <Button aria-label="Cargar más productos" disabled={loadingMore} onClick={() => onLoadMore?.()} variant="primary">
            {loadingMore ? (
              <>
                <Spinner animation="border" aria-hidden="true" className="me-2" size="sm" />
                Cargando...
              </>
            ) : (
              "Cargar más"
            )}
          </Button>
        </div>
      )}

      {!hasMore && productCount > itemsPerPage && (
        <div className="text-center mt-3">
          <output className="text-muted">No hay más productos para mostrar.</output>
        </div>
      )}
    </>
  );
};

export default LoadMoreSection;
