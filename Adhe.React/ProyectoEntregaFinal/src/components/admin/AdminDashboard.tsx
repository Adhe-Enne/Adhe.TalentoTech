import React, { useEffect, useMemo, useState } from "react";
import { FaBox, FaCheckCircle, FaClipboardList, FaClock, FaDollarSign, FaTag, FaTimesCircle } from "react-icons/fa";

import type { Order } from "../../models";

import useCoupons from "../../hooks/selectors/useCoupons";
import useProducts from "../../hooks/selectors/useProducts";
import { useErrorNotification } from "../../hooks/useErrorNotification";
import useOrders from "../../hooks/useOrders";
import { OrderStatus } from "../../models/Order";
import { formatPrice } from "../../utils/format";
import AdminDashboardView from "./AdminDashboardView";

const AdminDashboard: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const { coupons, loading: couponsLoading } = useCoupons();
  const { error, fetchAllOrders } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);

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

  const loading: boolean = productsLoading || couponsLoading || ordersLoading;
  const metrics: { label: string; value: string; icon: React.ReactNode; link?: string }[] = useMemo(() => {
    const totalProducts: number = products?.length ?? 0;
    const activeProducts: number = products?.filter((p) => p.isEnabled).length ?? 0;
    const totalCoupons: number = coupons.length;
    const activeCoupons: number = coupons.filter((c) => c.isEnabled).length;
    const totalOrders: number = orders.length;
    const pendingOrders: number = orders.filter((o) => o.status === OrderStatus.Pendiente).length;
    const completedOrders: number = orders.filter((o) => o.status === OrderStatus.Completado).length;
    const cancelledOrders: number = orders.filter((o) => o.status === OrderStatus.Cancelado).length;
    const totalRevenue: number = orders.filter((o) => o.status === OrderStatus.Completado).reduce((s: number, o: Order) => s + o.total, 0);

    return [
      { label: "Total Productos", value: String(totalProducts), icon: <FaBox />, link: "/admin/productos" },
      { label: "Productos Activos", value: String(activeProducts), icon: <FaCheckCircle /> },
      { label: "Total Cupones", value: String(totalCoupons), icon: <FaTag />, link: "/admin/cupones" },
      { label: "Cupones Activos", value: String(activeCoupons), icon: <FaCheckCircle /> },
      { label: "Total Pedidos", value: String(totalOrders), icon: <FaClipboardList />, link: "/admin/ordenes" },
      { label: "Pedidos Pendientes", value: String(pendingOrders), icon: <FaClock /> },
      { label: "Pedidos Completados", value: String(completedOrders), icon: <FaCheckCircle /> },
      { label: "Pedidos Cancelados", value: String(cancelledOrders), icon: <FaTimesCircle /> },
      { label: "Ingresos Totales", value: `${formatPrice(totalRevenue)}`, icon: <FaDollarSign /> },
    ];
  }, [products, coupons, orders]);

  return <AdminDashboardView loading={loading} metrics={metrics} />;
};

export default AdminDashboard;
