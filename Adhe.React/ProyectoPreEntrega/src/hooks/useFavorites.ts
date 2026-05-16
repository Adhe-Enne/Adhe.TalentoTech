import { useContext } from "react";

import type { FavoritesContextType } from "../contexts/Favorites/Favorites.Types";

import FavoritesContext from "../contexts/Favorites/FavoritesContext";

const useFavorites: () => FavoritesContextType = () => {
  const ctx: FavoritesContextType | undefined = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
};

export default useFavorites;
