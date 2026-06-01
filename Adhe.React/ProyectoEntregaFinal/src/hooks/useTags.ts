import { useContextSelector } from "use-context-selector";

import type { TagsContextType } from "../contexts/Tags/TagsTypes";

import TagsContext from "../contexts/Tags/TagsContext";

const useTags: () => TagsContextType = (): TagsContextType => {
  const tags: TagsContextType["tags"] | undefined = useContextSelector(TagsContext, (c) => c?.tags);
  const loading: TagsContextType["loading"] | undefined = useContextSelector(TagsContext, (c) => c?.loading);
  const findById: TagsContextType["findById"] | undefined = useContextSelector(TagsContext, (c) => c?.findById);
  const reload: TagsContextType["reload"] | undefined = useContextSelector(TagsContext, (c) => c?.reload);
  const createTag: TagsContextType["createTag"] | undefined = useContextSelector(TagsContext, (c) => c?.createTag);

  if (tags === undefined || loading === undefined || findById === undefined || reload === undefined || createTag === undefined) {
    throw new Error("useTags must be used within TagsProvider");
  }

  return { tags, loading, findById, reload, createTag };
};

export default useTags;
