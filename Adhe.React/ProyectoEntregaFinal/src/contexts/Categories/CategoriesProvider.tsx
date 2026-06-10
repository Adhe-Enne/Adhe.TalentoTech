import React, { useCallback, useMemo } from "react";

import type { Category } from "../../models/Category";
import type { ProviderProps } from "../../models/ProviderProps";
import type { CategoriesContextType } from "./CategoriesTypes";

import useAsyncCollection from "../../hooks/useAsyncCollection";
import { categoryService } from "../../services/categoryService";
import CategoriesContext from "./CategoriesContext";

export const CategoriesProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const fetchAllCategories: () => Promise<Category[]> = useCallback(() => categoryService.fetchCategories(), []);
  const { data: categories, loading, setData, reload } = useAsyncCollection(fetchAllCategories);

  const createCategory: (name: string, slug?: string) => Promise<Category | undefined> = useCallback(async (name: string, slug?: string): Promise<Category | undefined> => {
    try {
      const created: Category = await categoryService.createCategory(name, slug);
      setData((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }, [setData]);

  const findById: (id: string) => Category | undefined = useCallback((id: string): Category | undefined => categories.find((c) => c.id === id), [categories]);

  const value: CategoriesContextType = useMemo(() => ({ categories, loading, findById, reload, createCategory }), [categories, loading, findById, reload, createCategory]);

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
};

export default CategoriesProvider;
