import { useCallback, useEffect, useRef, useState, type Dispatch, type RefObject, type SetStateAction } from "react";

import { extractErrorMessage } from "../utils/errorUtils";

function useAsyncCollection<T>(fetcher: () => Promise<T[]>): {
  data: T[];
  error: string | null;
  loading: boolean;
  reload: () => Promise<void>;
  setData: Dispatch<SetStateAction<T[]>>;
  setError: Dispatch<SetStateAction<string | null>>;
} {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const mounted: RefObject<boolean> = useRef<boolean>(true);

  const load: () => Promise<void> = useCallback(async (): Promise<void> => {
    try {
      const result: T[] = await fetcher();
      if (mounted.current) {
        setData(result);
      }
    } catch (err: unknown) {
      if (mounted.current) {
        setError(extractErrorMessage(err, "Error loading data"));
        setData([]);
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, [fetcher]);

  useEffect((): (() => void) => {
    mounted.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    return (): void => {
      mounted.current = false;
    };
  }, [load]);

  const reload: () => Promise<void> = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    await load();
  }, [load]);

  return { data, error, loading, reload, setData, setError };
}

export default useAsyncCollection;
