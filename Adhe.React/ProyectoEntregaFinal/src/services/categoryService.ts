import { collection, getDocs, addDoc, query, orderBy, where, type DocumentData, Query, QuerySnapshot, DocumentReference } from "firebase/firestore";

import type { Category } from "../models/Category";

import { CATEGORIES_COLLECTION } from "../App.Constants";
import { db } from "../firebase";
import { timestamps } from "../utils/firestore";
import { tsToIso } from "../utils/parseDataUtils";

export const categoryService: {
  fetchCategories: () => Promise<Category[]>;
  createCategory: (name: string, slug?: string) => Promise<Category>;
} = {
  fetchCategories: async (): Promise<Category[]> => {
    const q: Query<DocumentData> = query(collection(db, CATEGORIES_COLLECTION), orderBy("name"));
    const snap: QuerySnapshot<DocumentData> = await getDocs(q);
    return snap.docs.map((d) => {
      const data: DocumentData = d.data();
      return {
        id: d.id,
        name: data.name,
        categorySlug: data.categorySlug,
        createdAt: tsToIso(data.createdAt) ?? "",
        updatedAt: tsToIso(data.updatedAt) ?? undefined,
      };
    });
  },

  createCategory: async (name: string, slug?: string): Promise<Category> => {
    const nameTrim: string = name.trim();
    const nameLower: string = nameTrim.toLowerCase();

    const q: Query<DocumentData> = query(collection(db, CATEGORIES_COLLECTION), where("name", "==", nameLower));
    const snap: QuerySnapshot<DocumentData> = await getDocs(q);
    if (!snap.empty) {
      const { docs } = snap;
      const [d] = docs;
      const data: DocumentData = d.data();
      return {
        id: d.id,
        name: data.name,
        categorySlug: data.categorySlug,
        createdAt: tsToIso(data.createdAt) ?? "",
        updatedAt: tsToIso(data.updatedAt) ?? undefined,
      };
    }

    const payload: Partial<Category> = {
      name: nameTrim,
      categorySlug: slug?.trim() || nameTrim.replace(/\s+/g, "-").toLowerCase(),
      ...timestamps.onCreate(),
    };

    const ref: DocumentReference = await addDoc(collection(db, CATEGORIES_COLLECTION), payload);
    return {
      id: ref.id,
      name: payload.name ?? "",
      categorySlug: payload.categorySlug,
      ...timestamps.onCreate(),
    };
  },
};
