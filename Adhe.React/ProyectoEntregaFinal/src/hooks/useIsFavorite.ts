import { useContextSelector } from "use-context-selector";

import type { FavoritesContextType } from "../contexts/Favorites/FavoritesTypes";

import FavoritesContext from "../contexts/Favorites/FavoritesContext";

export const useIsFavorite: (id: string) => boolean = (id: string): boolean => {
  const favs: FavoritesContextType["favorites"] | undefined = useContextSelector(FavoritesContext, (c) => c?.favorites);

  if (favs === undefined) {
    throw new Error("useIsFavorite must be used within FavoritesProvider");
  }

  return Boolean(favs[String(id)]);
};

export default useIsFavorite;
