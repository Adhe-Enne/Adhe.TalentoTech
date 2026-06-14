import { useCallback, useRef, useState, type RefObject } from "react";

import type { Product } from "../models";
import type { PaginatedResult } from "../types";

import { productService } from "../services/productService";
import useAsyncCollection from "./useAsyncCollection";

const ITEMS_PER_PAGE: number = 8;

interface UsePaginatedProductsReturn {
  error: string | null;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  products: Product[];
  loadNextPage: () => Promise<void>;
  reload: () => Promise<void>;
}

const usePaginatedProducts: () => UsePaginatedProductsReturn = (): UsePaginatedProductsReturn => {
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const lastKeyRef: RefObject<string | null> = useRef<string | null>(null);

  const fetcher: () => Promise<Product[]> = useCallback(async (): Promise<Product[]> => {
    const result: PaginatedResult<Product> = await productService.fetchProductsPage(ITEMS_PER_PAGE);
    const enabled: Product[] = result.items.filter((p: Product) => p.isEnabled !== false);
    lastKeyRef.current = result.lastKey;
    setHasMore(result.hasMore);
    return enabled;
  }, []);

  const { data: products, error, loading, reload, setData, setError } = useAsyncCollection<Product>(fetcher);

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
      setError((err as Error)?.message ?? "Error loading more products");
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, setData, setError]);

  return { error, hasMore, loading, loadingMore, products, loadNextPage, reload };
};

export default usePaginatedProducts;
