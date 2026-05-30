import React, { createContext } from "react";

import type { CategoriesContextType } from "./Categories.Types";

const CategoriesContext: React.Context<CategoriesContextType | undefined> = createContext<CategoriesContextType | undefined>(undefined);

export default CategoriesContext;
