import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import type { Product } from "../../models";

import useFavorites from "../../hooks/useFavorites";
import usePaginatedProducts from "../../hooks/usePaginatedProducts";
import Home from "./Home";

const HomeContainer: React.FC = () => {
  const { products: paginatedProducts, loading, loadingMore, hasMore, loadNextPage, reload: reloadProducts } = usePaginatedProducts();
  const { favorites } = useFavorites();

  const location: ReturnType<typeof useLocation> = useLocation();
  const params: URLSearchParams = new URLSearchParams(location.search);
  const q: string = (params.get("q") ?? "").toLowerCase();
  const filter: string | null = params.get("filter");

  const [localQ, setLocalQ] = useState<string>("");

  const filteredProducts: Product[] = useMemo(() => {
    let list: Product[] = paginatedProducts ?? [];
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
    if (localQ) {
      const lq: string = localQ.toLowerCase();
      list = list.filter((p) => {
        const name: string = p.name?.toLowerCase() ?? "";
        const desc: string = p.description?.toLowerCase() ?? "";
        return name.includes(lq) || desc.includes(lq);
      });
    }
    return list;
  }, [paginatedProducts, q, filter, favorites, localQ]);

  const pageTitle: string | undefined = filter === "favorites" ? "Favoritos" : "Productos";
  const pageDescription: string | undefined = filter === "favorites" ? "Tus productos favoritos en Talento Tech." : "Explora nuestro catálogo de productos tecnológicos.";

  return (
    <Home
      emptyMessage={filter === "favorites" ? "No tienes productos favoritos aún." : undefined}
      hasMore={hasMore}
      loading={loading}
      loadingMore={loadingMore}
      localQ={localQ}
      onLoadMore={loadNextPage}
      onLocalQChange={setLocalQ}
      onReload={reloadProducts}
      pageDescription={pageDescription}
      pageTitle={pageTitle}
      products={filteredProducts}
    />
  );
};

export default HomeContainer;
