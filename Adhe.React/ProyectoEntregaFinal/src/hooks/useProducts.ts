import { useContextSelector } from "use-context-selector";

import type { ProductsContextType } from "../contexts/Products/ProductsTypes";

import ProductsContext from "../contexts/Products/ProductsContext";

export const useProducts: () => ProductsContextType = (): ProductsContextType => {
  const products: ProductsContextType["products"] | undefined = useContextSelector(ProductsContext, (c) => c?.products);
  const loading: ProductsContextType["loading"] | undefined = useContextSelector(ProductsContext, (c) => c?.loading);
  const createProduct: ProductsContextType["createProduct"] | undefined = useContextSelector(ProductsContext, (c) => c?.createProduct);
  const findById: ProductsContextType["findById"] | undefined = useContextSelector(ProductsContext, (c) => c?.findById);
  const reload: ProductsContextType["reload"] | undefined = useContextSelector(ProductsContext, (c) => c?.reload);

  if (products === undefined || loading === undefined || createProduct === undefined || findById === undefined || reload === undefined) {
    throw new Error("useProducts must be used within ProductsProvider");
  }

  return { products, loading, createProduct, findById, reload };
};
