import { collection, getDocs, addDoc, query, orderBy, where, type DocumentData, Query, QuerySnapshot, DocumentReference } from "firebase/firestore";

import type { Tag } from "../models/Tag";

import { TAGS_COLLECTION } from "../App.Constants";
import { db } from "../firebase";
import { timestamps } from "../utils/firestore";
import { tsToIso } from "../utils/parseDataUtils";

export const tagService: {
  fetchTags: () => Promise<Tag[]>;
  createTag: (name: string, categoryId: string) => Promise<Tag>;
} = {
  fetchTags: async (): Promise<Tag[]> => {
    const q: Query<DocumentData> = query(collection(db, TAGS_COLLECTION), orderBy("name"));
    const snap: QuerySnapshot<DocumentData> = await getDocs(q);
    return snap.docs.map((d) => {
      const data: DocumentData = d.data();
      return {
        id: d.id,
        name: data.name,
        categoryId: data.categoryId,
        createdAt: tsToIso(data.createdAt) ?? "",
        updatedAt: tsToIso(data.updatedAt) ?? undefined,
      };
    });
  },

  createTag: async (name: string, categoryId: string): Promise<Tag> => {
    const nameTrim: string = name.trim();
    const nameLower: string = nameTrim.toLowerCase();

    const q: Query<DocumentData> = query(collection(db, TAGS_COLLECTION), where("name", "==", nameLower), where("categoryId", "==", categoryId));
    const snap: QuerySnapshot<DocumentData> = await getDocs(q);
    if (!snap.empty) {
      const { docs } = snap;
      const [d] = docs;
      const data: DocumentData = d.data();
      return {
        id: d.id,
        name: data.name,
        categoryId: data.categoryId,
        createdAt: data.createdAt ?? "",
        updatedAt: data.updatedAt ?? undefined,
      };
    }

    const payload: Partial<Tag> = {
      name: nameTrim,
      categoryId,
      ...timestamps.onCreate(),
    };

    const ref: DocumentReference = await addDoc(collection(db, TAGS_COLLECTION), payload);
    return {
      id: ref.id,
      name: payload.name ?? "Sin nombre",
      categoryId: payload.categoryId ?? "",
      ...timestamps.onCreate(),
    };
  },
};
