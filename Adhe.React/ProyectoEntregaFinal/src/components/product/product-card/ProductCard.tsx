import React from "react";
import { FaCartPlus, FaEye, FaHeart, FaRegHeart } from "react-icons/fa";

import type { Product } from "../../../models";

import { formatPrice } from "../../../utils/format";
import QuantityStepper from "../../ui/QuantityStepper";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  currentQuantity: number;
  isFavorite: boolean;
  product: Product;
  onAddToCart: () => void;
  onDecrement: () => void;
  onIncrement: () => void;
  onNavigate: () => void;
  onToggleFavorite: () => void;
}

const ProductCard: React.FC<ProductCardProps> = (props) => {
  const { currentQuantity, isFavorite, product, onAddToCart, onDecrement, onIncrement, onNavigate, onToggleFavorite } = props;

  const outOfStock: boolean = product.stock <= 0;
  const inCart: boolean = currentQuantity > 0;

  return (
    <div className={`card h-100 ${styles.tarjetaProducto} ${outOfStock ? styles.outOfStockCard : ""}`}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <button aria-label={`Ver detalles de ${product.name}`} className={styles.imageWrapper} onClick={onNavigate} type="button">
          <img alt={product.name} className={styles.imagen} loading="lazy" src={product.image} />
          <span className={"badge-price " + styles.priceBadge}>{formatPrice(product.price, product.currency)}</span>
          {outOfStock && <span className={styles.outOfStockOverlay}>Sin stock</span>}
        </button>

        <button
          aria-label={isFavorite ? "Eliminar favorito" : "Marcar favorito"}
          aria-pressed={isFavorite}
          className={styles.favButton}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          title={isFavorite ? "Eliminar favorito" : "Marcar favorito"}
          type="button"
        >
          {isFavorite ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
        </button>
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <div className="d-flex justify-content-center mb-2">
          {outOfStock ? <span className={`badge ${styles.outOfStockBadge}`}>Sin stock</span> : <span className={`badge ${styles.stockBadge}`}>{product.stock} en stock</span>}
        </div>

        <div className={`d-flex gap-2 ${styles.actions}`}>
          <button aria-label={`Ver detalle de ${product.name}`} className={`btn btn-outline-primary btn-sm ${styles.btnOutline}`} onClick={onNavigate}>
            <FaEye aria-hidden="true" className="me-1" />
            Ver detalle
          </button>

          {!outOfStock && !inCart && (
            <button aria-label={`Agregar ${product.name} al carrito`} className={`btn btn-primary btn-sm ${styles.btnPrimary} btn-icon`} onClick={onAddToCart}>
              <FaCartPlus />
              Añadir
            </button>
          )}

          {!outOfStock && inCart && <QuantityStepper max={product.stock} onDecrement={onDecrement} onIncrement={onIncrement} size="sm" value={currentQuantity} />}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
