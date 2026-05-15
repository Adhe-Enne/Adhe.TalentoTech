import { useContext } from "react";

import type { ProductsContextType } from "../contexts/ProductsContext";

import ProductsContext from "../contexts/ProductsContext";

export const useProducts: () => ProductsContextType = (): ProductsContextType => {
  const ctx: ProductsContextType | undefined = useContext(ProductsContext);
  if (!ctx) {
    throw new Error("useProducts must be used within ProductsProvider");
  }
  return ctx;
};
