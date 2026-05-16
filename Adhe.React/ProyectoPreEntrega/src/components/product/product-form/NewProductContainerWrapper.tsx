import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { Product } from "../../../models";

import { useNotification } from "../../../hooks/useNotification";
import { useProducts } from "../../../hooks/useProducts";
import NewProductContainer from "./NewProductContainer";

const NewProductContainerWrapper: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { createProduct } = useProducts();
  const { setNotification } = useNotification();
  // refs y cleanup para cancelar FileReader y timers

  const dataTimerRef: React.RefObject<ReturnType<typeof setTimeout> | null> = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const fileReaderRef: React.RefObject<FileReader | null> = useRef<FileReader | null>(null);

  const fileToDataUrl: (f: File) => Promise<string> = useCallback(
    (f: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader: FileReader = new FileReader();
        fileReaderRef.current = reader;
        reader.onload = (): void => {
          fileReaderRef.current = null;
          resolve(typeof reader.result === "string" ? reader.result : "");
        };
        reader.onerror = (e: ProgressEvent<FileReader>): void => {
          fileReaderRef.current = null;
          reject(new Error(e?.target?.error?.message || "File reading error"));
        };
        reader.readAsDataURL(f);
      }),
    [],
  );

  const isMountedRef: React.RefObject<boolean> = useRef<boolean>(true);
  const navigate: NavigateFunction = useNavigate();

  const onCreated: (p: { nombre: string; precio: number; descripcion?: string; file?: File | null }) => Promise<void> =
    useCallback(
      async (p: { nombre: string; precio: number; descripcion?: string; file?: File | null }) => {
        setLoading(true);
        isMountedRef.current = true;
        try {
          let imageUrl: string = "/images/avatar1.svg";
          if (p.file) {
            // Simular subida cancelable
            await new Promise<void>((resolve) => {
              dataTimerRef.current = globalThis.setTimeout(() => {
                dataTimerRef.current = null;
                resolve();
              }, 1500);
            });

            if (!isMountedRef.current) {
              return;
            }

            imageUrl = await fileToDataUrl(p.file);

            if (!isMountedRef.current) {
              return;
            }
          }

          if (!isMountedRef.current) {
            return;
          }

          const created: Partial<Product> = {
            nombre: p.nombre,
            precio: p.precio,
            descripcion: p.descripcion,
            imagen: imageUrl,
          };

          if (!isMountedRef.current) {
            return;
          }

          createProduct(created);

          if (isMountedRef.current) {
            setNotification(`${created.nombre ?? "Producto"} creado (simulado)`, 3000, "info");
          }
          if (isMountedRef.current) {
            navigate("/");
          }
        } catch {
          if (isMountedRef.current) {
            setNotification("Error al subir el producto", 3000, "danger");
          }
        } finally {
          if (isMountedRef.current) {
            setLoading(false);
          }
        }
      },
      [createProduct, fileToDataUrl, navigate, setNotification],
    );

  useEffect(() => {
    isMountedRef.current = true;
    return (): void => {
      isMountedRef.current = false;
      if (dataTimerRef.current) {
        globalThis.clearTimeout(dataTimerRef.current);
        dataTimerRef.current = null;
      }
      if (fileReaderRef.current) {
        fileReaderRef.current.abort();
        fileReaderRef.current = null;
      }
    };
  }, []);
  return <NewProductContainer loading={loading} onCreated={onCreated} />;
};

export default NewProductContainerWrapper;
