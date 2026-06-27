import type { FavoritesContextType } from "../../contexts/Favorites/FavoritesContext";

import FavoritesContext from "../../contexts/Favorites/FavoritesContext";
import { createSelectorHook } from "./factory";

const useFavorites: () => FavoritesContextType = createSelectorHook(FavoritesContext, "Favorites");

export default useFavorites;
