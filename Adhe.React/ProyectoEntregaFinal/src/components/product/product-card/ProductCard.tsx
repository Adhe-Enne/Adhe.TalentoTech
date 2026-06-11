import React from "react";
import { FaCartPlus, FaEye, FaHeart, FaRegHeart } from "react-icons/fa";

import type { Product } from "../../../models";

import useFavorites from "../../../hooks/useFavorites";
import useIsFavorite from "../../../hooks/useIsFavorite";
import QuantityStepper from "../../ui/QuantityStepper";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  cantidadActual?: number;
  onAddToCart?: (product: Product) => void;
  onClick?: (product: Product) => void;
  onDecrement?: () => void;
  onIncrement?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = (props) => {
  const { product, onAddToCart, onClick, onIncrement, onDecrement, cantidadActual = 0 } = props;

  const { toggleFavorite } = useFavorites();
  const fav: boolean = useIsFavorite(product.id);
  const outOfStock: boolean = product.stock <= 0;
  const inCart: boolean = cantidadActual > 0;

  return (
    <div className={`card h-100 ${styles.tarjetaProducto} ${outOfStock ? styles.outOfStockCard : ""}`}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <button aria-label={`Ver detalles de ${product.name}`} className={styles.imageWrapper} onClick={() => onClick?.(product)} type="button">
          <img alt={product.name} className={styles.imagen} loading="lazy" src={product.image} />
          <span className={"badge-price " + styles.priceBadge}>${product.price.toFixed(2)}</span>
          {outOfStock && (
            <span className={styles.outOfStockOverlay}>Sin stock</span>
          )}
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
          {fav ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
        </button>
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <div className="d-flex justify-content-center mb-2">
          {outOfStock ? (
            <span className={`badge ${styles.outOfStockBadge}`}>Sin stock</span>
          ) : (
            <span className={`badge ${styles.stockBadge}`}>{product.stock} en stock</span>
          )}
        </div>

        <div className={`d-flex gap-2 ${styles.actions}`}>
          {onClick && (
            <button aria-label={`Ver detalle de ${product.name}`} className={`btn btn-outline-primary btn-sm ${styles.btnOutline}`} onClick={() => onClick(product)}>
              <FaEye aria-hidden="true" className="me-1" />
              Ver detalle
            </button>
          )}

          {!outOfStock && !inCart && onAddToCart && (
            <button aria-label={`Agregar ${product.name} al carrito`} className={`btn btn-primary btn-sm ${styles.btnPrimary} btn-icon`} onClick={() => onAddToCart(product)}>
              <FaCartPlus />
              Añadir
            </button>
          )}

          {!outOfStock && inCart && onIncrement && onDecrement && (
            <QuantityStepper
              max={product.stock}
              onDecrement={onDecrement}
              onIncrement={onIncrement}
              size="sm"
              value={cantidadActual}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
