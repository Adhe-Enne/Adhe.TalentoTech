import type { JSX } from "react";

import { useMemo } from "react";
import { FaBox, FaBoxOpen, FaChartLine, FaClipboardList, FaDollarSign, FaExclamationTriangle, FaMoneyBillWave, FaPercentage, FaTag, FaUsers } from "react-icons/fa";

import type { Coupon, Order, Product } from "../models";
import type { ComputedMetrics } from "../types";

import { OrderStatus } from "../models/Order";
import { formatPrice } from "../utils/format";

type MetricVariant = "primary" | "success" | "warning" | "danger" | "info";

interface MetricItem {
  icon: JSX.Element;
  label: string;
  value: string;
  link?: string;
  subtitle?: string;
  variant?: MetricVariant;
}

interface UseDashboardMetricsResult {
  computed: ComputedMetrics;
  metrics: MetricItem[];
}

const useDashboardMetrics: (products: Product[], coupons: Coupon[], orders: Order[], rates: Record<string, number>) => UseDashboardMetricsResult = (
  products: Product[],
  coupons: Coupon[],
  orders: Order[],
  rates: Record<string, number>,
): UseDashboardMetricsResult => {
  const computed: ComputedMetrics = useMemo(() => {
    const totalProducts: number = products?.length ?? 0;
    const activeProducts: number = products?.filter((p: Product) => p.isEnabled).length ?? 0;
    const totalCoupons: number = coupons.length;
    const activeCoupons: number = coupons.filter((c: Coupon) => c.isEnabled).length;
    const totalOrders: number = orders.length;
    const pendingOrders: number = orders.filter((o: Order) => o.status === OrderStatus.Pendiente).length;
    const completedOrders: number = orders.filter((o: Order) => o.status === OrderStatus.Completado).length;
    const cancelledOrders: number = orders.filter((o: Order) => o.status === OrderStatus.Cancelado).length;
    const completedOrdersList: Order[] = orders.filter((o: Order) => o.status === OrderStatus.Completado);
    const totalRevenueUSD: number = completedOrdersList.reduce((s: number, o: Order) => s + (o.totalInBase ?? o.total), 0);
    const completionRate: number = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
    const uniqueCustomers: number = new Set(orders.map((o: Order) => o.userEmail)).size;
    const lowStockProducts: number = products?.filter((p: Product) => p.stock < 5).length ?? 0;
    const inventoryValueUSD: number =
      products?.reduce((s: number, p: Product) => {
        const currency: string = p.currency ?? "USD";
        const rate: number = rates[currency] ?? 1;
        return s + (p.price * p.stock) / rate;
      }, 0) ?? 0;

    const aovUSD: number = completedOrdersList.length > 0 ? totalRevenueUSD / completedOrdersList.length : 0;

    const totalDiscountsUSD: number = orders.reduce((s: number, o: Order) => {
      return s + (o.discount ?? 0) * (o.exchangeRate ?? 1);
    }, 0);

    return {
      totalProducts,
      activeProducts,
      totalCoupons,
      activeCoupons,
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      completedOrdersList,
      totalRevenueUSD,
      aovUSD,
      totalDiscountsUSD,
      completionRate,
      uniqueCustomers,
      lowStockProducts,
      inventoryValueUSD,
    };
  }, [products, coupons, orders, rates]);

  const metrics: MetricItem[] = useMemo(() => {
    const {
      totalProducts,
      activeProducts,
      totalCoupons,
      activeCoupons,
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      completedOrdersList,
      totalRevenueUSD,
      aovUSD,
      totalDiscountsUSD,
      completionRate,
      uniqueCustomers,
      lowStockProducts,
      inventoryValueUSD,
    } = computed;

    return [
      {
        label: "Productos",
        value: String(totalProducts),
        icon: <FaBox />,
        link: "/admin/productos",
        subtitle: `${activeProducts} activos · ${totalProducts - activeProducts} inactivos`,
      },
      {
        label: "Cupones",
        value: String(totalCoupons),
        icon: <FaTag />,
        link: "/admin/cupones",
        subtitle: `${activeCoupons} activos · ${totalCoupons - activeCoupons} inactivos`,
      },
      {
        label: "Pedidos",
        value: String(totalOrders),
        icon: <FaClipboardList />,
        link: "/admin/ordenes",
        subtitle: `✅ ${completedOrders} completados · ⏳ ${pendingOrders} pendientes · ❌ ${cancelledOrders} cancelados — ${completionRate.toFixed(1)}% tasa`,
      },
      { label: "Ingresos Totales (USD)", value: `${formatPrice(totalRevenueUSD, "USD")}`, icon: <FaDollarSign />, subtitle: "Todo convertido a USD" },
      { label: "Ticket Promedio (USD)", value: `${formatPrice(aovUSD, "USD")}`, icon: <FaChartLine />, subtitle: `${completedOrdersList.length} pedidos completados` },
      { label: "Descuentos Aplicados (USD)", value: `${formatPrice(totalDiscountsUSD, "USD")}`, icon: <FaMoneyBillWave />, variant: "success", subtitle: `En ${totalOrders} pedidos` },
      { label: "Tasa de Completados", value: `${completionRate.toFixed(1)}%`, icon: <FaPercentage />, variant: "primary", subtitle: `${completedOrders} de ${totalOrders} pedidos` },
      { label: "Clientes Únicos", value: String(uniqueCustomers), icon: <FaUsers />, variant: "info" },
      { label: "Stock Bajo", value: String(lowStockProducts), icon: <FaExclamationTriangle />, variant: "danger", subtitle: "Productos con stock < 5" },
      { label: "Valor Inventario (USD)", value: `${formatPrice(inventoryValueUSD, "USD")}`, icon: <FaBoxOpen />, variant: "success", subtitle: "Convertido a USD" },
    ];
  }, [computed]);

  return { computed, metrics };
};

export default useDashboardMetrics;
