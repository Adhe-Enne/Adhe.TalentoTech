import { collection, getDocs, query, orderBy, where, addDoc, QuerySnapshot, type DocumentData, Query, DocumentReference } from "firebase/firestore";
import React, { useEffect, useState, useCallback, useMemo } from "react";

import type { ProviderProps } from "../../models/ProviderProps";
import type { Tag } from "../../models/Tag";
import type { TagsContextType } from "./TagsTypes";

import { TAGS_COLLECTION } from "../../App.Constants";
import { db } from "../../firebase";
import { tsToIso } from "../../utils/parseDataUtils";
import TagsContext from "./TagsContext";

export const TagsProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTags: () => Promise<void> = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const q: Query<DocumentData> = query(collection(db, TAGS_COLLECTION), orderBy("name"));
      const snap: QuerySnapshot<DocumentData> = await getDocs(q);
      const list: Tag[] = snap.docs.map((d) => {
        const data: DocumentData = d.data();
        return {
          id: d.id,
          name: data.name,
          categoryId: data.categoryId,
          createdAt: tsToIso(data.createdAt) ?? "",
          updatedAt: tsToIso(data.updatedAt) ?? undefined,
        };
      });
      setTags(list);
    } catch {
      setTags([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller: AbortController = new AbortController();
    void (async (): Promise<void> => {
      await fetchTags();
    })();

    return (): void => controller.abort();
  }, [fetchTags]);

  const findById: (id: string) => Tag | undefined = useCallback((id: string): Tag | undefined => tags.find((t) => t.id === id), [tags]);

  const reload: () => void = useCallback((): void => {
    void fetchTags();
  }, [fetchTags]);

  const createTag: (name: string, categoryId: string) => Promise<Tag | undefined> = useCallback(async (name: string, categoryId: string): Promise<Tag | undefined> => {
    const nameTrim: string = name.trim();
    const nameLower: string = nameTrim.toLowerCase();

    try {
      // check existing by nameLower + categoryId
      const q: Query<DocumentData> = query(collection(db, TAGS_COLLECTION), where("name", "==", nameLower), where("categoryId", "==", categoryId));
      const snap: QuerySnapshot<DocumentData> = await getDocs(q);
      if (!snap.empty) {
        const { docs } = snap;
        const [d] = docs;
        const data: DocumentData = d.data();
        const existing: Tag = {
          id: d.id,
          name: data.name,
          categoryId: data.categoryId,
          createdAt: data.createdAt ?? "",
          updatedAt: data.updatedAt ?? undefined,
        };
        return existing;
      }

      const payload: Partial<Tag> = {
        name: nameTrim,
        categoryId,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };

      const ref: DocumentReference = await addDoc(collection(db, TAGS_COLLECTION), payload);
      const created: Tag = {
        id: ref.id,
        name: payload.name ?? "Sin nombre",
        categoryId: payload.categoryId ?? "",
        createdAt: payload.createdAt ?? new Date().toISOString(),
      };
      setTags((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }, []);

  const value: TagsContextType = useMemo(() => ({ tags, loading, findById, reload, createTag }), [tags, loading, findById, reload, createTag]);

  return <TagsContext.Provider value={value}>{children}</TagsContext.Provider>;
};

export default TagsProvider;
