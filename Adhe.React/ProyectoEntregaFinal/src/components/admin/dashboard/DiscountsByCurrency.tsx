import React, { useMemo } from "react";
import { FaDollarSign, FaPercentage } from "react-icons/fa";

import type { Order } from "../../../models";

import { formatPrice } from "../../../utils/format";
import { CURRENCY_META, type DiscountCurrencyRow } from "./currencyMeta";
import DashboardCard from "./DashboardCard";
import ProgressBarRow from "./ProgressBarRow";

interface DiscountsByCurrencyProps {
  orders: Order[];
}

const DiscountsByCurrency: React.FC<DiscountsByCurrencyProps> = (props) => {
  const { orders } = props;

  const currencyData: DiscountCurrencyRow[] = useMemo(() => {
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
      .sort((a: DiscountCurrencyRow, b: DiscountCurrencyRow) => b.discountUSD - a.discountUSD);
  }, [orders]);

  const grandTotalUSD: number = useMemo(() => currencyData.reduce((s: number, c: DiscountCurrencyRow) => s + c.discountUSD, 0), [currencyData]);

  return (
    <DashboardCard
      footer={
        <>
          <strong>Total (USD)</strong>
          <strong>{formatPrice(grandTotalUSD, "USD")}</strong>
        </>
      }
      icon={<FaPercentage />}
      iconColor="text-emerald-600"
      title="Descuentos por Moneda"
    >
      {currencyData.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No hay descuentos registrados</div>
      ) : (
        currencyData.map((row: DiscountCurrencyRow) => {
          const { currency, count, discountOriginal, percentage } = row;
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
                  {count} pedido{count === 1 ? "" : "s"} con descuento
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
              rightText={formatPrice(discountOriginal, currency)}
            />
          );
        })
      )}
    </DashboardCard>
  );
};

export default DiscountsByCurrency;
