import React, { useCallback, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { Tag } from "../../../models/Tag";

import useCart from "../../../hooks/useCart";
import useNotification from "../../../hooks/useNotification";
import { type Product } from "../../../models";
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
    <div className="container">
      <div className="row gx-4 gy-3 justify-content-center product-detail">
        <div className="col-12 col-md-5">
          <div className="card">
            <ProductImageCarousel alt={product.name} images={images ?? [product.image]} />
          </div>
        </div>
        <div className="col-12 col-md-5">
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
              <span className="badge bg-success">{stock} en stock</span>
            ) : (
              <span className="badge bg-danger">Sin stock</span>
            )}
          </div>

          {tags && tags.length > 0 && (
            <div className="mb-2">
              {tags.map((t) => (
                <span className="badge bg-secondary me-1" key={t.id}>
                  {t.name}
                </span>
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
              <button className="btn btn-secondary" disabled>
                Sin stock
              </button>
            ) : (
              <button className="btn btn-cta" onClick={handleAdd}>
                Añadir al carrito
              </button>
            )}
          </div>

          <div className="mt-3">
            <button className="btn btn-cta" onClick={handleBack}>
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
