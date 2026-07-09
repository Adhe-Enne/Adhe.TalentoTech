import React, { useMemo } from "react";
import { FaChartLine, FaDollarSign } from "react-icons/fa";

import type { Order } from "../../../models";

import { OrderStatus } from "../../../models/Order";
import { formatPrice } from "../../../utils/format";
import { CURRENCY_META, type AverageTicketCurrencyRow } from "./currencyMeta";
import DashboardCard from "./DashboardCard";
import ProgressBarRow from "./ProgressBarRow";

interface AverageTicketByCurrencyProps {
  orders: Order[];
}

const AverageTicketByCurrency: React.FC<AverageTicketByCurrencyProps> = (props) => {
  const { orders } = props;

  const currencyData: AverageTicketCurrencyRow[] = useMemo(() => {
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
      .sort((a: AverageTicketCurrencyRow, b: AverageTicketCurrencyRow) => b.averageUSD - a.averageUSD);
  }, [orders]);

  const grandAverageUSD: number = useMemo(() => {
    const totalCompleted: number = currencyData.reduce((s: number, c: AverageTicketCurrencyRow) => s + c.count, 0);
    const totalUSD: number = currencyData.reduce((s: number, c: AverageTicketCurrencyRow) => s + c.averageUSD * c.count, 0);
    return totalCompleted > 0 ? totalUSD / totalCompleted : 0;
  }, [currencyData]);

  return (
    <DashboardCard
      footer={
        <>
          <strong>Promedio General (USD)</strong>
          <strong>{formatPrice(grandAverageUSD, "USD")}</strong>
        </>
      }
      icon={<FaChartLine />}
      iconColor="text-emerald-600"
      title="Ticket Promedio por Moneda"
    >
      {currencyData.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No hay pedidos completados</div>
      ) : (
        currencyData.map((data: AverageTicketCurrencyRow) => {
          const { averageOriginal, count, currency, percentage } = data;
          const meta: { icon: React.ReactNode; color: string; label: string } = CURRENCY_META[currency] ?? {
            icon: <FaDollarSign />,
            color: "secondary",
            label: currency,
          };
          return (
            <ProgressBarRow
              ariaLabel={`${meta.label}: ${percentage.toFixed(1)}%`}
              color={meta.color}
              extra={
                <div className="text-sm text-gray-500 mb-1">
                  {count} pedido{count === 1 ? "" : "s"}
                </div>
              }
              key={currency}
              label={
                <span className="flex items-center gap-2">
                  {meta.icon}
                  <strong>{meta.label}</strong>
                </span>
              }
              percent={percentage}
              rightText={formatPrice(averageOriginal, currency)}
            />
          );
        })
      )}
    </DashboardCard>
  );
};

export default AverageTicketByCurrency;
