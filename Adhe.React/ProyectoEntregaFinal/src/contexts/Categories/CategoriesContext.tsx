import type { Category } from "../../models/Category";

import { createTypedContext } from "../../utils/context";

export interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  createCategory: (name: string, slug?: string) => Promise<Category | undefined>;
  findById: (id: string) => Category | undefined;
  reload: () => void;
}

export default createTypedContext<CategoriesContextType>();
