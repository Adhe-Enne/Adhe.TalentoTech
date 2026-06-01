import { createContext, type Context } from "use-context-selector";

import type { CategoriesContextType } from "./CategoriesTypes";

const CategoriesContext: Context<CategoriesContextType | undefined> = createContext<CategoriesContextType | undefined>(undefined);

export default CategoriesContext;
