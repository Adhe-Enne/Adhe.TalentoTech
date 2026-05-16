import React, { useCallback, useEffect, useMemo, useState } from "react";

import type { ProviderProps } from "../../models/ProviderProps";
import type { FavoritesContextType } from "./Favorites.Types";

import { useNotification } from "../../hooks/useNotification";
import { parseFavorites } from "./Favorites.Hooks";
import FavoritesContext from "./FavoritesContext";

const FAVORITES_KEY: string = "tt_favorites";

export const FavoritesProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const { setNotification } = useNotification();

  const [store, setStore] = useState<Set<number>>(() =>
    parseFavorites(globalThis.window === undefined ? null : localStorage.getItem(FAVORITES_KEY)),
  );

  const toggleFavorite: (id: number) => void = useCallback(
    (id: number) => {
      let willAdd: boolean | undefined;

      setStore((prev) => {
        willAdd = !prev.has(id);
        const next: Set<number> = new Set(prev);
        willAdd ? next.add(id) : next.delete(id);
        return next;
      });

      if (willAdd !== undefined) {
        setNotification(willAdd ? "Añadido a favoritos" : "Eliminado de favoritos", 3000, willAdd ? "info" : "warning");
      }
    },
    [setNotification],
  );

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...store]));
  }, [store]);

  useEffect(() => {
    if (globalThis.window === undefined) {
      return;
    }

    const onStorage: (e: StorageEvent) => void = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY) {
        setStore(parseFavorites(e.newValue));
      }
    };

    globalThis.window.addEventListener("storage", onStorage);
    return (): void => globalThis.window.removeEventListener("storage", onStorage);
  }, []);

  const favorites: Record<number, boolean> = useMemo(
    () => Object.fromEntries([...store].map((id) => [id, true])),
    [store],
  );

  const isFavorite: (id: number) => boolean = useCallback((id: number) => store.has(id), [store]);

  const value: FavoritesContextType = useMemo(
    () => ({
      favorites,
      isFavorite,
      toggleFavorite,
    }),
    [favorites, isFavorite, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
