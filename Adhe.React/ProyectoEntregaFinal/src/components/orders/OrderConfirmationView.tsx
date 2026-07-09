import React from "react";
import { FaCheckCircle, FaClock, FaShoppingBag, FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

import type { Order } from "../../models";

import { type OrderStatusValue, OrderStatus } from "../../models/Order";
import { formatPrice } from "../../utils/format";
import HelmetMeta from "../ui/HelmetMeta";
import RefreshButton from "../ui/RefreshButton";
import OrderItemRow from "./OrderItemRow";

interface OrderConfirmationViewProps {
  loading: boolean;
  order: Order | null;
  refreshLoading: boolean;
  onBack: () => void;
  onRefresh: () => void;
}

interface StatusConfig {
  color: string;
  helmet: string;
  icon: React.ReactNode;
  title: string;
}

const STATUS_CONFIG: Record<OrderStatusValue, StatusConfig> = {
  [OrderStatus.Completado]: {
    color: "text-success",
    helmet: "Compra exitosa",
    icon: <FaCheckCircle className="text-success mb-3" size={64} />,
    title: "Compra confirmada con éxito",
  },
  [OrderStatus.Pendiente]: {
    color: "text-warning",
    helmet: "Pedido pendiente",
    icon: <FaClock className="text-warning mb-3" size={64} />,
    title: "Tu pedido está pendiente de aprobación",
  },
  [OrderStatus.Cancelado]: {
    color: "text-danger",
    helmet: "Pedido cancelado",
    icon: <FaTimesCircle className="text-danger mb-3" size={64} />,
    title: "Tu pedido fue cancelado",
  },
};

const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = (props) => {
  const { loading, onBack, onRefresh, order, refreshLoading } = props;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-5 text-center">
        <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-accent" role="status">
          <span className="sr-only">Cargando orden...</span>
        </span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-5 text-center">
        <h4>Orden no encontrada</h4>
        <p className="text-gray-500">La orden que buscas no existe o fue eliminada.</p>
        <button className="bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90" onClick={onBack}>
          Volver al inicio
        </button>
      </div>
    );
  }

  const config: StatusConfig = STATUS_CONFIG[order.status];
  const statusIcon: React.ReactNode = config.icon;
  const statusTitle: string = config.title;
  const statusColor: string = config.color;
  const helmetTitle: string = config.helmet;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <HelmetMeta description="Estado del pedido en Talento Tech." title={`Talento Tech | ${helmetTitle}`} />
      <div className="flex justify-end mb-2">
        <RefreshButton loading={refreshLoading} onRefresh={onRefresh} />
      </div>
      <div className="text-center mb-4">
        {statusIcon}
        <h2 className={statusColor}>{statusTitle}</h2>
        <p className="text-gray-500">Orden #{order.id.slice(-8).toUpperCase()}</p>
      </div>

      <div className="flex justify-center">
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3">
            <div className="p-4">
              <h5 className="text-lg font-semibold mb-3">Resumen</h5>
              {order.items.map((item) => (
                <OrderItemRow imageSize={48} item={item} key={item.productId} />
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
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3">
            <div className="p-4">
              <h5 className="text-lg font-semibold mb-3">Datos de envío</h5>
              <p className="mb-1">{order.shippingInfo.fullName}</p>
              <p className="mb-1">{order.shippingInfo.address}</p>
              <p className="mb-1">
                {order.shippingInfo.city} - CP {order.shippingInfo.postalCode}
              </p>
              <p className="mb-0">{order.shippingInfo.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-3">
        <Link className="bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-1" to="/mis-ordenes">
          <FaShoppingBag />
          Mis pedidos
        </Link>
        <button className="bg-transparent border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50" onClick={onBack}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationView;
