import type { Product } from "../../models";

export type ProductsContextType = {
  products: Product[];
  loading: boolean;
  createProduct: (p: Partial<Product>) => Promise<string | undefined>;
  findById: (id: string | number) => Product | undefined;
  reload: () => void;
};
