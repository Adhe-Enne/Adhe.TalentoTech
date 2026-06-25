import { useMemo } from "react";
import { useContextSelector } from "use-context-selector";

import type { ProductsContextType } from "../../contexts/Products/ProductsTypes";
import type { Product } from "../../models";

import ProductsContext from "../../contexts/Products/ProductsContext";

export const useProduct: (id?: string | number) => Product | undefined = (id?: string | number): Product | undefined => {
  const productById: ProductsContextType["productById"] | undefined = useContextSelector(ProductsContext, (c) => c?.productById);

  if (productById === undefined) {
    throw new Error("useProduct must be used within ProductsProvider");
  }

  return useMemo(() => {
    if (id === undefined || id === null) {
      return undefined;
    }
    return productById[String(id)];
  }, [productById, id]);
};

export default useProduct;
