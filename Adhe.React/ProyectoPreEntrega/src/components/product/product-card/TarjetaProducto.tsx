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
      <button
        aria-label={`Ver detalles de ${product.nombre}`}
        className={styles.imageWrapper}
        onClick={() => onClick?.(product)}
        type="button"
      >
        <img alt={product.nombre} className={styles.imagen} src={product.imagen} />
        <button
          aria-label={fav ? "Eliminar favorito" : "Marcar favorito"}
          aria-pressed={fav}
          className={styles.favButton}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          title={fav ? "Eliminar favorito" : "Marcar favorito"}
          type="button"
        >
          <span aria-hidden="true">{fav ? "♥" : "♡"}</span>
        </button>
        <span className={"badge-price " + styles.priceBadge}>${product.precio.toFixed(2)}</span>
      </button>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.nombre}</h5>

        <div className={`d-flex gap-2 ${styles.actions}`}>
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
        </div>
      </div>
    </div>
  );
};

export default TarjetaProducto;
