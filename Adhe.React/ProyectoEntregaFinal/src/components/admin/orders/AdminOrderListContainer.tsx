import React, { useCallback, useEffect, useState } from "react";

import { useErrorNotification } from "../../../hooks/useErrorNotification";
import useExpandable from "../../../hooks/useExpandable";
import useOrders from "../../../hooks/useOrders";
import { type Order, type OrderStatusValue, OrderStatus } from "../../../models/Order";
import { withDelay, withToast } from "../../../utils/withToast";
import AdminOrderListView from "./AdminOrderListView";

const AdminOrderListContainer: React.FC = () => {
  const { deleteOrder, error, fetchAllOrders, updateOrderStatus, isLoading } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const { expandedId, toggleExpand } = useExpandable();
  const [filter, setFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState<Map<string, string>>(new Map());

  useErrorNotification(error);

  const handleRefresh: () => void = useCallback((): void => {
    fetchAllOrders()
      .then(setOrders)
      .catch((): void => {
        /* error handled by useErrorNotification */
      });
  }, [fetchAllOrders]);

  useEffect((): void => {
    handleRefresh();
  }, [handleRefresh]);

  const handleStatusChange: (id: string, status: OrderStatusValue, actionLabel: string, pastLabel: string) => Promise<void> = useCallback(
    async (id: string, status: OrderStatusValue, actionLabel: string, pastLabel: string): Promise<void> => {
      const action: string = status === OrderStatus.Completado ? "approve" : "reject";
      setActionLoading((prev: Map<string, string>) => new Map(prev).set(id, action));
      await withToast(() => withDelay(updateOrderStatus(id, status)), `${actionLabel} pedido...`, `Pedido ${pastLabel}`, `Error al ${actionLabel.toLowerCase()} pedido`);
      setOrders((prev: Order[]) => prev.map((o: Order) => (o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o)));
      setActionLoading((prev: Map<string, string>) => {
        const next: Map<string, string> = new Map(prev);
        next.delete(id);
        return next;
      });
    },
    [updateOrderStatus],
  );

  const handleDeleteConfirm: () => Promise<void> = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }
    setDeleting(true);
    await withToast(() => deleteOrder(deleteTarget), "Eliminando pedido...", "Pedido eliminado", "Error al eliminar pedido");
    setOrders((prev: Order[]) => prev.filter((o: Order) => o.id !== deleteTarget));
    setDeleting(false);
    setDeleteTarget(null);
  }, [deleteTarget, deleteOrder]);

  return (
    <AdminOrderListView
      actionLoading={actionLoading}
      deleteTarget={deleteTarget}
      deleting={deleting}
      expandedId={expandedId}
      filter={filter}
      isLoading={isLoading}
      onApprove={(id: string) => handleStatusChange(id, OrderStatus.Completado, "Aprobando", "aprobado")}
      onDeleteCancel={() => setDeleteTarget(null)}
      onDeleteConfirm={handleDeleteConfirm}
      onDeleteRequest={(id: string) => setDeleteTarget(id)}
      onRefresh={handleRefresh}
      onReject={(id: string) => handleStatusChange(id, OrderStatus.Cancelado, "Rechazando", "rechazado")}
      onStatusChange={setFilter}
      onToggleExpand={toggleExpand}
      orders={orders}
    />
  );
};

export default AdminOrderListContainer;
