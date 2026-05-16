import type { Product } from "../../models";

export type ProductsContextType = {
  products: Product[];
  loading: boolean;
  createProduct: (p: Partial<Product>) => void;
  findById: (id: number) => Product | undefined;
  reload: () => void;
};
