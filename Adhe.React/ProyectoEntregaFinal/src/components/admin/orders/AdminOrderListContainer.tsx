import React, { useCallback, useEffect, useState } from "react";

import useNotification from "../../../hooks/selectors/useNotification";
import { useErrorNotification } from "../../../hooks/useErrorNotification";
import useOrders from "../../../hooks/useOrders";
import { type Order, type OrderStatusValue, OrderStatus } from "../../../models/Order";
import AdminOrderList from "./AdminOrderList";

const statusOptions: OrderStatusValue[] = [OrderStatus.Pendiente, OrderStatus.Completado, OrderStatus.Cancelado];

const AdminOrderListContainer: React.FC = () => {
  const { setNotification } = useNotification();
  const { deleteOrder, error, fetchAllOrders, updateOrderStatus, isLoading } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useErrorNotification(error);

  useEffect((): void => {
    fetchAllOrders().then(setOrders);
  }, [fetchAllOrders]);

  const toggleExpand: (id: string) => void = useCallback((id: string): void => {
    setExpandedId((prev: string | null) => (prev === id ? null : id));
  }, []);

  const handleApprove: (id: string) => Promise<void> = useCallback(
    async (id: string): Promise<void> => {
      await updateOrderStatus(id, OrderStatus.Completado);
      setOrders((prev: Order[]) => prev.map((o: Order) => (o.id === id ? { ...o, status: OrderStatus.Completado, updatedAt: new Date().toISOString() } : o)));
    },
    [updateOrderStatus],
  );

  const handleReject: (id: string) => Promise<void> = useCallback(
    async (id: string): Promise<void> => {
      await updateOrderStatus(id, OrderStatus.Cancelado);
      setOrders((prev: Order[]) => prev.map((o: Order) => (o.id === id ? { ...o, status: OrderStatus.Cancelado, updatedAt: new Date().toISOString() } : o)));
    },
    [updateOrderStatus],
  );

  const handleDeleteConfirm: () => Promise<void> = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }
    setDeleting(true);
    try {
      await deleteOrder(deleteTarget);
      setOrders((prev: Order[]) => prev.filter((o: Order) => o.id !== deleteTarget));
      setNotification("Pedido eliminado", 3000, "success");
    } catch {
      setNotification("Error al eliminar pedido", 3000, "danger");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteOrder, setNotification]);

  return (
    <AdminOrderList
      deleteTarget={deleteTarget}
      deleting={deleting}
      expandedId={expandedId}
      filter={filter}
      isLoading={isLoading}
      onApprove={handleApprove}
      onDeleteCancel={() => setDeleteTarget(null)}
      onDeleteConfirm={handleDeleteConfirm}
      onDeleteRequest={(id: string) => setDeleteTarget(id)}
      onReject={handleReject}
      onStatusChange={setFilter}
      onToggleExpand={toggleExpand}
      orders={orders}
      statusOptions={statusOptions}
    />
  );
};

export default AdminOrderListContainer;
