import React, { useMemo } from "react";
import { FaDollarSign, FaEuroSign, FaMoneyBillWave, FaPercentage } from "react-icons/fa";

import type { Order } from "../../../models";

import { formatPrice } from "../../../utils/format";

const CURRENCY_META: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  USD: { icon: <FaDollarSign />, color: "success", label: "USD" },
  ARS: { icon: <FaMoneyBillWave />, color: "info", label: "ARS" },
  EUR: { icon: <FaEuroSign />, color: "primary", label: "EUR" },
  BRL: { icon: <FaMoneyBillWave />, color: "warning", label: "BRL" },
};

interface CurrencyRow {
  count: number;
  currency: string;
  discountOriginal: number;
  discountUSD: number;
  percentage: number;
}

interface DiscountsByCurrencyProps {
  orders: Order[];
}

const DiscountsByCurrency: React.FC<DiscountsByCurrencyProps> = (props) => {
  const { orders } = props;

  const currencyData: CurrencyRow[] = useMemo(() => {
    const originalDiscounts: Record<string, number> = {};
    const usdDiscounts: Record<string, number> = {};
    const counts: Record<string, number> = {};

    for (const order of orders) {
      if (!order.discount || order.discount <= 0) {
        continue;
      }
      const currency: string = order.currency ?? "USD";
      originalDiscounts[currency] = (originalDiscounts[currency] ?? 0) + order.discount;
      usdDiscounts[currency] = (usdDiscounts[currency] ?? 0) + order.discount * (order.exchangeRate ?? 1);
      counts[currency] = (counts[currency] ?? 0) + 1;
    }

    const grandTotalUSD: number = Object.values(usdDiscounts).reduce((s: number, v: number) => s + v, 0);

    return Object.entries(originalDiscounts)
      .map(([currency, discountOriginal]: [string, number]) => {
        const discountUSD: number = usdDiscounts[currency] ?? 0;
        return {
          currency,
          count: counts[currency] ?? 0,
          discountOriginal,
          discountUSD,
          percentage: grandTotalUSD > 0 ? (discountUSD / grandTotalUSD) * 100 : 0,
        };
      })
      .sort((a: CurrencyRow, b: CurrencyRow) => b.discountUSD - a.discountUSD);
  }, [orders]);

  const grandTotalUSD: number = useMemo(() => currencyData.reduce((s: number, c: CurrencyRow) => s + c.discountUSD, 0), [currencyData]);

  if (currencyData.length === 0) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-header bg-white d-flex align-items-center gap-2">
          <FaPercentage className="text-success" />
          <h5 className="mb-0">Descuentos por Moneda</h5>
        </div>
        <div className="card-body text-center text-muted py-4">No hay descuentos registrados</div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-white d-flex align-items-center gap-2">
        <FaPercentage className="text-success" />
        <h5 className="mb-0">Descuentos por Moneda</h5>
      </div>
      <div className="card-body">
        {currencyData.map((row: CurrencyRow) => {
          const { currency, count, discountOriginal, percentage } = row;
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
                <span className="text-muted small">{formatPrice(discountOriginal, currency)}</span>
              </div>
              <div className="small text-muted mb-1">
                {count} pedido{count === 1 ? "" : "s"} con descuento
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
          <strong>Total (USD)</strong>
          <strong>{formatPrice(grandTotalUSD, "USD")}</strong>
        </div>
      </div>
    </div>
  );
};

export default DiscountsByCurrency;
