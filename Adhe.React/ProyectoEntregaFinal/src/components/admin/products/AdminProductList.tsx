import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { Product } from "../../../models";

import useCategories from "../../../hooks/selectors/useCategories";
import useProducts from "../../../hooks/selectors/useProducts";
import useConfirmDelete from "../../../hooks/useConfirmDelete";
import { productService } from "../../../services/productService";
import { withDelay, withToast } from "../../../utils/withToast";
import AdminProductListView from "./AdminProductListView";

const AdminProductList: React.FC = () => {
  const { products, loading, reload, updateProduct } = useProducts();
  const { findById } = useCategories();
  const navigate: NavigateFunction = useNavigate();
  const { deleteTarget, deleting, handleDeleteRequest, handleDeleteCancel, handleDeleteConfirm: baseDeleteConfirm } = useConfirmDelete();
  const [search, setSearch] = useState<string>("");
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const filtered: Product[] = useMemo(() => products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase())), [products, search]);

  const filteredResolved: Product[] = useMemo(() => filtered.map((p) => ({ ...p, category: p.categoryId ? (findById(p.categoryId) ?? null) : null })), [filtered, findById]);

  const handleToggleEnabled: (id: string, current: boolean) => Promise<void> = useCallback(
    async (id: string, current: boolean) => {
      setTogglingIds((prev) => new Set(prev).add(id));
      await withDelay(updateProduct(id, { isEnabled: !current }));
      setTogglingIds((prev) => {
        const next: Set<string> = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [updateProduct],
  );

  const handleDeleteConfirm: () => Promise<void> = useCallback(async () => {
    await withToast(
      async () => {
        const success: boolean = await baseDeleteConfirm(
          (id: string) => productService.deleteProduct(id),
          () => {
            reload();
          },
        );
        if (!success) {
          throw new Error("Error al eliminar producto");
        }
      },
      "Eliminando...",
      deleteTarget ? `${deleteTarget.label} eliminado` : "Eliminado",
      "Error al eliminar producto",
    );
  }, [baseDeleteConfirm, deleteTarget, reload]);

  const handleEdit: (id: string) => void = useCallback(
    (id: string): void => {
      navigate(`/admin/productos/${id}/editar`);
    },
    [navigate],
  );

  return (
    <AdminProductListView
      deleteTarget={deleteTarget}
      deleting={deleting}
      filtered={filteredResolved}
      loading={loading}
      onDeleteCancel={handleDeleteCancel}
      onDeleteConfirm={handleDeleteConfirm}
      onDeleteRequest={handleDeleteRequest}
      onEdit={handleEdit}
      onRefresh={reload}
      onSearchChange={setSearch}
      onToggleEnabled={handleToggleEnabled}
      search={search}
      togglingIds={togglingIds}
    />
  );
};

export default AdminProductList;
