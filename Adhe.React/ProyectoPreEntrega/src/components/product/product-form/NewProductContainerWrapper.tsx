import React, { useCallback, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { Product } from "../../../models";
import type { CreatePayload } from "../Product.Types";

import { useNotification } from "../../../hooks/useNotification";
import { useProducts } from "../../../hooks/useProducts";
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
          await simulateDelay(1500);
          imageUrl = await fileToDataUrl(p.file);
        }

        const created: Partial<Product> = {
          nombre: p.nombre,
          precio: p.precio,
          descripcion: p.descripcion,
          imagen: imageUrl,
        };

        createProduct(created);
        setNotification(`${created.nombre ?? "Producto"} creado (simulado)`, 3000, "info");
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
