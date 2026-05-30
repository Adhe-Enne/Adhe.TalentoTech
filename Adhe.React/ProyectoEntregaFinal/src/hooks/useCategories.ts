import { useContext } from "react";

import type { CategoriesContextType } from "../contexts/Categories/Categories.Types";

import CategoriesContext from "../contexts/Categories/CategoriesContext";

const useCategories: () => CategoriesContextType = (): CategoriesContextType => {
  const ctx: CategoriesContextType | undefined = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error("useCategories must be used within CategoriesProvider");
  }
  return ctx;
};

export default useCategories;
