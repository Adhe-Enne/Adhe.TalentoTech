import { useCallback, useEffect, useRef, useState } from "react";

interface UseProductFormSubmitResult {
  loading: boolean;
  safeSubmit: (fn: () => Promise<void>) => Promise<void>;
}

const useProductFormSubmit: () => UseProductFormSubmitResult = (): UseProductFormSubmitResult => {
  const [loading, setLoading] = useState(false);
  const mountedRef: { current: boolean } = useRef(true);

  useEffect((): (() => void) => {
    mountedRef.current = true;
    return (): void => {
      mountedRef.current = false;
    };
  }, []);

  const safeSubmit: (fn: () => Promise<void>) => Promise<void> = useCallback(
    async (fn: () => Promise<void>): Promise<void> => {
      setLoading(true);
      try {
        await fn();
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        throw err;
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [setLoading],
  );

  return { loading, safeSubmit };
};

export default useProductFormSubmit;
