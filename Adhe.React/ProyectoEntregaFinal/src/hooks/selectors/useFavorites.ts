import { useContextSelector } from "use-context-selector";

import type { FavoritesContextType } from "../../contexts/Favorites/FavoritesTypes";

import FavoritesContext from "../../contexts/Favorites/FavoritesContext";

const useFavorites: () => FavoritesContextType = () => {
  const favorites: FavoritesContextType["favorites"] | undefined = useContextSelector(FavoritesContext, (c) => c?.favorites);
  const count: FavoritesContextType["favCount"] | undefined = useContextSelector(FavoritesContext, (c) => c?.favCount);
  const isFavorite: FavoritesContextType["isFavorite"] | undefined = useContextSelector(FavoritesContext, (c) => c?.isFavorite);
  const toggleFavorite: FavoritesContextType["toggleFavorite"] | undefined = useContextSelector(FavoritesContext, (c) => c?.toggleFavorite);

  if (favorites === undefined || count === undefined || isFavorite === undefined || toggleFavorite === undefined) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }

  return { favorites, favCount: count, isFavorite, toggleFavorite };
};

export default useFavorites;
