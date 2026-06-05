import React, { useState, useCallback } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { Tag } from "../../../models/Tag";

import useCart from "../../../hooks/useCart";
import useNotification from "../../../hooks/useNotification";
import { type Product } from "../../../models";
import ProductImageCarousel from "./ProductImageCarousel";

interface ProductDetailProps {
  product: Product;
  categoryName?: string;
  tags?: Tag[];
}

const ProductDetail: React.FC<ProductDetailProps> = (props) => {
  const { product, categoryName, tags } = props;
  const [cantidad, setCantidad] = useState<number>(1);
  const { images } = product;

  const { addToCart } = useCart();
  const { setNotification } = useNotification();
  const navigate: NavigateFunction = useNavigate();

  const handleAdd: () => void = useCallback(() => {
    addToCart(product, cantidad);
    setNotification(`${product.name} fue agregado al carrito`, 3000, "success");
  }, [addToCart, cantidad, product, setNotification]);

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
            <label className="mb-0" htmlFor="cantidad-input">
              Cantidad:
            </label>
            <input
              className="form-control"
              id="cantidad-input"
              min={1}
              onChange={(e) => setCantidad(Math.max(1, Number(e.target.value) || 1))}
              style={{ width: 100 }}
              type="number"
              value={cantidad}
            />
            <button className="btn btn-cta" onClick={handleAdd}>
              Añadir al carrito
            </button>
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
