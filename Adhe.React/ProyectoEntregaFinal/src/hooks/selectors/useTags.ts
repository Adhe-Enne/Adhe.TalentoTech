import type { TagsContextType } from "../../contexts/Tags/TagsContext";

import TagsContext from "../../contexts/Tags/TagsContext";
import { createSelectorHook } from "./factory";

const useTags: () => TagsContextType = createSelectorHook(TagsContext, "Tags");

export default useTags;
