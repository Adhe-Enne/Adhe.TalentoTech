import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { Product } from "../../../models";
import type { ProductFormPayload } from "../../product/product-form/ProductFormTypes";

import useNotification from "../../../hooks/useNotification";
import useProducts from "../../../hooks/useProducts";
import useProductUpload from "../../../hooks/useProductUpload";
import useTags from "../../../hooks/useTags";
import ProductFormWrapper from "../../product/product-form/ProductFormWrapper";
import HelmetMeta from "../../ui/HelmetMeta";

const CreateProductFlow: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { createProduct } = useProducts();
  const { createTag } = useTags();
  const { setNotification } = useNotification();
  const navigate: NavigateFunction = useNavigate();
  const { uploadMainImage, uploadAdditionalImages, resolveTagIds } = useProductUpload(createTag);
  const mountedRef: { current: boolean } = useRef(true) as { current: boolean };

  useEffect((): (() => void) => {
    return (): void => {
      mountedRef.current = false;
    };
  }, []);

  const onCreated: (p: ProductFormPayload) => Promise<void> = useCallback(
    async (p: ProductFormPayload): Promise<void> => {
      setLoading(true);
      try {
        const imageUrl: string = p.file ? await uploadMainImage(p.file) : "/images/avatar1.svg";
        const newImages: string[] = await uploadAdditionalImages(p.images ?? []);
        const tagIds: string[] = p.tagIds?.length === (p.tags?.length ?? 0) ? p.tagIds : await resolveTagIds(p.tags, p.categoriaId);

        const created: Partial<Product> = {
          name: p.nombre,
          price: p.precio,
          stock: p.stock,
          description: p.descripcion,
          image: imageUrl,
          images: newImages,
          currency: p.currency,
          categoryId: p.categoriaId,
          tagIds,
        };

        const newId: string | undefined = await createProduct(created);
        setNotification(`${created.name ?? "Producto"} creado!`, 3000, "info");
        if (newId) {
          navigate(`/producto/${newId}`);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setNotification("Error al subir el producto", 3000, "danger");
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [createProduct, resolveTagIds, uploadMainImage, uploadAdditionalImages, navigate, setNotification],
  );

  return (
    <>
      <HelmetMeta description="Crea un nuevo producto en Talento Tech." title="Admin | Nuevo Producto" />
      <ProductFormWrapper loading={loading} onCreated={onCreated} />
    </>
  );
};

export default CreateProductFlow;
