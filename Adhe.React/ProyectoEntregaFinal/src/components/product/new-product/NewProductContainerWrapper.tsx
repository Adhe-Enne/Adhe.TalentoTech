import React, { useCallback, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { Product } from "../../../models";
import type { Tag } from "../../../models/Tag";
import type { ProductFormPayload } from "./NewProductTypes";

import { useNotification } from "../../../hooks/useNotification";
import { useProducts } from "../../../hooks/useProducts";
import useTags from "../../../hooks/useTags";
import { uploadImageToImgbb } from "../../../services/imageService";
import NewProductContainer from "./NewProductContainer";
import { useCancelable } from "./product-form/hooks/useCancelable";

const NewProductContainerWrapper: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { createProduct } = useProducts();
  const { createTag } = useTags();
  const { setNotification } = useNotification();
  const navigate: NavigateFunction = useNavigate();

  const resolveTagIds: (tags?: string[] | undefined, categoryId?: string | undefined) => Promise<string[]> = useCallback(
    async (tags?: string[] | undefined, categoryId?: string | undefined): Promise<string[]> => {
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

  const { fileToDataUrl, simulateDelay } = useCancelable();

  const mountedRef: { current: boolean } = React.useRef<boolean>(true) as { current: boolean };

  React.useEffect((): (() => void) => {
    return (): void => {
      mountedRef.current = false;
    };
  }, []);

  const onCreated: (p: ProductFormPayload) => Promise<void> = useCallback(
    async (p: ProductFormPayload): Promise<void> => {
      setLoading(true);
      try {
        let imageUrl: string = "/images/avatar1.svg";
        if (p.file) {
          const imgbbKey: string | undefined = import.meta.env.VITE_IMGBB_API_KEY;
          if (imgbbKey) {
            imageUrl = await uploadImageToImgbb(p.file);
          } else {
            await simulateDelay(1500);
            imageUrl = await fileToDataUrl(p.file);
          }
        }
        // upload additional images (if any)
        const additionalImages: string[] = [];
        if (p.images && p.images.length > 0) {
          const imgbbKey: string | undefined = import.meta.env.VITE_IMGBB_API_KEY;
          const uploads: Promise<string>[] = p.images.map(async (f) => {
            if (imgbbKey) {
              return await uploadImageToImgbb(f);
            }
            await simulateDelay(800);
            return await fileToDataUrl(f);
          });
          const urls: string[] = await Promise.all(uploads);
          additionalImages.push(...urls);
        }

        const images: string[] = additionalImages;
        const tagIds: string[] = p.tagIds?.length === (p.tags?.length ?? 0) ? p.tagIds : await resolveTagIds(p.tags, p.categoriaId);

        const created: Partial<Product> = {
          name: p.nombre,
          price: p.precio,
          description: p.descripcion,
          image: imageUrl,
          images,
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
    [createProduct, resolveTagIds, fileToDataUrl, navigate, setNotification, simulateDelay],
  );

  return <NewProductContainer loading={loading} onCreated={onCreated} />;
};

export default NewProductContainerWrapper;
