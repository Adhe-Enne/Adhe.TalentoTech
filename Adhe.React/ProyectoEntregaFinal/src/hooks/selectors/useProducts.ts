import type { ProductsContextType } from "../../contexts/Products/ProductsContext";

import ProductsContext from "../../contexts/Products/ProductsContext";
import { createSelectorHook } from "./factory";

const useProducts: () => ProductsContextType = createSelectorHook(ProductsContext, "Products");

export default useProducts;
