import React, { useCallback, useMemo } from "react";

import type { Tag } from "../../models/Tag";
import type { ProviderProps } from "../../types/ProviderProps";
import type { TagsContextType } from "./TagsTypes";

import useAsyncCollection from "../../hooks/useAsyncCollection";
import { tagService } from "../../services/tagService";
import TagsContext from "./TagsContext";

export const TagsProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const fetchAllTags: () => Promise<Tag[]> = useCallback(() => tagService.fetchTags(), []);
  const { data: tags, loading, setData, reload } = useAsyncCollection(fetchAllTags);

  const createTag: (name: string, categoryId: string) => Promise<Tag | undefined> = useCallback(async (name: string, categoryId: string): Promise<Tag | undefined> => {
    try {
      const created: Tag = await tagService.createTag(name, categoryId);
      setData((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }, [setData]);

  const findById: (id: string) => Tag | undefined = useCallback((id: string): Tag | undefined => tags.find((t) => t.id === id), [tags]);

  const value: TagsContextType = useMemo(() => ({ tags, loading, findById, reload, createTag }), [tags, loading, findById, reload, createTag]);

  return <TagsContext.Provider value={value}>{children}</TagsContext.Provider>;
};

export default TagsProvider;
