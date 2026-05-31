import { useCallback, type RefObject } from "react";

import type { StateRefType } from "../../NewProductTypes";

export const useAbortableFileReader: (stateRef: RefObject<StateRefType>) => (file: File) => Promise<string> = (stateRef: RefObject<StateRefType>) => {
  return useCallback(
    (file: File): Promise<string> =>
      new Promise<string>((resolve, reject) => {
        const controller: AbortController = new AbortController();
        stateRef.current.controllers.add(controller);
        const { signal } = controller;

        const reader: FileReader = new FileReader();

        const onAbort: () => void = (): void => {
          reader.abort();

          stateRef.current.controllers.delete(controller);
          reject(new DOMException("Aborted", "AbortError"));
        };

        if (signal.aborted) {
          onAbort();
          return;
        }

        signal.addEventListener("abort", onAbort, { once: true });

        reader.onload = (): void => {
          signal.removeEventListener("abort", onAbort);
          stateRef.current.controllers.delete(controller);
          resolve(typeof reader.result === "string" ? reader.result : "");
        };

        reader.onerror = (): void => {
          signal.removeEventListener("abort", onAbort);
          stateRef.current.controllers.delete(controller);
          reject(new Error("File reading error"));
        };

        reader.readAsDataURL(file);
      }),
    [stateRef],
  );
};
