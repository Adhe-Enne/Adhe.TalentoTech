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
  totalRevenue: number;
  totalRevenueUSD: number;
  aov: number; // Average Order Value (mixed currency — legacy)
  aovUSD: number; // Average Order Value in USD
  totalDiscounts: number; // Original currency sum (legacy)
  totalDiscountsUSD: number; // Discounts converted to USD
  completionRate: number; // Percentage of completed orders
  uniqueCustomers: number; // Count of unique customers based on email
  lowStockProducts: number; // Count of products with stock < 5
  inventoryValue: number; // Total value of inventory (price * stock) — original currencies
  inventoryValueUSD: number; // Inventory value converted to USD
  hasMixedInventoryCurrencies: boolean; // Whether products have different currencies
};
