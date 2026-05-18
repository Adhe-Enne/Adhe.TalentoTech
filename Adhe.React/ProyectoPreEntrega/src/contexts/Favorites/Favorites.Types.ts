export type FavoritesContextType = {
  favorites: Record<number, boolean>;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
  count: number;
};
