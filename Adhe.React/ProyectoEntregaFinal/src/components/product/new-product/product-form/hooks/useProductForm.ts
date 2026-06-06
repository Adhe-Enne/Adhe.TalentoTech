import React, { useCallback, useEffect, useMemo, useState } from "react";

import type { ProductFormPayload, Fields, UseProductFormReturn } from "../../NewProductTypes";

export const useProductForm: (initial?: Partial<Fields>) => UseProductFormReturn = (initial?: Partial<Fields>): UseProductFormReturn => {
  const [fields, setFields] = useState<Fields>({
    nombre: initial?.nombre ?? "",
    precio: initial?.precio ?? "",
    stock: initial?.stock ?? "",
    descripcion: initial?.descripcion ?? "",
    file: initial?.file ?? null,
    images: initial?.images ?? [],
    existingImageUrls: initial?.existingImageUrls ?? [],
    categoriaId: initial?.categoriaId ?? "",
    currency: initial?.currency ?? "USD",
    tags: initial?.tags ?? [],
    tagIds: initial?.tagIds ?? [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField: <K extends keyof Fields>(k: K, v: Fields[K]) => void = useCallback(<K extends keyof Fields>(k: K, v: Fields[K]) => {
    setFields((s: Fields) => ({ ...s, [k]: v }));
    setErrors((prev) => {
      if (prev[k]) {
        const next = { ...prev };
        delete next[k];
        return next;
      }
      return prev;
    });
  }, []);

  const setFile: (f: File | null) => void = useCallback((f: File | null) => setField("file", f), [setField]);
  const reset: () => void = useCallback(
    () =>
      setFields({
        nombre: "",
        precio: "",
        stock: "",
        descripcion: "",
        file: null,
        images: [],
        existingImageUrls: [],
        categoriaId: "",
        currency: "USD",
        tags: [],
        tagIds: [],
      }),
    [],
  );
  const previewUrl: string | undefined = useMemo(() => (fields.file ? URL.createObjectURL(fields.file) : undefined), [fields.file]);

  const validate: () => boolean = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fields.nombre.trim()) {
      newErrors.nombre = "El nombre del producto es obligatorio";
    }

    const price: number = Number.parseFloat(fields.precio);
    if (isNaN(price) || price <= 0) {
      newErrors.precio = "El precio debe ser un número mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fields.nombre, fields.precio]);

  const clearErrors: () => void = useCallback(() => setErrors({}), []);

  const getPayload: () => ProductFormPayload = useCallback((): ProductFormPayload => {
    return {
      nombre: fields.nombre.trim(),
      precio: Number.parseFloat(fields.precio) || 0,
      stock: Number.parseInt(fields.stock, 10) || 0,
      descripcion: fields.descripcion.trim(),
      file: fields.file,
      images: fields.images ?? [],
      existingImageUrls: fields.existingImageUrls,
      categoriaId: fields.categoriaId || undefined,
      currency: fields.currency ?? "USD",
      tags: fields.tags ?? [],
      tagIds: fields.tagIds ?? [],
    };
  }, [fields]);

  const handleSubmit: (onSubmit: (p: ProductFormPayload) => void) => (e: React.SyntheticEvent) => void = useCallback(
    (onSubmit: (p: ProductFormPayload) => void) => (e: React.SyntheticEvent) => {
      e.preventDefault();
      if (validate()) {
        onSubmit(getPayload());
      }
    },
    [getPayload, validate],
  );

  useEffect(() => {
    return (): void => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return { fields, setField, setFile, reset, previewUrl, getPayload, handleSubmit, errors, validate, clearErrors };
};
