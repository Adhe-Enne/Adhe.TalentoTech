import { collection, getDocs, addDoc, query, orderBy, where, type DocumentData, Query, QuerySnapshot, DocumentReference } from "firebase/firestore";

import type { Tag } from "../models/Tag";

import { TAGS_COLLECTION } from "../App.Constants";
import { db } from "../firebase";
import { timestamps } from "../utils/firestore";
import { mapTimestamps } from "../utils/parseDataUtils";

function mapDocToTag(data: DocumentData, id: string): Tag {
  return {
    id,
    name: data.name,
    categoryId: data.categoryId,
    ...mapTimestamps(data),
  };
}

export const tagService: {
  fetchTags: () => Promise<Tag[]>;
  createTag: (name: string, categoryId: string) => Promise<Tag>;
} = {
  fetchTags: async (): Promise<Tag[]> => {
    const q: Query<DocumentData> = query(collection(db, TAGS_COLLECTION), orderBy("name"));
    const snap: QuerySnapshot<DocumentData> = await getDocs(q);
    return snap.docs.map((d) => mapDocToTag(d.data(), d.id));
  },

  createTag: async (name: string, categoryId: string): Promise<Tag> => {
    const nameTrim: string = name.trim();
    const nameLower: string = nameTrim.toLowerCase();

    const q: Query<DocumentData> = query(collection(db, TAGS_COLLECTION), where("name", "==", nameLower), where("categoryId", "==", categoryId));
    const snap: QuerySnapshot<DocumentData> = await getDocs(q);
    if (!snap.empty) {
      const { docs } = snap;
      const [d] = docs;
      return mapDocToTag(d.data(), d.id);
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
      createdAt: payload.createdAt ?? "",
      updatedAt: payload.updatedAt ?? undefined,
    };
  },
};
