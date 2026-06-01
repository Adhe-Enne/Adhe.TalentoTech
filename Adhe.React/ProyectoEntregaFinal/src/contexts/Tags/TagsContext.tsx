import { createContext, type Context } from "use-context-selector";

import type { TagsContextType } from "./TagsTypes";

const TagsContext: Context<TagsContextType | undefined> = createContext<TagsContextType | undefined>(undefined);

export default TagsContext;
