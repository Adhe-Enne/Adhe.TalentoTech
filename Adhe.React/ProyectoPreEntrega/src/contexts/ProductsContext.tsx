import React, { createContext, useEffect, useState, useCallback, useMemo } from "react";

import type { Product } from "../models";
import type { ProviderProps } from "../models/ProviderProps";

import { useNotification } from "../hooks/useNotification";

export type ProductsContextType = {
  products: Product[];
  loading: boolean;
  createProduct: (p: Partial<Product>) => void;
  findById: (id: number) => Product | undefined;
  reload: () => void;
};

const ProductsContext: React.Context<ProductsContextType | undefined> = createContext<ProductsContextType | undefined>(
  undefined,
);

export const ProductsProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const { setNotification } = useNotification();
  
  const createProduct: (p: Partial<Product>) => void = useCallback((p: Partial<Product>): void => {
    const id: number = Date.now();
    const newProduct: Product = {
      id,
      nombre: p.nombre ?? "Sin nombre",
      descripcion: p.descripcion,
      precio: p.precio ?? 0,
      imagen: p.imagen ?? "/images/avatar1.svg",
    };
    setProducts((prev) => [newProduct, ...prev]);
  }, []);

  const fetchProducts: (signal?: AbortSignal) => Promise<void> = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      try {
        setLoading(true);
        const res: Response = await fetch("/productos.json", { signal });
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err: unknown) {
        if ((err as Error)?.name === "AbortError") {
          return;
        }
        setNotification("Error cargando productos", 3000, "danger");
      } finally {
        setLoading(false);
      }
    },
    [setNotification],
  );

  const findById: (id: number) => Product | undefined = useCallback(
    (id: number): Product | undefined => products.find((p) => p.id === id),
    [products],
  );
  
  const reload: () => void = useCallback((): void => {
    void fetchProducts();
  }, [fetchProducts]);
  
  useEffect(() => {
    const controller: AbortController = new AbortController();
    void fetchProducts(controller.signal);
    return (): void => controller.abort();
  }, [fetchProducts]);
  
  const value: ProductsContextType = useMemo(
    () => ({ products, loading, createProduct, findById, reload }),
    [products, loading, createProduct, findById, reload],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export default ProductsContext;
