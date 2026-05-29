import React, { useMemo } from "react";

import type { Product } from "../../../models";

import useFavorites from "../../../hooks/useFavorites";
import Plus from "../../icons/Plus";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = (props) => {
  const { product, onAddToCart, onClick } = props;

  const { isFavorite, toggleFavorite } = useFavorites();
  const fav: boolean = useMemo(() => isFavorite(product.id), [isFavorite, product.id]);

  return (
    <div className={`card h-100 ${styles.tarjetaProducto}`}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <button aria-label={`Ver detalles de ${product.name}`} className={styles.imageWrapper} onClick={() => onClick?.(product)} type="button">
          <img alt={product.name} className={styles.imagen} src={product.image} />
          <span className={"badge-price " + styles.priceBadge}>${product.price.toFixed(2)}</span>
        </button>

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
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>

        <div className={`d-flex gap-2 ${styles.actions}`}>
          {onClick && (
            <button className={`btn btn-outline-primary btn-sm ${styles.btnOutline}`} onClick={() => onClick(product)}>
              Ver detalle
            </button>
          )}

          {onAddToCart && (
            <button className={`btn btn-primary btn-sm ${styles.btnPrimary} btn-icon`} onClick={() => onAddToCart(product)}>
              <Plus style={{ width: 16, height: 16 }} />
              Añadir
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
