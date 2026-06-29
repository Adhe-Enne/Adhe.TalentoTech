import { useCallback, useState } from "react";

import useNotification from "../../../../hooks/selectors/useNotification";
import { isValidSlug, maxLength } from "../../../../utils/validators";

type ModalState = "closed" | "open" | "creating";

function useCategoryCreate(
  createCategory: (name: string, slug?: string) => Promise<{ id: string } | undefined>,
  setField: (field: "categoriaId", value: string) => void,
): { isCreating: boolean; show: boolean; handleClose: () => void; handleOpen: () => void; handleCreate: (name: string, slug?: string) => Promise<void> } {
  const [modalState, setModalState] = useState<ModalState>("closed");
  const { setNotification } = useNotification();

  const handleClose: () => void = useCallback(() => {
    setModalState("closed");
  }, []);

  const handleOpen: () => void = useCallback(() => {
    setModalState("open");
  }, []);

  const handleCreate: (name: string, slug?: string) => Promise<void> = useCallback(
    async (name: string, slug?: string): Promise<void> => {
      if (!name.trim()) {
        setNotification("El nombre es obligatorio", 3000, "danger");
        return;
      }
      if (!maxLength(name, 50)) {
        setNotification("El nombre no puede exceder 50 caracteres", 3000, "danger");
        return;
      }
      if (slug && !isValidSlug(slug)) {
        setNotification("Slug inválido: solo mayúsculas, números y guión medio, sin espacios", 3000, "danger");
        return;
      }

      setModalState("creating");

      try {
        const created: { id: string } | undefined = await createCategory(name, slug);
        if (created) {
          setField("categoriaId", created.id);
          setModalState("closed");
          setNotification(`Categoría "${name}" creada!`, 3000, "info");
        } else {
          setNotification("No se pudo crear la categoría", 3000, "danger");
        }
      } catch {
        setNotification("Error al crear la categoría", 3000, "danger");
      }
    },
    [createCategory, setField, setNotification],
  );

  return { isCreating: modalState === "creating", show: modalState !== "closed", handleClose, handleOpen, handleCreate };
}

export default useCategoryCreate;
