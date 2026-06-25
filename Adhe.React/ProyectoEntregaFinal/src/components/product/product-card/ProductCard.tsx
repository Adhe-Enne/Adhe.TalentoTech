import React, { useCallback } from "react";
import { FaCartPlus, FaEye, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { Product } from "../../../models";

import useCart from "../../../hooks/selectors/useCart";
import useFavorites from "../../../hooks/selectors/useFavorites";
import useNotification from "../../../hooks/selectors/useNotification";
import QuantityStepper from "../../ui/QuantityStepper";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = (props) => {
  const { product } = props;
  const { addToCart, getCantidadActual, removeFromCart, updateQuantity } = useCart();
  const { setNotification } = useNotification();
  const navigate: NavigateFunction = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav: boolean = isFavorite(product.id);

  const cantidadActual: number = getCantidadActual(product.id);
  const outOfStock: boolean = product.stock <= 0;
  const inCart: boolean = cantidadActual > 0;

  const handleAddToCart: () => void = useCallback(() => {
    addToCart(product, 1);
    setNotification(`${product.name} fue agregado al carrito`, 3000, "success");
  }, [addToCart, product, setNotification]);

  const handleIncrement: () => void = useCallback(() => {
    const current: number = getCantidadActual(product.id);
    if (current >= product.stock) {
      setNotification(`Stock maximo alcanzado para ${product.name}`, 3000, "warning");
      return;
    }
    updateQuantity(product.id, current + 1);
    setNotification(`${product.name}: +1 unidad`, 2000, "info");
  }, [getCantidadActual, product.id, product.stock, product.name, updateQuantity, setNotification]);

  const handleDecrement: () => void = useCallback(() => {
    const current: number = getCantidadActual(product.id);
    if (current <= 1) {
      removeFromCart(product.id);
      setNotification(`${product.name} eliminado del carrito`, 2000, "info");
      return;
    }
    updateQuantity(product.id, current - 1);
    setNotification(`${product.name}: -1 unidad`, 2000, "info");
  }, [getCantidadActual, product.id, product.name, removeFromCart, updateQuantity, setNotification]);

  const handleClick: () => void = useCallback(() => {
    navigate(`/producto/${product.id}`);
  }, [navigate, product.id]);

  return (
    <div className={`card h-100 ${styles.tarjetaProducto} ${outOfStock ? styles.outOfStockCard : ""}`}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <button aria-label={`Ver detalles de ${product.name}`} className={styles.imageWrapper} onClick={handleClick} type="button">
          <img alt={product.name} className={styles.imagen} loading="lazy" src={product.image} />
          <span className={"badge-price " + styles.priceBadge}>${product.price.toFixed(2)}</span>
          {outOfStock && <span className={styles.outOfStockOverlay}>Sin stock</span>}
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
          {outOfStock ? <span className={`badge ${styles.outOfStockBadge}`}>Sin stock</span> : <span className={`badge ${styles.stockBadge}`}>{product.stock} en stock</span>}
        </div>

        <div className={`d-flex gap-2 ${styles.actions}`}>
          <button aria-label={`Ver detalle de ${product.name}`} className={`btn btn-outline-primary btn-sm ${styles.btnOutline}`} onClick={handleClick}>
            <FaEye aria-hidden="true" className="me-1" />
            Ver detalle
          </button>

          {!outOfStock && !inCart && (
            <button aria-label={`Agregar ${product.name} al carrito`} className={`btn btn-primary btn-sm ${styles.btnPrimary} btn-icon`} onClick={handleAddToCart}>
              <FaCartPlus />
              Añadir
            </button>
          )}

          {!outOfStock && inCart && <QuantityStepper max={product.stock} onDecrement={handleDecrement} onIncrement={handleIncrement} size="sm" value={cantidadActual} />}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
