export type FavoritesContextType = {
  favorites: Record<string, boolean>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  favCount: number;
};
