import React, { createContext } from "react";

import type { FavoritesContextType } from "./Favorites.Types";

const FavoritesContext: React.Context<FavoritesContextType | undefined> = createContext<
  FavoritesContextType | undefined
>(undefined);

export default FavoritesContext;
