import React, { useCallback, useMemo } from "react";

import type { Category } from "../../models/Category";
import type { ProviderProps } from "../../types/ProviderProps";
import type { CategoriesContextType } from "./CategoriesContext";

import useNotification from "../../hooks/selectors/useNotification";
import { useCollectionCrud } from "../../hooks/useCollectionCrud";
import { categoryService } from "../../services/categoryService";
import CategoriesContext from "./CategoriesContext";

export const CategoriesProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const { setNotification } = useNotification();
  const fetchAll: () => Promise<Category[]> = useCallback(() => categoryService.fetchCategories(), []);
  const { data: categories, loading, findById, reload, addOptimistic } = useCollectionCrud(fetchAll);

  const createCategory: (name: string, slug?: string) => Promise<Category | undefined> = useCallback(
    async (name: string, slug?: string): Promise<Category | undefined> => {
      try {
        const created: Category = await categoryService.createCategory(name, slug);
        addOptimistic(created);
        return created;
      } catch {
        setNotification("Error al crear categoria", 3000, "danger");
        return undefined;
      }
    },
    [addOptimistic, setNotification],
  );

  const value: CategoriesContextType = useMemo(() => ({ categories, loading, findById, reload, createCategory }), [categories, loading, findById, reload, createCategory]);

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
};

export default CategoriesProvider;
