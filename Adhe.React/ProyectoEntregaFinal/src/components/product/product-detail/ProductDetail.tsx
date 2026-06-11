import React, { useCallback, useState } from "react";
import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { Tag } from "../../../models/Tag";

import useCart from "../../../hooks/useCart";
import useNotification from "../../../hooks/useNotification";
import { type Product } from "../../../models";
import HelmetMeta from "../../ui/HelmetMeta";
import QuantityStepper from "../../ui/QuantityStepper";
import ProductImageCarousel from "./ProductImageCarousel";

interface ProductDetailProps {
  product: Product;
  categoryName?: string;
  tags?: Tag[];
}

const ProductDetail: React.FC<ProductDetailProps> = (props) => {
  const { product, categoryName, tags } = props;
  const [cantidad, setCantidad] = useState<number>(1);
  const { images, stock } = product;

  const { addToCart } = useCart();
  const { setNotification } = useNotification();
  const navigate: NavigateFunction = useNavigate();

  const handleAdd: () => void = useCallback(() => {
    if (stock <= 0) {
      setNotification("Producto sin stock", 3000, "warning");
      return;
    }
    addToCart(product, cantidad);
    setNotification(`${product.name} fue agregado al carrito`, 3000, "success");
  }, [addToCart, cantidad, product, setNotification, stock]);

  const handleIncrement: () => void = useCallback(() => {
    setCantidad((prev) => {
      if (prev >= stock) {
        setNotification("Stock maximo alcanzado", 3000, "warning");
        return prev;
      }
      return prev + 1;
    });
  }, [stock, setNotification]);

  const handleDecrement: () => void = useCallback(() => {
    setCantidad((prev) => Math.max(1, prev - 1));
  }, []);

  const handleBack: () => void = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <>
      <HelmetMeta description={`${product.name} — ${(product.description ?? "Producto disponible en Talento Tech").slice(0, 160)}`} title={`${product.name} | Talento Tech`} />
    <Container>
      <Row className="gx-4 gy-3 justify-content-center product-detail">
        <Col xs={12} md={5}>
          <div className="card">
            <ProductImageCarousel alt={product.name} images={[product.image, ...(images ?? [])]} />
          </div>
        </Col>
        <Col xs={12} md={5}>
          <h2>{product.name}</h2>
          {categoryName && <div className="mb-1 text-muted">Categoría: {categoryName}</div>}

          <div className="mb-3 text-muted">{product.description ?? "Sin descripción"}</div>

          <div className="mb-3">
            <span className="badge-price">
              {" "}
              {product.currency} ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="mb-2">
            {stock > 0 ? (
              <Badge bg="success">{stock} en stock</Badge>
            ) : (
              <Badge bg="danger">Sin stock</Badge>
            )}
          </div>

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
            <QuantityStepper 
              max={stock}
              min={1}
              onDecrement={handleDecrement}
              onIncrement={handleIncrement}
              size="md"
              value={cantidad}
            />
            {stock <= 0 ? (
              <Button variant="secondary" disabled>
                Sin stock
              </Button>
            ) : (
              <button className="btn btn-cta btn-icon" aria-label={`Agregar ${product.name} al carrito`} onClick={handleAdd}>
                <FaShoppingCart />
                Añadir al carrito
              </button>
            )}
          </div>

          <div className="mt-3">
            <button className="btn btn-cta" aria-label="Volver a productos" onClick={handleBack}>
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
