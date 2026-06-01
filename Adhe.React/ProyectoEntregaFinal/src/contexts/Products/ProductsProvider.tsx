import { collection, getDocs, query, orderBy, addDoc, type DocumentData, Query, QuerySnapshot, DocumentReference } from "firebase/firestore";
import React, { useEffect, useState, useCallback, useMemo } from "react";

import type { Product } from "../../models";
import type { Category } from "../../models/Category";
import type { ProviderProps } from "../../models/ProviderProps";
import type { ProductsContextType } from "./ProductsTypes";

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

  const createProduct: (p: Partial<Product>) => Promise<string | undefined> = useCallback(
    async (p: Partial<Product>): Promise<string | undefined> => {
      try {
        const payload: Partial<Product> = {
          name: p.name,
          description: p.description,
          price: Number(p.price ?? 0),
          image: p.image ?? (Array.isArray(p.images) ? p.images[0] : null) ?? "/images/avatar1.svg",
          images: p.images ?? [],
          categoryId: p.categoryId,
          tagIds: p.tagIds ?? [],
          isEnabled: p.isEnabled ?? true,
          createdAt: new Date().toISOString(),
          updatedAt: null,
        };

        const ref: DocumentReference = await addDoc(collection(db, PRODUCTS_COLLECTION), payload);
        const createdId: string = ref.id;

        const createdProduct: Product = {
          id: createdId,
          name: payload.name ?? "Sin nombre",
          description: payload.description ?? "",
          price: payload.price ?? 0,
          stock: payload.stock ?? 0,
          image: payload.image ?? "/images/avatar1.svg",
          images: payload.images,
          currency: payload.currency ?? "USD",
          categoryId: payload.categoryId ? String(payload.categoryId) : "",
          tagIds: payload.tagIds,
          isEnabled: payload.isEnabled ?? true,
          createdAt: new Date().toISOString(),
          updatedAt: null,
          category: null,
        };

        setProducts((prev) => [createdProduct, ...prev]);
        return createdId;
      } catch (err) {
        console.error(err);
        setNotification("Error creando producto", 3000, "danger");
        return undefined;
      }
    },
    [setNotification],
  );

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
          image: data.image ?? (Array.isArray(data.images) ? data.images[0] : undefined) ?? "/images/avatar1.svg",
          images: Array.isArray(data.images) ? data.images : undefined,
          currency: data.currency,
          categoryId: data.categoryId ?? data.category?.id,
          category: (data.category as Category) ?? (null as Category | null),
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

  const productById: Record<string, Product> = useMemo(() => {
    return products.reduce<Record<string, Product>>(
      (acc, p) => {
        acc[String(p.id)] = p;
        return acc;
      },
      {} as Record<string, Product>,
    );
  }, [products]);

  const findByIdMemoized: (id: string | number) => Product | undefined = useCallback(
    (id: string | number): Product | undefined => {
      const sid: string = String(id);
      return productById[sid];
    },
    [productById],
  );

  const value: ProductsContextType = useMemo(
    () => ({ products, loading, productById, createProduct, findById: findByIdMemoized, reload }),
    [products, loading, productById, createProduct, findByIdMemoized, reload],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};
