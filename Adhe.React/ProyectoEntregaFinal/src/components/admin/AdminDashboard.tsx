import React from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { FaBox, FaCheckCircle, FaTag } from "react-icons/fa";
import { Link } from "react-router-dom";

import HelmetMeta from "../ui/HelmetMeta";
import styles from "./AdminDashboard.module.css";

interface AdminDashboardProps {
  activeCoupons: number;
  activeProducts: number;
  loading: boolean;
  totalCoupons: number;
  totalProducts: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const { totalProducts, activeProducts, totalCoupons, activeCoupons, loading } = props;

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

  const metrics: { label: string; value: number; icon: React.ReactNode; link?: string }[] = [
    { label: "Total Productos", value: totalProducts, icon: <FaBox />, link: "/admin/productos" },
    { label: "Productos Activos", value: activeProducts, icon: <FaCheckCircle /> },
    { label: "Total Cupones", value: totalCoupons, icon: <FaTag />, link: "/admin/cupones" },
    { label: "Cupones Activos", value: activeCoupons, icon: <FaCheckCircle /> },
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
