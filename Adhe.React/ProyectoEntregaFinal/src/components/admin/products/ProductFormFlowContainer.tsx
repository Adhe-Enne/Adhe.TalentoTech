import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, type NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";

import type { Product, Tag } from "../../../models";
import type { Fields, ProductFormPayload } from "../../product/product-form/ProductFormTypes";

import useCategories from "../../../hooks/selectors/useCategories";
import useProducts from "../../../hooks/selectors/useProducts";
import useTags from "../../../hooks/selectors/useTags";
import { imageService } from "../../../services/imageService";
import { parseCurrency } from "../../../utils/currency";
import { useCancelable } from "../../product/product-form/hooks/useCancelable";
import ProductForm from "../../product/product-form/ProductForm";
import HelmetMeta from "../../ui/HelmetMeta";
import LoadingSpinner from "../../ui/LoadingSpinner";

const ProductFormFlowContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate: NavigateFunction = useNavigate();
  const { createProduct, findById, updateProduct } = useProducts();
  const { categories, createCategory } = useCategories();
  const { createTag, tags } = useTags();
  const { fileToDataUrl, simulateDelay } = useCancelable();

  const [loading, setLoading] = useState(false);
  const mountedRef: { current: boolean } = useRef(true);

  useEffect((): (() => void) => {
    mountedRef.current = true;
    return (): void => {
      mountedRef.current = false;
    };
  }, []);

  const safeSubmit: (fn: () => Promise<void>) => Promise<void> = useCallback(
    async (fn: () => Promise<void>): Promise<void> => {
      setLoading(true);
      try {
        await fn();
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        throw err;
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [setLoading],
  );

  const resolveTagIds: (tagNames?: string[], categoryId?: string, existingTagIds?: string[]) => Promise<string[]> = useCallback(
    async (tagNames?: string[], categoryId?: string, existingTagIds?: string[]): Promise<string[]> => {
      const resolved: string[] = [...(existingTagIds ?? [])];
      if (!tagNames?.length) {
        return resolved;
      }
      for (const name of tagNames) {
        const alreadyResolved: boolean = resolved.some((id) => {
          const tag: Tag | undefined = tags.find((t) => t.id === id);
          return tag?.name.toLowerCase() === name.toLowerCase();
        });
        if (alreadyResolved) {
          continue;
        }
        const createdTag: Tag | undefined = await createTag(name, categoryId ?? "");
        if (createdTag) {
          resolved.push(createdTag.id);
        }
      }
      return resolved;
    },
    [createTag, tags],
  );

  const uploadMainImage: (file: File) => Promise<string> = useCallback(
    async (file: File): Promise<string> => {
      const imgbbKey: string | undefined = import.meta.env.VITE_IMGBB_API_KEY;
      if (imgbbKey) {
        return await imageService.uploadImageToImgbb(file);
      }
      await simulateDelay(1500);
      return await fileToDataUrl(file);
    },
    [fileToDataUrl, simulateDelay],
  );

  const uploadAdditionalImages: (files: File[]) => Promise<string[]> = useCallback(
    async (files: File[]): Promise<string[]> => {
      if (!files.length) {
        return [];
      }
      const imgbbKey: string | undefined = import.meta.env.VITE_IMGBB_API_KEY;
      const uploads: Promise<string>[] = files.map(async (f) => {
        if (imgbbKey) {
          return await imageService.uploadImageToImgbb(f);
        }
        await simulateDelay(800);
        return await fileToDataUrl(f);
      });
      return await Promise.all(uploads);
    },
    [fileToDataUrl, simulateDelay],
  );

  const isEdit: boolean = !!id;
  const product: Product | undefined = isEdit ? findById(id!) : undefined;

  const initialData: Partial<Fields> | undefined = useMemo((): Partial<Fields> | undefined => {
    if (!product) {
      return undefined;
    }
    const productTagIds: string[] = product.tagIds ?? [];
    return {
      nombre: product.name,
      precio: String(product.price),
      stock: String(product.stock),
      descripcion: product.description ?? "",
      categoriaId: product.categoryId ?? "",
      currency: parseCurrency(product.currency),
      tagIds: productTagIds,
      tags: productTagIds.map((tagId) => tags.find((t) => t.id === tagId)?.name ?? "").filter(Boolean),
      existingImageUrls: product.images ?? [],
    };
  }, [product, tags]);

  const onSubmit: (p: ProductFormPayload) => Promise<void> = useCallback(
    async (p: ProductFormPayload): Promise<void> => {
      const toastId: string | number = toast.loading(isEdit ? "Actualizando producto..." : "Subiendo producto...");
      try {
        await safeSubmit(async () => {
          const imageUrl: string = p.file ? await uploadMainImage(p.file) : (product?.image ?? "/images/avatar1.svg");
          const newImages: string[] = await uploadAdditionalImages(p.images ?? []);
          const images: string[] = isEdit ? [...(p.existingImageUrls ?? []), ...newImages] : newImages;
          const tagIds: string[] = await resolveTagIds(p.tags, p.categoriaId, p.tagIds);

          if (isEdit) {
            await updateProduct(id!, {
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
            toast.update(toastId, { autoClose: 3000, isLoading: false, render: "¡Producto actualizado!", type: "success" });
            navigate("/admin/productos");
          } else {
            const created: Partial<Product> = {
              name: p.nombre,
              price: p.precio,
              stock: p.stock,
              description: p.descripcion,
              image: imageUrl,
              images,
              currency: p.currency,
              categoryId: p.categoriaId,
              tagIds,
            };
            const newId: string | undefined = await createProduct(created);
            toast.update(toastId, { autoClose: 3000, isLoading: false, render: `¡${created.name ?? "Producto"} creado!`, type: "success" });
            if (newId) {
              navigate(`/producto/${newId}`);
            }
          }
        });
      } catch {
        toast.update(toastId, { autoClose: 3000, isLoading: false, render: `Error al ${isEdit ? "actualizar" : "subir"} el producto`, type: "error" });
      }
    },
    [isEdit, id, product, safeSubmit, createProduct, updateProduct, resolveTagIds, uploadMainImage, uploadAdditionalImages, navigate],
  );

  const handleCancel: () => void = useCallback(() => {
    navigate("/admin/productos");
  }, [navigate]);

  if (isEdit && !product) {
    return <LoadingSpinner message="Cargando producto..." />;
  }

  return (
    <>
      <HelmetMeta description={isEdit ? `Edita los detalles de ${product?.name}` : "Crea un nuevo producto en Talento Tech."} title={isEdit ? `Editar ${product?.name}` : "Admin | Nuevo Producto"} />
      <div className="container py-4">
        <h2>{isEdit ? "Editar producto" : "Nuevo producto"}</h2>
        {isEdit ? (
          <ProductForm
            categories={categories}
            existingImageUrl={product!.image}
            initialData={initialData}
            loading={loading}
            mode="edit"
            onCancel={handleCancel}
            onCreateCategory={createCategory}
            onCreateTag={createTag}
            onSubmit={onSubmit}
            tags={tags}
          />
        ) : (
          <ProductForm categories={categories} loading={loading} onCreateCategory={createCategory} onCreateTag={createTag} onSubmit={onSubmit} tags={tags} />
        )}
      </div>
    </>
  );
};

export default ProductFormFlowContainer;
