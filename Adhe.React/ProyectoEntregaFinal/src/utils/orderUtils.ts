import { OrderStatus, type OrderStatusValue } from "../models/Order";

export const ORDER_STATUS_VARIANT: Record<OrderStatusValue, string> = {
  [OrderStatus.Completado]: "success",
  [OrderStatus.Cancelado]: "danger",
  [OrderStatus.Pendiente]: "warning",
};
