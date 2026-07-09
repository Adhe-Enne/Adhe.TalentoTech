import React, { useMemo } from "react";
import { FaBoxes, FaDollarSign } from "react-icons/fa";

import type { Product } from "../../../models";

import { formatPrice } from "../../../utils/format";
import { CURRENCY_META, type InventoryCurrencyRow } from "./currencyMeta";
import DashboardCard from "./DashboardCard";
import ProgressBarRow from "./ProgressBarRow";

interface InventoryByCurrencyProps {
  products: Product[];
  rates: Record<string, number>;
}

const InventoryByCurrency: React.FC<InventoryByCurrencyProps> = (props) => {
  const { products, rates } = props;

  const currencyData: InventoryCurrencyRow[] = useMemo(() => {
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
      .sort((a: InventoryCurrencyRow, b: InventoryCurrencyRow) => b.totalUSD - a.totalUSD);
  }, [products, rates]);

  const grandTotalUSD: number = useMemo(() => currencyData.reduce((s: number, c: InventoryCurrencyRow) => s + c.totalUSD, 0), [currencyData]);

  return (
    <DashboardCard footer={<><strong>Total (USD)</strong><strong>{formatPrice(grandTotalUSD, "USD")}</strong></>} icon={<FaBoxes />} iconColor="text-emerald-600" title="Inventario por Moneda">
      {currencyData.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No hay productos registrados</div>
      ) : (
        currencyData.map((data: InventoryCurrencyRow) => {
          const { currency, totalOriginal, percentage } = data;
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

export default InventoryByCurrency;
