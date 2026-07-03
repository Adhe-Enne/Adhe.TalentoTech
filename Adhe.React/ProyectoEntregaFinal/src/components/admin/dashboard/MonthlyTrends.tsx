import React, { useMemo } from "react";
import { FaChartLine } from "react-icons/fa";

import type { Order } from "../../../models";

import { OrderStatus } from "../../../models/Order";
import { formatPrice } from "../../../utils/format";

interface MonthData {
  label: string;
  total: number;
}

interface MonthlyTrendsProps {
  orders: Order[];
}

const MonthlyTrends: React.FC<MonthlyTrendsProps> = (props) => {
  const { orders } = props;

  const { bestMonth, growth, avgMonthly, monthlyData } = useMemo<{
    bestMonth: { label: string; total: number } | null;
    growth: number | null;
    avgMonthly: number;
    monthlyData: MonthData[];
  }>(() => {
    const byMonth: Record<string, number> = {};

    for (const order of orders) {
      if (order.status !== OrderStatus.Completado) {continue;}
      if (!order.createdAt) {continue;}
      const month: string = order.createdAt.slice(0, 7);
      byMonth[month] = (byMonth[month] ?? 0) + (order.totalInBase ?? order.total);
    }

    const entries: [string, number][] = Object.entries(byMonth).sort(
      ([a]: [string, number], [b]: [string, number]) => a.localeCompare(b),
    );

    const monthlyData: MonthData[] = entries.map(([label, total]: [string, number]) => ({ label, total }));
    const totalRevenue: number = monthlyData.reduce((s: number, m: MonthData) => s + m.total, 0);
    const avgMonthly: number = monthlyData.length > 0 ? totalRevenue / monthlyData.length : 0;

    let bestMonth: { label: string; total: number } | null = null;
    for (const m of monthlyData) {
      if (!bestMonth || m.total > bestMonth.total) {
        bestMonth = m;
      }
    }

    let growth: number | null = null;
    if (monthlyData.length >= 2) {
      const last: MonthData = monthlyData[monthlyData.length - 1];
      const prev: MonthData = monthlyData[monthlyData.length - 2];
      if (prev.total > 0) {
        growth = ((last.total - prev.total) / prev.total) * 100;
      }
    }

    return { bestMonth, growth, avgMonthly, monthlyData };
  }, [orders]);

  const maxTotal: number = useMemo(
    () => Math.max(...monthlyData.map((m: MonthData) => m.total), 0),
    [monthlyData],
  );

  if (monthlyData.length === 0) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-header bg-white d-flex align-items-center gap-2">
          <FaChartLine className="text-info" />
          <h5 className="mb-0">Tendencias Mensuales</h5>
        </div>
        <div className="card-body text-center text-muted py-4">
          No hay datos de ventas
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-white d-flex align-items-center gap-2">
        <FaChartLine className="text-info" />
        <h5 className="mb-0">Tendencias Mensuales</h5>
      </div>
      <div className="card-body">
        <div className="row g-2 mb-3">
          <div className="col-6">
            <div className="small text-muted">Mejor mes</div>
            <div className="fw-bold">{bestMonth?.label ?? "-"}</div>
            <div className="small">{bestMonth ? formatPrice(bestMonth.total, "USD") : ""}</div>
          </div>
          <div className="col-6">
            <div className="small text-muted">Crecimiento mensual</div>
            <div className={`fw-bold ${growth !== null && growth >= 0 ? "text-success" : "text-danger"}`}>
              {growth !== null ? `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%` : "-"}
            </div>
          </div>
          <div className="col-6 mt-2">
            <div className="small text-muted">Promedio mensual</div>
            <div className="fw-bold">{formatPrice(avgMonthly, "USD")}</div>
          </div>
        </div>

        {monthlyData.map((m: MonthData) => {
          const pct: number = maxTotal > 0 ? (m.total / maxTotal) * 100 : 0;
          return (
            <div className="mb-2" key={m.label}>
              <div className="d-flex justify-content-between small">
                <span>{m.label}</span>
                <span className="fw-semibold">{formatPrice(m.total, "USD")}</span>
              </div>
              <div
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={Math.round(pct)}
                className="progress"
                role="progressbar"
                style={{ height: 14 }}
              >
                <div
                  className="progress-bar bg-info"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyTrends;
