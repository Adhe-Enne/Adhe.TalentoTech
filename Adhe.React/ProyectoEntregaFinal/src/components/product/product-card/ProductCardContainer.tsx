import React, { useCallback } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { Product } from "../../../models";

import useCart from "../../../hooks/useCart";
import useNotification from "../../../hooks/useNotification";
import ProductCard from "./ProductCard";

interface ProductCardContainerProps {
  product: Product;
}

const ProductCardContainer: React.FC<ProductCardContainerProps> = (props) => {
  const { product } = props;
  const { addToCart, getCantidadActual, removeFromCart, updateQuantity } = useCart();
  const { setNotification } = useNotification();
  const navigate: NavigateFunction = useNavigate();
  const cantidadActual: number = getCantidadActual(product.id);

  const handleAddToCart: (p: Product) => void = useCallback(
    (p: Product) => {
      addToCart(p, 1);
      setNotification(`${p.name} fue agregado al carrito`, 3000, "success");
    },
    [addToCart, setNotification],
  );

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

  const handleClick: (p: Product) => void = useCallback(
    (p: Product) => {
      navigate(`/producto/${p.id}`);
    },
    [navigate],
  );

  return (
    <ProductCard
      cantidadActual={cantidadActual}
      onAddToCart={handleAddToCart}
      onClick={handleClick}
      onDecrement={handleDecrement}
      onIncrement={handleIncrement}
      product={product}
    />
  );
};

export default ProductCardContainer;
