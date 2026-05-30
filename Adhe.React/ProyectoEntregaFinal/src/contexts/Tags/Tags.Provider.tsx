import { collection, getDocs, query, orderBy, QuerySnapshot, type DocumentData, Query } from "firebase/firestore";
import React, { useEffect, useState, useCallback, useMemo } from "react";

import type { ProviderProps } from "../../models/ProviderProps";
import type { Tag } from "../../models/Tag";
import type { TagsContextType } from "./Tags.Types";

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

  const value: TagsContextType = useMemo(() => ({ tags, loading, findById, reload }), [tags, loading, findById, reload]);

  return <TagsContext.Provider value={value}>{children}</TagsContext.Provider>;
};

export default TagsProvider;
