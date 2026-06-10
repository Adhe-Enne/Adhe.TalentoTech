import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams, type NavigateFunction } from "react-router-dom";

import type { Product, Tag } from "../../../models";
import type { Currency, Fields, ProductFormPayload } from "../../product/product-form/ProductFormTypes";

import useNotification from "../../../hooks/useNotification";
import useProducts from "../../../hooks/useProducts";
import useTags from "../../../hooks/useTags";
import { imageService } from "../../../services/imageService";
import { useCancelable } from "../../product/product-form/hooks/useCancelable";
import ProductFormWrapper from "../../product/product-form/ProductFormWrapper";
import HelmetMeta from "../../ui/HelmetMeta";

const VALID_CURRENCIES: Set<Currency> = new Set(["USD", "ARS", "BTC"]);

function parseCurrency(value: string): Currency {
  return VALID_CURRENCIES.has(value as Currency) ? (value as Currency) : "USD";
}

const EditProductFlow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate: NavigateFunction = useNavigate();
  const { setNotification } = useNotification();
  const { findById, updateProduct } = useProducts();
  const { createTag } = useTags();
  const { fileToDataUrl, simulateDelay } = useCancelable();
  const [loading, setLoading] = useState(false);
  const mountedRef: React.RefObject<boolean> = React.useRef<boolean>(true);

  React.useEffect((): (() => void) => {
    return (): void => {
      mountedRef.current = false;
    };
  }, []);

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

  const resolveTagIds: (tags?: string[], categoryId?: string) => Promise<string[]> = useCallback(
    async (tags?: string[], categoryId?: string): Promise<string[]> => {
      const ids: string[] = [];
      if (!tags?.length) {
        return ids;
      }
      for (const name of tags) {
        const createdTag: Tag | undefined = await createTag(name, categoryId ?? "");
        if (createdTag) {
          ids.push(createdTag.id);
        }
      }
      return ids;
    },
    [createTag],
  );

  const onCreated: (p: ProductFormPayload) => Promise<void> = useCallback(
    async (p: ProductFormPayload): Promise<void> => {
      if (!id || !product) {
        return;
      }
      setLoading(true);
      try {
        let imageUrl: string = product.image;
        if (p.file) {
          const imgbbKey: string | undefined = import.meta.env.VITE_IMGBB_API_KEY;
          if (imgbbKey) {
            imageUrl = await imageService.uploadImageToImgbb(p.file);
          } else {
            await simulateDelay(1500);
            imageUrl = await fileToDataUrl(p.file);
          }
        }

        const newImageUrls: string[] = [];
        if (p.images && p.images.length > 0) {
          const imgbbKey: string | undefined = import.meta.env.VITE_IMGBB_API_KEY;
          const uploads: Promise<string>[] = p.images.map(async (f) => {
            if (imgbbKey) {
              return await imageService.uploadImageToImgbb(f);
            }
            await simulateDelay(800);
            return await fileToDataUrl(f);
          });
          const urls: string[] = await Promise.all(uploads);
          newImageUrls.push(...urls);
        }

        const images: string[] = [...(p.existingImageUrls ?? []), ...newImageUrls];
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
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setNotification("Error al actualizar el producto", 3000, "danger");
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [id, product, updateProduct, resolveTagIds, fileToDataUrl, navigate, setNotification, simulateDelay],
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
      <ProductFormWrapper existingImageUrl={product.image} initialData={initialData} loading={loading} mode="edit" onCancel={handleCancel} onCreated={onCreated} />
    </>
  );
};

export default EditProductFlow;
