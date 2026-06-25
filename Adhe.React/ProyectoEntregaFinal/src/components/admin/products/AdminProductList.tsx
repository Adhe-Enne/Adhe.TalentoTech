import React, { useCallback, useMemo, useState } from "react";
import { Alert, Button, Spinner, Table } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Link, useNavigate, type NavigateFunction } from "react-router-dom";

import type { Product } from "../../../models";

import useNotification from "../../../hooks/selectors/useNotification";
import useProducts from "../../../hooks/selectors/useProducts";
import useConfirmDelete from "../../../hooks/useConfirmDelete";
import { productService } from "../../../services/productService";
import ConfirmDialog from "../../ui/ConfirmDialog";
import ToggleSwitch from "../../ui/ToggleSwitch";
import adminStyles from "./AdminProductList.module.css";

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

  if (loading) {
    return (
      <div aria-busy="true" className="d-flex justify-content-center py-5">
        <Spinner animation="border" aria-hidden="true" />
        <output aria-live="polite" className="visually-hidden">
          Cargando productos...
        </output>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Productos</h3>
        <div className="d-flex gap-2 align-items-center">
          <Link aria-label="Crear nuevo producto" className="btn btn-success btn-sm" to="/admin/productos/nuevo">
            <FaPlus aria-hidden="true" className="me-1" />
            Nuevo producto
          </Link>
          <input
            aria-label="Buscar productos por nombre"
            className={`form-control form-control-sm ${adminStyles.searchInput}`}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            value={search}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Alert className="text-center py-4" variant="info">
          {search ? "No se encontraron productos con ese nombre." : "No hay productos disponibles."}
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table className="align-middle" hover>
            <thead>
              <tr>
                <th className={adminStyles.thumbCol} />
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoria</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr className={adminStyles.productRow} key={p.id}>
                  <td>
                    <img alt={p.name} className={`rounded ${adminStyles.thumb}`} src={p.image} />
                  </td>
                  <td className="fw-semibold">{p.name}</td>
                  <td className="text-primary fw-bold">${p.price.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>{p.category?.name ?? "Sin categoria"}</td>
                  <td>
                    <ToggleSwitch checked={p.isEnabled} label={`${p.isEnabled ? "Desactivar" : "Activar"} ${p.name}`} onToggle={() => handleToggleEnabled(p.id, p.isEnabled)} />
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button aria-label={`Editar ${p.name}`} onClick={() => navigate(`/admin/productos/${p.id}/editar`)} size="sm" variant="outline-primary">
                        <FaEdit className="me-1" />
                        Editar
                      </Button>
                      <Button aria-label={`Eliminar ${p.name}`} onClick={() => handleDeleteRequest(p.id, p.name)} size="sm" variant="outline-danger">
                        <FaTrash className="me-1" />
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        confirmLabel="Eliminar"
        confirmVariant="danger"
        loading={deleting}
        message={`¿Eliminar "${deleteTarget?.label}"? No se podrá deshacer.`}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={deleteTarget !== null}
        title="Eliminar producto"
      />
    </div>
  );
};

export default AdminProductList;
