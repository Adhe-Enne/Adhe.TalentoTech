import React, { useMemo } from "react";
import { Badge } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";

import type { Product } from "../../../models";

import { formatPrice } from "../../../utils/format";

interface StockAlertsProps {
  products: Product[];
}

const StockAlerts: React.FC<StockAlertsProps> = (props) => {
  const { products } = props;

  const lowStockItems: Product[] = useMemo(() => products.filter((p: Product) => p.stock < 5).sort((a: Product, b: Product) => a.stock - b.stock), [products]);

  const criticalCount: number = useMemo(() => lowStockItems.filter((p: Product) => p.stock === 0).length, [lowStockItems]);

  if (lowStockItems.length === 0) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-header bg-white d-flex align-items-center gap-2">
          <FaExclamationTriangle className="text-warning" />
          <h5 className="mb-0">Alertas de Stock</h5>
        </div>
        <div className="card-body text-center text-success py-4">
          <FaExclamationTriangle className="me-2" />
          Todo en stock suficiente
        </div>
      </div>
    );
  }

  const renderLowStockItems: () => React.ReactNode = () => {
    return lowStockItems.map((product: Product) => {
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
    });
  };

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-white d-flex align-items-center gap-2">
        <FaExclamationTriangle className="text-warning" />
        <h5 className="mb-0 d-flex align-items-center gap-2">
          Alertas de Stock
          <Badge bg="danger">{lowStockItems.length}</Badge>
        </h5>
      </div>
      <div className="card-body p-0">
        {criticalCount > 0 && (
          <div className="alert alert-danger d-flex align-items-center gap-2 m-3 mb-0 py-2 small" role="alert">
            <FaExclamationTriangle />
            {criticalCount} producto{criticalCount === 1 ? "" : "s"} sin stock
          </div>
        )}
        <div className="list-group list-group-flush">{renderLowStockItems()}</div>
      </div>
    </div>
  );
};

export default StockAlerts;
