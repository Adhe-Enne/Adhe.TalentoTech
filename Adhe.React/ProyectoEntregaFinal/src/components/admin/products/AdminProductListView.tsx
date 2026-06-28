import React from "react";
import { Alert, Button, Spinner, Table } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

import type { Product } from "../../../models";

import { formatPrice } from "../../../utils/format";
import ConfirmDialog from "../../ui/ConfirmDialog";
import ToggleSwitch from "../../ui/ToggleSwitch";
import adminStyles from "./AdminProductList.module.css";

interface DeleteTarget {
  id: string;
  label: string;
}

interface AdminProductListViewProps {
  deleteTarget: DeleteTarget | null;
  deleting: boolean;
  filtered: Product[];
  loading: boolean;
  search: string;
  togglingIds: Set<string>;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  onDeleteRequest: (id: string, label: string) => void;
  onEdit: (id: string) => void;
  onSearchChange: (value: string) => void;
  onToggleEnabled: (id: string, current: boolean) => void;
}

const AdminProductListView: React.FC<AdminProductListViewProps> = (props) => {
  const { deleting, deleteTarget, filtered, loading, search, togglingIds, onDeleteCancel, onDeleteConfirm, onDeleteRequest, onEdit, onSearchChange, onToggleEnabled } = props;

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
            onChange={(e) => onSearchChange(e.target.value)}
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
                  <td className="text-primary fw-bold">{formatPrice(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>{p.category?.name ?? "Sin categoria"}</td>
                  <td>
                    <ToggleSwitch checked={p.isEnabled} label={`${p.isEnabled ? "Desactivar" : "Activar"} ${p.name}`} loading={togglingIds.has(p.id)} onToggle={() => onToggleEnabled(p.id, p.isEnabled)} />
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button aria-label={`Editar ${p.name}`} onClick={() => onEdit(p.id)} size="sm" variant="outline-primary">
                        <FaEdit className="me-1" />
                        Editar
                      </Button>
                      <Button aria-label={`Eliminar ${p.name}`} onClick={() => onDeleteRequest(p.id, p.name)} size="sm" variant="outline-danger">
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
        onCancel={onDeleteCancel}
        onConfirm={onDeleteConfirm}
        open={deleteTarget !== null}
        title="Eliminar producto"
      />
    </div>
  );
};

export default AdminProductListView;
