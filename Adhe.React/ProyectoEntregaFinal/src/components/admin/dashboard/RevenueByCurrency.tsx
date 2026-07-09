import React, { useMemo } from "react";
import { FaDollarSign } from "react-icons/fa";

import type { Order } from "../../../models";

import { OrderStatus } from "../../../models/Order";
import { formatPrice } from "../../../utils/format";
import { CURRENCY_META, type RevenueCurrencyRow } from "./currencyMeta";
import DashboardCard from "./DashboardCard";
import ProgressBarRow from "./ProgressBarRow";

interface RevenueByCurrencyProps {
  orders: Order[];
}

const RevenueByCurrency: React.FC<RevenueByCurrencyProps> = (props) => {
  const { orders } = props;

  const currencyData: RevenueCurrencyRow[] = useMemo(() => {
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
      .sort((a: RevenueCurrencyRow, b: RevenueCurrencyRow) => b.totalUSD - a.totalUSD);
  }, [orders]);

  const grandTotalUSD: number = useMemo(() => currencyData.reduce((s: number, c: RevenueCurrencyRow) => s + c.totalUSD, 0), [currencyData]);

  return (
    <DashboardCard footer={<><strong>Total (Conversion a USD)</strong><strong>{formatPrice(grandTotalUSD, "USD")}</strong></>} icon={<FaDollarSign />} iconColor="text-emerald-600" title="Ingresos por Moneda">
      {currencyData.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No hay ingresos registrados</div>
      ) : (
        currencyData.map((row: RevenueCurrencyRow) => {
          const { currency, totalOriginal, percentage } = row;
          const meta: { icon: React.ReactNode; color: string; label: string } = CURRENCY_META[currency] ?? {
            icon: <FaDollarSign />,
            color: "secondary",
            label: currency,
          };
          return (
            <ProgressBarRow
              ariaLabel={`${meta.label}: ${percentage.toFixed(1)}%`}
              color={meta.color}
              key={currency}
              label={<span className="flex items-center gap-2">{meta.icon}<strong>{meta.label}</strong></span>}
              percent={percentage}
              rightText={formatPrice(totalOriginal, currency)}
            />
          );
        })
      )}
    </DashboardCard>
  );
};

export default RevenueByCurrency;
