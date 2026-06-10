import type { SyntheticEvent, RefObject } from "react";

export type Currency = "USD" | "ARS" | "BTC";

export type ProductFormPayload = {
  nombre: string;
  precio: number;
  stock: number;
  descripcion?: string;
  file?: File | null; // main image
  images?: File[]; // additional images (new files)
  existingImageUrls?: string[]; // existing additional image URLs to keep
  categoriaId?: string;
  tags?: string[]; // tag names
  tagIds?: string[]; // persisted tag ids
  currency?: Currency;
};

export type StateRefType = {
  timers: Set<ReturnType<typeof setTimeout>>;
  readers: Set<FileReader>;
  controllers: Set<AbortController>;
};

export type Fields = {
  nombre: string;
  precio: string;
  stock: string;
  descripcion: string;
  file: File | null;
  images: File[]; // additional images selected (new files)
  existingImageUrls: string[]; // existing additional image URLs to keep
  categoriaId: string;
  currency: Currency;
  tags: string[];
  tagIds: string[];
};

export type FormMode = 'create' | 'edit';

export type UseProductFormReturn = {
  fields: Fields;
  setField: <K extends keyof Fields>(k: K, v: Fields[K]) => void;
  setFile: (f: File | null) => void;
  reset: () => void;
  previewUrl?: string;
  getPayload: () => ProductFormPayload;
  handleSubmit: (onSubmit: (p: ProductFormPayload) => void) => (e: SyntheticEvent) => void;
  errors: Record<string, string>;
  validate: () => boolean;
  clearErrors: () => void;
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
