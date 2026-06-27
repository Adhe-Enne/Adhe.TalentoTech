import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { Product } from "../../../models";

import useNotification from "../../../hooks/selectors/useNotification";
import useProducts from "../../../hooks/selectors/useProducts";
import useConfirmDelete from "../../../hooks/useConfirmDelete";
import { productService } from "../../../services/productService";
import AdminProductListView from "./AdminProductListView";

const AdminProductList: React.FC = () => {
  const { products, loading, reload, updateProduct } = useProducts();
  const { setNotification } = useNotification();
  const navigate: NavigateFunction = useNavigate();
  const { deleteTarget, deleting, handleDeleteRequest, handleDeleteCancel, handleDeleteConfirm: baseDeleteConfirm } = useConfirmDelete();
  const [search, setSearch] = useState<string>("");

  const filtered: Product[] = useMemo(() => products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase())), [products, search]);

  const handleToggleEnabled: (id: string, current: boolean) => Promise<void> = useCallback(
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

  const handleDeleteConfirm: () => Promise<void> = useCallback(async () => {
    const success: boolean = await baseDeleteConfirm(
      (id: string) => productService.deleteProduct(id),
      () => {
        reload();
      },
    );
    if (success && deleteTarget) {
      setNotification(`${deleteTarget.label} eliminado`, 3000, "success");
    } else if (!success) {
      setNotification("Error al eliminar producto", 3000, "danger");
    }
  }, [baseDeleteConfirm, deleteTarget, reload, setNotification]);

  const handleEdit: (id: string) => void = useCallback((id: string): void => {
    navigate(`/admin/productos/${id}/editar`);
  }, [navigate]);

  return (
    <AdminProductListView
      deleteTarget={deleteTarget}
      deleting={deleting}
      filtered={filtered}
      loading={loading}
      onDeleteCancel={handleDeleteCancel}
      onDeleteConfirm={handleDeleteConfirm}
      onDeleteRequest={handleDeleteRequest}
      onEdit={handleEdit}
      onSearchChange={setSearch}
      onToggleEnabled={handleToggleEnabled}
      search={search}
    />
  );
};

export default AdminProductList;
