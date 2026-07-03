import type { BaseEntity } from "./BaseEntity";
import type { OrderItem } from "./OrderItem";
import type { ShippingInfo } from "./ShippingInfo";

export const OrderStatus: Record<string, string> = {
  Pendiente: "Pendiente",
  Completado: "Completo",
  Cancelado: "Cancelado",
} as const;

export type OrderStatusValue = (typeof OrderStatus)[keyof typeof OrderStatus];

export const ORDER_STATUS_LABELS: Record<OrderStatusValue, string> = {
  [OrderStatus.Pendiente]: "Pendiente",
  [OrderStatus.Completado]: "Completo",
  [OrderStatus.Cancelado]: "Cancelado",
};

export interface Order extends BaseEntity {
  baseCurrency: string;
  currency: string;
  discount: number;
  exchangeRate: number;
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  status: OrderStatusValue;
  subtotal: number;
  total: number;
  totalInBase: number;
  userEmail: string;
  userId: string;
  couponId?: string | null;
  discountCode?: string | null;
}
export type CreateOrderPayload = Omit<Order, "id" | "createdAt" | "updatedAt">;
