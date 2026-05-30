import type { Category } from "../../models/Category";

export type CategoriesContextType = {
  categories: Category[];
  loading: boolean;
  findById: (id: string) => Category | undefined;
  reload: () => void;
};
