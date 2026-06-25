import React, { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { FaBox, FaCheckCircle, FaClipboardList, FaClock, FaDollarSign, FaTag, FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

import type { Order } from "../../models";

import useCoupons from "../../hooks/selectors/useCoupons";
import useNotification from "../../hooks/selectors/useNotification";
import useProducts from "../../hooks/selectors/useProducts";
import useOrders from "../../hooks/useOrders";
import { OrderStatus } from "../../models/Order";
import HelmetMeta from "../ui/HelmetMeta";
import styles from "./AdminDashboard.module.css";

const AdminDashboard: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const { coupons, loading: couponsLoading } = useCoupons();
  const { setNotification } = useNotification();
  const { error, fetchAllOrders } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);

  useEffect((): void => {
    if (error) {
      setNotification(error, 5000, "danger");
    }
  }, [error, setNotification]);

  useEffect((): void => {
    fetchAllOrders().then((data: Order[]) => {
      setOrders(data);
      setOrdersLoading(false);
    });
  }, [fetchAllOrders]);

  const loading: boolean = productsLoading || couponsLoading || ordersLoading;
  const totalProducts: number = products?.length ?? 0;
  const activeProducts: number = products?.filter((p) => p.isEnabled).length ?? 0;
  const totalCoupons: number = coupons.length;
  const activeCoupons: number = coupons.filter((c) => c.isEnabled).length;
  const totalOrders: number = orders.length;
  const pendingOrders: number = orders.filter((o) => o.status === OrderStatus.Pendiente).length;
  const completedOrders: number = orders.filter((o) => o.status === OrderStatus.Completado).length;
  const cancelledOrders: number = orders.filter((o) => o.status === OrderStatus.Cancelado).length;
  const totalRevenue: number = orders.filter((o) => o.status === OrderStatus.Completado).reduce((s: number, o: Order) => s + o.total, 0);

  if (loading) {
    return (
      <div aria-busy="true" className="d-flex justify-content-center py-5">
        <Spinner animation="border" aria-hidden="true" />
        <output aria-live="polite" className="visually-hidden">
          Cargando...
        </output>
      </div>
    );
  }

  const metrics: { label: string; value: string; icon: React.ReactNode; link?: string }[] = [
    { label: "Total Productos", value: String(totalProducts), icon: <FaBox />, link: "/admin/productos" },
    { label: "Productos Activos", value: String(activeProducts), icon: <FaCheckCircle /> },
    { label: "Total Cupones", value: String(totalCoupons), icon: <FaTag />, link: "/admin/cupones" },
    { label: "Cupones Activos", value: String(activeCoupons), icon: <FaCheckCircle /> },
    { label: "Total Pedidos", value: String(totalOrders), icon: <FaClipboardList />, link: "/admin/ordenes" },
    { label: "Pedidos Pendientes", value: String(pendingOrders), icon: <FaClock /> },
    { label: "Pedidos Completados", value: String(completedOrders), icon: <FaCheckCircle /> },
    { label: "Pedidos Cancelados", value: String(cancelledOrders), icon: <FaTimesCircle /> },
    { label: "Ingresos Totales", value: `$${totalRevenue.toFixed(2)}`, icon: <FaDollarSign /> },
  ];

  return (
    <div>
      <HelmetMeta description="Panel de administración de Talento Tech." title="Admin | Talento Tech" />
      <h3 className="mb-4">Dashboard</h3>
      <Row className="g-3">
        {metrics.map((m) => (
          <Col key={m.label} lg={3} sm={6} xs={12}>
            <div className={`${styles.card} card h-100 shadow-sm`}>
              <div className="card-body d-flex align-items-center gap-3 p-3">
                <div className={styles.iconWrapper}>{m.icon}</div>
                <div>
                  <div className={styles.value}>{m.value}</div>
                  <div className={styles.label}>{m.label}</div>
                </div>
              </div>
              {m.link && <Link aria-label={`Ir a ${m.label}`} className="stretched-link" to={m.link} />}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AdminDashboard;
