import React from "react";

import { type CartItem } from "../../models";

interface CarritoProps {
  items: CartItem[];
  onBack?: () => void;
  onChangeCantidad: (productId: number, cantidad: number) => void;
  onRemove: (productId: number) => void;
}

const Carrito: React.FC<CarritoProps> = (props) => {
  const { items, onBack, onChangeCantidad, onRemove } = props;

  const total: number = items.reduce((acc, it) => acc + it.product.precio * it.cantidad, 0);

  return (
    <div className="container py-4">
      <h2>Carrito</h2>
      {items.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div className="list-group">
          {items.map((it) => (
            <div className="list-group-item d-flex align-items-center gap-3" key={it.product.id}>
              <img
                alt={it.product.nombre}
                className="rounded"
                src={it.product.imagen}
                style={{ width: 80, height: 80, objectFit: "cover" }}
              />
              <div className="flex-grow-1">
                <strong>{it.product.nombre}</strong>
                <div className="text-muted">${it.product.precio.toFixed(2)}</div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => onChangeCantidad(it.product.id, Math.max(1, it.cantidad - 1))}
                >
                  -
                </button>
                <span>{it.cantidad}</span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => onChangeCantidad(it.product.id, it.cantidad + 1)}
                >
                  +
                </button>
              </div>
              <div style={{ width: 120, textAlign: "right" }}>${(it.product.precio * it.cantidad).toFixed(2)}</div>
              <div>
                <button className="btn btn-danger btn-sm" onClick={() => onRemove(it.product.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-between mt-3">
            <strong>Total:</strong>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </div>
      )}

      <div className="mt-3">
        {onBack && (
          <button className="btn btn-secondary" onClick={onBack}>
            Volver
          </button>
        )}
      </div>
    </div>
  );
};

export default Carrito;
