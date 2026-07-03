import React, { useMemo } from "react";
import { Badge } from "react-bootstrap";
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
      <div className="card shadow-sm h-100">
        <div className="card-header bg-white d-flex align-items-center gap-2">
          <FaShoppingBag className="text-primary" />
          <h5 className="mb-0">Pedidos Recientes</h5>
        </div>
        <div className="card-body text-center text-muted py-4">
          No hay pedidos registrados
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-white d-flex align-items-center gap-2">
        <FaShoppingBag className="text-primary" />
        <h5 className="mb-0">Pedidos Recientes</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order: Order) => (
                <tr key={order.id}>
                  <td className="text-muted small" style={{ maxWidth: 80 }}>
                    <span className="text-truncate d-inline-block" style={{ maxWidth: 70 }}>
                      {order.id}
                    </span>
                  </td>
                  <td className="small">{order.userEmail}</td>
                  <td className="small">{formatPrice(order.total)}</td>
                  <td>
                    <Badge bg={ORDER_STATUS_VARIANT[order.status] ?? "secondary"}>
                      {order.status}
                    </Badge>
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
