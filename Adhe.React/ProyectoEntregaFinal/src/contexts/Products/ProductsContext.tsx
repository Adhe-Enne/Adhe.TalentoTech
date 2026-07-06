import type { Product } from "../../models";

import { createTypedContext } from "../../utils/context";

export interface ProductsContextType {
  enabledProducts: Product[];
  loading: boolean;
  productById: Record<string, Product>;
  products: Product[];
  createProduct: (p: Partial<Product>) => Promise<string | undefined>;
  deleteProduct: (id: string) => Promise<void>;
  findById: (id: string) => Product | undefined;
  reload: () => void;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
}

export default createTypedContext<ProductsContextType>();
