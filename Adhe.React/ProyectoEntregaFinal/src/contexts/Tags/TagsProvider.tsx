import React, { useCallback, useMemo } from "react";

import type { Tag } from "../../models/Tag";
import type { ProviderProps } from "../../types/ProviderProps";
import type { TagsContextType } from "./TagsContext";

import { useCollectionCrud } from "../../hooks/useCollectionCrud";
import useNotification from "../../hooks/selectors/useNotification";
import { tagService } from "../../services/tagService";
import TagsContext from "./TagsContext";

export const TagsProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const { setNotification } = useNotification();
  const fetchAll: () => Promise<Tag[]> = useCallback(() => tagService.fetchTags(), []);
  const { data: tags, loading, findById, reload, addOptimistic } = useCollectionCrud(fetchAll);

  const createTag: (name: string, categoryId: string) => Promise<Tag | undefined> = useCallback(
    async (name: string, categoryId: string): Promise<Tag | undefined> => {
      try {
        const created: Tag = await tagService.createTag(name, categoryId);
        addOptimistic(created);
        return created;
      } catch {
        setNotification("Error al crear etiqueta", 3000, "danger");
        return undefined;
      }
    },
    [addOptimistic, setNotification],
  );

  const value: TagsContextType = useMemo(
    () => ({ tags, loading, findById, reload, createTag }),
    [tags, loading, findById, reload, createTag],
  );

  return <TagsContext.Provider value={value}>{children}</TagsContext.Provider>;
};

export default TagsProvider;
