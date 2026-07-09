import React, { useMemo } from "react";
import { FaShoppingBag } from "react-icons/fa";

import type { Order } from "../../../models";

import { formatPrice } from "../../../utils/format";
import { ORDER_STATUS_VARIANT } from "../../../utils/orderUtils";

interface RecentOrdersProps {
  orders: Order[];
}

const RecentOrders: React.FC<RecentOrdersProps> = (props) => {
  const { orders } = props;

  const recentOrders: Order[] = useMemo(() => orders.slice(0, 5), [orders]);

  if (recentOrders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm h-full">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 bg-white">
          <FaShoppingBag className="text-cta" />
          <h5 className="mb-0">Pedidos Recientes</h5>
        </div>
        <div className="p-4 text-center text-gray-500">
          No hay pedidos registrados
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm h-full">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 bg-white">
        <FaShoppingBag className="text-cta" />
        <h5 className="mb-0">Pedidos Recientes</h5>
      </div>
      <div className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full mb-0">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order: Order) => (
                <tr className="hover:bg-gray-50" key={order.id}>
                  <td className="text-gray-500 text-sm px-3 py-2" style={{ maxWidth: 80 }}>
                    <span className="truncate inline-block" style={{ maxWidth: 70 }}>
                      {order.id}
                    </span>
                  </td>
                  <td className="text-sm px-3 py-2">{order.userEmail}</td>
                  <td className="text-sm px-3 py-2">{formatPrice(order.total, order.currency)}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      (ORDER_STATUS_VARIANT[order.status] ?? "secondary") === "success" ? "bg-success/10 text-success" :
                      (ORDER_STATUS_VARIANT[order.status] ?? "secondary") === "warning" ? "bg-warning/10 text-warning" :
                      (ORDER_STATUS_VARIANT[order.status] ?? "secondary") === "danger" ? "bg-danger/10 text-danger" :
                      (ORDER_STATUS_VARIANT[order.status] ?? "secondary") === "info" ? "bg-info/10 text-info" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
