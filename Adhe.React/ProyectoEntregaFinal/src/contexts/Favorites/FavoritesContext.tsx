import { createContext, type Context } from "use-context-selector";

import type { FavoritesContextType } from "./FavoritesTypes";

const FavoritesContext: Context<FavoritesContextType | undefined> = createContext<FavoritesContextType | undefined>(undefined);

export default FavoritesContext;
