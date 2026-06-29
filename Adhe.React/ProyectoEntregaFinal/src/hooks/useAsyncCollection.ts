import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";

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

  useEffect((): (() => void) => {
    let mounted: boolean = true;
    const load: () => Promise<void> = async (): Promise<void> => {
      try {
        const result: T[] = await fetcher();
        if (mounted) {
          setData(result);
        }
      } catch (err: unknown) {
        if (mounted) {
          setError(extractErrorMessage(err, "Error loading data"));
          setData([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    void load();
    return (): void => {
      mounted = false;
    };
  }, [fetcher]);

  const reload: () => Promise<void> = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const result: T[] = await fetcher();
      setData(result);
    } catch (err: unknown) {
      setError(extractErrorMessage(err, "Error loading data"));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  return { data, error, loading, reload, setData, setError };
}

export default useAsyncCollection;
