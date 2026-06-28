import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useErrorNotification } from "../../../hooks/useErrorNotification";
import useOrders from "../../../hooks/useOrders";
import { type Order, type OrderStatusValue, OrderStatus } from "../../../models/Order";
import AdminOrderList from "./AdminOrderList";

const statusOptions: OrderStatusValue[] = [OrderStatus.Pendiente, OrderStatus.Completado, OrderStatus.Cancelado];

const AdminOrderListContainer: React.FC = () => {
  const { deleteOrder, error, fetchAllOrders, updateOrderStatus, isLoading } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState<Map<string, string>>(new Map());

  useErrorNotification(error);

  useEffect((): void => {
    fetchAllOrders().then(setOrders);
  }, [fetchAllOrders]);

  const toggleExpand: (id: string) => void = useCallback((id: string): void => {
    setExpandedId((prev: string | null) => (prev === id ? null : id));
  }, []);

  const handleApprove: (id: string) => Promise<void> = useCallback(
    async (id: string): Promise<void> => {
      const toastId: string | number = toast.loading("Aprobando pedido...");
      setActionLoading((prev: Map<string, string>) => new Map(prev).set(id, "approve"));
      try {
        await Promise.all([
          updateOrderStatus(id, OrderStatus.Completado),
          new Promise<void>((resolve) => {
            setTimeout(resolve, 800);
          }),
        ]);
        setOrders((prev: Order[]) => prev.map((o: Order) => (o.id === id ? { ...o, status: OrderStatus.Completado, updatedAt: new Date().toISOString() } : o)));
        toast.update(toastId, { autoClose: 3000, isLoading: false, render: "Pedido aprobado", type: "success" });
      } catch {
        toast.update(toastId, { autoClose: 3000, isLoading: false, render: "Error al aprobar pedido", type: "error" });
      } finally {
        setActionLoading((prev: Map<string, string>) => {
          const next: Map<string, string> = new Map(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [updateOrderStatus],
  );

  const handleReject: (id: string) => Promise<void> = useCallback(
    async (id: string): Promise<void> => {
      const toastId: string | number = toast.loading("Rechazando pedido...");
      setActionLoading((prev: Map<string, string>) => new Map(prev).set(id, "reject"));
      try {
        await Promise.all([
          updateOrderStatus(id, OrderStatus.Cancelado),
          new Promise<void>((resolve) => {
            setTimeout(resolve, 800);
          }),
        ]);
        setOrders((prev: Order[]) => prev.map((o: Order) => (o.id === id ? { ...o, status: OrderStatus.Cancelado, updatedAt: new Date().toISOString() } : o)));
        toast.update(toastId, { autoClose: 3000, isLoading: false, render: "Pedido rechazado", type: "info" });
      } catch {
        toast.update(toastId, { autoClose: 3000, isLoading: false, render: "Error al rechazar pedido", type: "error" });
      } finally {
        setActionLoading((prev: Map<string, string>) => {
          const next: Map<string, string> = new Map(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [updateOrderStatus],
  );

  const handleDeleteConfirm: () => Promise<void> = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }
    const toastId: string | number = toast.loading("Eliminando pedido...");
    setDeleting(true);
    try {
      await deleteOrder(deleteTarget);
      setOrders((prev: Order[]) => prev.filter((o: Order) => o.id !== deleteTarget));
      toast.update(toastId, { autoClose: 3000, isLoading: false, render: "Pedido eliminado", type: "success" });
    } catch {
      toast.update(toastId, { autoClose: 3000, isLoading: false, render: "Error al eliminar pedido", type: "error" });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteOrder]);

  return (
    <AdminOrderList
      actionLoading={actionLoading}
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
