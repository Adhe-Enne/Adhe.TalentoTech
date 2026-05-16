import React, { createContext } from "react";

import type { ProductsContextType } from "./Products.Types";

const ProductsContext: React.Context<ProductsContextType | undefined> = createContext<ProductsContextType | undefined>(
  undefined,
);
export default ProductsContext;
