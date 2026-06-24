import React, { useCallback } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { Product } from "../../../models";
import type { ProductFormPayload } from "../../product/product-form/ProductFormTypes";

import useNotification from "../../../hooks/useNotification";
import useProductFormSubmit from "../../../hooks/useProductFormSubmit";
import useProducts from "../../../hooks/useProducts";
import useProductUpload from "../../../hooks/useProductUpload";
import useTags from "../../../hooks/useTags";
import ProductForm from "../../product/product-form/ProductForm";
import HelmetMeta from "../../ui/HelmetMeta";

const CreateProductFlow: React.FC = () => {
  const { loading, safeSubmit } = useProductFormSubmit();
  const { createProduct } = useProducts();
  const { createTag } = useTags();
  const { setNotification } = useNotification();
  const navigate: NavigateFunction = useNavigate();
  const { uploadMainImage, uploadAdditionalImages, resolveTagIds } = useProductUpload(createTag);

  const onCreated: (p: ProductFormPayload) => Promise<void> = useCallback(
    async (p: ProductFormPayload): Promise<void> => {
      try {
        await safeSubmit(async () => {
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
        });
      } catch {
        setNotification("Error al subir el producto", 3000, "danger");
      }
    },
    [safeSubmit, createProduct, resolveTagIds, uploadMainImage, uploadAdditionalImages, navigate, setNotification],
  );

  return (
    <>
      <HelmetMeta description="Crea un nuevo producto en Talento Tech." title="Admin | Nuevo Producto" />
      <div className="container py-4">
        <h2>Nuevo producto</h2>
        <ProductForm loading={loading} onSubmit={onCreated} />
      </div>
    </>
  );
};

export default CreateProductFlow;
