import { useCallback, useState } from "react";

import type { CreateOrderPayload, Order } from "../models";
import type { OrderStatusValue } from "../models/Order";

import { orderService } from "../services/orderService";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkout: (payload: CreateOrderPayload) => Promise<string> = useCallback(async (payload: CreateOrderPayload): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      return await orderService.createOrder(payload);
    } catch (err: unknown) {
      const msg: string = err instanceof Error ? err.message : "Error al procesar la compra";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUserOrders: (userId: string) => Promise<Order[]> = useCallback(async (userId: string): Promise<Order[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await orderService.fetchUserOrders(userId);
    } catch (err: unknown) {
      const msg: string = err instanceof Error ? err.message : "Error al obtener pedidos";
      setError(msg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllOrders: () => Promise<Order[]> = useCallback(async (): Promise<Order[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await orderService.fetchAllOrders();
    } catch (err: unknown) {
      const msg: string = err instanceof Error ? err.message : "Error al obtener pedidos";
      setError(msg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOrderById: (id: string) => Promise<Order | null> = useCallback(async (id: string): Promise<Order | null> => {
    setError(null);
    try {
      return await orderService.fetchOrderById(id);
    } catch (err: unknown) {
      const msg: string = err instanceof Error ? err.message : "Error al obtener pedido";
      setError(msg);
      return null;
    }
  }, []);

  const deleteOrder: (id: string) => Promise<void> = useCallback(async (id: string): Promise<void> => {
    setError(null);
    try {
      await orderService.deleteOrder(id);
    } catch (err: unknown) {
      const msg: string = err instanceof Error ? err.message : "Error al eliminar pedido";
      setError(msg);
    }
  }, []);

  const updateOrderStatus: (id: string, status: OrderStatusValue) => Promise<void> = useCallback(async (id: string, status: OrderStatusValue): Promise<void> => {
    setError(null);
    try {
      await orderService.updateOrderStatus(id, status);
    } catch (err: unknown) {
      const msg: string = err instanceof Error ? err.message : "Error al actualizar pedido";
      setError(msg);
    }
  }, []);

  return { deleteOrder, error, isLoading, checkout, fetchAllOrders, fetchOrderById, fetchUserOrders, updateOrderStatus };
};

export default useOrders;
