import React, { useMemo } from "react";
import { FaTrophy } from "react-icons/fa";

import type { Order } from "../../../models";

import { OrderStatus } from "../../../models/Order";
import { formatPrice } from "../../../utils/format";

interface ProductAgg {
  name: string;
  quantity: number;
  revenue: number;
}

interface TopProductsProps {
  orders: Order[];
}

const TopProducts: React.FC<TopProductsProps> = (props) => {
  const { orders } = props;

  const { byQuantity, byRevenue, products } = useMemo<{ byQuantity: ProductAgg | null; byRevenue: ProductAgg | null; products: ProductAgg[] }>(() => {
    const map: Record<string, ProductAgg> = {};

    for (const order of orders) {
      if (order.status !== OrderStatus.Completado) {continue;}
      for (const item of order.items) {
        const id: string = item.productId;
        if (!map[id]) {
          map[id] = { name: item.productName, quantity: 0, revenue: 0 };
        }
        map[id].quantity += item.quantity;
        map[id].revenue += item.price * item.quantity;
      }
    }

    const products: ProductAgg[] = Object.values(map);
    const sortedQty: ProductAgg[] = [...products].sort((a: ProductAgg, b: ProductAgg) => b.quantity - a.quantity);
    const sortedRev: ProductAgg[] = [...products].sort((a: ProductAgg, b: ProductAgg) => b.revenue - a.revenue);

    return {
      byQuantity: sortedQty[0] ?? null,
      byRevenue: sortedRev[0] ?? null,
      products,
    };
  }, [orders]);

  if (products.length === 0) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-header bg-white d-flex align-items-center gap-2">
          <FaTrophy className="text-warning" />
          <h5 className="mb-0">Top Productos</h5>
        </div>
        <div className="card-body text-center text-muted py-4">
          No hay datos de ventas
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-white d-flex align-items-center gap-2">
        <FaTrophy className="text-warning" />
        <h5 className="mb-0">Top Productos</h5>
      </div>
      <div className="card-body">
        <h6 className="text-muted mb-2">Más vendido por cantidad</h6>
        {byQuantity && (
          <div className="d-flex justify-content-between align-items-center mb-3">
            <strong>{byQuantity.name}</strong>
            <span className="text-primary fw-bold">{byQuantity.quantity} und.</span>
          </div>
        )}

        <h6 className="text-muted mb-2">Mayor facturación</h6>
        {byRevenue && (
          <div className="d-flex justify-content-between align-items-center mb-3">
            <strong>{byRevenue.name}</strong>
            <span className="text-success fw-bold">{formatPrice(byRevenue.revenue, "USD")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProducts;
