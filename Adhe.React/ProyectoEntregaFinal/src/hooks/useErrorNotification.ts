import { useEffect } from "react";

import useNotification from "./selectors/useNotification";

export function useErrorNotification(error: string | null, duration?: number): void {
  const { setNotification } = useNotification();

  useEffect((): void => {
    if (error) {
      setNotification(error, duration ?? 5000, "danger");
    }
  }, [error, setNotification, duration]);
}
