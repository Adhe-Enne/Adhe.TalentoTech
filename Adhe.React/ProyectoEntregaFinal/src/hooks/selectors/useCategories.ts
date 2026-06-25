import { useContextSelector } from "use-context-selector";

import type { CategoriesContextType } from "../../contexts/Categories/CategoriesTypes";

import CategoriesContext from "../../contexts/Categories/CategoriesContext";

const useCategories: () => CategoriesContextType = (): CategoriesContextType => {
  const categories: CategoriesContextType["categories"] | undefined = useContextSelector(CategoriesContext, (c) => c?.categories);
  const loading: CategoriesContextType["loading"] | undefined = useContextSelector(CategoriesContext, (c) => c?.loading);
  const findById: CategoriesContextType["findById"] | undefined = useContextSelector(CategoriesContext, (c) => c?.findById);
  const reload: CategoriesContextType["reload"] | undefined = useContextSelector(CategoriesContext, (c) => c?.reload);
  const createCategory: CategoriesContextType["createCategory"] | undefined = useContextSelector(CategoriesContext, (c) => c?.createCategory);

  if (categories === undefined || loading === undefined || findById === undefined || reload === undefined || createCategory === undefined) {
    throw new Error("useCategories must be used within CategoriesProvider");
  }

  return { categories, loading, findById, reload, createCategory };
};

export default useCategories;
