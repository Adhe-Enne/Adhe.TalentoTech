import { useCallback, type Dispatch, type SetStateAction } from "react";

import useAsyncCollection from "./useAsyncCollection";

interface UseCollectionCrudReturn<T> {
  data: T[];
  error: string | null;
  loading: boolean;
  setData: Dispatch<SetStateAction<T[]>>;
  addOptimistic: (item: T) => void;
  findById: (id: string) => T | undefined;
  reload: () => Promise<void>;
}

export function useCollectionCrud<T extends { id: string }>(fetchFn: () => Promise<T[]>): UseCollectionCrudReturn<T> {
  const { products: data, error, loading, setData, reload } = useAsyncCollection(fetchFn);

  const findById: (id: string) => T | undefined = useCallback((id: string): T | undefined => data.find((item) => item.id === id), [data]);

  const addOptimistic: (item: T) => void = useCallback(
    (item: T): void => {
      setData((prev) => [item, ...prev]);
    },
    [setData],
  );

  return { data, error, loading, setData, addOptimistic, findById, reload };
}
