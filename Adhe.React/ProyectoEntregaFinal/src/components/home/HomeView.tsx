import React from "react";
import { Alert, Button, Col, Container, InputGroup, Row, Spinner } from "react-bootstrap";
import { FaChevronUp, FaSearch, FaTimes } from "react-icons/fa";

import type { Product } from "../../models";

import ProductCard from "../product/product-card/ProductCard";
import HelmetMeta from "../ui/HelmetMeta";
import LoadingSpinner from "../ui/LoadingSpinner";
import PageHeader from "../ui/PageHeader";
import RefreshButton from "../ui/RefreshButton";
import styles from "./Home.module.css";

interface ProductCardData {
  currentQuantity: number;
  isFavorite: boolean;
  product: Product;
  onAddToCart: () => void;
  onDecrement: () => void;
  onIncrement: () => void;
  onNavigate: () => void;
  onToggleFavorite: () => void;
}

interface HomeViewProps {
  cardData: ProductCardData[];
  emptyMessage: string | undefined;
  hasLocalFilter: boolean;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  localQ: string;
  pageDescription: string | undefined;
  pageTitle: string | undefined;
  showLoadMore: boolean;
  showReset: boolean;
  onClearFilter: () => void;
  onLoadMore: () => void;
  onLocalQChange: (q: string) => void;
  onReload: () => void;
}

const HomeView: React.FC<HomeViewProps> = (props) => {
  const { cardData, emptyMessage, hasLocalFilter, hasMore, loading, loadingMore, localQ, pageDescription, pageTitle, showLoadMore, showReset, onClearFilter, onLoadMore, onLocalQChange, onReload } = props;

  return (
    <Container className="py-4">
      <HelmetMeta description={pageDescription} title={pageTitle ? `Talento Tech | ${pageTitle}` : "Talento Tech"} />
      {loading ? (
        <LoadingSpinner message="Cargando productos..." minHeight="40vh" />
      ) : (
        <>
          <PageHeader headingTag="h3" title={pageTitle ?? "Productos"}>
            <RefreshButton loading={loading} onRefresh={onReload} />
          </PageHeader>
          <div className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <FaSearch aria-hidden="true" />
              </InputGroup.Text>
              <input aria-label="Filtrar productos por nombre" className="form-control" onChange={(e) => onLocalQChange(e.target.value)} placeholder="Filtrar resultados..." type="text" value={localQ} />
              {hasLocalFilter && (
                <Button aria-label="Limpiar filtro local" onClick={onClearFilter} variant="outline-secondary">
                  <FaTimes aria-hidden="true" className="me-1" />
                  Limpiar
                </Button>
              )}
            </InputGroup>
            {hasLocalFilter && (
              <small className="text-muted mt-1 d-block">
                {cardData.length} producto{cardData.length === 1 ? "" : "s"} encontrado{cardData.length === 1 ? "" : "s"} para &quot;{localQ}&quot;
              </small>
            )}
          </div>

          {cardData.length === 0 ? (
            <Alert className="d-flex align-items-center gap-2" variant="info">
              <span>{hasLocalFilter ? `No se encontraron productos para "${localQ}".` : (emptyMessage ?? "No hay productos disponibles.")}</span>
              {hasLocalFilter && (
                <Button aria-label="Limpiar filtro de búsqueda" className="ms-auto" onClick={onClearFilter} size="sm" variant="outline-secondary">
                  <FaTimes aria-hidden="true" className="me-1" />
                  Limpiar filtro
                </Button>
              )}
            </Alert>
          ) : (
            <div className={styles.fadeIn}>
              <Container>
                <Row className="g-3 product-grid-row">
                  {cardData.map((cd) => (
                    <Col key={cd.product.id} lg={3} md={4} sm={6} xs={12}>
                      <ProductCard
                        currentQuantity={cd.currentQuantity}
                        isFavorite={cd.isFavorite}
                        onAddToCart={cd.onAddToCart}
                        onDecrement={cd.onDecrement}
                        onIncrement={cd.onIncrement}
                        onNavigate={cd.onNavigate}
                        onToggleFavorite={cd.onToggleFavorite}
                        product={cd.product}
                      />
                    </Col>
                  ))}
                </Row>
              </Container>
            </div>
          )}

          {showLoadMore && (
            <div className="d-flex justify-content-center gap-2 mt-4">
              {showReset && (
                <Button aria-label="Ver menos productos" onClick={() => onReload()} variant="outline-secondary">
                  <FaChevronUp aria-hidden="true" className="me-1" />
                  Ver menos
                </Button>
              )}
              <Button aria-label="Cargar más productos" disabled={loadingMore} onClick={() => onLoadMore()} variant="primary">
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

          {!hasMore && cardData.length > 8 && (
            <div className="text-center mt-3">
              <output aria-live="polite" className="text-muted">
                No hay más productos para mostrar.
              </output>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default HomeView;
