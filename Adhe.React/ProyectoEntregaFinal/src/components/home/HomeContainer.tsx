import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

import type { Product } from "../../models";

import useFavorites from "../../hooks/useFavorites";
import useProducts from "../../hooks/useProducts";
import Home from "./Home";

const HomeContainer: React.FC = () => {
  const { products, loading } = useProducts();
  const { favorites } = useFavorites();

  const location: ReturnType<typeof useLocation> = useLocation();
  const params: URLSearchParams = new URLSearchParams(location.search);
  const q: string = (params.get("q") ?? "").toLowerCase();
  const filter: string | null = params.get("filter");

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

  return <Home emptyMessage={filter === "favorites" ? "No tienes productos favoritos aún." : undefined} loading={loading} products={filteredProducts} />;
};

export default HomeContainer;
