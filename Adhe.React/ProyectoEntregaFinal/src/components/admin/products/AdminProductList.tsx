import React, { useMemo, useState } from "react";
import { Alert, Button, Spinner, Table } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

import type { Product } from "../../../models";

import adminStyles from "./AdminProductList.module.css";

interface AdminProductListProps {
  error: string | null;
  loading: boolean;
  products: Product[];
  onDelete: (id: string, name: string) => void;
  onEdit: (id: string) => void;
  onRetry: () => void;
  onToggleEnabled: (id: string, current: boolean) => void;
}

const AdminProductList: React.FC<AdminProductListProps> = (props) => {
  const { products, loading, error, onDelete, onToggleEnabled, onEdit, onRetry } = props;
  const [search, setSearch] = useState("");

  const filtered: Product[] = useMemo(() => products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase())), [products, search]);

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

  if (error) {
    return (
      <Alert className="d-flex align-items-center gap-2" variant="danger">
        <span>{error}</span>
        <Button className="ms-auto" onClick={onRetry} size="sm" variant="outline-danger">
          Reintentar
        </Button>
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Productos</h3>
        <div className="d-flex gap-2 align-items-center">
          <Link className="btn btn-success btn-sm" to="/admin/productos/nuevo">
            + Nuevo producto
          </Link>
          <input
          aria-label="Buscar productos por nombre"
          className="form-control form-control-sm"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre..."
          style={{ maxWidth: 260, borderRadius: 999 }}
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
                <tr className={adminStyles.productRow} key={p.id}>
                  <td>
                    <img alt={p.name} className="rounded" src={p.image} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} />
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
                      <Button aria-label={`Editar ${p.name}`} onClick={() => onEdit(p.id)} size="sm" variant="outline-primary">
                        <FaEdit className="me-1" />
                        Editar
                      </Button>
                      <Button aria-label={`Eliminar ${p.name}`} onClick={() => onDelete(p.id, p.name)} size="sm" variant="outline-danger">
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
    </div>
  );
};

export default AdminProductList;
