import React from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import HelmetMeta from "../ui/HelmetMeta";
import LoadingSpinner from "../ui/LoadingSpinner";
import RefreshButton from "../ui/RefreshButton";
import styles from "./AdminDashboard.module.css";

interface Metric {
  icon: React.ReactNode;
  label: string;
  value: string;
  link?: string;
}

interface AdminDashboardViewProps {
  loading: boolean;
  metrics: Metric[];
  onRefresh: () => void;
}

const AdminDashboardView: React.FC<AdminDashboardViewProps> = (props) => {
  const { loading, metrics, onRefresh } = props;

  if (loading) {
    return <LoadingSpinner message="Cargando dashboard..." />;
  }

  return (
    <div>
      <HelmetMeta description="Panel de administración de Talento Tech." title="Admin | Talento Tech" />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Dashboard</h3>
        <RefreshButton loading={loading} onRefresh={onRefresh} />
      </div>
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

export default AdminDashboardView;
