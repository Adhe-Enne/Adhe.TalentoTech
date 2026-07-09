import React from "react";
import { FaCheck, FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";

import { type Order, ORDER_STATUS_LABELS, OrderStatus } from "../../../models/Order";
import { formatPrice } from "../../../utils/format";
import { ORDER_STATUS_OPTIONS, ORDER_STATUS_VARIANT } from "../../../utils/orderUtils";
import OrderItemRow from "../../orders/OrderItemRow";
import ConfirmDialog from "../../ui/ConfirmDialog";
import DeleteButton from "../../ui/DeleteButton";
import HelmetMeta from "../../ui/HelmetMeta";
import ListStateDisplay from "../../ui/ListStateDisplay";
import PageHeader from "../../ui/PageHeader";
import RefreshButton from "../../ui/RefreshButton";

interface AdminOrderListViewProps {
  actionLoading: Map<string, string>;
  deleteTarget: string | null;
  deleting: boolean;
  expandedId: string | null;
  filter: string;
  isLoading: boolean;
  orders: Order[];
  onApprove: (id: string) => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  onDeleteRequest: (id: string) => void;
  onRefresh: () => void;
  onReject: (id: string) => void;
  onStatusChange: (filter: string) => void;
  onToggleExpand: (id: string) => void;
}

const AdminOrderListView: React.FC<AdminOrderListViewProps> = (props) => {
  const { actionLoading, orders, filter, isLoading, expandedId, deleteTarget, deleting, onStatusChange, onToggleExpand, onApprove, onReject, onDeleteRequest, onDeleteCancel, onDeleteConfirm, onRefresh } = props;

  const filtered: Order[] = filter === "all" ? orders : orders.filter((o: Order) => o.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <HelmetMeta description="Administración de pedidos en Talento Tech." title="Talento Tech | Admin Pedidos" />
      <PageHeader title="Pedidos">
        <RefreshButton loading={isLoading} onRefresh={onRefresh} />
      </PageHeader>

      <select aria-label="Filtrar por estado" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-accent focus:border-accent mb-3 w-auto" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onStatusChange(e.target.value)} value={filter}>
        <option value="all">Todos</option>
        {ORDER_STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {ORDER_STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      <ListStateDisplay error={null} loading={isLoading} loadingMessage="Cargando pedidos...">
        {filtered.length === 0 ? (
          <p className="text-gray-500">No hay pedidos.</p>
        ) : (
          <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg">
            {filtered.map((order: Order) => (
              <div className="p-3" key={order.id}>
                <button
                  aria-label={`Orden ${order.id.slice(-8).toUpperCase()} - ${ORDER_STATUS_LABELS[order.status]}`}
                  className={`flex items-center justify-between w-full text-left bg-transparent border-0 p-0 bg-transparent border-0 cursor-pointer p-0 text-left w-full`}
                  onClick={() => onToggleExpand(order.id)}
                  type="button"
                >
                  <div>
                    <strong>#{order.id.slice(-8).toUpperCase()}</strong>
                    <div className="text-gray-500 text-sm">
                      {order.userEmail} - {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      (ORDER_STATUS_VARIANT[order.status] ?? "secondary") === "success" ? "bg-success/10 text-success" :
                      (ORDER_STATUS_VARIANT[order.status] ?? "secondary") === "warning" ? "bg-warning/10 text-warning" :
                      (ORDER_STATUS_VARIANT[order.status] ?? "secondary") === "danger" ? "bg-danger/10 text-danger" :
                      (ORDER_STATUS_VARIANT[order.status] ?? "secondary") === "info" ? "bg-info/10 text-info" :
                      "bg-gray-100 text-gray-800"
                    }`}>{ORDER_STATUS_LABELS[order.status]}</span>
                    <span>{formatPrice(order.total, order.currency)}</span>
                    {expandedId === order.id ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </button>

                {expandedId === order.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    {order.items.map((item) => (
                      <OrderItemRow item={item} key={item.productId} />
                    ))}
                    {order.shippingInfo && (
                      <div className="text-sm text-gray-500 mt-2">
                        <strong>Envio:</strong> {order.shippingInfo.fullName} - {order.shippingInfo.address}, {order.shippingInfo.city}
                      </div>
                    )}
                    {order.discount > 0 && (
                      <div className="text-sm text-success mt-1">
                        Descuento{order.discountCode ? ` (${order.discountCode})` : ""}: -{formatPrice(order.discount, order.currency)}
                      </div>
                    )}
                    {order.status === OrderStatus.Pendiente && (
                      <div className="flex gap-2 mt-2">
                        <button aria-label="Aprobar pedido" className="bg-success text-white px-3 py-1.5 rounded-lg text-sm hover:opacity-90 disabled:opacity-50" disabled={actionLoading.has(order.id)} onClick={() => onApprove(order.id)}>
                          {actionLoading.get(order.id) === "approve" ? (
                            <>
                              <span className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-accent rounded-full inline-block align-middle mr-1" /> Procesando...
                            </>
                          ) : (
                            <>
                              <FaCheck className="mr-1" />
                              Aprobar
                            </>
                          )}
                        </button>
                        <button aria-label="Rechazar pedido" className="bg-danger text-white px-3 py-1.5 rounded-lg text-sm hover:opacity-90 disabled:opacity-50" disabled={actionLoading.has(order.id)} onClick={() => onReject(order.id)}>
                          {actionLoading.get(order.id) === "reject" ? (
                            <>
                              <span className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-accent rounded-full inline-block align-middle mr-1" /> Procesando...
                            </>
                          ) : (
                            <>
                              <FaTimes className="mr-1" />
                              Rechazar
                            </>
                          )}
                        </button>
                        <DeleteButton aria-label="Eliminar pedido" disabled={actionLoading.has(order.id)} onClick={() => onDeleteRequest(order.id)} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ListStateDisplay>

      <ConfirmDialog
        loading={deleting}
        message="Esta accion no se puede deshacer."
        onCancel={onDeleteCancel}
        onConfirm={onDeleteConfirm}
        open={deleteTarget !== null}
        title="Eliminar pedido"
      />
    </div>
  );
};

export default AdminOrderListView;
