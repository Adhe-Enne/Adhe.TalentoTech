import { useCallback, type RefObject } from "react";

import type { StateRefType } from "../ProductFormTypes";

export const useAbortableTimeout: (stateRef: RefObject<StateRefType>) => (ms: number) => Promise<void> = (stateRef: RefObject<StateRefType>) => {
  return useCallback(
    (ms: number): Promise<void> =>
      new Promise<void>((resolve, reject) => {
        const controller: AbortController = new AbortController();
        stateRef.current.controllers.add(controller);
        const { signal } = controller;

        const id: ReturnType<typeof setTimeout> = globalThis.setTimeout(() => {
          stateRef.current.timers.delete(id);
          stateRef.current.controllers.delete(controller);
          resolve();
        }, ms);

        stateRef.current.timers.add(id);

        const onAbort: () => void = (): void => {
          globalThis.clearTimeout(id);
          stateRef.current.timers.delete(id);
          stateRef.current.controllers.delete(controller);
          reject(new DOMException("Aborted", "AbortError"));
        };

        if (signal.aborted) {
          onAbort();
          return;
        }

        signal.addEventListener("abort", onAbort, { once: true });
      }),
    [stateRef],
  );
};
