import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaBox, FaChartLine, FaCheckCircle, FaClipboardList, FaClock, FaDollarSign, FaExclamationTriangle, FaMoneyBillWave, FaBoxOpen, FaPercentage, FaTag, FaTimesCircle, FaUsers } from "react-icons/fa";

import type { Coupon, Order, Product } from "../../models";
import type { ComputedMetrics } from "../../types";

import useCategories from "../../hooks/selectors/useCategories";
import useCoupons from "../../hooks/selectors/useCoupons";
import useProducts from "../../hooks/selectors/useProducts";
import { useAllExchangeRates } from "../../hooks/useAllExchangeRates";
import { useErrorNotification } from "../../hooks/useErrorNotification";
import useOrders from "../../hooks/useOrders";
import { OrderStatus } from "../../models/Order";
import { formatPrice } from "../../utils/format";
import AdminDashboardView from "./AdminDashboardView";

type MetricVariant = "primary" | "success" | "warning" | "danger" | "info";

interface MetricItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  link?: string;
  subtitle?: string;
  variant?: MetricVariant;
}

const AdminDashboard: React.FC = () => {
  const { products, loading: productsLoading, reload } = useProducts();
  const { coupons, loading: couponsLoading, fetchCoupons } = useCoupons();
  const { categories } = useCategories();
  const { error, fetchAllOrders } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { rates } = useAllExchangeRates();

  useErrorNotification(error);

  useEffect((): void => {
    fetchAllOrders()
      .then((data: Order[]) => {
        setOrders(data);
        setOrdersLoading(false);
      })
      .catch((): void => {
        setOrdersLoading(false);
      });
  }, [fetchAllOrders]);

  const handleRefresh: () => void = useCallback((): void => {
    setRefreshing(true);
    reload();
    void fetchCoupons();
    fetchAllOrders()
      .then(setOrders)
      .catch((): void => {
        /* error handled by useErrorNotification */
      })
      .finally((): void => {
        setRefreshing(false);
      });
  }, [reload, fetchCoupons, fetchAllOrders]);

  const loading: boolean = productsLoading || couponsLoading || ordersLoading || refreshing;

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
    const totalRevenue: number = completedOrdersList.reduce((s: number, o: Order) => s + o.total, 0);
    const totalRevenueUSD: number = completedOrdersList.reduce((s: number, o: Order) => s + (o.totalInBase ?? o.total), 0);
    const aov: number = completedOrdersList.length > 0 ? totalRevenue / completedOrdersList.length : 0;
    const totalDiscounts: number = orders.reduce((s: number, o: Order) => s + (o.discount ?? 0), 0);
    const completionRate: number = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
    const uniqueCustomers: number = new Set(orders.map((o: Order) => o.userEmail)).size;
    const lowStockProducts: number = products?.filter((p: Product) => p.stock < 5).length ?? 0;
    const inventoryCurrencies: Set<string> = new Set(products?.map((p: Product) => p.currency ?? "USD") ?? []);
    const hasMixedInventoryCurrencies: boolean = inventoryCurrencies.size > 1;
    const inventoryValue: number = products?.reduce((s: number, p: Product) => s + p.price * p.stock, 0) ?? 0;
    const inventoryValueUSD: number = products?.reduce((s: number, p: Product) => {
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
      totalRevenue,
      totalRevenueUSD,
      aov,
      aovUSD,
      totalDiscounts,
      totalDiscountsUSD,
      completionRate,
      uniqueCustomers,
      lowStockProducts,
      inventoryValue,
      inventoryValueUSD,
      hasMixedInventoryCurrencies,
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
      { label: "Total Productos", value: String(totalProducts), icon: <FaBox />, link: "/admin/productos" },
      { label: "Productos Activos", value: String(activeProducts), icon: <FaCheckCircle /> },
      { label: "Total Cupones", value: String(totalCoupons), icon: <FaTag />, link: "/admin/cupones" },
      { label: "Cupones Activos", value: String(activeCoupons), icon: <FaCheckCircle /> },
      { label: "Total Pedidos", value: String(totalOrders), icon: <FaClipboardList />, link: "/admin/ordenes" },
      { label: "Pedidos Pendientes", value: String(pendingOrders), icon: <FaClock /> },
      { label: "Pedidos Completados", value: String(completedOrders), icon: <FaCheckCircle /> },
      { label: "Pedidos Cancelados", value: String(cancelledOrders), icon: <FaTimesCircle /> },
      { label: "Ingresos Totales (USD)", value: `${formatPrice(totalRevenueUSD, "USD")}`, icon: <FaDollarSign />, subtitle: "Todo convertido a USD" },
      { label: "Ticket Promedio (USD)", value: `${formatPrice(aovUSD, "USD")}`, icon: <FaChartLine />, subtitle: `${completedOrdersList.length} pedidos completados` },
      { label: "Descuentos Aplicados (USD)", value: `${formatPrice(totalDiscountsUSD, "USD")}`, icon: <FaMoneyBillWave />, variant: "success", subtitle: `En ${totalOrders} pedidos` },
      { label: "Tasa de Completados", value: `${completionRate.toFixed(1)}%`, icon: <FaPercentage />, variant: "primary", subtitle: `${completedOrders} de ${totalOrders} pedidos` },
      { label: "Clientes Únicos", value: String(uniqueCustomers), icon: <FaUsers />, variant: "info" },
      { label: "Stock Bajo", value: String(lowStockProducts), icon: <FaExclamationTriangle />, variant: "danger", subtitle: "Productos con stock < 5" },
      { label: "Valor Inventario (USD)", value: `${formatPrice(inventoryValueUSD, "USD")}`, icon: <FaBoxOpen />, variant: "success", subtitle: "Convertido a USD" },
    ];
  }, [computed]);

  const ordersProp: Order[] = orders;
  const productsProp: Product[] = products ?? [];
  const couponsProp: Coupon[] = coupons;

  return <AdminDashboardView categories={categories} coupons={couponsProp} loading={loading} metrics={metrics} onRefresh={handleRefresh} orders={ordersProp} products={productsProp} rates={rates} />;
};

export default AdminDashboard;
