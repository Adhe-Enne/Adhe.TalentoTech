import React, { useMemo } from "react";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

import type { Order } from "../../../models";

import { OrderStatus, type OrderStatusValue } from "../../../models/Order";
import { ORDER_STATUS_VARIANT } from "../../../utils/orderUtils";
import DashboardCard from "./DashboardCard";
import ProgressBarRow from "./ProgressBarRow";

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

  return (
    <DashboardCard icon={<FaCheckCircle />} iconColor="text-emerald-600" title="Estado de Pedidos">
      {statusData.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No hay pedidos registrados</div>
      ) : (
        statusData.map((statusRow: StatusRow) => {
          const { status, count, percentage } = statusRow;
          const variantMap: Record<string, string> = { success: "bg-success", danger: "bg-danger", warning: "bg-warning" };
          const variant: string = variantMap[ORDER_STATUS_VARIANT[status]] ?? "bg-gray-300";
          const meta: StatusMeta = STATUS_META[status] ?? { icon: null, label: status };
          return (
            <ProgressBarRow
              ariaLabel={`${meta.label}: ${percentage.toFixed(1)}%`}
              color={variant}
              key={status}
              label={
                <span className="flex items-center gap-2">
                  {meta.icon}
                  <strong>{meta.label}</strong>
                </span>
              }
              percent={percentage}
              rightText={`${count} (${percentage.toFixed(1)}%)`}
            />
          );
        })
      )}
    </DashboardCard>
  );
};

export default OrderStatusBreakdown;
