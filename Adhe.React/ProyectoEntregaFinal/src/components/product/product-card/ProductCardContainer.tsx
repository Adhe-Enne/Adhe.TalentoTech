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
  const { addToCart } = useCart();
  const { setNotification } = useNotification();
  const navigate: NavigateFunction = useNavigate();

  const handleAddToCart: (p: Product) => void = useCallback(
    (p: Product) => {
      addToCart(p, 1);
      setNotification(`${p.name} fue agregado al carrito`, 3000, "success");
    },
    [addToCart, setNotification],
  );

  const handleClick: (p: Product) => void = useCallback(
    (p: Product) => {
      navigate(`/producto/${p.id}`);
    },
    [navigate],
  );

  return <ProductCard onAddToCart={handleAddToCart} onClick={handleClick} product={product} />;
};

export default ProductCardContainer;
