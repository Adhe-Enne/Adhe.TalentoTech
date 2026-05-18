import React from "react";

export type CreatePayload = {
  nombre: string;
  precio: number;
  descripcion?: string;
  file?: File | null;
};

export type StateRefType = {
  timers: Set<ReturnType<typeof setTimeout>>;
  readers: Set<FileReader>;
  controllers: Set<AbortController>;
};

export type FormPayload = {
  nombre: string;
  precio: number;
  descripcion?: string;
  file?: File | null;
};

export type Fields = {
  nombre: string;
  precio: string;
  descripcion: string;
  file: File | null;
};

export type UseProductFormReturn = {
  fields: Fields;
  setField: <K extends keyof Fields>(k: K, v: Fields[K]) => void;
  setFile: (f: File | null) => void;
  reset: () => void;
  previewUrl?: string;
  getPayload: () => FormPayload;
  handleSubmit: (onSubmit: (p: FormPayload) => void) => (e: React.SyntheticEvent) => void;
};

export type UseCancelableReturn = {
  ref: React.RefObject<StateRefType>;
  fileToDataUrl: (file: File) => Promise<string>;
  simulateDelay: (ms: number) => Promise<void>;
};

export type ImagePreviewProps = {
  url?: string;
  name?: string;
  onFileChange: (f: File | null) => void;
  onClear: () => void;
};
