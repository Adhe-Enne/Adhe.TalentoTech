import { useContextSelector } from "use-context-selector";

import type { ProductsContextType } from "../contexts/Products/ProductsTypes";

import ProductsContext from "../contexts/Products/ProductsContext";

const useProducts: () => ProductsContextType = (): ProductsContextType => {
  const products: ProductsContextType["products"] | undefined = useContextSelector(ProductsContext, (c) => c?.products);
  const enabledProducts: ProductsContextType["enabledProducts"] | undefined = useContextSelector(ProductsContext, (c) => c?.enabledProducts);
  const loading: ProductsContextType["loading"] | undefined = useContextSelector(ProductsContext, (c) => c?.loading);
  const productById: ProductsContextType["productById"] | undefined = useContextSelector(ProductsContext, (c) => c?.productById);
  const createProduct: ProductsContextType["createProduct"] | undefined = useContextSelector(ProductsContext, (c) => c?.createProduct);
  const deleteProduct: ProductsContextType["deleteProduct"] | undefined = useContextSelector(ProductsContext, (c) => c?.deleteProduct);
  const findById: ProductsContextType["findById"] | undefined = useContextSelector(ProductsContext, (c) => c?.findById);
  const reload: ProductsContextType["reload"] | undefined = useContextSelector(ProductsContext, (c) => c?.reload);
  const updateProduct: ProductsContextType["updateProduct"] | undefined = useContextSelector(ProductsContext, (c) => c?.updateProduct);

  if (products === undefined || enabledProducts === undefined || loading === undefined || createProduct === undefined || deleteProduct === undefined || findById === undefined || reload === undefined || updateProduct === undefined || productById === undefined) {
    throw new Error("useProducts must be used within ProductsProvider");
  }

  return { products, enabledProducts, loading, productById, createProduct, deleteProduct, findById, reload, updateProduct };
};

export default useProducts;
