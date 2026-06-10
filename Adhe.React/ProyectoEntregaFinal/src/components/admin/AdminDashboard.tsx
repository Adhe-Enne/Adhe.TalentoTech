import React from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

import HelmetMeta from "../ui/HelmetMeta";

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

  const metrics: { label: string; value: number; icon: string; link?: string }[] = [
    { label: "Total Productos", value: totalProducts, icon: "\u{1F4E6}", link: "/admin/productos" },
    { label: "Productos Activos", value: activeProducts, icon: "\u2705" },
    { label: "Total Cupones", value: totalCoupons, icon: "\u{1F3F7}\uFE0F", link: "/admin/cupones" },
    { label: "Cupones Activos", value: activeCoupons, icon: "\u2705" },
  ];

  return (
    <div>
      <HelmetMeta description="Panel de administración de Talento Tech." title="Admin | Talento Tech" />
      <h3 className="mb-4">Dashboard</h3>
      <Row className="g-3">
        {metrics.map((m) => (
          <Col xs={12} sm={6} lg={3} key={m.label}>
            <div className="card h-100 shadow-sm" style={{ borderRadius: 12 }}>
              <div className="card-body d-flex align-items-center gap-3 p-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: 48, height: 48, background: "rgba(15, 102, 112, 0.08)", color: "#0f6670", fontSize: "1.25rem" }}
                >
                  {m.icon}
                </div>
                <div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1, color: "#212529" }}>{m.value}</div>
                  <div style={{ fontSize: "0.85rem", color: "#6c757d", marginTop: 2 }}>{m.label}</div>
                </div>
              </div>
              {m.link && <Link className="stretched-link" to={m.link} />}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AdminDashboard;
