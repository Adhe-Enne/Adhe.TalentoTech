import { createContext, type Context } from "use-context-selector";

import type { ProductsContextType } from "./ProductsTypes";

const ProductsContext: Context<ProductsContextType | undefined> = createContext<ProductsContextType | undefined>(undefined);
export default ProductsContext;
