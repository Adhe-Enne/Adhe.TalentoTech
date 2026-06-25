import React, { useCallback, useMemo } from "react";
import { useNavigate, useParams, type NavigateFunction } from "react-router-dom";

import type { Product } from "../../../models";
import type { Fields, ProductFormPayload } from "../../product/product-form/ProductFormTypes";

import useNotification from "../../../hooks/selectors/useNotification";
import useProducts from "../../../hooks/selectors/useProducts";
import useTags from "../../../hooks/selectors/useTags";
import useProductFormSubmit from "../../../hooks/useProductFormSubmit";
import useProductUpload from "../../../hooks/useProductUpload";
import { parseCurrency } from "../../../utils/currency";
import ProductForm from "../../product/product-form/ProductForm";
import HelmetMeta from "../../ui/HelmetMeta";

const EditProductFlow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate: NavigateFunction = useNavigate();
  const { setNotification } = useNotification();
  const { findById, updateProduct } = useProducts();
  const { createTag } = useTags();
  const { uploadMainImage, uploadAdditionalImages, resolveTagIds } = useProductUpload(createTag);
  const { loading, safeSubmit } = useProductFormSubmit();

  const product: Product | undefined = id ? findById(id) : undefined;

  const initialData: Partial<Fields> | undefined = useMemo((): Partial<Fields> | undefined => {
    if (!product) {
      return undefined;
    }
    return {
      nombre: product.name,
      precio: String(product.price),
      stock: String(product.stock),
      descripcion: product.description ?? "",
      categoriaId: product.categoryId ?? "",
      currency: parseCurrency(product.currency),
      tagIds: product.tagIds ?? [],
      tags: product.tags?.map((t) => t.name) ?? [],
      existingImageUrls: product.images ?? [],
    };
  }, [product]);

  const onCreated: (p: ProductFormPayload) => Promise<void> = useCallback(
    async (p: ProductFormPayload): Promise<void> => {
      if (!id || !product) {
        return;
      }
      try {
        await safeSubmit(async () => {
          const imageUrl: string = p.file ? await uploadMainImage(p.file) : product.image;
          const newImages: string[] = await uploadAdditionalImages(p.images ?? []);
          const images: string[] = [...(p.existingImageUrls ?? []), ...newImages];
          const tagIds: string[] = p.tagIds?.length === (p.tags?.length ?? 0) ? p.tagIds : await resolveTagIds(p.tags, p.categoriaId);

          await updateProduct(id, {
            name: p.nombre,
            price: p.precio,
            stock: p.stock,
            description: p.descripcion,
            image: imageUrl,
            images,
            currency: p.currency,
            categoryId: p.categoriaId,
            tagIds,
          });

          setNotification("Producto actualizado!", 3000, "success");
          navigate("/admin/productos");
        });
      } catch {
        setNotification("Error al actualizar el producto", 3000, "danger");
      }
    },
    [id, product, safeSubmit, updateProduct, resolveTagIds, uploadMainImage, uploadAdditionalImages, navigate, setNotification],
  );

  const handleCancel: () => void = useCallback(() => {
    navigate("/admin/productos");
  }, [navigate]);

  if (!id) {
    return <div className="alert alert-danger">ID de producto no válido</div>;
  }

  if (!product) {
    return (
      <div className="d-flex justify-content-center py-5">
        <output className="spinner-border">
          <span className="visually-hidden">Cargando producto...</span>
        </output>
      </div>
    );
  }
  return (
    <>
      <HelmetMeta description={`Edita los detalles de ${product.name}`} title={`Editar ${product.name}`} />
      <div className="container py-4">
        <h2>Editar producto</h2>
        <ProductForm existingImageUrl={product.image} initialData={initialData} loading={loading} mode="edit" onCancel={handleCancel} onSubmit={onCreated} />
      </div>
    </>
  );
};

export default EditProductFlow;
