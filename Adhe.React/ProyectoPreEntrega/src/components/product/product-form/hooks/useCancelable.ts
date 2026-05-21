import type { RefObject } from "react";

import type { UseCancelableReturn, StateRefType } from "../../Product.Types";

import { useAbortableFileReader } from "./useAbortableFileReader";
import { useAbortableTimeout } from "./useAbortableTimeout";
import { useCancelableRef } from "./useCancelableRef";

export const useCancelable: () => UseCancelableReturn = (): UseCancelableReturn => {
  const ref: RefObject<StateRefType> = useCancelableRef();
  const fileToDataUrl: (file: File) => Promise<string> = useAbortableFileReader(ref);
  const simulateDelay: (ms: number) => Promise<void> = useAbortableTimeout(ref);

  return { ref, fileToDataUrl, simulateDelay };
};
