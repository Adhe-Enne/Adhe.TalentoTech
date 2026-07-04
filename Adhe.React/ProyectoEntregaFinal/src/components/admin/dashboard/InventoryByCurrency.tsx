import React, { useMemo } from "react";
import { FaBoxes, FaDollarSign, FaEuroSign, FaMoneyBillWave } from "react-icons/fa";

import useProducts from "../../../hooks/selectors/useProducts";
import { useAllExchangeRates } from "../../../hooks/useAllExchangeRates";
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

const InventoryByCurrency: React.FC = () => {
  const { products } = useProducts();
  const { rates } = useAllExchangeRates();

  const currencyData: CurrencyRow[] = useMemo(() => {
    const originalTotals: Record<string, number> = {};

    for (const product of products) {
      const currency: string = product.currency ?? "USD";
      originalTotals[currency] = (originalTotals[currency] ?? 0) + product.price * product.stock;
    }

    const grandTotalUSD: number = Object.entries(originalTotals).reduce((s: number, [c, v]) => {
      const rate: number = rates[c] ?? 1;
      return s + v / rate;
    }, 0);

    return Object.entries(originalTotals)
      .map(([currency, totalOriginal]: [string, number]) => {
        const totalUSD: number = totalOriginal / (rates[currency] ?? 1);
        return {
          currency,
          totalOriginal,
          totalUSD,
          percentage: grandTotalUSD > 0 ? (totalUSD / grandTotalUSD) * 100 : 0,
        };
      })
      .sort((a: CurrencyRow, b: CurrencyRow) => b.totalUSD - a.totalUSD);
  }, [products, rates]);

  const grandTotalUSD: number = useMemo(() => currencyData.reduce((s: number, c: CurrencyRow) => s + c.totalUSD, 0), [currencyData]);

  if (currencyData.length === 0) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-header bg-white d-flex align-items-center gap-2">
          <FaBoxes className="text-success" />
          <h5 className="mb-0">Inventario por Moneda</h5>
        </div>
        <div className="card-body text-center text-muted py-4">No hay productos registrados</div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-white d-flex align-items-center gap-2">
        <FaBoxes className="text-success" />
        <h5 className="mb-0">Inventario por Moneda</h5>
      </div>
      <div className="card-body">
        {currencyData.map((data: CurrencyRow) => {
          const { currency, totalOriginal, percentage } = data;
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
          <strong>Total (USD)</strong>
          <strong>{formatPrice(grandTotalUSD, "USD")}</strong>
        </div>
      </div>
    </div>
  );
};

export default InventoryByCurrency;
