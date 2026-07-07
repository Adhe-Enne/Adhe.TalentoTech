import { useCallback, useState } from "react";

import { extractErrorMessage } from "../utils/errorUtils";

interface UseAsyncActionReturn {
  error: string | null;
  isLoading: boolean;
  execute: <T>(fn: () => Promise<T>, errorMsg?: string) => Promise<T>;
  executeSilent: <T>(fn: () => Promise<T>, fallback?: T, errorMsg?: string) => Promise<T | undefined>;
  executeWithFallback: <T>(fn: () => Promise<T>, fallback: T, errorMsg?: string) => Promise<T>;
  resetError: () => void;
}

function useAsyncAction(defaultErrorMsg: string): UseAsyncActionReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute: <T>(fn: () => Promise<T>, errorMsg?: string) => Promise<T> = useCallback(
    async <T>(fn: () => Promise<T>, errorMsg?: string): Promise<T> => {
      setIsLoading(true);
      setError(null);
      try {
        return await fn();
      } catch (err: unknown) {
        const msg: string = extractErrorMessage(err, errorMsg ?? defaultErrorMsg);
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [defaultErrorMsg],
  );

  const executeWithFallback: <T>(fn: () => Promise<T>, fallback: T, errorMsg?: string) => Promise<T> = useCallback(
    async <T>(fn: () => Promise<T>, fallback: T, errorMsg?: string): Promise<T> => {
      setIsLoading(true);
      setError(null);
      try {
        return await fn();
      } catch (err: unknown) {
        const msg: string = extractErrorMessage(err, errorMsg ?? defaultErrorMsg);
        setError(msg);
        return fallback;
      } finally {
        setIsLoading(false);
      }
    },
    [defaultErrorMsg],
  );

  const executeSilent: <T>(fn: () => Promise<T>, fallback?: T, errorMsg?: string) => Promise<T | undefined> = useCallback(
    async <T>(fn: () => Promise<T>, fallback?: T, errorMsg?: string): Promise<T | undefined> => {
      setError(null);
      try {
        return await fn();
      } catch (err: unknown) {
        const msg: string = extractErrorMessage(err, errorMsg ?? defaultErrorMsg);
        setError(msg);
        return fallback as T | undefined;
      }
    },
    [defaultErrorMsg],
  );

  const resetError: () => void = useCallback((): void => {
    setError(null);
  }, []);

  return { execute, executeWithFallback, executeSilent, error, isLoading, resetError };
}

export default useAsyncAction;
