import React, { useMemo } from "react";
import { Badge } from "react-bootstrap";
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
    <span className="d-flex align-items-center gap-2">
      Alertas de Stock
      {lowStockItems.length > 0 && <Badge bg="danger">{lowStockItems.length}</Badge>}
    </span>
  );

  if (lowStockItems.length === 0) {
    return (
      <DashboardCard icon={<FaExclamationTriangle />} iconColor="warning" title={title}>
        <div className="text-center text-success py-4">
          <FaExclamationTriangle className="me-2" />
          Todo en stock suficiente
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard icon={<FaExclamationTriangle />} iconColor="warning" title={title}>
      {criticalCount > 0 && (
        <div className="alert alert-danger d-flex align-items-center gap-2 m-0 mb-3 py-2 small" role="alert">
          <FaExclamationTriangle />
          {criticalCount} producto{criticalCount === 1 ? "" : "s"} sin stock
        </div>
      )}
      <div className="list-group list-group-flush">
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
            <div className="list-group-item d-flex justify-content-between align-items-center py-2" key={product.id}>
              <div className="d-flex flex-column">
                <span className="small fw-semibold">{product.name}</span>
                <span className="text-muted small">{formatPrice(product.price, product.currency)}</span>
              </div>
              <Badge bg={variant}>{product.stock}</Badge>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
};

export default StockAlerts;
