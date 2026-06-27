import type { Category } from "../../models/Category";

import { createTypedContext } from "../../utils/context";

export type CategoriesContextType = {
  categories: Category[];
  loading: boolean;
  findById: (id: string) => Category | undefined;
  reload: () => void;
  createCategory: (name: string, slug?: string) => Promise<Category | undefined>;
};

export default createTypedContext<CategoriesContextType>();
