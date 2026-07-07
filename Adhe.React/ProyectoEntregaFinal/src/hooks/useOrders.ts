import { useCallback } from "react";

import type { CreateOrderPayload, Order } from "../models";
import type { OrderStatusValue } from "../models/Order";

import { orderService } from "../services/orderService";
import useAsyncAction from "./useAsyncAction";

interface UseOrdersReturn {
  error: string | null;
  isLoading: boolean;
  checkout: (payload: CreateOrderPayload) => Promise<string>;
  deleteOrder: (id: string) => Promise<void>;
  fetchAllOrders: () => Promise<Order[]>;
  fetchOrderById: (id: string) => Promise<Order | null>;
  fetchUserOrders: (userId: string) => Promise<Order[]>;
  updateOrderStatus: (id: string, status: OrderStatusValue) => Promise<void>;
}

const useOrders: () => UseOrdersReturn = (): UseOrdersReturn => {
  const { execute, executeWithFallback, executeSilent, error, isLoading } = useAsyncAction("Error en operación");

  const checkout: (payload: CreateOrderPayload) => Promise<string> = useCallback(
    (payload: CreateOrderPayload): Promise<string> => execute(() => orderService.createOrder(payload), "Error al procesar la compra"),
    [execute],
  );

  const fetchUserOrders: (userId: string) => Promise<Order[]> = useCallback(
    (userId: string): Promise<Order[]> => executeWithFallback(() => orderService.fetchUserOrders(userId), [], "Error al obtener pedidos"),
    [executeWithFallback],
  );

  const fetchAllOrders: () => Promise<Order[]> = useCallback(
    (): Promise<Order[]> => executeWithFallback(() => orderService.fetchAllOrders(), [], "Error al obtener pedidos"),
    [executeWithFallback],
  );

  const fetchOrderById: (id: string) => Promise<Order | null> = useCallback(
    (id: string): Promise<Order | null> => executeSilent(() => orderService.fetchOrderById(id), null, "Error al obtener pedido") as Promise<Order | null>,
    [executeSilent],
  );

  const deleteOrder: (id: string) => Promise<void> = useCallback(
    (id: string): Promise<void> => executeSilent(() => orderService.deleteOrder(id), undefined, "Error al eliminar pedido") as Promise<void>,
    [executeSilent],
  );

  const updateOrderStatus: (id: string, status: OrderStatusValue) => Promise<void> = useCallback(
    (id: string, status: OrderStatusValue): Promise<void> => execute(() => orderService.updateOrderStatus(id, status), "Error al actualizar pedido"),
    [execute],
  );

  return { deleteOrder, error, isLoading, checkout, fetchAllOrders, fetchOrderById, fetchUserOrders, updateOrderStatus };
};

export default useOrders;
