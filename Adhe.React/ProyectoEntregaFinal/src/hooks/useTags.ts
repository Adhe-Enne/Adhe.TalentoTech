import { useContext } from "react";

import type { TagsContextType } from "../contexts/Tags/TagsTypes";

import TagsContext from "../contexts/Tags/TagsContext";

const useTags: () => TagsContextType = (): TagsContextType => {
  const ctx: TagsContextType | undefined = useContext(TagsContext);
  if (!ctx) {
    throw new Error("useTags must be used within TagsProvider");
  }
  return ctx;
};

export default useTags;
