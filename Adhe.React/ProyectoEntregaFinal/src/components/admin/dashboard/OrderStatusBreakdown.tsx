import React, { useMemo } from "react";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

import type { Order } from "../../../models";

import { OrderStatus, type OrderStatusValue } from "../../../models/Order";
import { ORDER_STATUS_VARIANT } from "../../../utils/orderUtils";

interface StatusMeta {
  icon: React.ReactNode;
  label: string;
}

const STATUS_META: Record<string, StatusMeta> = {
  [OrderStatus.Pendiente]: { icon: <FaClock />, label: "Pendientes" },
  [OrderStatus.Completado]: { icon: <FaCheckCircle />, label: "Completados" },
  [OrderStatus.Cancelado]: { icon: <FaTimesCircle />, label: "Cancelados" },
};

interface StatusRow {
  count: number;
  percentage: number;
  status: OrderStatusValue;
}

interface OrderStatusBreakdownProps {
  orders: Order[];
}

const OrderStatusBreakdown: React.FC<OrderStatusBreakdownProps> = (props) => {
  const { orders } = props;

  const statusData: StatusRow[] = useMemo(() => {
    const total: number = orders.length;
    const byStatus: Record<string, number> = {};

    for (const order of orders) {
      byStatus[order.status] = (byStatus[order.status] ?? 0) + 1;
    }

    return Object.entries(byStatus).map(([status, count]: [string, number]) => ({
      status,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));
  }, [orders]);

  if (statusData.length === 0) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-header bg-white d-flex align-items-center gap-2">
          <FaCheckCircle className="text-success" />
          <h5 className="mb-0">Estado de Pedidos</h5>
        </div>
        <div className="card-body text-center text-muted py-4">No hay pedidos registrados</div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-white d-flex align-items-center gap-2">
        <FaCheckCircle className="text-success" />
        <h5 className="mb-0">Estado de Pedidos</h5>
      </div>
      <div className="card-body">
        {statusData.map((statusRow: StatusRow) => {
          const { status, count, percentage } = statusRow;
          const variant: string = ORDER_STATUS_VARIANT[status] ?? "secondary";
          const meta: StatusMeta = STATUS_META[status] ?? { icon: null, label: status };
          return (
            <div className="mb-3" key={status}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="d-flex align-items-center gap-2">
                  {meta.icon}
                  <strong>{meta.label}</strong>
                </span>
                <span className="text-muted small">
                  {count} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="progress" style={{ height: 20 }}>
                <div className={`progress-bar bg-${variant}`} style={{ width: `${percentage}%` }}>
                  {percentage > 8 && `${percentage.toFixed(1)}%`}
                </div>
              </div>
              <progress aria-label={`${meta.label}: ${percentage.toFixed(1)}%`} className="visually-hidden" max={100} value={Math.round(percentage)} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusBreakdown;
