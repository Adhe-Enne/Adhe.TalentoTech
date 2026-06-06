import React, { useMemo, useState } from "react";

import type { Product } from "../../../models";

import adminStyles from "./AdminProductList.module.css";

interface AdminProductListProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string, name: string) => void;
  onToggleEnabled: (id: string, current: boolean) => void;
  onEdit: (id: string) => void;
  onRetry: () => void;
}

const AdminProductList: React.FC<AdminProductListProps> = (props) => {
  const { products, loading, error, onDelete, onToggleEnabled, onEdit, onRetry } = props;
  const [search, setSearch] = useState("");

  const filtered: Product[] = useMemo(
    () => products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase())),
    [products, search],
  );

  if (loading) {
    return (
      <div aria-busy="true" className="d-flex justify-content-center py-5">
        <div aria-hidden="true" className="spinner-border" />
        <output aria-live="polite" className="visually-hidden">Cargando productos...</output>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center gap-2">
        <span>{error}</span>
        <button className="btn btn-sm btn-outline-danger ms-auto" onClick={onRetry}>Reintentar</button>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Productos</h3>
        <input
          className="form-control form-control-sm"
          placeholder="Buscar por nombre..."
          style={{ maxWidth: 260, borderRadius: 999 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="alert alert-info text-center py-4">
          {search ? "No se encontraron productos con ese nombre." : "No hay productos disponibles."}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th style={{ width: 56 }}></th>
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
                <tr key={p.id} className={adminStyles.productRow}>
                  <td>
                    <img
                      alt={p.name}
                      className="rounded"
                      src={p.image}
                      style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }}
                    />
                  </td>
                  <td className="fw-semibold">{p.name}</td>
                  <td className="text-primary fw-bold">${p.price.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>{p.category?.name ?? "Sin categoria"}</td>
                  <td>
                    <button
                      aria-checked={p.isEnabled}
                      aria-label={`${p.isEnabled ? "Desactivar" : "Activar"} ${p.name}`}
                      className={adminStyles.toggle}
                      onClick={() => onToggleEnabled(p.id, p.isEnabled)}
                      role="switch"
                    />
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        aria-label={`Editar ${p.name}`}
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(p.id)}
                      >
                        Editar
                      </button>
                      <button
                        aria-label={`Eliminar ${p.name}`}
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(p.id, p.name)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductList;
