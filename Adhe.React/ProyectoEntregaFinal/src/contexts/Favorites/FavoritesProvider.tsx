import React, { useCallback, useEffect, useMemo, useState } from "react";

import type { ProviderProps } from "../../types/ProviderProps";
import type { FavoritesContextType } from "./FavoritesContext";

import useNotification from "../../hooks/selectors/useNotification";
import FavoritesContext from "./FavoritesContext";

const FAVORITES_KEY: string = "tt_favorites";

function parseFavorites(raw: string | null): Set<string> {
  if (!raw) {
    return new Set();
  }

  const parsed: unknown = JSON.parse(raw);
  if (Array.isArray(parsed)) {
    return new Set(parsed.map(String).filter(Boolean));
  }

  if (parsed && typeof parsed === "object") {
    return new Set(
      Object.keys(parsed)
        .filter((k) => (parsed as Record<string, unknown>)[k])
        .map(String)
        .filter(Boolean),
    );
  }

  return new Set();
}

export const FavoritesProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const { setNotification } = useNotification();

  const [store, setStore] = useState<Set<string>>(() => parseFavorites(globalThis.window === undefined ? null : localStorage.getItem(FAVORITES_KEY)));

  const toggleFavorite: (id: string) => void = useCallback(
    (id: string) => {
      const willAdd: boolean = !store.has(id);

      setStore((prev) => {
        const next: Set<string> = new Set(prev);
        willAdd ? next.add(id) : next.delete(id);
        return next;
      });

      setNotification(willAdd ? "Añadido a favoritos" : "Eliminado de favoritos", 3000, willAdd ? "info" : "warning");
    },
    [store, setNotification],
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

  const favorites: Record<string, boolean> = useMemo(() => Object.fromEntries([...store].map((id) => [id, true])), [store]);

  const isFavorite: (id: string) => boolean = useCallback((id: string) => store.has(id), [store]);

  const favCount: number = store.size;

  const value: FavoritesContextType = useMemo(
    () => ({
      favorites,
      favCount,
      isFavorite,
      toggleFavorite,
    }),
    [favorites, isFavorite, toggleFavorite, favCount],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
