import { collection, getDocs, query, orderBy, where, addDoc, type DocumentData, QuerySnapshot, Query, DocumentReference } from "firebase/firestore";
import React, { useEffect, useState, useCallback, useMemo } from "react";

import type { Category } from "../../models/Category";
import type { ProviderProps } from "../../models/ProviderProps";
import type { CategoriesContextType } from "./CategoriesTypes";

import { CATEGORIES_COLLECTION } from "../../App.Constants";
import { db } from "../../firebase";
import { tsToIso } from "../../utils/parseDataUtils";
import CategoriesContext from "./CategoriesContext";

export const CategoriesProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCategories: () => Promise<void> = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const q: Query<DocumentData> = query(collection(db, CATEGORIES_COLLECTION), orderBy("name"));
      const snap: QuerySnapshot<DocumentData> = await getDocs(q);
      const list: Category[] = snap.docs.map((d) => {
        const data: DocumentData = d.data();
        return {
          id: d.id,
          name: data.name,
          categorySlug: data.categorySlug,
          createdAt: tsToIso(data.createdAt) ?? "",
          updatedAt: tsToIso(data.updatedAt) ?? undefined,
        };
      });
      setCategories(list);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller: AbortController = new AbortController();
    void (async (): Promise<void> => {
      await fetchCategories();
    })();

    return (): void => controller.abort();
  }, [fetchCategories]);

  const findById: (id: string) => Category | undefined = useCallback((id: string): Category | undefined => categories.find((c) => c.id === id), [categories]);

  const reload: () => void = useCallback((): void => {
    void fetchCategories();
  }, [fetchCategories]);

  const createCategory: (name: string, slug?: string) => Promise<Category | undefined> = useCallback(async (name: string, slug?: string): Promise<Category | undefined> => {
    const nameTrim: string = name.trim();
    const nameLower: string = nameTrim.toLowerCase();

    try {
      // check existing by nameLower
      const q: Query<DocumentData> = query(collection(db, CATEGORIES_COLLECTION), where("name", "==", nameLower));
      const snap: QuerySnapshot<DocumentData> = await getDocs(q);
      if (!snap.empty) {
        const { docs } = snap;
        const [d] = docs;
        const data: DocumentData = d.data();
        const existing: Category = {
          id: d.id,
          name: data.name,
          categorySlug: data.categorySlug,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
        return existing;
      }

      const payload: Partial<Category> = {
        name: nameTrim,
        categorySlug: slug?.trim() || nameTrim.replace(/\s+/g, "-").toLowerCase(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const ref: DocumentReference = await addDoc(collection(db, CATEGORIES_COLLECTION), payload);
      const created: Category = {
        id: ref.id,
        name: payload.name!,
        categorySlug: payload.categorySlug,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
      setCategories((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }, []);

  const value: CategoriesContextType = useMemo(() => ({ categories, loading, findById, reload, createCategory }), [categories, loading, findById, reload, createCategory]);

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
};

export default CategoriesProvider;
