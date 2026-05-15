import React, { useMemo } from "react";

import type { Product } from "../../../models";

import useFavorites from "../../../hooks/useFavorites";
import styles from "./TarjetaProducto.module.css";

interface TarjetaProductoProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onClick?: (product: Product) => void;
}

const TarjetaProducto: React.FC<TarjetaProductoProps> = (props) => {
  const { product, onAddToCart, onClick } = props;

  const { isFavorite, toggleFavorite } = useFavorites();
  const fav: boolean = useMemo(() => isFavorite(product.id), [isFavorite, product.id]);

  return (
    <div className={`card h-100 ${styles.tarjetaProducto}`}>
      <img alt={product.nombre} className={`card-img-top ${styles.imagen}`} src={product.imagen} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.nombre}</h5>
        <p className="card-text text-success fw-bold">${product.precio.toFixed(2)}</p>
        <div className="mt-auto d-flex gap-2">
          {onClick && (
            <button className="btn btn-outline-primary btn-sm" onClick={() => onClick(product)}>
              Ver detalle
            </button>
          )}

          {onAddToCart && (
            <button className="btn btn-primary btn-sm" onClick={() => onAddToCart(product)}>
              Añadir
            </button>
          )}

          <button
            aria-label={fav ? "Eliminar favorito" : "Marcar favorito"}
            aria-pressed={fav}
            className={`btn btn-sm ${fav ? "btn-danger" : "btn-outline-danger"}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            title={fav ? "Eliminar favorito" : "Marcar favorito"}
            type="button"
          >
            <span aria-hidden="true">{fav ? "♥" : "♡"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TarjetaProducto;
