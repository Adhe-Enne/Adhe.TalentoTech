import React, { useCallback } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { Product } from "../../models";

import { useCart } from "../../hooks/useCart";
import { useNotification } from "../../hooks/useNotification";
import { useProducts } from "../../hooks/useProducts";
import Home from "./Home";

const HomeContainer: React.FC = () => {
  const { setNotification } = useNotification();
  const { products, loading } = useProducts();
  const backNavigate: NavigateFunction = useNavigate();
  const { addToCart } = useCart();

  const handleAddWithNotification: (p: Product) => void = useCallback(
    (p: Product) => {
      addToCart(p, 1);
      setNotification(`${p.nombre} fue agregado al carrito`, 3000, "success");
    },
    [addToCart, setNotification],
  );

  const handleSelect: (p: Product) => void = useCallback(
    (p: Product) => {
      backNavigate(`/producto/${p.id}`);
    },
    [backNavigate],
  );

  return <Home loading={loading} onAddToCart={handleAddWithNotification} onSelect={handleSelect} products={products} />;
};

export default HomeContainer;
