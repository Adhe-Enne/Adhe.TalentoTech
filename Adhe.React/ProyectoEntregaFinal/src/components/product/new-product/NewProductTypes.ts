import type { SyntheticEvent, RefObject } from "react";

export type ProductFormPayload = {
  nombre: string;
  precio: number;
  descripcion?: string;
  file?: File | null;
  categoriaId?: string;
  tags?: string[]; // tag names
};

export type StateRefType = {
  timers: Set<ReturnType<typeof setTimeout>>;
  readers: Set<FileReader>;
  controllers: Set<AbortController>;
};

export type Fields = {
  nombre: string;
  precio: string;
  descripcion: string;
  file: File | null;
  categoriaId: string;
  tags: string[];
};

export type UseProductFormReturn = {
  fields: Fields;
  setField: <K extends keyof Fields>(k: K, v: Fields[K]) => void;
  setFile: (f: File | null) => void;
  reset: () => void;
  previewUrl?: string;
  getPayload: () => ProductFormPayload;
  handleSubmit: (onSubmit: (p: ProductFormPayload) => void) => (e: SyntheticEvent) => void;
};

export type UseCancelableReturn = {
  ref: RefObject<StateRefType>;
  fileToDataUrl: (file: File) => Promise<string>;
  simulateDelay: (ms: number) => Promise<void>;
};

export type ImagePreviewProps = {
  url?: string;
  name?: string;
  onFileChange: (f: File | null) => void;
  onClear: () => void;
};
