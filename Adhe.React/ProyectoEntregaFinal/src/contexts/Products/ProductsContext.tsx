import type { Product } from "../../models";

import { createTypedContext } from "../../utils/context";

export type ProductsContextType = {
  products: Product[];
  enabledProducts: Product[];
  loading: boolean;
  productById: Record<string, Product>;
  createProduct: (p: Partial<Product>) => Promise<string | undefined>;
  deleteProduct: (id: string) => Promise<void>;
  findById: (id: string | number) => Product | undefined;
  reload: () => void;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
};

export default createTypedContext<ProductsContextType>();
