import React, { useCallback, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import useNotification from "../../../hooks/useNotification";
import useProducts from "../../../hooks/useProducts";
import { productService } from "../../../services/productService";
import ConfirmDialog from "../../ui/ConfirmDialog";
import HelmetMeta from "../../ui/HelmetMeta";
import AdminProductList from "./AdminProductList";

interface DeleteTarget {
  id: string;
  name: string;
}

const AdminProductListContainer: React.FC = () => {
  const { products, loading, reload, updateProduct } = useProducts();
  const { setNotification } = useNotification();
  const navigate: NavigateFunction = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleToggleEnabled: (id: string, current: boolean) => void = useCallback(
    async (id: string, current: boolean) => {
      try {
        await updateProduct(id, { isEnabled: !current });
        setNotification(`Producto ${current ? "desactivado" : "activado"}`, 2000, "info");
      } catch {
        setNotification("Error al cambiar estado", 3000, "danger");
      }
    },
    [updateProduct, setNotification],
  );

  const handleDeleteRequest: (id: string, name: string) => void = useCallback((id: string, name: string) => {
    setDeleteTarget({ id, name });
  }, []);

  const handleDeleteConfirm: () => void = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }
    setDeleting(true);
    try {
      await productService.deleteProduct(deleteTarget.id);
      setNotification(`${deleteTarget.name} eliminado`, 3000, "success");
      reload();
      setDeleteTarget(null);
    } catch {
      setNotification("Error al eliminar producto", 3000, "danger");
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, reload, setNotification]);

  const handleEdit: (id: string) => void = useCallback(
    (id: string) => {
      navigate(`/admin/productos/${id}/editar`);
    },
    [navigate],
  );

  return (
    <>
      <HelmetMeta description="Gestiona tus productos en Talento Tech." title="Admin | Productos" />
      <AdminProductList
        error={null}
        loading={loading}
        onDelete={handleDeleteRequest}
        onEdit={handleEdit}
        onRetry={reload}
        onToggleEnabled={handleToggleEnabled}
        products={products ?? []}
      />
      <ConfirmDialog
        confirmLabel="Eliminar"
        confirmVariant="danger"
        loading={deleting}
        message={`¿Eliminar "${deleteTarget?.name}"? No se podrá deshacer.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        open={deleteTarget !== null}
        title="Eliminar producto"
      />
    </>
  );
};

export default AdminProductListContainer;
