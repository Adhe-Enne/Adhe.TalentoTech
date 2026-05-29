import { useEffect, useRef, type RefObject } from "react";

import type { StateRefType } from "../../Product.Types";

export const useCancelableRef: () => RefObject<StateRefType> = (): RefObject<StateRefType> => {
  const stateRef: RefObject<StateRefType> = useRef<StateRefType>({
    timers: new Set<ReturnType<typeof setTimeout>>(),
    readers: new Set<FileReader>(),
    controllers: new Set<AbortController>(),
  });

  useEffect(() => {
    const s: StateRefType = stateRef.current;
    return (): void => {
      s.controllers.forEach((c) => {
        c.abort();
      });
      s.controllers.clear();
      s.timers.forEach(globalThis.clearTimeout);
      s.timers.clear();
      s.readers.forEach((r) => {
        r.abort();
      });
      s.readers.clear();
    };
  }, []);

  return stateRef;
};
