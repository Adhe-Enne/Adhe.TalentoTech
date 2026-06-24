import { useCallback, useState } from "react";

interface DeleteTarget {
  id: string;
  label: string;
}

interface UseConfirmDeleteReturn {
  deleteTarget: DeleteTarget | null;
  deleting: boolean;
  handleDeleteCancel: () => void;
  handleDeleteConfirm: (deleteFn: (id: string) => Promise<void>, onSuccess?: () => void) => Promise<boolean>;
  handleDeleteRequest: (id: string, label: string) => void;
}

const useConfirmDelete: () => UseConfirmDeleteReturn = (): UseConfirmDeleteReturn => {
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteRequest: (id: string, label: string) => void = useCallback((id: string, label: string) => {
    setDeleteTarget({ id, label });
  }, []);

  const handleDeleteCancel: () => void = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  const handleDeleteConfirm: (deleteFn: (id: string) => Promise<void>, onSuccess?: () => void) => Promise<boolean> = useCallback(
    async (deleteFn: (id: string) => Promise<void>, onSuccess?: () => void): Promise<boolean> => {
      if (!deleteTarget) {
        return false;
      }
      setDeleting(true);
      try {
        await deleteFn(deleteTarget.id);
        onSuccess?.();
        setDeleteTarget(null);
        return true;
      } catch {
        return false;
      } finally {
        setDeleting(false);
      }
    },
    [deleteTarget],
  );

  return { deleteTarget, deleting, handleDeleteRequest, handleDeleteCancel, handleDeleteConfirm };
};

export default useConfirmDelete;
