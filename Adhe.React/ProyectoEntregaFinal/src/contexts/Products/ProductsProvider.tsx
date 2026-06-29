import React, { useCallback, useMemo } from "react";

import type { Product } from "../../models";
import type { ProviderProps } from "../../types/ProviderProps";
import type { ProductsContextType } from "./ProductsContext";

import useNotification from "../../hooks/selectors/useNotification";
import useAsyncCollection from "../../hooks/useAsyncCollection";
import { productService } from "../../services/productService";
import ProductsContext from "./ProductsContext";

export const ProductsProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const { setNotification } = useNotification();
  const fetchAllProducts: () => Promise<Product[]> = useCallback(() => productService.fetchProducts(), []);
  const { data: products, loading, setData, reload } = useAsyncCollection(fetchAllProducts);

  const enabledProducts: Product[] = useMemo(() => products.filter((p) => p.isEnabled !== false), [products]);

  const createProduct: (p: Partial<Product>) => Promise<string | undefined> = useCallback(
    async (p: Partial<Product>): Promise<string | undefined> => {
      try {
        const newProduct: Product = await productService.createProduct(p);
        setData((prev) => [newProduct, ...prev]);
        setNotification("Producto creado exitosamente", 3000, "success");
        return newProduct.id;
      } catch {
        setNotification("Error creando producto", 3000, "danger");
        return undefined;
      }
    },
    [setData, setNotification],
  );

  const deleteProduct: (id: string) => Promise<void> = useCallback(
    async (id: string): Promise<void> => {
      try {
        await productService.deleteProduct(id);
        setData((prev) => prev.filter((p) => p.id !== id));
        setNotification("Producto eliminado", 3000, "success");
      } catch {
        setNotification("Error eliminando producto", 3000, "danger");
      }
    },
    [setData, setNotification],
  );

  const updateProduct: (id: string, p: Partial<Product>) => Promise<void> = useCallback(
    async (id: string, p: Partial<Product>): Promise<void> => {
      const { updatedAt: _u, ...clean } = p;
      await productService.updateProduct(id, clean);

      setData((prevProducts) => prevProducts.map((product) => (product.id === id ? { ...product, ...clean, updatedAt: new Date().toISOString() } : product)));
    },
    [setData],
  );

  const productById: Record<string, Product> = useMemo(() => {
    return products.reduce<Record<string, Product>>((acc, p) => {
      acc[String(p.id)] = p;
      return acc;
    }, {});
  }, [products]);

  const findByIdMemoized: (id: string) => Product | undefined = useCallback(
    (id: string): Product | undefined => {
      return productById[id];
    },
    [productById],
  );

  const value: ProductsContextType = useMemo(
    () => ({ products, enabledProducts, loading, productById, createProduct, deleteProduct, updateProduct, findById: findByIdMemoized, reload }),
    [products, enabledProducts, loading, productById, createProduct, deleteProduct, updateProduct, findByIdMemoized, reload],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export default ProductsProvider;
