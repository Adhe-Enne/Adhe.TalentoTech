import React, { useCallback, useEffect, useMemo, useState } from "react";

import type { Fields, FormPayload, UseProductFormReturn } from "../../Product.Types";

export const useProductForm: (initial?: Partial<Fields>) => UseProductFormReturn = (initial?: Partial<Fields>): UseProductFormReturn => {
  const [fields, setFields] = useState<Fields>({
    nombre: initial?.nombre ?? "",
    precio: initial?.precio ?? "",
    descripcion: initial?.descripcion ?? "",
    file: initial?.file ?? null,
  });

  const setField: <K extends keyof Fields>(k: K, v: Fields[K]) => void = useCallback(<K extends keyof Fields>(k: K, v: Fields[K]) => {
    setFields((s) => ({ ...s, [k]: v }));
  }, []);

  const setFile: (f: File | null) => void = useCallback((f: File | null) => setField("file", f), [setField]);
  const reset: () => void = useCallback(() => setFields({ nombre: "", precio: "", descripcion: "", file: null }), []);
  const previewUrl: string | undefined = useMemo(() => (fields.file ? URL.createObjectURL(fields.file) : undefined), [fields.file]);

  const getPayload: () => FormPayload = useCallback((): FormPayload => {
    return {
      nombre: fields.nombre.trim(),
      precio: Number.parseFloat(fields.precio) || 0,
      descripcion: fields.descripcion.trim(),
      file: fields.file,
    };
  }, [fields]);

  const handleSubmit: (onSubmit: (p: FormPayload) => void) => (e: React.SyntheticEvent) => void = useCallback(
    (onSubmit: (p: FormPayload) => void) => (e: React.SyntheticEvent) => {
      e.preventDefault();
      onSubmit(getPayload());
    },
    [getPayload],
  );

  useEffect(() => {
    return (): void => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return { fields, setField, setFile, reset, previewUrl, getPayload, handleSubmit };
};
