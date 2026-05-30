import React, { useCallback, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { Product } from "../../../models";
import type { CreatePayload } from "../Product.Types";

import { useNotification } from "../../../hooks/useNotification";
import { useProducts } from "../../../hooks/useProducts";
import { uploadImageToImgbb } from "../../../services/imageUploader";
import { useCancelable } from "./hooks/useCancelable";
import NewProductContainer from "./NewProductContainer";

const NewProductContainerWrapper: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { createProduct } = useProducts();
  const { setNotification } = useNotification();
  const navigate: NavigateFunction = useNavigate();

  const { fileToDataUrl, simulateDelay } = useCancelable();

  const mountedRef: { current: boolean } = React.useRef<boolean>(true) as { current: boolean };
  React.useEffect((): (() => void) => {
    return (): void => {
      mountedRef.current = false;
    };
  }, []);

  const onCreated: (p: CreatePayload) => Promise<void> = useCallback(
    async (p: CreatePayload): Promise<void> => {
      setLoading(true);
      try {
        let imageUrl: string = "/images/avatar1.svg";
        if (p.file) {
          // If an Imgbb API key is configured, upload to Imgbb and get a public URL.
          // Otherwise keep the previous behavior (simulate + data URL) as a fallback.
          const imgbbKey: string | undefined = import.meta.env.VITE_IMGBB_API_KEY;
          if (imgbbKey) {
            imageUrl = await uploadImageToImgbb(p.file);
          } else {
            await simulateDelay(1500);
            imageUrl = await fileToDataUrl(p.file);
          }
        }

        const created: Partial<Product> = {
          name: p.nombre,
          price: p.precio,
          description: p.descripcion,
          image: imageUrl,
        };

        createProduct(created);
        setNotification(`${created.name ?? "Producto"} creado!`, 3000, "info");
        navigate("/");
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
    [createProduct, fileToDataUrl, navigate, setNotification, simulateDelay],
  );

  return <NewProductContainer loading={loading} onCreated={onCreated} />;
};

export default NewProductContainerWrapper;
