import React, { useMemo } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

import type { Product } from "../../../models";

import { formatPrice } from "../../../utils/format";
import DashboardCard from "./DashboardCard";

interface StockAlertsProps {
  products: Product[];
}

const StockAlerts: React.FC<StockAlertsProps> = (props) => {
  const { products } = props;

  const lowStockItems: Product[] = useMemo(() => products.filter((p: Product) => p.stock < 5).sort((a: Product, b: Product) => a.stock - b.stock), [products]);

  const criticalCount: number = useMemo(() => lowStockItems.filter((p: Product) => p.stock === 0).length, [lowStockItems]);

  const title: React.ReactNode = (
    <span className="flex items-center gap-2">
      Alertas de Stock
      {lowStockItems.length > 0 && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger/10 text-danger">{lowStockItems.length}</span>}
    </span>
  );

  if (lowStockItems.length === 0) {
    return (
<DashboardCard icon={<FaExclamationTriangle />} iconColor="text-amber-500" title={title}>
        <div className="text-center text-emerald-600 py-4">
          <FaExclamationTriangle className="mr-2" />
          Todo en stock suficiente
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard icon={<FaExclamationTriangle />} iconColor="warning" title={title}>
      {criticalCount > 0 && (
        <div className="bg-danger/10 border border-danger/20 text-danger flex items-center gap-2 m-0 mb-3 py-2 text-sm rounded-lg" role="alert">
          <FaExclamationTriangle />
          {criticalCount} producto{criticalCount === 1 ? "" : "s"} sin stock
        </div>
      )}
      <div className="divide-y divide-gray-100">
        {lowStockItems.map((product: Product) => {
          const variant: string = ((): string => {
            if (product.stock === 0) {
              return "danger";
            }
            if (product.stock < 3) {
              return "warning";
            }
            return "secondary";
          })();

          return (
            <div className="flex justify-between items-center py-2" key={product.id}>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{product.name}</span>
                <span className="text-gray-500 text-sm">{formatPrice(product.price, product.currency)}</span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                variant === "danger" ? "bg-danger/10 text-danger" :
                variant === "warning" ? "bg-warning/10 text-warning" :
                "bg-gray-100 text-gray-800"
              }`}>{product.stock}</span>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
};

export default StockAlerts;
