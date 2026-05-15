import { useContext } from "react";

import FavoritesContext, { type FavoritesContextType } from "../contexts/FavoritesContext";

const useFavorites: () => FavoritesContextType = () => {
  const ctx: FavoritesContextType | undefined = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
};

export default useFavorites;
