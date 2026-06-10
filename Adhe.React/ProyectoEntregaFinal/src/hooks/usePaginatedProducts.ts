import type { QueryDocumentSnapshot } from "firebase/firestore";

import { useCallback, useEffect, useRef, useState, type MutableRefObject } from "react";

import type { Product } from "../models";

import { productService } from "../services/productService";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const lastDocRef: MutableRefObject<QueryDocumentSnapshot | null> = useRef<QueryDocumentSnapshot | null>(null);
  const mountedRef: MutableRefObject<boolean> = useRef<boolean>(true);

  const loadFirstPage: () => Promise<void> = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const result: { lastDoc: QueryDocumentSnapshot | null; products: Product[] } = await productService.fetchProductsPage(ITEMS_PER_PAGE);
      if (!mountedRef.current) {
        return;
      }
      const enabled: Product[] = result.products.filter((p: Product) => p.isEnabled !== false);
      setProducts(enabled);
      lastDocRef.current = result.lastDoc;
      setHasMore(result.products.length === ITEMS_PER_PAGE);
    } catch (err: unknown) {
      if (!mountedRef.current) {
        return;
      }
      setError((err as Error)?.message ?? "Error loading products");
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const loadNextPage: () => Promise<void> = useCallback(async (): Promise<void> => {
    if (!hasMore || loadingMore) {
      return;
    }
    setLoadingMore(true);
    try {
      const result: { lastDoc: QueryDocumentSnapshot | null; products: Product[] } = await productService.fetchProductsPage(ITEMS_PER_PAGE, lastDocRef.current ?? undefined);
      if (!mountedRef.current) {
        return;
      }
      const enabled: Product[] = result.products.filter((p: Product) => p.isEnabled !== false);
      setProducts((prev: Product[]) => [...prev, ...enabled]);
      lastDocRef.current = result.lastDoc;
      setHasMore(result.products.length === ITEMS_PER_PAGE);
    } catch (err: unknown) {
      if (!mountedRef.current) {
        return;
      }
      setError((err as Error)?.message ?? "Error loading more products");
    } finally {
      if (mountedRef.current) {
        setLoadingMore(false);
      }
    }
  }, [hasMore, loadingMore]);

  useEffect((): (() => void) => {
    mountedRef.current = true;
    void loadFirstPage();
    return (): void => {
      mountedRef.current = false;
    };
  }, [loadFirstPage]);

  return { error, hasMore, loading, loadingMore, products, loadNextPage, reload: loadFirstPage };
};

export default usePaginatedProducts;
