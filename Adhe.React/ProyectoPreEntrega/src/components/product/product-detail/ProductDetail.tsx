import React, { useState } from "react";

import { type Product } from "../../../models";

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, cantidad: number) => void;
  onBack?: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = (props) => {
  const { product, onAddToCart, onBack } = props;
  const [cantidad, setCantidad] = useState<number>(1);

  return (
    <div className="container">
      <div className="row gx-4 gy-3 justify-content-center product-detail">
        <div className="col-12 col-md-5">
          <div className="card">
            <img alt={product.name} className="img-fluid rounded-top" src={product.image} />
          </div>
        </div>
        <div className="col-12 col-md-5">
          <h2>{product.name}</h2>
          <div className="mb-3 text-muted">{product.description ?? "Sin descripción"}</div>

          <div className="mb-3">
            <span className="badge-price">${product.price.toFixed(2)}</span>
          </div>

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
            <button className="btn btn-cta" onClick={() => onAddToCart(product, cantidad)}>
              Añadir al carrito
            </button>
          </div>

          {onBack && (
            <div className="mt-3">
              <button className="btn btn-cta" onClick={onBack}>
                Volver
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
