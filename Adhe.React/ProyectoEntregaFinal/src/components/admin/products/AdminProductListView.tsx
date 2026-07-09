import React from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

import type { Product } from "../../../models";

import { formatPrice } from "../../../utils/format";
import ConfirmDialog from "../../ui/ConfirmDialog";
import DeleteButton from "../../ui/DeleteButton";
import LoadingSpinner from "../../ui/LoadingSpinner";
import RefreshButton from "../../ui/RefreshButton";
import ToggleSwitch from "../../ui/ToggleSwitch";

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
  onRefresh: () => void;
  onSearchChange: (value: string) => void;
  onToggleEnabled: (id: string, current: boolean) => void;
}

const AdminProductListView: React.FC<AdminProductListViewProps> = (props) => {
  const { deleting, deleteTarget, filtered, loading, onRefresh, search, togglingIds, onDeleteCancel, onDeleteConfirm, onDeleteRequest, onEdit, onSearchChange, onToggleEnabled } = props;

  if (loading) {
    return <LoadingSpinner message="Cargando productos..." />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="mb-0">Productos</h3>
        <div className="flex gap-2 items-center">
          <Link aria-label="Crear nuevo producto" className="inline-flex items-center gap-2 bg-success text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 whitespace-nowrap transition-colors" to="/admin/productos/nuevo">
            <FaPlus aria-hidden="true" />
            Nuevo producto
          </Link>
          <input
          aria-label="Buscar productos por nombre"
             className="w-full px-3 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-accent focus:border-accent max-w-[260px]"
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre..."
            value={search}
          />
          <RefreshButton loading={loading} onRefresh={onRefresh} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-info/10 border border-info/20 text-info text-center py-4 rounded-lg" role="alert">
          {search ? "No se encontraron productos con ese nombre." : "No hay productos disponibles."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="w-14" />
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((p) => (
                <tr className="hover:bg-accent/[0.02]" key={p.id}>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <img alt={p.name} className="w-12 h-12 object-cover rounded-lg" src={p.image} />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">{p.name}</td>
                  <td className="px-3 py-2 whitespace-nowrap font-semibold text-emerald-600">{formatPrice(p.price, p.currency)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">{p.stock}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">{p.category?.name ?? "Sin categoria"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <ToggleSwitch checked={p.isEnabled} label={`${p.isEnabled ? "Desactivar" : "Activar"} ${p.name}`} loading={togglingIds.has(p.id)} onToggle={() => onToggleEnabled(p.id, p.isEnabled)} />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex gap-1">
                      <button aria-label={`Editar ${p.name}`} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1.5 rounded-lg text-sm hover:bg-blue-100 hover:border-blue-300 transition-colors" onClick={() => onEdit(p.id)}>
                        <FaEdit />
                        Editar
                      </button>
                      <DeleteButton aria-label={`Eliminar ${p.name}`} onClick={() => onDeleteRequest(p.id, p.name)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
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
