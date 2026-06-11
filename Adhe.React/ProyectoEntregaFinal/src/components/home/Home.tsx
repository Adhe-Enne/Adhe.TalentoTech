import React, { type JSX } from "react";
import { Alert, Button, Container, InputGroup, Spinner } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

import type { Product } from "../../models";

import ProductGrid from "../product/ProductGrid";
import HelmetMeta from "../ui/HelmetMeta";
import styles from "./Home.module.css";

interface HomeProps {
  products: Product[];
  emptyMessage?: string;
  hasMore?: boolean;
  loading?: boolean;
  loadingMore?: boolean;
  localQ?: string;
  pageDescription?: string;
  pageTitle?: string;
  onLoadMore?: () => void;
  onLocalQChange?: (value: string) => void;
  onReload?: () => void;
}

const ITEMS_PER_PAGE: number = 8;

const Home: React.FC<HomeProps> = (props) => {
  const { products, emptyMessage, hasMore = false, loading, loadingMore = false, localQ = "", onLoadMore, onLocalQChange, onReload, pageTitle, pageDescription } = props;
  const showLocalSearch: boolean = !loading && onLocalQChange !== undefined;
  const hasLocalFilter: boolean = localQ.trim().length > 0;
  const showReset: boolean = products.length > ITEMS_PER_PAGE;
  const showLoadMore: boolean = hasMore && products.length > 0 && !loading;

  const renderProductList: () => JSX.Element = () => {
    if (products.length === 0) {
      const message: string = hasLocalFilter ? `No se encontraron productos para "${localQ}".` : (emptyMessage ?? "No hay productos disponibles.");
      return (
        <Alert className="d-flex align-items-center gap-2" variant="info">
          <span>{message}</span>
          {hasLocalFilter && (
            <Button className="ms-auto" onClick={() => onLocalQChange?.("")} size="sm" variant="outline-secondary">
              Limpiar filtro
            </Button>
          )}
        </Alert>
      );
    }
    return (
      <div className={styles.fadeIn}>
        <ProductGrid products={products} />
      </div>
    );
  };

  return (
    <Container className="py-4">
      <HelmetMeta description={pageDescription ?? undefined} title={pageTitle ? `Talento Tech | ${pageTitle}` : "Talento Tech"} />
      {loading ? (
        <div aria-busy="true" className="d-flex justify-content-center py-5">
          <Spinner animation="border" aria-hidden="true" />
          <output aria-live="polite" className="visually-hidden">
            Cargando...
          </output>
        </div>
      ) : (
        <>
          {showLocalSearch && (
            <div className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch aria-hidden="true" />
                </InputGroup.Text>
                <input
                  aria-label="Filtrar productos por nombre"
                  className="form-control"
                  onChange={(e) => onLocalQChange?.(e.target.value)}
                  placeholder="Filtrar resultados..."
                  type="text"
                  value={localQ}
                />
                {hasLocalFilter && (
                  <Button onClick={() => onLocalQChange?.("")} variant="outline-secondary">
                    Limpiar
                  </Button>
                )}
              </InputGroup>
              {hasLocalFilter && (
                <small className="text-muted mt-1 d-block">
                  {products.length} producto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""} para &quot;{localQ}&quot;
                </small>
              )}
            </div>
          )}
          {renderProductList()}

          {showLoadMore && (
            <div className="d-flex justify-content-center gap-2 mt-4">
              {showReset && (
                <Button onClick={() => onReload?.()} variant="outline-secondary">
                  Ver menos
                </Button>
              )}
              <Button disabled={loadingMore} onClick={() => onLoadMore?.()} variant="primary">
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

          {!hasMore && products.length > ITEMS_PER_PAGE && (
            <div className="text-center mt-3">
              <output className="text-muted">No hay más productos para mostrar.</output>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;
