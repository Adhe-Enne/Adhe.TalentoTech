import React from "react";
import { FaBox, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";

import type { Order } from "../../models";

import { ORDER_STATUS_LABELS } from "../../models";
import { formatPrice } from "../../utils/format";
import { ORDER_STATUS_VARIANT } from "../../utils/orderUtils";
import EmptyState from "../ui/EmptyState";
import HelmetMeta from "../ui/HelmetMeta";
import ListStateDisplay from "../ui/ListStateDisplay";
import PageHeader from "../ui/PageHeader";
import RefreshButton from "../ui/RefreshButton";
import OrderItemRow from "./OrderItemRow";

const BADGE_TW: Record<string, string> = {
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  warning: "bg-warning/10 text-warning",
  secondary: "bg-gray-100 text-gray-800",
};

interface OrderHistoryViewProps {
  expandedId: string | null;
  loading: boolean;
  orders: Order[];
  refreshLoading: boolean;
  onRefresh: () => void;
  onToggleExpand: (id: string) => void;
}

const OrderHistoryView: React.FC<OrderHistoryViewProps> = (props) => {
  const { expandedId, loading, onRefresh, onToggleExpand, orders, refreshLoading } = props;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <HelmetMeta description="Historial de pedidos en Talento Tech." title="Talento Tech | Mis pedidos" />
      <PageHeader title="Mis pedidos">
        <RefreshButton loading={refreshLoading} onRefresh={onRefresh} />
      </PageHeader>
      <ListStateDisplay error={null} loading={loading} loadingMessage="Cargando pedidos...">
        {orders.length === 0 ? (
          <EmptyState
            action={
              <Link className="bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90" to="/productos">
                Ver productos
              </Link>
            }
            icon={<FaBox className="text-gray-500 mb-3" size={48} />}
            message="Tus compras aparecerán aquí."
            title="No tenés pedidos aún"
          />
        ) : (
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
            {orders.map((order: Order) => (
              <div className="p-3" key={order.id}>
                <button
                  aria-label={`Orden ${order.id.slice(-8).toUpperCase()} - ${ORDER_STATUS_LABELS[order.status]}`}
                  className={`flex items-center justify-between w-full p-0 border-0 text-start cursor-pointer`}
                  onClick={() => onToggleExpand(order.id)}
                  type="button"
                >
                  <div>
                    <strong>#{order.id.slice(-8).toUpperCase()}</strong>
                    <div className="text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()} - {order.items.length} producto{order.items.length === 1 ? "" : "s"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${BADGE_TW[ORDER_STATUS_VARIANT[order.status]] ?? BADGE_TW.secondary}`}>{ORDER_STATUS_LABELS[order.status]}</span>
                    <span>{formatPrice(order.total, order.currency)}</span>
                    {expandedId === order.id ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </button>

                {expandedId === order.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    {order.items.map((item) => (
                      <OrderItemRow item={item} key={item.productId} />
                    ))}
                    <hr className="border-t border-gray-200 my-3" />
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(order.subtotal, order.currency)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm text-success">
                        <span>Descuento{order.discountCode ? ` (${order.discountCode})` : ""}</span>
                        <span>-{formatPrice(order.discount, order.currency)}</span>
                      </div>
                    )}
                    <hr className="border-t border-gray-200 my-3" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatPrice(order.total, order.currency)}</span>
                    </div>
                    {order.shippingInfo && (
                      <div className="text-sm text-gray-500 mt-2">
                        <strong>Envío:</strong> {order.shippingInfo.fullName} - {order.shippingInfo.address}, {order.shippingInfo.city}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ListStateDisplay>
    </div>
  );
};

export default OrderHistoryView;
