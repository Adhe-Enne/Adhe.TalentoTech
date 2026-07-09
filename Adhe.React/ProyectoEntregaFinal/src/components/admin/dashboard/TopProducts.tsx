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
      if (order.status !== OrderStatus.Completado) {
        continue;
      }
      for (const item of order.items) {
        const id: string = item.productId;
        if (!map[id]) {
          map[id] = { name: item.productName, quantity: 0, revenue: 0 };
        }
        map[id].quantity += item.quantity;
        map[id].revenue += item.price * item.quantity * (order.exchangeRate ?? 1);
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
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-100">
        <div className="px-4 py-3 border-b border-gray-100 font-semibold bg-white flex items-center gap-2">
          <FaTrophy className="text-amber-500" />
          <h5 className="mb-0">Top Productos</h5>
        </div>
        <div className="p-4 text-center text-gray-500 py-4">No hay datos de ventas</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-100">
      <div className="px-4 py-3 border-b border-gray-100 font-semibold bg-white flex items-center gap-2">
        <FaTrophy className="text-amber-500" />
        <h5 className="mb-0">Top Productos</h5>
      </div>
      <div className="p-4">
        <h6 className="text-gray-500 mb-2">Más vendido por cantidad</h6>
        {byQuantity && (
          <div className="flex justify-between items-center mb-3">
            <strong>{byQuantity.name}</strong>
            <span className="text-blue-600 font-bold">{byQuantity.quantity} und.</span>
          </div>
        )}

        <h6 className="text-gray-500 mb-2">Mayor facturación</h6>
        {byRevenue && (
          <div className="flex justify-between items-center mb-3">
            <strong>{byRevenue.name}</strong>
            <span className="text-emerald-600 font-bold">{formatPrice(byRevenue.revenue, "USD")} (Conversion)</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProducts;
