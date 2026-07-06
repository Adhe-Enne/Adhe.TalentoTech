import { createTypedContext } from "../../utils/context";

export interface FavoritesContextType {
  favCount: number;
  favorites: Record<string, boolean>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

export default createTypedContext<FavoritesContextType>();
