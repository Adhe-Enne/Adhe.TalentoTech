import React, { useState } from "react";

import { type Product } from "../../../models";

interface DetalleProductoProps {
  product: Product;
  onAddToCart: (product: Product, cantidad: number) => void;
  onBack?: () => void;
}

const DetalleProducto: React.FC<DetalleProductoProps> = (props) => {
  const { product, onAddToCart, onBack } = props;
  const [cantidad, setCantidad] = useState<number>(1);

  return (
    <div className="container">
      <div className="row gx-4 gy-3 justify-content-center">
        <div className="col-12 col-md-5">
          <img alt={product.nombre} className="img-fluid rounded" src={product.imagen} />
        </div>
        <div className="col-12 col-md-5">
          <h2>{product.nombre}</h2>
          <p>{product.descripcion ?? "Sin descripción"}</p>
          <p className="fw-bold">${product.precio.toFixed(2)}</p>

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
            <button className="btn btn-primary" onClick={() => onAddToCart(product, cantidad)}>
              Añadir al carrito
            </button>
          </div>

          {onBack && (
            <div className="mt-3">
              <button className="btn btn-secondary" onClick={onBack}>
                Volver
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;
