import React, { useCallback, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, type NavigateFunction } from "react-router-dom";

import type { Product } from "../../models";
import type { PaginatedResult } from "../../types";

import useCart from "../../hooks/selectors/useCart";
import useFavorites from "../../hooks/selectors/useFavorites";
import useNotification from "../../hooks/selectors/useNotification";
import useAsyncCollection from "../../hooks/useAsyncCollection";
import useCartActions from "../../hooks/useCartActions";
import { productService } from "../../services/productService";
import { extractErrorMessage } from "../../utils/errorUtils";
import HomeView from "./HomeView";

const ITEMS_PER_PAGE: number = 8;

const Home: React.FC = () => {
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const lastKeyRef: React.RefObject<string | null> = useRef<string | null>(null);

  const fetcher: () => Promise<Product[]> = useCallback(async (): Promise<Product[]> => {
    const result: PaginatedResult<Product> = await productService.fetchProductsPage(ITEMS_PER_PAGE);
    const enabled: Product[] = result.items.filter((p: Product) => p.isEnabled !== false);
    lastKeyRef.current = result.lastKey;
    setHasMore(result.hasMore);
    return enabled;
  }, []);

  const { data: paginatedProducts, loading, reload: reloadProducts, setData, setError } = useAsyncCollection<Product>(fetcher);

  const loadNextPage: () => Promise<void> = useCallback(async (): Promise<void> => {
    if (!hasMore || loadingMore) {
      return;
    }
    setLoadingMore(true);
    try {
      const result: PaginatedResult<Product> = await productService.fetchProductsPage(ITEMS_PER_PAGE, lastKeyRef.current ?? undefined);
      const enabled: Product[] = result.items.filter((p: Product) => p.isEnabled !== false);
      setData((prev: Product[]) => [...prev, ...enabled]);
      lastKeyRef.current = result.lastKey;
      setHasMore(result.hasMore);
    } catch (err: unknown) {
      setError(extractErrorMessage(err, "Error loading more products"));
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, setData, setError]);
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart, getCantidadActual } = useCart();
  const { setNotification } = useNotification();
  const { increment, decrement } = useCartActions();
  const navigate: NavigateFunction = useNavigate();

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
  const emptyMessage: string | undefined = filter === "favorites" ? "No tienes productos favoritos aún." : undefined;
  const hasLocalFilter: boolean = localQ.trim().length > 0;

  const handleAddToCart: (product: Product) => void = useCallback(
    (product: Product): void => {
      addToCart(product, 1);
      setNotification(`${product.name} fue agregado al carrito`, 3000, "success");
    },
    [addToCart, setNotification],
  );

  const handleIncrement: (product: Product) => void = useCallback(
    (product: Product): void => {
      increment(product);
    },
    [increment],
  );

  const handleDecrement: (product: Product) => void = useCallback(
    (product: Product): void => {
      decrement(product);
    },
    [decrement],
  );

  const cardData: { currentQuantity: number; isFavorite: boolean; product: Product; onAddToCart: () => void; onDecrement: () => void; onIncrement: () => void; onNavigate: () => void; onToggleFavorite: () => void }[] =
    useMemo(
      () =>
        filteredProducts.map((p) => ({
          currentQuantity: getCantidadActual(p.id),
          isFavorite: Boolean(favorites?.[p.id]),
          product: p,
          onAddToCart: () => handleAddToCart(p),
          onDecrement: () => handleDecrement(p),
          onIncrement: () => handleIncrement(p),
          onNavigate: () => navigate(`/producto/${p.id}`),
          onToggleFavorite: () => toggleFavorite(p.id),
        })),
      [filteredProducts, favorites, getCantidadActual, handleAddToCart, handleDecrement, handleIncrement, navigate, toggleFavorite],
    );

  const showReset: boolean = filteredProducts.length > ITEMS_PER_PAGE;
  const showLoadMore: boolean = hasMore && filteredProducts.length > 0 && !loadingMore;

  return (
    <HomeView
      cardData={cardData}
      emptyMessage={emptyMessage}
      hasLocalFilter={hasLocalFilter}
      hasMore={hasMore}
      loading={loading}
      loadingMore={loadingMore}
      localQ={localQ}
      onClearFilter={() => setLocalQ("")}
      onLoadMore={loadNextPage}
      onLocalQChange={setLocalQ}
      onReload={reloadProducts}
      pageDescription={pageDescription}
      pageTitle={pageTitle}
      showLoadMore={showLoadMore}
      showReset={showReset}
    />
  );
};

export default Home;
