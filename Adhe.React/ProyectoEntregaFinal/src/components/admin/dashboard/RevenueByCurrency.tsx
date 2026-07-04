import React, { useMemo } from "react";
import { FaDollarSign, FaEuroSign, FaMoneyBillWave } from "react-icons/fa";

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
  currency: string;
  percentage: number;
  totalOriginal: number;
  totalUSD: number;
}

interface RevenueByCurrencyProps {
  orders: Order[];
}

const RevenueByCurrency: React.FC<RevenueByCurrencyProps> = (props) => {
  const { orders } = props;

  const currencyData: CurrencyRow[] = useMemo(() => {
    const originalTotals: Record<string, number> = {};
    const usdTotals: Record<string, number> = {};

    for (const order of orders) {
      if (order.status !== OrderStatus.Completado) {
        continue;
      }
      const currency: string = order.currency ?? "USD";
      originalTotals[currency] = (originalTotals[currency] ?? 0) + (order.total ?? 0);
      usdTotals[currency] = (usdTotals[currency] ?? 0) + (order.totalInBase ?? order.total);
    }

    const grandTotalUSD: number = Object.values(usdTotals).reduce((s: number, v: number) => s + v, 0);

    return Object.entries(originalTotals)
      .map(([currency, totalOriginal]: [string, number]) => {
        const totalUSD: number = usdTotals[currency] ?? 0;
        return {
          currency,
          percentage: grandTotalUSD > 0 ? (totalUSD / grandTotalUSD) * 100 : 0,
          totalOriginal,
          totalUSD,
        };
      })
      .sort((a: CurrencyRow, b: CurrencyRow) => b.totalUSD - a.totalUSD);
  }, [orders]);

  const grandTotalUSD: number = useMemo(() => currencyData.reduce((s: number, c: CurrencyRow) => s + c.totalUSD, 0), [currencyData]);

  if (currencyData.length === 0) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-header bg-white d-flex align-items-center gap-2">
          <FaDollarSign className="text-success" />
          <h5 className="mb-0">Ingresos por Moneda</h5>
        </div>
        <div className="card-body text-center text-muted py-4">No hay ingresos registrados</div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-white d-flex align-items-center gap-2">
        <FaDollarSign className="text-success" />
        <h5 className="mb-0">Ingresos por Moneda</h5>
      </div>
      <div className="card-body">
        {currencyData.map((row: CurrencyRow) => {
          const { currency, totalOriginal, percentage } = row;
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
                <span className="text-muted small">{formatPrice(totalOriginal, currency)}</span>
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
          <strong>Total (Conversion a USD)</strong>
          <strong>{formatPrice(grandTotalUSD, "USD")}</strong>
        </div>
      </div>
    </div>
  );
};

export default RevenueByCurrency;
