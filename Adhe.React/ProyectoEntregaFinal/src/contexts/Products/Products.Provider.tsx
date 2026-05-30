import { collection, getDocs, query, orderBy, type DocumentData, Query, QuerySnapshot } from "firebase/firestore";
import React, { useEffect, useState, useCallback, useMemo } from "react";

import type { Product } from "../../models";
import type { Category } from "../../models/Category";
import type { ProviderProps } from "../../models/ProviderProps";
import type { ProductsContextType } from "./Products.Types";

import { PRODUCTS_COLLECTION } from "../../App.Constants";
import { db } from "../../firebase";
import { useNotification } from "../../hooks/useNotification";
import { tsToIso } from "../../utils/parseDataUtils";
import ProductsContext from "./ProductsContext";

export const ProductsProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const { setNotification } = useNotification();
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);

  const createProduct: (p: Partial<Product>) => void = useCallback((p: Partial<Product>): void => {
    const newProduct: Partial<Product> = {
      name: p.name ?? "Sin nombre",
      description: p.description ?? "",
      price: p.price ?? 0,
      image: p.image ?? "/images/avatar1.svg",
    };
    setProducts((prev) => [newProduct as Product, ...prev]);
  }, []);

  const fetchProducts: () => Promise<void> = useCallback(async () => {
    try {
      setLoading(true);

      const q: Query<DocumentData> = query(collection(db, PRODUCTS_COLLECTION), orderBy("createdAt", "desc"));
      const snap: QuerySnapshot<DocumentData> = await getDocs(q);
      const list: Product[] = snap.docs.map((d) => {
        const data: DocumentData = d.data();

        return {
          id: d.id,
          name: data.name ?? "Sin nombre",
          description: data.description,
          price: Number(data.price ?? 0),
          stock: data.stock ?? data.quantity ?? 0,
          image: data.image ?? Array.isArray(data.images) ?? data.images[0] ?? "/images/avatar1.svg",
          images: Array.isArray(data.images) ? data.images : undefined,
          currency: data.currency,
          categoryId: data.categoryId ?? data.category?.id,
          category: data.category ?? (null as Category | null),
          tagIds: Array.isArray(data.tagIds) ? data.tagIds : undefined,
          isEnabled: data.isEnabled ?? true,
          createdAt: tsToIso(data.createdAt) ?? "",
          updatedAt: tsToIso(data.updatedAt) ?? undefined,
        };
      });
      setProducts(list);
    } catch {
      setNotification("Error cargando productos", 3000, "danger");
    } finally {
      setLoading(false);
    }
  }, [setNotification]);

  const findById: (id: string | number) => Product | undefined = useCallback(
    (id: string | number): Product | undefined => {
      const sid: string = String(id);
      return products.find((p) => p.id === sid || String(p.id) === sid);
    },
    [products],
  );

  const reload: () => void = useCallback((): void => {
    void fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const controller: AbortController = new AbortController();
    void (async (): Promise<void> => {
      await fetchProducts();
    })();

    return (): void => controller.abort();
  }, [fetchProducts]);

  const value: ProductsContextType = useMemo(() => ({ products, loading, createProduct, findById, reload }), [products, loading, createProduct, findById, reload]);

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};
