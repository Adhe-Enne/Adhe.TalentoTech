import React, { createContext } from "react";

import type { TagsContextType } from "./Tags.Types";

const TagsContext: React.Context<TagsContextType | undefined> = createContext<TagsContextType | undefined>(undefined);

export default TagsContext;
