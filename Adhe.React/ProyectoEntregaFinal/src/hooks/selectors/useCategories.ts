import type { CategoriesContextType } from "../../contexts/Categories/CategoriesContext";

import CategoriesContext from "../../contexts/Categories/CategoriesContext";
import { createSelectorHook } from "./factory";

const useCategories: () => CategoriesContextType = createSelectorHook(CategoriesContext, "Categories");

export default useCategories;
