import React, { useMemo } from "react";
import { Badge } from "react-bootstrap";
import { FaTicketAlt } from "react-icons/fa";

import type { Coupon } from "../../../models";

interface CouponInsightsProps {
  coupons: Coupon[];
}

const CouponInsights: React.FC<CouponInsightsProps> = (props) => {
  const { coupons } = props;

  const insights: {
    total: number;
    active: number;
    expired: number;
    nearLimit: number;
    mostUsed: Coupon | undefined;
    totalUsage: number;
  } = useMemo(() => {
    const now: Date = new Date();
    const total: number = coupons.length;
    const active: number = coupons.filter((c: Coupon) => c.isEnabled).length;
    const expired: number = coupons.filter((c: Coupon) => c.expiresAt && new Date(c.expiresAt) < now).length;
    const nearLimit: number = coupons.filter((c: Coupon) => c.usageLimit != null && c.usedCount >= c.usageLimit * 0.8).length;

    const [mostUsed] = [...coupons].sort((a: Coupon, b: Coupon) => b.usedCount - a.usedCount);

    const totalUsage: number = coupons.reduce((s: number, c: Coupon) => s + (c.usedCount ?? 0), 0);

    return { total, active, expired, nearLimit, mostUsed, totalUsage };
  }, [coupons]);

  if (coupons.length === 0) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-header bg-white d-flex align-items-center gap-2">
          <FaTicketAlt className="text-info" />
          <h5 className="mb-0">Cupones</h5>
        </div>
        <div className="card-body text-center text-muted py-4">No hay cupones registrados</div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-white d-flex align-items-center gap-2">
        <FaTicketAlt className="text-info" />
        <h5 className="mb-0">Cupones</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-6">
            <div className="text-center p-2 rounded bg-primary bg-opacity-10">
              <div className="fs-4 fw-bold text-primary">{insights.total}</div>
              <div className="small text-muted">Totales</div>
            </div>
          </div>
          <div className="col-6">
            <div className="text-center p-2 rounded bg-success bg-opacity-10">
              <div className="fs-4 fw-bold text-success">{insights.active}</div>
              <div className="small text-muted">Activos</div>
            </div>
          </div>
          <div className="col-6">
            <div className="text-center p-2 rounded bg-warning bg-opacity-10">
              <div className="fs-4 fw-bold text-warning">{insights.expired}</div>
              <div className="small text-muted">Expirados</div>
            </div>
          </div>
          <div className="col-6">
            <div className="text-center p-2 rounded bg-danger bg-opacity-10">
              <div className="fs-4 fw-bold text-danger">{insights.nearLimit}</div>
              <div className="small text-muted">Por agotar</div>
            </div>
          </div>
        </div>
        {insights.mostUsed && (
          <div className="mt-3 pt-3 border-top small text-muted d-flex justify-content-between">
            <span>
              <strong>Más usado:</strong> {insights.mostUsed.code}
            </span>
            <span>
              <Badge bg="secondary">{insights.mostUsed.usedCount} usos</Badge>
            </span>
          </div>
        )}
        <div className="mt-2 small text-muted d-flex justify-content-between">
          <span>Usos totales</span>
          <strong>{insights.totalUsage}</strong>
        </div>
      </div>
    </div>
  );
};

export default CouponInsights;
