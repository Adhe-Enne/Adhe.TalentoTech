import type { Order } from "../models";

export type ComputedMetrics = {
  totalProducts: number;
  activeProducts: number;
  totalCoupons: number;
  activeCoupons: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  completedOrdersList: Order[];
  totalRevenueUSD: number;
  aovUSD: number;
  totalDiscountsUSD: number;
  completionRate: number;
  uniqueCustomers: number;
  lowStockProducts: number;
  inventoryValueUSD: number;
};
