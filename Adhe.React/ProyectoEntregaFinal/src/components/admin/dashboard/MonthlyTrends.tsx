import React, { useMemo } from "react";
import { FaChartLine } from "react-icons/fa";

import type { Order } from "../../../models";

import { OrderStatus } from "../../../models/Order";
import { formatPrice } from "../../../utils/format";

const MONTH_NAMES: string[] = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const formatMonthLabel: (isoMonth: string) => string = (isoMonth: string): string => {
  const [year, month] = isoMonth.split("-");
  return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
};

interface MonthData {
  isoKey: string;
  label: string;
  orderCount: number;
  total: number;
  yoyChange: number | null;
}

interface MonthlyTrendsProps {
  orders: Order[];
}

interface MonthlyStats {
  avgMonthly: number;
  bestMonth: { label: string; total: number; orderCount: number } | null;
  growth: number | null;
  monthlyData: MonthData[];
  multiYearData: boolean;
  yoyCoverageNote: string | null;
  yoyGrowth: number | null;
  yoyLabel: string;
}

const aggregateByMonth: (orders: Order[]) => MonthData[] = (orders: Order[]): MonthData[] => {
  const byMonth: Record<string, { total: number; count: number }> = {};

  for (const order of orders) {
    if (order.status !== OrderStatus.Completado || !order.createdAt) {
      continue;
    }
    const month: string = order.createdAt.slice(0, 7);
    const prev: { total: number; count: number } = byMonth[month] ?? { total: 0, count: 0 };
    byMonth[month] = {
      count: prev.count + 1,
      total: prev.total + (order.totalInBase ?? order.total),
    };
  }

  const entries: [string, { total: number; count: number }][] = Object.entries(byMonth).sort(([a]: [string, unknown], [b]: [string, unknown]) => a.localeCompare(b));

  const data: MonthData[] = entries.map(([isoKey, agg]) => ({
    isoKey,
    label: formatMonthLabel(isoKey),
    orderCount: agg.count,
    total: agg.total,
    yoyChange: null,
  }));

  const monthMap: Map<string, MonthData> = new Map(data.map((m) => [m.isoKey, m]));
  for (const m of data) {
    const [year, monthNum] = m.isoKey.split("-");
    const prevIsoKey: string = `${String(Number(year) - 1)}-${monthNum}`;
    const prev: MonthData | undefined = monthMap.get(prevIsoKey);
    if (prev && prev.total > 0) {
      m.yoyChange = ((m.total - prev.total) / prev.total) * 100;
    }
  }

  return data;
};

const computeMonthlyStats: (orders: Order[]) => MonthlyStats = (orders: Order[]): MonthlyStats => {
  const monthlyData: MonthData[] = aggregateByMonth(orders);
  const years: string[] = [...new Set(monthlyData.map((m: MonthData) => m.isoKey.slice(0, 4)))];
  const multiYearData: boolean = years.length >= 2;
  const totalRevenue: number = monthlyData.reduce((s: number, m: MonthData) => s + m.total, 0);
  const avgMonthly: number = monthlyData.length > 0 ? totalRevenue / monthlyData.length : 0;

  let bestMonth: { label: string; total: number; orderCount: number } | null = null;
  for (const m of monthlyData) {
    if (!bestMonth || m.total > bestMonth.total) {
      bestMonth = { label: m.label, orderCount: m.orderCount, total: m.total };
    }
  }

  const growth: number | null = monthlyData.length >= 2 && monthlyData.at(-2) && (monthlyData.at(-2)?.total ?? 0) > 0 ? (((monthlyData.at(-1)?.total ?? 0) - (monthlyData.at(-2)?.total ?? 0)) / (monthlyData.at(-2)?.total ?? 1)) * 100 : null;

  const last: MonthData | undefined = monthlyData.at(-1);
  const yoyGrowth: number | null = multiYearData && last && last.yoyChange !== null ? last.yoyChange : null;
  const yoyLabel: string = ((): string => {
    if (!multiYearData || last?.yoyChange === null) {
      return "";
    }

    const [year, monthNum] = last!.isoKey.split("-");
    const prevIsoKey: string = `${String(Number(year) - 1)}-${monthNum}`;
    return `${last!.label} vs ${formatMonthLabel(prevIsoKey)}`;
  })();

  const yoyCoverageNote: string | null = multiYearData ? `${monthlyData.filter((m: MonthData) => m.yoyChange !== null).length} de ${monthlyData.length} meses tienen datos del a\u00f1o anterior para comparar` : null;

  return { avgMonthly, bestMonth, growth, monthlyData, multiYearData, yoyCoverageNote, yoyGrowth, yoyLabel };
};

const MonthlyTrends: React.FC<MonthlyTrendsProps> = (props) => {
  const { orders } = props;

  const { bestMonth, growth, avgMonthly, monthlyData, multiYearData, yoyGrowth, yoyLabel, yoyCoverageNote } = useMemo<MonthlyStats>(() => computeMonthlyStats(orders), [orders]);

  const maxTotal: number = useMemo(() => Math.max(...monthlyData.map((m: MonthData) => m.total), 0), [monthlyData]);

  if (monthlyData.length === 0) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-header bg-white d-flex align-items-center gap-2">
          <FaChartLine className="text-info" />
          <h5 className="mb-0">Tendencias Mensuales</h5>
        </div>
        <div className="card-body text-center text-muted py-4">No hay datos de ventas</div>
      </div>
    );
  }

  const growthClass: string = growth !== null && growth >= 0 ? "text-success" : "text-danger";
  const growthSign: string = growth !== null && growth >= 0 ? "+" : "";
  const growthLabel: string = growth === null ? "-" : `${growthSign}${growth.toFixed(1)}%`;

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
            <div className="small">{bestMonth ? `${formatPrice(bestMonth.total, "USD")} · ${bestMonth.orderCount} pedidos` : ""}</div>
          </div>
          <div className="col-6">
            <div className="small text-muted">Crecimiento mensual</div>
            <div className={`fw-bold ${growthClass}`}>{growthLabel}</div>
          </div>
          <div className="col-6 mt-2">
            <div className="small text-muted">Promedio mensual</div>
            <div className="fw-bold">{formatPrice(avgMonthly, "USD")}</div>
          </div>
          {multiYearData &&
            ((): React.ReactNode => {
              const yoyClass: string = yoyGrowth !== null && yoyGrowth >= 0 ? "text-success" : "text-danger";
              const yoySign: string = yoyGrowth !== null && yoyGrowth >= 0 ? "+" : "";
              const yoyText: string = yoyGrowth === null ? "-" : `${yoySign}${yoyGrowth.toFixed(1)}%`;
              return (
                <div className="col-6 mt-2">
                  <div className="small text-muted">vs año anterior</div>
                  <div className={`fw-bold ${yoyClass}`}>{yoyText}</div>
                  {yoyLabel && <div className="small">{yoyLabel}</div>}
                </div>
              );
            })()}
        </div>

        {monthlyData.map((m: MonthData) => {
          const pct: number = maxTotal > 0 ? (m.total / maxTotal) * 100 : 0;
          return (
            <div className="mb-2" key={m.isoKey}>
              <div className="d-flex justify-content-between small">
                <span>{m.label}</span>
                <span className="fw-semibold">
                  {formatPrice(m.total, "USD")} · {m.orderCount} ped.
                </span>
              </div>
              <div className="progress" style={{ height: 14 }}>
                <div className="progress-bar bg-info" style={{ width: `${pct}%` }} />
              </div>
              <progress aria-label={`${m.label}: ${pct.toFixed(1)}%`} className="visually-hidden" max={100} value={Math.round(pct)} />
            </div>
          );
        })}

        {yoyCoverageNote && <div className="mt-3 small text-muted">{yoyCoverageNote}</div>}
      </div>
    </div>
  );
};

export default MonthlyTrends;
