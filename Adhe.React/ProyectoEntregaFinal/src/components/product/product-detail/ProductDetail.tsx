import React, { useCallback, useState } from "react";
import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";

import type { Product } from "../../../models";
import type { Tag } from "../../../models/Tag";

import { formatPrice } from "../../../utils/format";
import HelmetMeta from "../../ui/HelmetMeta";
import QuantityStepper from "../../ui/QuantityStepper";
import RefreshButton from "../../ui/RefreshButton";
import ProductImageCarousel from "./ProductImageCarousel";

interface ProductDetailProps {
  loading: boolean;
  product: Product;
  categoryName?: string;
  tags?: Tag[];
  onAddToCart: (cantidad: number) => void;
  onBack: () => void;
  onRefresh: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = (props) => {
  const { categoryName, loading, onAddToCart, onBack, onRefresh, product, tags } = props;
  const [cantidad, setCantidad] = useState<number>(1);
  const { images, stock } = product;

  const handleIncrement: () => void = useCallback(() => {
    setCantidad((prev) => Math.min(prev + 1, stock));
  }, [stock]);

  const handleDecrement: () => void = useCallback(() => {
    setCantidad((prev) => Math.max(1, prev - 1));
  }, []);

  const handleAdd: () => void = useCallback(() => {
    onAddToCart(cantidad);
  }, [cantidad, onAddToCart]);

  return (
    <>
      <HelmetMeta description={`${product.name} — ${(product.description ?? "Producto disponible en Talento Tech").slice(0, 160)}`} title={`${product.name} | Talento Tech`} />
      <Container>
        <Row className="gx-4 gy-3 justify-content-center product-detail">
          <Col md={5} xs={12}>
            <div className="card">
              <ProductImageCarousel alt={product.name} images={[product.image, ...(images ?? [])]} />
            </div>
          </Col>
          <Col md={5} xs={12}>
            <div className="d-flex justify-content-between align-items-start">
              <h2>{product.name}</h2>
              <RefreshButton loading={loading} onRefresh={onRefresh} />
            </div>
            {categoryName && <div className="mb-1 text-muted">Categoría: {categoryName}</div>}

            <div className="mb-3 text-muted">{product.description ?? "Sin descripción"}</div>

            <div className="mb-3">
              <span className="badge-price">
                {" "}
                {formatPrice(product.price, product.currency)}
              </span>
            </div>

            <div className="mb-2">{stock > 0 ? <Badge bg="success">{stock} en stock</Badge> : <Badge bg="danger">Sin stock</Badge>}</div>

            {tags && tags.length > 0 && (
              <div className="mb-2">
                {tags.map((t) => (
                  <Badge bg="secondary" className="me-1" key={t.id}>
                    {t.name}
                  </Badge>
                ))}
              </div>
            )}

            <div className="d-flex align-items-center gap-2 mt-3">
              <span className="mb-0">Cantidad:</span>
              <QuantityStepper max={stock} min={1} onDecrement={handleDecrement} onIncrement={handleIncrement} size="md" value={cantidad} />
              {stock <= 0 ? (
                <Button disabled variant="secondary">
                  Sin stock
                </Button>
              ) : (
                <button aria-label={`Agregar ${product.name} al carrito`} className="btn btn-cta btn-icon" onClick={handleAdd}>
                  <FaShoppingCart />
                  Añadir al carrito
                </button>
              )}
            </div>

            <div className="mt-3">
              <button aria-label="Volver a productos" className="btn btn-cta" onClick={onBack}>
                <FaArrowLeft className="me-1" />
                Volver
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductDetail;
