import React, { useCallback, useMemo } from "react";
import { useNavigate, useLocation, type NavigateFunction } from "react-router-dom";

import type { Product } from "../../models";

import { useCart } from "../../hooks/useCart";
import useFavorites from "../../hooks/useFavorites";
import { useNotification } from "../../hooks/useNotification";
import { useProducts } from "../../hooks/useProducts";
import Home from "./Home";

const HomeContainer: React.FC = () => {
  const { setNotification } = useNotification();
  const { products, loading } = useProducts();
  const { favorites } = useFavorites();

  const location: ReturnType<typeof useLocation> = useLocation();
  const params: URLSearchParams = new URLSearchParams(location.search);
  const q: string = (params.get("q") ?? "").toLowerCase();
  const filter: string | null = params.get("filter");

  const backNavigate: NavigateFunction = useNavigate();
  const { addToCart } = useCart();

  const handleAddWithNotification: (p: Product) => void = useCallback(
    (p: Product) => {
      addToCart(p, 1);
      setNotification(`${p.name} fue agregado al carrito`, 3000, "success");
    },
    [addToCart, setNotification],
  );

  const handleSelect: (p: Product) => void = useCallback(
    (p: Product) => {
      backNavigate(`/producto/${p.id}`);
    },
    [backNavigate],
  );

  const filteredProducts: Product[] = useMemo(() => {
    let list: Product[] = products ?? [];
    if (q) {
      list = list.filter((p) => {
        const name: string = p.name?.toLowerCase() ?? "";
        const desc: string = p.description?.toLowerCase() ?? "";
        return name.includes(q) || desc.includes(q);
      });
    }
    if (filter === "favorites") {
      list = list.filter((p) => Boolean(favorites?.[p.id]));
    }
    return list;
  }, [products, q, filter, favorites]);

  return (
    <Home
      emptyMessage={filter === "favorites" ? "No tienes productos favoritos aún." : undefined}
      loading={loading}
      onAddToCart={handleAddWithNotification}
      onSelect={handleSelect}
      products={filteredProducts}
    />
  );
};

export default HomeContainer;
