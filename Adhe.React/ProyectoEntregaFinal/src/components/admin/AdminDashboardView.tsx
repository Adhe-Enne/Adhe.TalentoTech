import React from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import type { Coupon, Order, Product, Category } from "../../models";

import HelmetMeta from "../ui/HelmetMeta";
import LoadingSpinner from "../ui/LoadingSpinner";
import PageHeader from "../ui/PageHeader";
import RefreshButton from "../ui/RefreshButton";
import AverageTicketByCurrency from "./dashboard/AverageTicketByCurrency";
import CouponInsights from "./dashboard/CouponInsights";
import DiscountsByCurrency from "./dashboard/DiscountsByCurrency";
import InventoryByCurrency from "./dashboard/InventoryByCurrency";
import MonthlyTrends from "./dashboard/MonthlyTrends";
import OrderStatusBreakdown from "./dashboard/OrderStatusBreakdown";
import ProductsByCategory from "./dashboard/ProductsByCategory";
import RecentOrders from "./dashboard/RecentOrders";
import RevenueByCurrency from "./dashboard/RevenueByCurrency";
import StockAlerts from "./dashboard/StockAlerts";
import TopProducts from "./dashboard/TopProducts";

interface Metric {
  icon: React.ReactNode;
  label: string;
  value: string;
  link?: string;
  subtitle?: string;
  variant?: "primary" | "success" | "warning" | "danger" | "info";
}

interface AdminDashboardViewProps {
  categories: Category[];
  coupons: Coupon[];
  loading: boolean;
  metrics: Metric[];
  orders: Order[];
  products: Product[];
  rates: Record<string, number>;
  onRefresh: () => void;
}

const VARIANT_MAP: Record<string, { bg: string; text: string; border: string }> = {
  primary: { bg: "bg-primary bg-opacity-10", text: "text-primary", border: "border-primary" },
  success: { bg: "bg-success bg-opacity-10", text: "text-success", border: "border-success" },
  warning: { bg: "bg-warning bg-opacity-10", text: "text-warning", border: "border-warning" },
  danger: { bg: "bg-danger bg-opacity-10", text: "text-danger", border: "border-danger" },
  info: { bg: "bg-info bg-opacity-10", text: "text-info", border: "border-info" },
};

const AdminDashboardView: React.FC<AdminDashboardViewProps> = (props) => {
  const { categories, coupons, loading, metrics, orders, products, rates, onRefresh } = props;

  if (loading) {
    return <LoadingSpinner message="Cargando dashboard..." />;
  }

  return (
    <div>
      <HelmetMeta description="Panel de administración de Talento Tech." title="Admin | Talento Tech" />
      <PageHeader className="mb-4" headingTag="h3" title="Dashboard">
        <RefreshButton loading={loading} onRefresh={onRefresh} />
      </PageHeader>
      <Row className="g-3">
        {metrics.map((m: Metric) => {
          const vs: { bg: string; text: string; border: string } | undefined = m.variant ? VARIANT_MAP[m.variant] : undefined;
          return (
            <Col key={m.label} lg={3} sm={6} xs={12}>
              <div className={`card h-100 shadow-sm rounded-3${vs ? " " + vs.border : ""} position-relative`}>
                <div className="card-body d-flex align-items-center gap-3 p-3">
                  <div
                    className={`d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 ${vs?.bg ?? "bg-info bg-opacity-10"} ${vs?.text ?? "text-info"}`}
                    style={{ width: 48, height: 48, fontSize: "1.25rem" }}
                  >
                    {m.icon}
                  </div>
                  <div>
                    <div className="fs-3 fw-bold lh-1 text-dark">{m.value}</div>
                    <div className="small text-muted mt-1">{m.label}</div>
                    {m.subtitle && <div className="small text-muted opacity-75 mt-1">{m.subtitle}</div>}
                  </div>
                </div>
                {m.link && <Link aria-label={`Ir a ${m.label}`} className="stretched-link" to={m.link} />}
              </div>
            </Col>
          );
        })}
      </Row>
      <Row className="g-3 mt-4">
        <Col lg={6} xs={12}>
          <RevenueByCurrency orders={orders} />
        </Col>
        <Col lg={6} xs={12}>
          <OrderStatusBreakdown orders={orders} />
        </Col>
      </Row>
      <Row className="g-3 mt-3">
        <Col lg={6} xs={12}>
          <ProductsByCategory categories={categories} products={products} />
        </Col>
        <Col lg={6} xs={12}>
          <RecentOrders orders={orders} />
        </Col>
      </Row>
      <Row className="g-3 mt-3">
        <Col lg={6} xs={12}>
          <StockAlerts products={products} />
        </Col>
        <Col lg={6} xs={12}>
          <CouponInsights coupons={coupons} />
        </Col>
      </Row>
      <Row className="g-3 mt-3">
        <Col lg={6} xs={12}>
          <InventoryByCurrency products={products} rates={rates} />
        </Col>
        <Col lg={6} xs={12}>
          <DiscountsByCurrency orders={orders} />
        </Col>
      </Row>
      <Row className="g-3 mt-3">
        <Col lg={6} xs={12}>
          <AverageTicketByCurrency orders={orders} />
        </Col>
      </Row>
      <Row className="g-3 mt-3">
        <Col lg={6} xs={12}>
          <TopProducts orders={orders} />
        </Col>
        <Col lg={6} xs={12}>
          <MonthlyTrends orders={orders} />
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboardView;
