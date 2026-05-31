import React, { createContext } from "react";

import type { TagsContextType } from "./TagsTypes";

const TagsContext: React.Context<TagsContextType | undefined> = createContext<TagsContextType | undefined>(undefined);

export default TagsContext;
