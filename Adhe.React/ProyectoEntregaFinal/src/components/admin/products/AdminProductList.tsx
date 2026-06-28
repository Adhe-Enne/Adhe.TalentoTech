import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";

import type { Product } from "../../../models";

import useCategories from "../../../hooks/selectors/useCategories";
import useProducts from "../../../hooks/selectors/useProducts";
import useConfirmDelete from "../../../hooks/useConfirmDelete";
import { productService } from "../../../services/productService";
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
      const toastId: string | number = toast.loading("Procesando...");
      setTogglingIds((prev) => new Set(prev).add(id));
      try {
        await Promise.all([
          updateProduct(id, { isEnabled: !current }),
          new Promise<void>((r) => { setTimeout(r, 800); }),
        ]);
        toast.update(toastId, { autoClose: 2000, isLoading: false, render: `Producto ${current ? "desactivado" : "activado"}`, type: "info" });
      } catch {
        toast.update(toastId, { autoClose: 3000, isLoading: false, render: "Error al cambiar estado", type: "error" });
      } finally {
        setTogglingIds((prev) => {
          const next: Set<string> = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [updateProduct],
  );

  const handleDeleteConfirm: () => Promise<void> = useCallback(async () => {
    const toastId: string | number = toast.loading("Eliminando...");
    const success: boolean = await baseDeleteConfirm(
      (id: string) => productService.deleteProduct(id),
      () => {
        reload();
      },
    );
    if (success && deleteTarget) {
      toast.update(toastId, { autoClose: 3000, isLoading: false, render: `${deleteTarget.label} eliminado`, type: "success" });
    } else if (!success) {
      toast.update(toastId, { autoClose: 3000, isLoading: false, render: "Error al eliminar producto", type: "error" });
    }
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
      onSearchChange={setSearch}
      onToggleEnabled={handleToggleEnabled}
      search={search}
      togglingIds={togglingIds}
    />
  );
};

export default AdminProductList;
