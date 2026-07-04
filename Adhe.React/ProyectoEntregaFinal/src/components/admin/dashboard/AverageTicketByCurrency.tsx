import React, { useMemo } from "react";
import { FaChartLine, FaDollarSign, FaEuroSign, FaMoneyBillWave } from "react-icons/fa";

import type { Order } from "../../../models";

import { OrderStatus } from "../../../models/Order";
import { formatPrice } from "../../../utils/format";

const CURRENCY_META: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  USD: { icon: <FaDollarSign />, color: "success", label: "USD" },
  ARS: { icon: <FaMoneyBillWave />, color: "info", label: "ARS" },
  EUR: { icon: <FaEuroSign />, color: "primary", label: "EUR" },
  BRL: { icon: <FaMoneyBillWave />, color: "warning", label: "BRL" },
};

interface CurrencyRow {
  averageOriginal: number;
  averageUSD: number;
  count: number;
  currency: string;
  percentage: number;
}

interface AverageTicketByCurrencyProps {
  orders: Order[];
}

const AverageTicketByCurrency: React.FC<AverageTicketByCurrencyProps> = (props) => {
  const { orders } = props;

  const currencyData: CurrencyRow[] = useMemo(() => {
    const sums: Record<string, number> = {};
    const usdSums: Record<string, number> = {};
    const counts: Record<string, number> = {};

    for (const order of orders) {
      if (order.status !== OrderStatus.Completado) {
        continue;
      }
      const currency: string = order.currency ?? "USD";
      sums[currency] = (sums[currency] ?? 0) + (order.total ?? 0);
      usdSums[currency] = (usdSums[currency] ?? 0) + (order.totalInBase ?? order.total);
      counts[currency] = (counts[currency] ?? 0) + 1;
    }

    const grandTotalUSD: number = Object.values(usdSums).reduce((s: number, v: number) => s + v, 0);

    return Object.entries(sums)
      .map(([currency, sumOriginal]: [string, number]) => {
        const cnt: number = counts[currency] ?? 0;
        const usdSum: number = usdSums[currency] ?? 0;
        return {
          currency,
          averageOriginal: cnt > 0 ? sumOriginal / cnt : 0,
          averageUSD: cnt > 0 ? usdSum / cnt : 0,
          count: cnt,
          percentage: grandTotalUSD > 0 ? (usdSum / grandTotalUSD) * 100 : 0,
        };
      })
      .sort((a: CurrencyRow, b: CurrencyRow) => b.averageUSD - a.averageUSD);
  }, [orders]);

  const grandAverageUSD: number = useMemo(() => {
    const totalCompleted: number = currencyData.reduce((s: number, c: CurrencyRow) => s + c.count, 0);
    const totalUSD: number = currencyData.reduce((s: number, c: CurrencyRow) => s + c.averageUSD * c.count, 0);
    return totalCompleted > 0 ? totalUSD / totalCompleted : 0;
  }, [currencyData]);

  if (currencyData.length === 0) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-header bg-white d-flex align-items-center gap-2">
          <FaChartLine className="text-success" />
          <h5 className="mb-0">Ticket Promedio por Moneda</h5>
        </div>
        <div className="card-body text-center text-muted py-4">No hay pedidos completados</div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-white d-flex align-items-center gap-2">
        <FaChartLine className="text-success" />
        <h5 className="mb-0">Ticket Promedio por Moneda</h5>
      </div>
      <div className="card-body">
        {currencyData.map((data: CurrencyRow) => {
          const { averageOriginal, count, currency, percentage } = data;
          const meta: { icon: React.ReactNode; color: string; label: string } = CURRENCY_META[currency] ?? {
            icon: <FaDollarSign />,
            color: "secondary",
            label: currency,
          };
          return (
            <div className="mb-3" key={currency}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="d-flex align-items-center gap-2">
                  {meta.icon}
                  <strong>{meta.label}</strong>
                </span>
                <span className="text-muted small">{formatPrice(averageOriginal, currency)}</span>
              </div>
              <div className="small text-muted mb-1">
                {count} pedido{count === 1 ? "" : "s"}
              </div>
              <div className="progress" style={{ height: 20 }}>
                <div className={`progress-bar bg-${meta.color}`} style={{ width: `${percentage}%` }}>
                  {percentage > 8 && `${percentage.toFixed(1)}%`}
                </div>
              </div>
              <progress aria-label={`${meta.label}: ${percentage.toFixed(1)}%`} className="visually-hidden" max={100} value={Math.round(percentage)} />
            </div>
          );
        })}
        <div className="d-flex justify-content-between pt-2 border-top">
          <strong>Promedio General (USD)</strong>
          <strong>{formatPrice(grandAverageUSD, "USD")}</strong>
        </div>
      </div>
    </div>
  );
};

export default AverageTicketByCurrency;
