import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

import type { ProviderProps } from "../models/ProviderProps";

import { useNotification } from "../hooks/useNotification";

const FAVORITES_KEY: string = "tt_favorites";

export type FavoritesContextType = {
  favorites: Record<number, boolean>;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
};

const FavoritesContext: React.Context<FavoritesContextType | undefined> = createContext<
  FavoritesContextType | undefined
>(undefined);

function parseFavorites(raw: string | null): Set<number> {
  if (!raw) {
    return new Set<number>();
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return new Set<number>((parsed as Array<number | string>).map(Number).filter((n) => !Number.isNaN(n)));
    }

    if (parsed && typeof parsed === "object") {
      const asObj: Record<string, unknown> = parsed as Record<string, unknown>;
      return new Set<number>(
        Object.entries(asObj)
          .filter(([_, val]) => !!val)
          .map(([k]) => Number(k))
          .filter((n) => !Number.isNaN(n)),
      );
    }
  } catch {
    // ignore
  }

  return new Set<number>();
}

export const FavoritesProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;

  const [store, setStore] = useState<Set<number>>(() => {
    try {
      const raw: string | null =
        globalThis.window === undefined ? null : globalThis.localStorage.getItem(FAVORITES_KEY);
      return parseFavorites(raw);
    } catch {
      return new Set<number>();
    }
  });

  const { setNotification } = useNotification();

  const favorites: Record<number, boolean> = useMemo(() => {
    const out: Record<number, boolean> = {};
    store.forEach((id) => (out[id] = true));
    return out;
  }, [store]);

  const isFavorite: (id: number) => boolean = useCallback((id: number): boolean => store.has(id), [store]);

  const toggleFavorite: (id: number) => void = useCallback(
    (id: number): void => {
      // compute current intent from current store snapshot
      const willAdd: boolean = !store.has(id);

      // update store (pure updater)
      setStore((prev: Set<number>) => {
        const next: Set<number> = new Set<number>(prev);
        if (willAdd) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });

      // side-effect: show notification - keep outside updater to avoid duplicate calls
      try {
        if (typeof setNotification === "function") {
          if (willAdd) {
            setNotification("Añadido a favoritos", 3000, "info");
          } else {
            setNotification("Eliminado de favoritos", 3000, "warning");
          }
        }
      } catch {
        // ignore
      }
    },
    [setNotification, store],
  );

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...store]));
    } catch {
      // ignore
    }
  }, [store]);

  useEffect((): (() => void) => {
    const onStorage: (e: StorageEvent) => void = (e: StorageEvent): void => {
      if (e.key !== FAVORITES_KEY) {
        return;
      }
      try {
        const next: Set<number> = parseFavorites(e.newValue);
        setStore(next);
      } catch {
        // ignore
      }
    };

    globalThis.addEventListener("storage", onStorage);
    return (): void => {
      globalThis.removeEventListener("storage", onStorage);
    };
  }, []);

  const value: FavoritesContextType = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite }),
    [favorites, isFavorite, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export default FavoritesContext;
