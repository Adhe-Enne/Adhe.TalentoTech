import { createTypedContext } from "../../utils/context";

export type FavoritesContextType = {
  favorites: Record<string, boolean>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  favCount: number;
};

export default createTypedContext<FavoritesContextType>();
